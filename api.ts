// API Service for Main JafaSol Admin Dashboard
const API_BASE = 'https://jafasol-backend-c364453817af.herokuapp.com/api';

interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

interface AuthResponse {
  token: string;
  user: any;
  expiresIn: string;
}

// Frontend Cache Service
class FrontendCache {
  private cache = new Map<string, { data: any; expiry: number; timestamp: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  isStale(key: string, staleTime: number = 30 * 1000): boolean {
    const cached = this.cache.get(key);
    if (!cached) return true;
    return Date.now() - cached.timestamp > staleTime;
  }

  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    const valid = entries.filter(([_, cached]) => now < cached.expiry);
    const expired = entries.filter(([_, cached]) => now >= cached.expiry);
    
    return {
      total: entries.length,
      valid: valid.length,
      expired: expired.length,
      memoryUsage: JSON.stringify(entries).length
    };
  }
}

const frontendCache = new FrontendCache();

class ApiService {
  private token: string | null = null;
  private tokenExpiry: number | null = null;
  private requestQueue = new Map<string, Promise<any>>();

  setToken(token: string, expiresIn: string = '24h') {
    this.token = token;
    // Calculate expiry time
    const hours = expiresIn.includes('h') ? parseInt(expiresIn.replace('h', '')) : 24;
    this.tokenExpiry = Date.now() + (hours * 60 * 60 * 1000);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('tokenExpiry', this.tokenExpiry.toString());
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('adminToken');
      const expiry = localStorage.getItem('tokenExpiry');
      if (expiry) {
        this.tokenExpiry = parseInt(expiry);
      }
    }
    
    // Check if token is expired
    if (this.tokenExpiry && Date.now() > this.tokenExpiry) {
      this.clearToken();
      return null;
    }
    
    return this.token;
  }

  clearToken() {
    this.token = null;
    this.tokenExpiry = null;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('tokenExpiry');
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    return token !== null && this.tokenExpiry !== null && Date.now() < this.tokenExpiry;
  }

  // Deduplication - prevent multiple identical requests
  private async deduplicatedRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key)!;
    }

    const promise = requestFn();
    this.requestQueue.set(key, promise);
    
    try {
      const result = await promise;
      return result;
    } finally {
      this.requestQueue.delete(key);
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, cacheOptions?: {
    ttl?: number;
    useCache?: boolean;
    cacheKey?: string;
    staleTime?: number;
  }): Promise<T> {
    const cacheKey = cacheOptions?.cacheKey || `api:${endpoint}`;
    const useCache = cacheOptions?.useCache !== false;
    const ttl = cacheOptions?.ttl || 5 * 60 * 1000; // 5 minutes default
    const staleTime = cacheOptions?.staleTime || 30 * 1000; // 30 seconds

    // Check cache first
    if (useCache) {
      const cached = frontendCache.get(cacheKey);
      if (cached && !frontendCache.isStale(cacheKey, staleTime)) {
        return cached;
      }
    }

    const token = this.getToken();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // Handle authentication errors
      if (response.status === 401) {
        this.clearToken();
        throw new Error('Authentication failed. Please login again.');
      }

      if (response.status === 403) {
        throw new Error('Access denied. Insufficient permissions.');
      }

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache successful responses
      if (useCache && response.ok) {
        frontendCache.set(cacheKey, data, ttl);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - server is taking too long to respond');
      }
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, { useCache: false }); // Don't cache login responses
    
    this.setToken(response.token, response.expiresIn);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      }, { useCache: false });
    } finally {
      this.clearToken();
      frontendCache.clear(); // Clear all cache on logout
    }
  }

  async verifyToken(): Promise<any> {
    return this.request('/auth/verify', {}, { useCache: false });
  }

  // Dashboard with aggressive caching
  async getDashboard(): Promise<any> {
    return this.deduplicatedRequest('dashboard', () => 
      this.request('/dashboard', {}, {
        ttl: 2 * 60 * 1000, // 2 minutes
        staleTime: 10 * 1000, // 10 seconds
        cacheKey: 'dashboard'
      })
    );
  }

  // Schools with longer cache
  async getSchools(): Promise<any> {
    return this.deduplicatedRequest('schools', () =>
      this.request('/admin/schools', {}, {
        ttl: 5 * 60 * 1000, // 5 minutes
        staleTime: 30 * 1000, // 30 seconds
        cacheKey: 'schools'
      })
    );
  }

  // Analytics with medium cache
  async getAnalytics(): Promise<any> {
    return this.deduplicatedRequest('analytics', () =>
      this.request('/admin/analytics', {}, {
        ttl: 3 * 60 * 1000, // 3 minutes
        staleTime: 15 * 1000, // 15 seconds
        cacheKey: 'analytics'
      })
    );
  }

  // Cache management
  clearCache(pattern?: string): void {
    if (pattern) {
      // Clear specific patterns (simplified)
      const keys = Array.from(frontendCache['cache'].keys());
      keys.forEach(key => {
        if (key.includes(pattern)) {
          frontendCache.delete(key);
        }
      });
    } else {
      frontendCache.clear();
    }
  }

  getCacheStats(): any {
    return frontendCache.getStats();
  }

  // Prefetch critical data
  async prefetchCriticalData(): Promise<void> {
    try {
      await Promise.allSettled([
        this.getDashboard(),
        this.getSchools(),
        this.getAnalytics()
      ]);
    } catch (error) {
      console.warn('Prefetch failed:', error);
    }
  }

  // Support Tickets
  async getSupportTickets(): Promise<any> {
    return this.request('/admin/support/tickets');
  }

  // System Settings
  async getSystemSettings(): Promise<any> {
    return this.request('/admin/settings');
  }

  async updateSystemSettings(settings: any): Promise<any> {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Health Check
  async healthCheck(): Promise<any> {
    return this.request('/health');
  }

  // Backups
  async getBackups(): Promise<any> {
    return this.request('/admin/backups');
  }

  // Data Export
  async exportData(type: string): Promise<any> {
    return this.request(`/admin/export/${type}`);
  }

  // Subdomains
  async getSubdomains(): Promise<any> {
    return this.request('/admin/subdomains');
  }

  async getSubdomain(id: string): Promise<any> {
    return this.request(`/admin/subdomains/${id}`);
  }

  async createSubdomain(subdomainData: any): Promise<any> {
    return this.request('/admin/subdomains', {
      method: 'POST',
      body: JSON.stringify(subdomainData),
    });
  }

  async updateSubdomain(id: string, updates: any): Promise<any> {
    return this.request(`/admin/subdomains/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteSubdomain(id: string): Promise<any> {
    return this.request(`/admin/subdomains/${id}`, {
      method: 'DELETE',
    });
  }

  async checkSubdomainHealth(id: string): Promise<any> {
    return this.request(`/admin/subdomains/${id}/health`);
  }

  async getSubdomainBySchoolId(schoolId: string): Promise<any> {
    return this.request(`/admin/subdomains/school/${schoolId}`);
  }

  async updateSubdomainDNS(id: string, dnsRecords: any): Promise<any> {
    return this.request(`/admin/subdomains/${id}/dns`, {
      method: 'PUT',
      body: JSON.stringify(dnsRecords),
    });
  }

  async provisionSubdomain(id: string): Promise<any> {
    return this.request(`/admin/subdomains/${id}/provision`, {
      method: 'POST',
    });
  }

  async getSubdomainAnalytics(id: string): Promise<any> {
    return this.request(`/admin/subdomains/${id}/analytics`);
  }

  async bulkProvisionSubdomains(subdomainIds: string[]): Promise<any> {
    return this.request('/admin/subdomains/bulk-provision', {
      method: 'POST',
      body: JSON.stringify({ subdomainIds }),
    });
  }

  async getSubdomainTemplates(): Promise<any> {
    return this.request('/admin/subdomains/templates');
  }

  async applySubdomainTemplate(id: string, templateId: string): Promise<any> {
    return this.request(`/admin/subdomains/${id}/template`, {
      method: 'POST',
      body: JSON.stringify({ templateId }),
    });
  }

  // Users
  async getUsers(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${queryString}`);
  }

  async getUser(id: string): Promise<any> {
    return this.request(`/admin/users/${id}`);
  }

  async createUser(userData: any): Promise<any> {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, updates: any): Promise<any> {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: string): Promise<any> {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async resetUserPassword(id: string): Promise<any> {
    return this.request(`/admin/users/${id}/reset-password`, {
      method: 'POST',
    });
  }

  async toggleUserStatus(id: string): Promise<any> {
    return this.request(`/admin/users/${id}/toggle-status`, {
      method: 'POST',
    });
  }

  // Notifications
  async getNotifications(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/notifications?${queryString}`);
  }

  async getNotification(id: string): Promise<any> {
    return this.request(`/admin/notifications/${id}`);
  }

  async createNotification(notificationData: any): Promise<any> {
    return this.request('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  async updateNotification(id: string, updates: any): Promise<any> {
    return this.request(`/admin/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteNotification(id: string): Promise<any> {
    return this.request(`/admin/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  async markNotificationAsRead(id: string, userId: string): Promise<any> {
    return this.request(`/admin/notifications/${id}/read`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async getAnnouncements(): Promise<any> {
    return this.request('/admin/announcements');
  }

  async createAnnouncement(announcementData: any): Promise<any> {
    return this.request('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  }

  // Security
  async getLoginLogs(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/security/login-logs?${queryString}`);
  }

  async getSecurityAudit(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/security/audit?${queryString}`);
  }

  async getSecuritySettings(): Promise<any> {
    return this.request('/admin/security/settings');
  }

  async updateSecuritySettings(settings: any): Promise<any> {
    return this.request('/admin/security/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async toggle2FA(userId: string, enabled: boolean): Promise<any> {
    return this.request(`/admin/security/2fa/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    });
  }

  async get2FAStatus(userId: string): Promise<any> {
    return this.request(`/admin/security/2fa/${userId}/status`);
  }

  // Feature Toggles
  async getFeatureToggles(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/features?${queryString}`);
  }

  async getFeatureToggle(id: string): Promise<any> {
    return this.request(`/admin/features/${id}`);
  }

  async createFeatureToggle(featureData: any): Promise<any> {
    return this.request('/admin/features', {
      method: 'POST',
      body: JSON.stringify(featureData),
    });
  }

  async updateFeatureToggle(id: string, updates: any): Promise<any> {
    return this.request(`/admin/features/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteFeatureToggle(id: string): Promise<any> {
    return this.request(`/admin/features/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleFeature(id: string): Promise<any> {
    return this.request(`/admin/features/${id}/toggle`, {
      method: 'POST',
    });
  }

  // A/B Testing
  async getABTests(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/ab-tests?${queryString}`);
  }

  async createABTest(testData: any): Promise<any> {
    return this.request('/admin/ab-tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  async updateABTestMetrics(id: string, metrics: any): Promise<any> {
    return this.request(`/admin/ab-tests/${id}/metrics`, {
      method: 'PUT',
      body: JSON.stringify(metrics),
    });
  }

  // AI Features
  async sendAIMessage(message: string, userId: string, userName: string): Promise<any> {
    return this.request('/admin/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, userId, userName }),
    });
  }

  async getAIChatHistory(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/ai/chat?${queryString}`);
  }

  async getAIInsights(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/ai/insights?${queryString}`);
  }

  async generateAIInsight(type: string, data: any): Promise<any> {
    return this.request('/admin/ai/insights/generate', {
      method: 'POST',
      body: JSON.stringify({ type, data }),
    });
  }

  async getAIRecommendations(): Promise<any> {
    return this.request('/admin/ai/recommendations');
  }

  async generateAutoResponse(query: string, context?: any): Promise<any> {
    return this.request('/admin/ai/auto-response', {
      method: 'POST',
      body: JSON.stringify({ query, context }),
    });
  }
}

export const apiService = new ApiService();
export default apiService; 
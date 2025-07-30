// API Service for Main JafaSol Admin Dashboard
const API_BASE = 'https://jafasol-backend-c364453817af.herokuapp.com/api';

interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('adminToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('adminToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('adminToken');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - server is taking too long to respond');
      }
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(response.token);
    return response;
  }

  // Dashboard
  async getDashboardStats(): Promise<any> {
    return this.request('/admin/dashboard');
  }

  // Schools
  async getSchools(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    plan?: string;
  } = {}): Promise<any> {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/admin/schools?${queryString}`);
  }

  async getSchool(id: string): Promise<any> {
    return this.request(`/admin/schools/${id}`);
  }

  async createSchool(schoolData: any): Promise<any> {
    return this.request('/admin/schools', {
      method: 'POST',
      body: JSON.stringify(schoolData),
    });
  }

  async updateSchool(id: string, updates: any): Promise<any> {
    return this.request(`/admin/schools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteSchool(id: string): Promise<any> {
    return this.request(`/admin/schools/${id}`, {
      method: 'DELETE',
    });
  }

  // Subscriptions
  async getSubscriptions(): Promise<any> {
    return this.request('/admin/billing/subscriptions');
  }

  // Support
  async getSupportTickets(): Promise<any> {
    return this.request('/admin/support/tickets');
  }

  // Settings
  async getSystemSettings(): Promise<any> {
    return this.request('/admin/settings');
  }

  async updateSystemSettings(settings: any): Promise<any> {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Analytics
  async getAnalytics(): Promise<any> {
    return this.request('/admin/analytics');
  }

  // Health check
  async healthCheck(): Promise<any> {
    return this.request('/health');
  }

  // Backups
  async getBackups(): Promise<any> {
    return this.request('/admin/backups');
  }

  // Data export
  async exportData(type: string): Promise<any> {
    return this.request('/admin/export', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  // Subdomain management
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

  // Enhanced subdomain management
  async getSubdomainBySchoolId(schoolId: string): Promise<any> {
    return this.request(`/admin/schools/${schoolId}/subdomain`);
  }

  async updateSubdomainDNS(id: string, dnsRecords: any): Promise<any> {
    return this.request(`/admin/subdomains/${id}/dns`, {
      method: 'PUT',
      body: JSON.stringify({ dnsRecords }),
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
    return this.request(`/admin/subdomains/${id}/apply-template`, {
      method: 'POST',
      body: JSON.stringify({ templateId }),
    });
  }

  // User management
  async getUsers(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params as any).toString();
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
    const queryString = new URLSearchParams(params as any).toString();
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
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/admin/security/login-logs?${queryString}`);
  }

  async getSecurityAudit(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params as any).toString();
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
    return this.request(`/admin/security/2fa/${userId}`);
  }

  // Feature Toggles
  async getFeatureToggles(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params as any).toString();
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

  async getABTests(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/admin/features/ab-tests?${queryString}`);
  }

  async createABTest(testData: any): Promise<any> {
    return this.request('/admin/features/ab-tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  async updateABTestMetrics(id: string, metrics: any): Promise<any> {
    return this.request(`/admin/features/ab-tests/${id}/metrics`, {
      method: 'PUT',
      body: JSON.stringify(metrics),
    });
  }

  // AI Integration
  async sendAIMessage(message: string, userId: string, userName: string): Promise<any> {
    return this.request('/admin/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, userId, userName }),
    });
  }

  async getAIChatHistory(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/admin/ai/chat?${queryString}`);
  }

  async getAIInsights(params?: any): Promise<any> {
    const queryString = new URLSearchParams(params as any).toString();
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
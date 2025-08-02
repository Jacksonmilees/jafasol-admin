import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import apiService from '../api';
import { School, SupportTicket, Invoice, Backup, SystemSettings } from '../types';

// Types
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  dashboardStats: any;
  schools: School[];
  supportTickets: SupportTicket[];
  invoices: Invoice[];
  backups: Backup[];
  systemSettings: SystemSettings | null;
  subdomains: any[]; // Add subdomains state
  users: any[]; // Add users state
  notifications: any[];
  announcements: any[];
  loginLogs: any[];
  securityAudit: any[];
  securitySettings: any;
  featureToggles: any[];
  abTests: any[];
  aiChatHistory: any[];
  aiInsights: any[];
  aiRecommendations: any[];
}

type AdminAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: AdminUser }
  | { type: 'LOGOUT' }
  | { type: 'SET_DASHBOARD_STATS'; payload: any }
  | { type: 'SET_SCHOOLS'; payload: School[] }
  | { type: 'SET_SUPPORT_TICKETS'; payload: SupportTicket[] }
  | { type: 'SET_INVOICES'; payload: Invoice[] }
  | { type: 'SET_BACKUPS'; payload: Backup[] }
  | { type: 'SET_SYSTEM_SETTINGS'; payload: SystemSettings }
  | { type: 'ADD_SCHOOL'; payload: School }
  | { type: 'UPDATE_SCHOOL'; payload: School }
  | { type: 'DELETE_SCHOOL'; payload: string }
  | { type: 'SET_SUBDOMAINS'; payload: any[] } // Add subdomains action
  | { type: 'ADD_SUBDOMAIN'; payload: any }
  | { type: 'UPDATE_SUBDOMAIN'; payload: any }
  | { type: 'DELETE_SUBDOMAIN'; payload: string }
  | { type: 'SET_USERS'; payload: any[] } // Add users actions
  | { type: 'ADD_USER'; payload: any }
  | { type: 'UPDATE_USER'; payload: any }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: any[] }
  | { type: 'ADD_NOTIFICATION'; payload: any }
  | { type: 'UPDATE_NOTIFICATION'; payload: any }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'SET_ANNOUNCEMENTS'; payload: any[] }
  | { type: 'ADD_ANNOUNCEMENT'; payload: any }
  | { type: 'SET_LOGIN_LOGS'; payload: any[] }
  | { type: 'SET_SECURITY_AUDIT'; payload: any[] }
  | { type: 'SET_SECURITY_SETTINGS'; payload: any }
  | { type: 'SET_FEATURE_TOGGLES'; payload: any[] }
  | { type: 'ADD_FEATURE_TOGGLE'; payload: any }
  | { type: 'UPDATE_FEATURE_TOGGLE'; payload: any }
  | { type: 'DELETE_FEATURE_TOGGLE'; payload: string }
  | { type: 'SET_AB_TESTS'; payload: any[] }
  | { type: 'ADD_AB_TEST'; payload: any }
  | { type: 'UPDATE_AB_TEST'; payload: any }
  | { type: 'SET_AI_CHAT_HISTORY'; payload: any[] }
  | { type: 'ADD_AI_CHAT'; payload: any }
  | { type: 'SET_AI_INSIGHTS'; payload: any[] }
  | { type: 'ADD_AI_INSIGHT'; payload: any }
  | { type: 'SET_AI_RECOMMENDATIONS'; payload: any[] };

// Initial state
const initialState: AdminState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  dashboardStats: null,
  schools: [],
  supportTickets: [],
  invoices: [],
  backups: [],
  systemSettings: null,
  subdomains: [], // Add subdomains to initial state
  users: [], // Add users to initial state
  notifications: [],
  announcements: [],
  loginLogs: [],
  securityAudit: [],
  securitySettings: null,
  featureToggles: [],
  abTests: [],
  aiChatHistory: [],
  aiInsights: [],
  aiRecommendations: [],
};

// Reducer
function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    case 'SET_SCHOOLS':
      return { ...state, schools: action.payload };
    case 'SET_SUPPORT_TICKETS':
      return { ...state, supportTickets: action.payload };
    case 'SET_INVOICES':
      return { ...state, invoices: action.payload };
    case 'SET_BACKUPS':
      return { ...state, backups: action.payload };
    case 'SET_SYSTEM_SETTINGS':
      return { ...state, systemSettings: action.payload };
    case 'ADD_SCHOOL':
      return { ...state, schools: [action.payload, ...state.schools] };
    case 'UPDATE_SCHOOL':
      return {
        ...state,
        schools: state.schools.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_SCHOOL':
      return {
        ...state,
        schools: state.schools.filter(s => s.id !== action.payload)
      };
    case 'SET_SUBDOMAINS':
      return { ...state, subdomains: action.payload };
    case 'ADD_SUBDOMAIN':
      return { ...state, subdomains: [action.payload, ...state.subdomains] };
    case 'UPDATE_SUBDOMAIN':
      return {
        ...state,
        subdomains: state.subdomains.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_SUBDOMAIN':
      return {
        ...state,
        subdomains: state.subdomains.filter(s => s.id !== action.payload)
      };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [action.payload, ...state.users] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(u => u.id === action.payload.id ? action.payload : u)
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.payload)
      };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(n => n.id === action.payload.id ? action.payload : n)
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    case 'SET_ANNOUNCEMENTS':
      return { ...state, announcements: action.payload };
    case 'ADD_ANNOUNCEMENT':
      return { ...state, announcements: [action.payload, ...state.announcements] };
    case 'SET_LOGIN_LOGS':
      return { ...state, loginLogs: action.payload };
    case 'SET_SECURITY_AUDIT':
      return { ...state, securityAudit: action.payload };
    case 'SET_SECURITY_SETTINGS':
      return { ...state, securitySettings: action.payload };
    case 'SET_FEATURE_TOGGLES':
      return { ...state, featureToggles: action.payload };
    case 'ADD_FEATURE_TOGGLE':
      return { ...state, featureToggles: [action.payload, ...state.featureToggles] };
    case 'UPDATE_FEATURE_TOGGLE':
      return {
        ...state,
        featureToggles: state.featureToggles.map(f => f.id === action.payload.id ? action.payload : f)
      };
    case 'DELETE_FEATURE_TOGGLE':
      return {
        ...state,
        featureToggles: state.featureToggles.filter(f => f.id !== action.payload)
      };
    case 'SET_AB_TESTS':
      return { ...state, abTests: action.payload };
    case 'ADD_AB_TEST':
      return { ...state, abTests: [action.payload, ...state.abTests] };
    case 'UPDATE_AB_TEST':
      return {
        ...state,
        abTests: state.abTests.map(t => t.id === action.payload.id ? action.payload : t)
      };
    case 'SET_AI_CHAT_HISTORY':
      return { ...state, aiChatHistory: action.payload };
    case 'ADD_AI_CHAT':
      return { ...state, aiChatHistory: [action.payload, ...state.aiChatHistory] };
    case 'SET_AI_INSIGHTS':
      return { ...state, aiInsights: action.payload };
    case 'ADD_AI_INSIGHT':
      return { ...state, aiInsights: [action.payload, ...state.aiInsights] };
    case 'SET_AI_RECOMMENDATIONS':
      return { ...state, aiRecommendations: action.payload };
    default:
      return state;
  }
}

// Context
const AdminContext = createContext<{
  state: AdminState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchDashboardStats: () => Promise<void>;
  fetchSchools: (params?: any) => Promise<void>;
  fetchSupportTickets: () => Promise<void>;
  fetchInvoices: () => Promise<void>;
  fetchBackups: () => Promise<void>;
  fetchSystemSettings: () => Promise<void>;
  createSchool: (schoolData: any) => Promise<School>;
  updateSchool: (id: string, updates: any) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
  exportData: (type: string) => Promise<any>; // Add exportData to context type
  fetchSubdomains: () => Promise<void>;
  createSubdomain: (subdomainData: any) => Promise<any>;
  updateSubdomain: (id: string, updates: any) => Promise<void>;
  deleteSubdomain: (id: string) => Promise<void>;
  checkSubdomainHealth: (id: string) => Promise<any>;
  fetchUsers: () => Promise<void>;
  createUser: (userData: any) => Promise<any>;
  updateUser: (id: string, updates: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  resetUserPassword: (id: string) => Promise<any>;
  toggleUserStatus: (id: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  createNotification: (notificationData: any) => Promise<any>;
  updateNotification: (id: string, updates: any) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  markNotificationAsRead: (id: string, userId: string) => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
  createAnnouncement: (announcementData: any) => Promise<any>;
  fetchLoginLogs: () => Promise<void>;
  fetchSecurityAudit: () => Promise<void>;
  fetchSecuritySettings: () => Promise<void>;
  updateSecuritySettings: (settings: any) => Promise<void>;
  toggle2FA: (userId: string, enabled: boolean) => Promise<any>;
  get2FAStatus: (userId: string) => Promise<any>;
  fetchFeatureToggles: () => Promise<void>;
  createFeatureToggle: (featureData: any) => Promise<any>;
  updateFeatureToggle: (id: string, updates: any) => Promise<void>;
  deleteFeatureToggle: (id: string) => Promise<void>;
  toggleFeature: (id: string) => Promise<void>;
  fetchABTests: () => Promise<void>;
  createABTest: (testData: any) => Promise<any>;
  updateABTestMetrics: (id: string, metrics: any) => Promise<void>;
  sendAIMessage: (message: string, userId: string, userName: string) => Promise<any>;
  fetchAIChatHistory: () => Promise<void>;
  fetchAIInsights: () => Promise<void>;
  generateAIInsight: (type: string, data: any) => Promise<any>;
  fetchAIRecommendations: () => Promise<void>;
  generateAutoResponse: (query: string, context?: any) => Promise<any>;
  provisionSubdomain: (id: string) => Promise<any>;
  getSubdomainAnalytics: (id: string) => Promise<any>;
  bulkProvisionSubdomains: (subdomainIds: string[]) => Promise<any>;
  getSubdomainTemplates: () => Promise<any>;
  applySubdomainTemplate: (id: string, templateId: string) => Promise<any>;
  updateSystemSettings: (settings: any) => Promise<void>;
  uploadSchoolLogo: (id: string, logoData: any) => Promise<any>;
} | null>(null);

// Provider
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    const token = apiService.getToken();
    if (token) {
      // For now, we'll use a mock admin user
      const adminUser = {
        id: 'admin-1',
        name: 'JafaSol Super Admin',
        email: 'admin@jafasol.com',
        role: 'super_admin',
      };
      dispatch({ type: 'SET_USER', payload: adminUser });
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await apiService.login(email, password);
      
      // Use the real user data from the backend
      const adminUser = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
      };

      dispatch({ type: 'SET_USER', payload: adminUser });
      
      // Start background data fetching without blocking login
      setTimeout(() => {
        apiService.prefetchCriticalData().catch(error => {
          console.warn('Background data prefetch failed:', error);
        });
      }, 100);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      dispatch({ 
        type: 'SET_ERROR', 
        payload: errorMessage 
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Logout function
  const logout = () => {
    apiService.clearToken();
    dispatch({ type: 'LOGOUT' });
  };

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getDashboard();
      dispatch({ type: 'SET_DASHBOARD_STATS', payload: response.stats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch dashboard stats' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch schools
  const fetchSchools = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getSchools();
      dispatch({ type: 'SET_SCHOOLS', payload: response.schools || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch schools' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch support tickets
  const fetchSupportTickets = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getSupportTickets();
      dispatch({ type: 'SET_SUPPORT_TICKETS', payload: response.tickets || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch support tickets' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch invoices
  const fetchInvoices = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getBackups(); // Using backups as fallback for invoices
      dispatch({ type: 'SET_INVOICES', payload: response.subscriptions || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch invoices' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch backups
  const fetchBackups = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getBackups();
      dispatch({ type: 'SET_BACKUPS', payload: response.backups || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch backups' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Export data
  const exportData = async (type: string) => {
    try {
      const response = await apiService.exportData(type);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Fetch system settings
  const fetchSystemSettings = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getSystemSettings();
      dispatch({ type: 'SET_SYSTEM_SETTINGS', payload: response.settings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch system settings' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Create school
  const createSchool = async (schoolData: any): Promise<School> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.createSchool(schoolData);
      
      const newSchool: School = {
        id: response.school._id || response.school.id,
        name: response.school.name,
        email: response.school.email,
        phone: response.school.phone || '',
        logoUrl: `https://picsum.photos/seed/${Date.now()}/40/40`,
        plan: response.school.plan,
        status: response.school.status,
        subdomain: response.school.subdomain,
        storageUsage: response.school.storageUsage || 0,
        createdAt: response.school.createdAt ? new Date(response.school.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        modules: response.school.modules || [],
      };

      // Include admin credentials in the response for the onboarding modal
      const schoolWithCredentials = {
        ...newSchool,
        adminCredentials: response.school.adminCredentials
      };

      dispatch({ type: 'ADD_SCHOOL', payload: newSchool });
      // Refresh the schools list to ensure consistency
      await fetchSchools();
      return schoolWithCredentials as any;
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to create school' 
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update school
  const updateSchool = async (id: string, updates: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.updateSchool(id, updates);
      
      const updatedSchool = state.schools.find(s => s.id === id);
      if (updatedSchool) {
        const newSchool = { ...updatedSchool, ...updates };
        dispatch({ type: 'UPDATE_SCHOOL', payload: newSchool });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to update school' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Delete school
  const deleteSchool = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.deleteSchool(id);
      dispatch({ type: 'DELETE_SCHOOL', payload: id });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to delete school' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Upload school logo
  const uploadSchoolLogo = async (id: string, logoData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.uploadSchoolLogo(id, logoData);
      
      // Update the school with the new logo URL
      const updatedSchool = state.schools.find(s => s.id === id);
      if (updatedSchool) {
        const newSchool = { ...updatedSchool, logoUrl: response.logo.logoUrl };
        dispatch({ type: 'UPDATE_SCHOOL', payload: newSchool });
      }
      
      return response.logo;
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to upload logo' 
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch subdomains
  const fetchSubdomains = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getSubdomains();
      dispatch({ type: 'SET_SUBDOMAINS', payload: response.subdomains || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch subdomains' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Create subdomain
  const createSubdomain = async (subdomainData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.createSubdomain(subdomainData);
      dispatch({ type: 'ADD_SUBDOMAIN', payload: response.subdomain });
      return response.subdomain;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create subdomain' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update subdomain
  const updateSubdomain = async (id: string, updates: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.updateSubdomain(id, updates);
      
      const updatedSubdomain = state.subdomains.find(s => s.id === id);
      if (updatedSubdomain) {
        const newSubdomain = { ...updatedSubdomain, ...updates };
        dispatch({ type: 'UPDATE_SUBDOMAIN', payload: newSubdomain });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update subdomain' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Delete subdomain
  const deleteSubdomain = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.deleteSubdomain(id);
      dispatch({ type: 'DELETE_SUBDOMAIN', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete subdomain' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Check subdomain health
  const checkSubdomainHealth = async (id: string) => {
    try {
      const response = await apiService.checkSubdomainHealth(id);
      return response.health;
    } catch (error) {
      throw error;
    }
  };

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getUsers();
      dispatch({ type: 'SET_USERS', payload: response.users || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch users' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Create user
  const createUser = async (userData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.createUser(userData);
      dispatch({ type: 'ADD_USER', payload: response.user });
      return response.user;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create user' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update user
  const updateUser = async (id: string, updates: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.updateUser(id, updates);
      
      const updatedUser = state.users.find(u => u.id === id);
      if (updatedUser) {
        const newUser = { ...updatedUser, ...updates };
        dispatch({ type: 'UPDATE_USER', payload: newUser });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update user' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Delete user
  const deleteUser = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.deleteUser(id);
      dispatch({ type: 'DELETE_USER', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete user' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Reset user password
  const resetUserPassword = async (id: string) => {
    try {
      const response = await apiService.resetUserPassword(id);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Toggle user status
  const toggleUserStatus = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.toggleUserStatus(id);
      
      const updatedUser = state.users.find(u => u.id === id);
      if (updatedUser) {
        const newStatus = updatedUser.status === 'Active' ? 'Suspended' : 'Active';
        const newUser = { ...updatedUser, status: newStatus };
        dispatch({ type: 'UPDATE_USER', payload: newUser });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to toggle user status' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getNotifications();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: response.notifications || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch notifications' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Create notification
  const createNotification = async (notificationData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.createNotification(notificationData);
      dispatch({ type: 'ADD_NOTIFICATION', payload: response.notification });
      return response.notification;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create notification' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update notification
  const updateNotification = async (id: string, updates: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.updateNotification(id, updates);
      
      const updatedNotification = state.notifications.find(n => n.id === id);
      if (updatedNotification) {
        const newNotification = { ...updatedNotification, ...updates };
        dispatch({ type: 'UPDATE_NOTIFICATION', payload: newNotification });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update notification' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.deleteNotification(id);
      dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete notification' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (id: string, userId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.markNotificationAsRead(id, userId);
      
      const updatedNotification = state.notifications.find(n => n.id === id);
      if (updatedNotification) {
        const newNotification = { ...updatedNotification, isRead: true };
        dispatch({ type: 'UPDATE_NOTIFICATION', payload: newNotification });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to mark notification as read' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch announcements
  const fetchAnnouncements = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getAnnouncements();
      dispatch({ type: 'SET_ANNOUNCEMENTS', payload: response.announcements || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch announcements' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Create announcement
  const createAnnouncement = async (announcementData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.createAnnouncement(announcementData);
      dispatch({ type: 'ADD_ANNOUNCEMENT', payload: response.announcement });
      return response.announcement;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create announcement' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch login logs
  const fetchLoginLogs = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getLoginLogs();
      dispatch({ type: 'SET_LOGIN_LOGS', payload: response.logs || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch login logs' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch security audit
  const fetchSecurityAudit = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getSecurityAudit();
      dispatch({ type: 'SET_SECURITY_AUDIT', payload: response.audit || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch security audit' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch security settings
  const fetchSecuritySettings = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getSecuritySettings();
      dispatch({ type: 'SET_SECURITY_SETTINGS', payload: response.settings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch security settings' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Update security settings
  const updateSecuritySettings = async (settings: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.updateSecuritySettings(settings);
      dispatch({ type: 'SET_SECURITY_SETTINGS', payload: settings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update security settings' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Toggle 2FA
  const toggle2FA = async (userId: string, enabled: boolean) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.toggle2FA(userId, enabled);
      
      const updatedUser = state.users.find(u => u.id === userId);
      if (updatedUser) {
        const newStatus = enabled ? 'Enabled' : 'Disabled';
        const newUser = { ...updatedUser, twoFactorEnabled: enabled };
        dispatch({ type: 'UPDATE_USER', payload: newUser });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to toggle 2FA' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get 2FA status
  const get2FAStatus = async (userId: string) => {
    try {
      const response = await apiService.get2FAStatus(userId);
      return response.status;
    } catch (error) {
      throw error;
    }
  };

  // Fetch feature toggles
  const fetchFeatureToggles = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getFeatureToggles();
      dispatch({ type: 'SET_FEATURE_TOGGLES', payload: response.toggles || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch feature toggles' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Create feature toggle
  const createFeatureToggle = async (featureData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.createFeatureToggle(featureData);
      dispatch({ type: 'ADD_FEATURE_TOGGLE', payload: response.toggle });
      return response.toggle;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create feature toggle' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update feature toggle
  const updateFeatureToggle = async (id: string, updates: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.updateFeatureToggle(id, updates);
      
      const updatedToggle = state.featureToggles.find(f => f.id === id);
      if (updatedToggle) {
        const newToggle = { ...updatedToggle, ...updates };
        dispatch({ type: 'UPDATE_FEATURE_TOGGLE', payload: newToggle });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update feature toggle' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Delete feature toggle
  const deleteFeatureToggle = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.deleteFeatureToggle(id);
      dispatch({ type: 'DELETE_FEATURE_TOGGLE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete feature toggle' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Toggle feature
  const toggleFeature = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.toggleFeature(id);
      
      const updatedToggle = state.featureToggles.find(f => f.id === id);
      if (updatedToggle) {
        const newStatus = updatedToggle.enabled ? 'Disabled' : 'Enabled';
        const newToggle = { ...updatedToggle, enabled: !updatedToggle.enabled };
        dispatch({ type: 'UPDATE_FEATURE_TOGGLE', payload: newToggle });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to toggle feature' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch AB tests
  const fetchABTests = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getABTests();
      dispatch({ type: 'SET_AB_TESTS', payload: response.tests || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch AB tests' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Create AB test
  const createABTest = async (testData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.createABTest(testData);
      dispatch({ type: 'ADD_AB_TEST', payload: response.test });
      return response.test;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create AB test' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update AB test metrics
  const updateABTestMetrics = async (id: string, metrics: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.updateABTestMetrics(id, metrics);
      
      const updatedTest = state.abTests.find(t => t.id === id);
      if (updatedTest) {
        const newTest = { ...updatedTest, metrics: metrics };
        dispatch({ type: 'UPDATE_AB_TEST', payload: newTest });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update AB test metrics' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Send AI message
  const sendAIMessage = async (message: string, userId: string, userName: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.sendAIMessage(message, userId, userName);
      dispatch({ type: 'ADD_AI_CHAT', payload: response.chat });
      return response.chat;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to send AI message' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch AI chat history
  const fetchAIChatHistory = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getAIChatHistory();
      dispatch({ type: 'SET_AI_CHAT_HISTORY', payload: response.history || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch AI chat history' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch AI insights
  const fetchAIInsights = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getAIInsights();
      dispatch({ type: 'SET_AI_INSIGHTS', payload: response.insights || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch AI insights' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Generate AI insight
  const generateAIInsight = async (type: string, data: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.generateAIInsight(type, data);
      dispatch({ type: 'ADD_AI_INSIGHT', payload: response.insight });
      return response.insight;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to generate AI insight' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch AI recommendations
  const fetchAIRecommendations = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getAIRecommendations();
      dispatch({ type: 'SET_AI_RECOMMENDATIONS', payload: response.recommendations || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch AI recommendations' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Generate auto response
  const generateAutoResponse = async (query: string, context?: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.generateAutoResponse(query, context);
      return response.response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to generate auto response' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Provision subdomain
  const provisionSubdomain = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.provisionSubdomain(id);
      
      const updatedSubdomain = state.subdomains.find(s => s.id === id);
      if (updatedSubdomain) {
        const newSubdomain = { ...updatedSubdomain, ...response.subdomain };
        dispatch({ type: 'UPDATE_SUBDOMAIN', payload: newSubdomain });
      }
      
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to provision subdomain' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get subdomain analytics
  const getSubdomainAnalytics = async (id: string) => {
    try {
      const response = await apiService.getSubdomainAnalytics(id);
      return response.analytics;
    } catch (error) {
      throw error;
    }
  };

  // Bulk provision subdomains
  const bulkProvisionSubdomains = async (subdomainIds: string[]) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.bulkProvisionSubdomains(subdomainIds);
      
      // Update subdomains based on results
      response.results.forEach((result: any) => {
        if (result.status === 'provisioned') {
          dispatch({ type: 'UPDATE_SUBDOMAIN', payload: result.subdomain });
        }
      });
      
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to bulk provision subdomains' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get subdomain templates
  const getSubdomainTemplates = async () => {
    try {
      const response = await apiService.getSubdomainTemplates();
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Apply subdomain template
  const applySubdomainTemplate = async (id: string, templateId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.applySubdomainTemplate(id, templateId);
      
      const updatedSubdomain = state.subdomains.find(s => s.id === id);
      if (updatedSubdomain) {
        const newSubdomain = { ...updatedSubdomain, ...response.subdomain };
        dispatch({ type: 'UPDATE_SUBDOMAIN', payload: newSubdomain });
      }
      
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to apply template' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update system settings
  const updateSystemSettings = async (settings: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.updateSystemSettings(settings);
      dispatch({ type: 'SET_SYSTEM_SETTINGS', payload: settings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update system settings' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    state,
    login,
    logout,
    fetchDashboardStats,
    fetchSchools,
    fetchSupportTickets,
    fetchInvoices,
    fetchBackups,
    fetchSystemSettings,
    createSchool,
    updateSchool,
    deleteSchool,
    exportData,
    fetchSubdomains,
    createSubdomain,
    updateSubdomain,
    deleteSubdomain,
    checkSubdomainHealth,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    toggleUserStatus,
    fetchNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
    markNotificationAsRead,
    fetchAnnouncements,
    createAnnouncement,
    fetchLoginLogs,
    fetchSecurityAudit,
    fetchSecuritySettings,
    updateSecuritySettings,
    toggle2FA,
    get2FAStatus,
    fetchFeatureToggles,
    createFeatureToggle,
    updateFeatureToggle,
    deleteFeatureToggle,
    toggleFeature,
    fetchABTests,
    createABTest,
    updateABTestMetrics,
    sendAIMessage,
    fetchAIChatHistory,
    fetchAIInsights,
    generateAIInsight,
    fetchAIRecommendations,
    generateAutoResponse,
    provisionSubdomain,
    getSubdomainAnalytics,
    bulkProvisionSubdomains,
    getSubdomainTemplates,
    applySubdomainTemplate,
    updateSystemSettings,
    uploadSchoolLogo,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// Hook
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}; 
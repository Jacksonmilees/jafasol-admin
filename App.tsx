import React, { useEffect, useState } from 'react';
import { ActiveView, School } from './types';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './components/dashboard/DashboardOverview';
import SchoolsList from './components/schools/SchoolsList';
import PlansManager from './components/billing/PlansManager';
import SupportTickets from './components/support/SupportTickets';
import LoginPage from './components/auth/LoginPage';
import GlobalAnalytics from './components/analytics/GlobalAnalytics';
import BackupRestore from './components/backup/BackupRestore';
import FeatureToggles from './components/settings/FeatureToggles';
import NotificationsCenter from './components/notifications/NotificationsCenter';
import SubdomainManager from './components/hosting/SubdomainManager';
import UserManagement from './components/users/UserManagement';
import SecurityPage from './components/security/SecurityPage';
import GeminiChat from './components/ai/GeminiChat';
import SystemSettings from './components/settings/SystemSettings';
import DataExport from './components/export/DataExport';
import SystemHealth from './components/health/SystemHealth';
import { AdminProvider, useAdmin } from './context/AdminContext';

const AppContent: React.FC = () => {
  const { state, login, logout, fetchDashboardStats, fetchSchools, fetchSupportTickets, fetchInvoices, fetchBackups, fetchSystemSettings, fetchSubdomains, fetchUsers, fetchNotifications, fetchAnnouncements, fetchLoginLogs, fetchSecurityAudit, fetchSecuritySettings, fetchFeatureToggles, fetchABTests, fetchAIChatHistory, fetchAIInsights, fetchAIRecommendations, createSchool, updateSchool, deleteSchool } = useAdmin();
  const { isAuthenticated, isLoading, error } = state;
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
      fetchSchools();
      fetchSupportTickets();
      fetchInvoices();
      fetchBackups();
      fetchSystemSettings();
      fetchSubdomains();
      fetchUsers();
      fetchNotifications();
      fetchAnnouncements();
      fetchLoginLogs();
      fetchSecurityAudit();
      fetchSecuritySettings();
      fetchFeatureToggles();
      fetchABTests();
      fetchAIChatHistory();
      fetchAIInsights();
      fetchAIRecommendations();
    }
  }, [isAuthenticated, fetchDashboardStats, fetchSchools, fetchSupportTickets, fetchInvoices, fetchBackups, fetchSystemSettings, fetchSubdomains, fetchUsers, fetchNotifications, fetchAnnouncements, fetchLoginLogs, fetchSecurityAudit, fetchSecuritySettings, fetchFeatureToggles, fetchABTests, fetchAIChatHistory, fetchAIInsights, fetchAIRecommendations]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Wrapper functions to match expected signatures
  const handleCreateSchool = (newSchoolData: Omit<School, 'id' | 'createdAt' | 'storageUsage' | 'logoUrl'>): School => {
    const schoolData = {
      name: newSchoolData.name,
      email: newSchoolData.email,
      phone: newSchoolData.phone,
      plan: newSchoolData.plan,
      status: newSchoolData.status,
      subdomain: newSchoolData.subdomain,
      modules: newSchoolData.modules,
    };
    
    // Create a temporary school object for immediate UI update
    const tempSchool: School = {
      id: `temp_${Date.now()}`,
      name: schoolData.name,
      email: schoolData.email,
      phone: schoolData.phone,
      logoUrl: `https://picsum.photos/seed/${Date.now()}/40/40`,
      plan: schoolData.plan,
      status: schoolData.status,
      subdomain: schoolData.subdomain,
      storageUsage: 0,
      createdAt: new Date().toISOString().split('T')[0],
      modules: schoolData.modules,
    };
    
    // Call the API in the background
    createSchool(schoolData).catch(error => {
      console.error('Failed to create school:', error);
    });
    
    return tempSchool;
  };

  const handleUpdateSchool = (updatedSchool: School) => {
    const updates = {
      name: updatedSchool.name,
      email: updatedSchool.email,
      phone: updatedSchool.phone,
      plan: updatedSchool.plan,
      status: updatedSchool.status,
      subdomain: updatedSchool.subdomain,
      modules: updatedSchool.modules,
    };
    updateSchool(updatedSchool.id, updates);
  };

  const handleUpdateTicket = (updatedTicket: any) => {
    // TODO: Implement ticket update
    console.log('Update ticket:', updatedTicket);
  };

  const handleCreateBackup = (schoolId: string) => {
    // TODO: Implement backup creation
    console.log('Create backup for school:', schoolId);
  };

  const renderActiveView = (activeView: ActiveView) => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'schools':
        return (
          <SchoolsList 
            schools={state.schools} 
            onCreateSchool={handleCreateSchool} 
            onUpdateSchool={handleUpdateSchool} 
            onDeleteSchool={deleteSchool} 
          />
        );
      case 'users':
        return <UserManagement />;
      case 'billing':
        return <PlansManager invoices={state.invoices} schools={state.schools} onUpdateSchool={handleUpdateSchool} />;
      case 'support':
        return <SupportTickets tickets={state.supportTickets} onUpdateTicket={handleUpdateTicket} />;
      case 'notifications':
        return <NotificationsCenter />;
      case 'analytics':
        return <GlobalAnalytics />;
      case 'backup':
        return <BackupRestore backups={state.backups} onCreateBackup={handleCreateBackup} />;
      case 'hosting':
        return <SubdomainManager />;
      case 'systemHealth':
        return <SystemHealth />;
      case 'geminiChat':
        return <GeminiChat />;
      case 'featureToggles':
        return <FeatureToggles />;
      case 'security':
        return <SecurityPage />;
      case 'settings':
        return <SystemSettings />;
      case 'dataExport':
        return <DataExport />;
      default:
        return <DashboardOverview />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} isLoading={isLoading} />;
  }

  return (
    <DashboardLayout 
      activeView={activeView}
      setActiveView={setActiveView}
      onLogout={handleLogout}
    >
      {renderActiveView(activeView)}
    </DashboardLayout>
  );
};

const App: React.FC = () => {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
};

export default App;
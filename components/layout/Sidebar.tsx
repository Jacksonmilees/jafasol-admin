import React from 'react';
import { ActiveView } from '../../types';
import { DashboardIcon, SchoolIcon, BillingIcon, SupportIcon, SettingsIcon, LogoutIcon, AnalyticsIcon, BackupIcon, FeatureToggleIcon, NotificationIcon, HostingIcon, UserManagementIcon, SecurityIcon, GeminiIcon, DataExportIcon, HealthIcon } from '../icons/Icons';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onLogout: () => void;
}

const NavLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-brand text-white'
        : 'text-gray-300 hover:bg-brand-darker hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-6 h-6" /> },
    { id: 'geminiChat', label: 'Gemini AI Chat', icon: <GeminiIcon className="w-6 h-6" /> },
    { id: 'schools', label: 'Schools', icon: <SchoolIcon className="w-6 h-6" /> },
    { id: 'users', label: 'User Management', icon: <UserManagementIcon className="w-6 h-6" /> },
    { id: 'billing', label: 'Billing & Plans', icon: <BillingIcon className="w-6 h-6" /> },
    { id: 'systemHealth', label: 'System Health', icon: <HealthIcon className="w-6 h-6" /> },
    { id: 'analytics', label: 'Global Analytics', icon: <AnalyticsIcon className="w-6 h-6" /> },
    { id: 'hosting', label: 'Hosting Manager', icon: <HostingIcon className="w-6 h-6" /> },
    { id: 'backup', label: 'Backup & Restore', icon: <BackupIcon className="w-6 h-6" /> },
    { id: 'support', label: 'Support Tickets', icon: <SupportIcon className="w-6 h-6" /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationIcon className="w-6 h-6" /> },
  ];

  const settingsNavItems = [
    { id: 'security', label: 'Security', icon: <SecurityIcon className="w-6 h-6" /> },
    { id: 'featureToggles', label: 'Feature Toggles', icon: <FeatureToggleIcon className="w-6 h-6" /> },
    { id: 'dataExport', label: 'Data Export', icon: <DataExportIcon className="w-6 h-6" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-6 h-6" /> }
  ];

  return (
    <div className="w-full lg:w-64 bg-brand-dark text-white flex flex-col sidebar-full-height">
      {/* Logo/Brand - Now at the very top */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700 bg-brand-darker flex-shrink-0">
        <h1 className="text-xl font-bold text-white">Jafasol Admin</h1>
      </div>
      
      {/* Scrollable navigation */}
      <div className="flex-1 overflow-y-auto sidebar-scroll">
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeView === item.id}
              onClick={() => setActiveView(item.id as ActiveView)}
            />
          ))}
        </nav>
      </div>
      
      {/* Settings and Logout - Fixed at bottom */}
      <div className="p-4 border-t border-gray-700 space-y-2 bg-brand-darker flex-shrink-0">
         {settingsNavItems.map((item) => (
            <NavLink
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeView === item.id}
                onClick={() => setActiveView(item.id as ActiveView)}
            />
         ))}
         <NavLink
            icon={<LogoutIcon className="w-6 h-6" />}
            label="Logout"
            isActive={false}
            onClick={onLogout}
          />
      </div>
    </div>
  );
};

export default Sidebar;
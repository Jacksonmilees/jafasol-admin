import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Header from './Header';
import Sidebar from './Sidebar';
import { AlertLevel, ActiveView } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeView, 
  setActiveView, 
  onLogout 
}) => {
  const { state } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get alerts from context instead of mock data
  const criticalAlerts = state.notifications?.filter(n => n.level === AlertLevel.Critical) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar 
            activeView={activeView}
            setActiveView={(view) => {
              setActiveView(view);
              setSidebarOpen(false); // Close sidebar on mobile when navigating
            }}
            onLogout={onLogout}
          />
        </div>
        
        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Critical Alerts Banner */}
            {criticalAlerts.length > 0 && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                      Critical System Alerts ({criticalAlerts.length})
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {criticalAlerts.slice(0, 3).map((alert, index) => (
                          <li key={`alert-${alert.id || index}`}>{alert.title || alert.message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="ml-3 flex-shrink-0 text-red-400 hover:text-red-600"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {/* Page content */}
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
import React from 'react';
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

  // Get alerts from context instead of mock data
  const criticalAlerts = state.notifications?.filter(n => n.level === AlertLevel.Critical) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-col lg:flex-row">
        <Sidebar 
          activeView={activeView}
          setActiveView={setActiveView}
          onLogout={onLogout}
        />
        
        <main className="flex-1 lg:ml-64 p-4 lg:p-6">
          {/* Critical Alerts Banner */}
          {criticalAlerts.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Critical System Alerts
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {criticalAlerts.slice(0, 3).map((alert, index) => (
                        <li key={`alert-${alert.id || index}`}>{alert.title || alert.message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
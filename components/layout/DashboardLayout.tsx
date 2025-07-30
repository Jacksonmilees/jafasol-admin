import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ActiveView, SystemAlert, AlertLevel, Toast } from '../../types';
import { MOCK_SYSTEM_ALERTS } from '../../constants';
import AlertBanner from '../dashboard/AlertBanner';
import ToastNotification from '../ui/ToastNotification';


interface DashboardLayoutProps {
  children: React.ReactNode;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onLogout: () => void;
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeView, setActiveView, onLogout, toasts, removeToast }) => {
  const [visibleAlerts, setVisibleAlerts] = useState<SystemAlert[]>(
    MOCK_SYSTEM_ALERTS.filter(a => a.level === AlertLevel.Critical)
  );

  const handleDismissAlert = (alertId: string) => {
    setVisibleAlerts(prev => prev.filter(a => a.id !== alertId));
  };


  return (
    <div className="flex h-screen bg-brand-light">
      <div aria-live="assertive" className="fixed inset-0 flex flex-col items-end px-4 py-20 pointer-events-none sm:p-6 sm:items-end z-50 space-y-3">
          {toasts.map((toast) => (
            <ToastNotification key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
      </div>
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={onLogout} />
      <div className="flex-1 flex flex-col ml-64">
        <Header onLogout={onLogout} setActiveView={setActiveView} />
        <main className="flex-1 flex flex-col overflow-y-auto">
          {visibleAlerts.length > 0 && (
              <div className="p-6 pb-0 md:p-8 md:pb-0 lg:p-10 lg:pb-0 space-y-4">
                  {visibleAlerts.map(alert => (
                      <AlertBanner key={alert.id} alert={alert} onDismiss={handleDismissAlert} />
                  ))}
              </div>
          )}
          <div className="flex-1 p-6 md:p-8 lg:p-10">
              {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
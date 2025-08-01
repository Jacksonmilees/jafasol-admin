import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Card from '../ui/Card';

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number;
}

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

const SecurityPage: React.FC = () => {
  const { state, fetchLoginLogs, fetchSecurityAudit, fetchSecuritySettings } = useAdmin();
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    maxAge: 90
  });
  const [activeTab, setActiveTab] = useState<'policy' | 'logs' | 'audit'>('policy');

  useEffect(() => {
    fetchLoginLogs();
    fetchSecurityAudit();
    fetchSecuritySettings();
  }, [fetchLoginLogs, fetchSecurityAudit, fetchSecuritySettings]);

  const activityLogs = state.loginLogs || [];
  const securityAudit = state.securityAudit || [];

  const handlePolicyChange = (field: keyof PasswordPolicy, value: any) => {
    setPasswordPolicy(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('policy')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'policy'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Password Policy
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Login Logs
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'audit'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Security Audit
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'policy' && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Password Policy</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Length</label>
                <input
                  type="number"
                  value={passwordPolicy.minLength}
                  onChange={(e) => handlePolicyChange('minLength', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Requirements</label>
                <div className="space-y-2">
                  {[
                    { key: 'requireUppercase', label: 'Require uppercase letters' },
                    { key: 'requireLowercase', label: 'Require lowercase letters' },
                    { key: 'requireNumbers', label: 'Require numbers' },
                    { key: 'requireSpecialChars', label: 'Require special characters' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={passwordPolicy[key as keyof PasswordPolicy] as boolean}
                        onChange={(e) => handlePolicyChange(key as keyof PasswordPolicy, e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password Max Age (days)</label>
                <input
                  type="number"
                  value={passwordPolicy.maxAge}
                  onChange={(e) => handlePolicyChange('maxAge', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-4">
          {activityLogs.length > 0 ? (
            activityLogs.map((log: ActivityLog) => (
              <Card key={log.id}>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{log.user}</h3>
                      <p className="text-sm text-gray-500">{log.action}</p>
                      <p className="text-xs text-gray-400 mt-1">{log.timestamp}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      <p>{log.ipAddress}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No login logs available
            </div>
          )}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-4">
          {securityAudit.length > 0 ? (
            securityAudit.map((audit: any) => (
              <Card key={audit.id}>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{audit.action}</h3>
                      <p className="text-sm text-gray-500">{audit.details}</p>
                      <p className="text-xs text-gray-400 mt-1">{audit.timestamp}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      <p>{audit.ipAddress}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No security audit logs available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecurityPage;
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Card from '../ui/Card';

interface SystemSettingsType {
  platformName: string;
  adminEmail: string;
  platformUrl: string;
  defaultCurrency: string;
  taxPercentage: number;
  paymentGateways: {
    stripe: { apiKey: string; secretKey: string; };
    paypal: { clientId: string; clientSecret: string; };
    mpesa: { consumerKey: string; consumerSecret: string; };
  };
  emailConfig: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
  };
  branding: {
    logoUrl: string;
  };
}

const SystemSettings: React.FC = () => {
  const { state, updateSystemSettings } = useAdmin();
  const [settings, setSettings] = useState<SystemSettingsType>({
    platformName: '',
    adminEmail: '',
    platformUrl: '',
    defaultCurrency: 'USD',
    taxPercentage: 0,
    paymentGateways: {
      stripe: { apiKey: '', secretKey: '' },
      paypal: { clientId: '', clientSecret: '' },
      mpesa: { consumerKey: '', consumerSecret: '' },
    },
    emailConfig: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPass: '',
    },
    branding: {
      logoUrl: '',
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (state.systemSettings) {
      setSettings(state.systemSettings);
    }
  }, [state.systemSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSystemSettings(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Platform Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Platform Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Email</label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Platform URL</label>
              <input
                type="url"
                value={settings.platformUrl}
                onChange={(e) => setSettings({...settings, platformUrl: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Payment Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Currency</label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => setSettings({...settings, defaultCurrency: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="KES">KES</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax Percentage</label>
              <input
                type="number"
                value={settings.taxPercentage}
                onChange={(e) => setSettings({...settings, taxPercentage: parseFloat(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettings;
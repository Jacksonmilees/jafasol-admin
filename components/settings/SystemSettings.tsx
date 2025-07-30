import React, { useState } from 'react';
import Card from '../ui/Card';
import { MOCK_SYSTEM_SETTINGS } from '../../constants';
import { SystemSettings as SystemSettingsType } from '../../types';

interface SectionCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
    onSave?: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, description, onSave, children }) => (
    <Card className="flex flex-col">
        <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="bg-gray-50 p-6 space-y-4 flex-grow">
            {children}
        </div>
        {onSave && (
            <div className="px-6 py-4 bg-gray-50 text-right rounded-b-xl border-t">
                <button
                    onClick={onSave}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Save Changes
                </button>
            </div>
        )}
    </Card>
);

const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">{children}</div>
    </div>
);

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
    />
);


const SystemSettings: React.FC = () => {
    const [settings, setSettings] = useState<SystemSettingsType>(MOCK_SYSTEM_SETTINGS);

    // Dummy save function
    const handleSave = (section: string) => {
        console.log(`Saving ${section} settings...`, settings);
        // Here you would typically make an API call
        alert(`${section} settings saved! (Check console for data)`);
    };
    
    // Generic handler for nested state
    const handleNestedChange = (section: keyof SystemSettingsType, field: string, value: any) => {
         setSettings(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as any),
                [field]: value
            }
        }));
    };
    
    const handlePaymentGatewayChange = (gateway: 'stripe' | 'paypal' | 'mpesa', field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            paymentGateways: {
                ...prev.paymentGateways,
                [gateway]: {
                    ...prev.paymentGateways[gateway],
                    [field]: value,
                }
            }
        }));
    };


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
                <p className="mt-1 text-gray-600">Manage global configurations for the Jafasol platform.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <SectionCard title="General Settings" description="Basic platform information." onSave={() => handleSave('General')}>
                    <FormRow label="Platform Name">
                        <TextInput value={settings.platformName} onChange={e => setSettings({...settings, platformName: e.target.value})} />
                    </FormRow>
                    <FormRow label="Administrative Email">
                        <TextInput type="email" value={settings.adminEmail} onChange={e => setSettings({...settings, adminEmail: e.target.value})} />
                    </FormRow>
                     <FormRow label="Platform Base URL">
                        <TextInput type="url" value={settings.platformUrl} onChange={e => setSettings({...settings, platformUrl: e.target.value})} />
                    </FormRow>
                </SectionCard>

                 <SectionCard title="Branding" description="Customize the look of your platform." onSave={() => handleSave('Branding')}>
                     <FormRow label="Platform Logo">
                        <div className="flex items-center space-x-4">
                             <img src={settings.branding.logoUrl} alt="Current Logo" className="h-12 bg-white p-1 border rounded-md" />
                             <button className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Upload New Logo
                             </button>
                        </div>
                     </FormRow>
                </SectionCard>

                <SectionCard title="Billing & Payments" description="Configure currency, tax, and payment gateways." onSave={() => handleSave('Billing')}>
                    <div className="grid grid-cols-2 gap-4">
                        <FormRow label="Default Currency">
                            <TextInput value={settings.defaultCurrency} onChange={e => setSettings({...settings, defaultCurrency: e.target.value})} />
                        </FormRow>
                        <FormRow label="Tax Percentage (%)">
                            <TextInput type="number" value={settings.taxPercentage} onChange={e => setSettings({...settings, taxPercentage: parseFloat(e.target.value)})} />
                        </FormRow>
                    </div>
                    <h4 className="text-md font-medium text-gray-800 pt-4 border-t mt-4">Payment Gateways</h4>
                     <FormRow label="Stripe API Key">
                        <TextInput type="password" value={settings.paymentGateways.stripe.apiKey} onChange={e => handlePaymentGatewayChange('stripe', 'apiKey', e.target.value)} />
                    </FormRow>
                     <FormRow label="Stripe Secret Key">
                        <TextInput type="password" value={settings.paymentGateways.stripe.secretKey} onChange={e => handlePaymentGatewayChange('stripe', 'secretKey', e.target.value)} />
                    </FormRow>
                     <FormRow label="PayPal Client ID">
                        <TextInput type="password" value={settings.paymentGateways.paypal.clientId} onChange={e => handlePaymentGatewayChange('paypal', 'clientId', e.target.value)} />
                    </FormRow>
                </SectionCard>

                <SectionCard title="Email Configuration" description="Set up your SMTP server for sending emails." onSave={() => handleSave('Email')}>
                    <FormRow label="SMTP Host">
                        <TextInput value={settings.emailConfig.smtpHost} onChange={e => handleNestedChange('emailConfig', 'smtpHost', e.target.value)} />
                    </FormRow>
                    <FormRow label="SMTP Port">
                        <TextInput type="number" value={settings.emailConfig.smtpPort} onChange={e => handleNestedChange('emailConfig', 'smtpPort', parseInt(e.target.value))} />
                    </FormRow>
                     <FormRow label="SMTP Username">
                        <TextInput value={settings.emailConfig.smtpUser} onChange={e => handleNestedChange('emailConfig', 'smtpUser', e.target.value)} />
                    </FormRow>
                     <FormRow label="SMTP Password">
                        <TextInput type="password" value={settings.emailConfig.smtpPass} onChange={e => handleNestedChange('emailConfig', 'smtpPass', e.target.value)} />
                    </FormRow>
                     <div className="pt-2">
                         <button className="text-sm font-medium text-primary hover:underline">Send Test Email</button>
                    </div>
                </SectionCard>
            </div>
        </div>
    );
};

export default SystemSettings;
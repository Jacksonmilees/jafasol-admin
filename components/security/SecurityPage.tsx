import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { MOCK_ACTIVITY_LOGS, MOCK_PASSWORD_POLICY } from '../../constants';
import { ActivityLog, PasswordPolicy } from '../../types';
import ToggleSwitch from '../ui/ToggleSwitch';

const SecurityPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [whitelistedIps, setWhitelistedIps] = useState<string[]>(['192.168.1.1', '203.0.113.0/24']);
    const [newIp, setNewIp] = useState('');
    const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>(MOCK_PASSWORD_POLICY);
    const [is2faEnabled, setIs2faEnabled] = useState(false);

    const filteredLogs = useMemo(() => {
        return MOCK_ACTIVITY_LOGS.filter(log =>
            log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleAddIp = () => {
        if (newIp && !whitelistedIps.includes(newIp)) {
            setWhitelistedIps([...whitelistedIps, newIp]);
            setNewIp('');
        }
    };

    const handleRemoveIp = (ipToRemove: string) => {
        setWhitelistedIps(whitelistedIps.filter(ip => ip !== ipToRemove));
    };

    const handlePolicyChange = (field: keyof PasswordPolicy, value: boolean | number) => {
        setPasswordPolicy(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Security Center</h1>
                <p className="mt-1 text-gray-600">Monitor activity, manage access control, and set security policies.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* 2FA */}
                <Card>
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">Two-Factor Authentication (2FA)</h3>
                        <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to all admin accounts.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Enforce 2FA for all Admins</span>
                            <ToggleSwitch id="policy-2fa" enabled={is2faEnabled} onChange={setIs2faEnabled} />
                        </div>
                        {is2faEnabled && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center space-y-4 border">
                                <p className="text-sm text-gray-600">To set up, scan this QR code with an authenticator app (e.g., Google Authenticator).</p>
                                <div className="flex justify-center">
                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/Jafasol:super-admin@jafasol.com?secret=JBSWY3DPEHPK3PXP&issuer=Jafasol" alt="QR Code for 2FA" />
                                </div>
                                <div className="text-left">
                                     <h4 className="font-semibold text-gray-700">Recovery Codes:</h4>
                                     <p className="text-xs text-gray-500">Store these securely. They can be used to log in if you lose access to your device.</p>
                                     <pre className="mt-2 bg-white p-2 rounded text-sm font-mono text-gray-600 overflow-x-auto">
                                         <code>
                                             <div>abcd-1234</div>
                                             <div>efgh-5678</div>
                                             <div>ijkl-9012</div>
                                             <div>mnop-3456</div>
                                         </code>
                                     </pre>
                                </div>
                            </div>
                        )}
                         <div className="pt-2 flex justify-end">
                            <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700">Save 2FA Setting</button>
                        </div>
                    </div>
                </Card>

                {/* Password Policies */}
                <Card>
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">Password Policies</h3>
                        <p className="text-sm text-gray-500 mt-1">Enforce strong password requirements for all users.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="minLength" className="text-sm font-medium text-gray-700">Minimum Length</label>
                            <input
                                type="number"
                                id="minLength"
                                value={passwordPolicy.minLength}
                                onChange={(e) => handlePolicyChange('minLength', parseInt(e.target.value, 10))}
                                className="w-20 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Require Uppercase & Lowercase</span>
                            <ToggleSwitch id="policy-uppercase" enabled={passwordPolicy.requireUppercase} onChange={(e) => handlePolicyChange('requireUppercase', e)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Require Numbers</span>
                             <ToggleSwitch id="policy-numbers" enabled={passwordPolicy.requireNumbers} onChange={(e) => handlePolicyChange('requireNumbers', e)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Require Symbols (e.g., !@#$)</span>
                             <ToggleSwitch id="policy-symbols" enabled={passwordPolicy.requireSymbols} onChange={(e) => handlePolicyChange('requireSymbols', e)} />
                        </div>
                         <div className="pt-2 flex justify-end">
                            <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700">Save Policies</button>
                        </div>
                    </div>
                </Card>

                 {/* IP Whitelist Management */}
                <Card>
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">IP Whitelist Management</h3>
                        <p className="text-sm text-gray-500 mt-1">Only allow logins from these IP addresses.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newIp}
                                onChange={(e) => setNewIp(e.target.value)}
                                placeholder="Enter IP address or range (CIDR)"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                            />
                            <button onClick={handleAddIp} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700 whitespace-nowrap">Add IP</button>
                        </div>
                        <ul className="divide-y divide-gray-200 max-h-48 overflow-y-auto border rounded-md">
                            {whitelistedIps.map(ip => (
                                <li key={ip} className="px-4 py-3 flex justify-between items-center">
                                    <span className="font-mono text-sm text-gray-700">{ip}</span>
                                    <button onClick={() => handleRemoveIp(ip)} className="text-sm font-medium text-danger hover:text-red-700">Remove</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            </div>

            {/* Activity Audit Trail */}
            <Card>
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Activity Audit Trail</h3>
                     <input
                        type="text"
                        placeholder="Search logs by user, action, or IP..."
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto max-h-96">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLogs.map((log) => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full" src={log.userAvatar} alt={`${log.userName} avatar`} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.action}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{log.ipAddress}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default SecurityPage;
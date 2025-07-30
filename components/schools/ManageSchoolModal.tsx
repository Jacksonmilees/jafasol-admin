import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { School, PlanName, ModuleKey, SchoolStatus, Invoice, InvoiceStatus, FeatureToggle } from '../../types';
import { PLANS, MODULES, MOCK_INVOICES, MOCK_FEATURE_TOGGLES } from '../../constants';
import ToggleSwitch from '../ui/ToggleSwitch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ManageSchoolModalProps {
  school: School;
  onClose: () => void;
  onSave: (updatedSchool: School) => void;
}

type ActiveTab = 'profile' | 'subscription' | 'modules' | 'billing' | 'analytics' | 'featureToggles';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
  >
    {label}
  </button>
);

const InvoiceStatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
    const baseClasses = "px-2 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        [InvoiceStatus.Paid]: "bg-green-100 text-green-800",
        [InvoiceStatus.Due]: "bg-blue-100 text-blue-800",
        [InvoiceStatus.Overdue]: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const ManageSchoolModal: React.FC<ManageSchoolModalProps> = ({ school, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [editedSchool, setEditedSchool] = useState<School>(school);
  const [schoolInvoices, setSchoolInvoices] = useState<Invoice[]>([]);

  const subjectPerformance = [
      { name: 'Maths', performance: 85 },
      { name: 'Science', performance: 92 },
      { name: 'History', performance: 78 },
      { name: 'English', performance: 88 },
      { name: 'Art', performance: 95 },
  ];

  useEffect(() => {
    setEditedSchool(school);
    setSchoolInvoices(MOCK_INVOICES.filter(inv => inv.schoolId === school.id));
  }, [school]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedSchool(prev => ({ ...prev, [name]: value }));
  };

  const handleModuleToggle = (moduleKey: ModuleKey) => {
    setEditedSchool(prev => {
      const newModules = new Set(prev.modules);
      if (newModules.has(moduleKey)) {
        newModules.delete(moduleKey);
      } else {
        newModules.add(moduleKey);
      }
      return { ...prev, modules: Array.from(newModules) };
    });
  };

  const handleFeatureToggle = (toggleId: string) => {
    setEditedSchool(prev => {
        const currentToggles = prev.enabledFeatureToggles || [];
        const newToggles = new Set(currentToggles);
        if (newToggles.has(toggleId)) {
            newToggles.delete(toggleId);
        } else {
            newToggles.add(toggleId);
        }
        return { ...prev, enabledFeatureToggles: Array.from(newToggles) };
    });
  };

  const handleSaveChanges = () => {
    onSave(editedSchool);
  };

  const handleGenerateInvoice = () => {
    const plan = PLANS[editedSchool.plan];
    const newInvoice: Invoice = {
        id: `inv_${Date.now()}`,
        schoolId: school.id,
        schoolName: school.name,
        planName: plan.name,
        amount: plan.price,
        issuedDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        status: InvoiceStatus.Due,
    };
    setSchoolInvoices(prev => [newInvoice, ...prev]);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Manage: ${school.name}`}>
      <div className="space-y-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 sm:space-x-2" aria-label="Tabs">
            <TabButton label="Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <TabButton label="Subscription" isActive={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
            <TabButton label="Modules" isActive={activeTab === 'modules'} onClick={() => setActiveTab('modules')} />
            <TabButton label="Billing" isActive={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
            <TabButton label="Analytics" isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            <TabButton label="Features" isActive={activeTab === 'featureToggles'} onClick={() => setActiveTab('featureToggles')} />
          </nav>
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">School Name</label>
                <input type="text" name="name" id="name" value={editedSchool.name} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input type="email" name="email" id="email" value={editedSchool.email} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" name="phone" id="phone" value={editedSchool.phone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">School Status</label>
                <select id="status" name="status" value={editedSchool.status} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                  {Object.values(SchoolStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Subdomain</label>
                <p className="text-sm text-gray-800 mt-1 font-mono p-2 bg-gray-100 rounded-md">{editedSchool.subdomain}</p>
              </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700">Subscription Plan</label>
              <select id="plan" name="plan" value={editedSchool.plan} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                {Object.values(PLANS).map(p => <option key={p.name} value={p.name}>{p.name} - ${p.price}/mo</option>)}
              </select>
            </div>
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h4 className="font-semibold text-indigo-800">Plan Features</h4>
                <ul className="list-disc list-inside mt-2 text-sm text-indigo-700">
                    {PLANS[editedSchool.plan].features.map(f => <li key={f}>{f}</li>)}
                </ul>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-2">Assigned Modules</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border rounded-lg p-4 max-h-60 overflow-y-auto">
              {MODULES.map(module => (
                <div key={module.key} className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`mod-${module.key}`}
                      name={module.key}
                      type="checkbox"
                      checked={editedSchool.modules.includes(module.key)}
                      onChange={() => handleModuleToggle(module.key)}
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={`mod-${module.key}`} className="font-medium text-gray-700">{module.name}</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'billing' && (
           <div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-medium text-gray-800">Invoice History</h4>
                <button
                  type="button"
                  onClick={handleGenerateInvoice}
                  className="bg-secondary text-white py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-green-600"
                >
                  Generate New Invoice
                </button>
            </div>
             <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {schoolInvoices.length > 0 ? schoolInvoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-mono text-gray-500">{invoice.id}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">${invoice.amount.toFixed(2)}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{invoice.dueDate}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm"><InvoiceStatusBadge status={invoice.status} /></td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-sm text-gray-500">No invoices found for this school.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
           </div>
        )}

        {activeTab === 'analytics' && (
            <div className="space-y-4">
                 <h4 className="text-md font-medium text-gray-800">Analytics Preview</h4>
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <p className="text-2xl font-bold text-primary">580</p>
                        <p className="text-sm text-gray-600">Total Students</p>
                    </div>
                     <div className="p-4 bg-gray-100 rounded-lg">
                        <p className="text-2xl font-bold text-primary">35</p>
                        <p className="text-sm text-gray-600">Active Teachers</p>
                    </div>
                     <div className="p-4 bg-gray-100 rounded-lg">
                        <p className="text-2xl font-bold text-primary">85%</p>
                        <p className="text-sm text-gray-600">Fees Collected</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <p className="text-2xl font-bold text-primary">92%</p>
                        <p className="text-sm text-gray-600">Attendance</p>
                    </div>
                 </div>
                 <div>
                    <h5 className="font-semibold text-gray-700 mb-2">Average Subject Performance</h5>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <BarChart data={subjectPerformance} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis unit="%" />
                                <Tooltip cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}/>
                                <Bar dataKey="performance" radius={[4, 4, 0, 0]}>
                                    {subjectPerformance.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.performance > 90 ? '#10B981' : entry.performance > 80 ? '#3B82F6' : '#F59E0B'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </div>
            </div>
        )}
        
        {activeTab === 'featureToggles' && (
            <div>
                <h4 className="text-md font-medium text-gray-800 mb-2">Beta Feature Enrollment</h4>
                <div className="space-y-4 border rounded-lg p-4 max-h-60 overflow-y-auto">
                {MOCK_FEATURE_TOGGLES.map((toggle: FeatureToggle) => (
                    <div key={toggle.id} className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-800">{toggle.name}</p>
                            <p className="text-sm text-gray-500">{toggle.description}</p>
                        </div>
                        <ToggleSwitch
                            id={`ft-${toggle.id}`}
                            enabled={editedSchool.enabledFeatureToggles?.includes(toggle.id) ?? false}
                            onChange={() => handleFeatureToggle(toggle.id)}
                        />
                    </div>
                ))}
                </div>
            </div>
        )}

        <div className="pt-4 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={handleSaveChanges} className="bg-primary text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700">Save Changes</button>
        </div>
      </div>
    </Modal>
  );
};

export default ManageSchoolModal;
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Card from '../ui/Card';
import { PlusIcon } from '../icons/Icons';
import Modal from '../ui/Modal';
import ConfirmationModal from '../ui/ConfirmationModal';

type SSLStatus = 'active' | 'pending' | 'expired' | 'error';
type ServerStatus = 'online' | 'offline' | 'provisioning' | 'maintenance';

interface Subdomain {
  id: string;
  schoolId: string;
  schoolName: string;
  subdomain: string;
  fullDomain: string;
  url: string;
  sslStatus: SSLStatus;
  serverStatus: ServerStatus;
  createdAt: string;
  lastChecked?: string;
  dnsRecords?: Array<{ type: string; name: string; value: string; }>;
  isActive: boolean;
}

interface SubdomainTemplate {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
}

const SSLStatusBadge: React.FC<{ status: SSLStatus }> = ({ status }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
  const statusClasses = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    expired: "bg-red-100 text-red-800",
    error: "bg-red-100 text-red-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const ServerStatusBadge: React.FC<{ status: ServerStatus }> = ({ status }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
  const statusClasses = {
    online: "bg-green-100 text-green-800",
    offline: "bg-red-100 text-red-800",
    provisioning: "bg-blue-100 text-blue-800",
    maintenance: "bg-yellow-100 text-yellow-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const SubdomainManager: React.FC = () => {
  const { state, fetchSubdomains, createSubdomain, updateSubdomain, deleteSubdomain, checkSubdomainHealth, provisionSubdomain, getSubdomainAnalytics, bulkProvisionSubdomains, getSubdomainTemplates, applySubdomainTemplate } = useAdmin();
  const { subdomains, isLoading } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubdomain, setEditingSubdomain] = useState<Subdomain | null>(null);
  const [deletingSubdomain, setDeletingSubdomain] = useState<Subdomain | null>(null);
  const [selectedSubdomains, setSelectedSubdomains] = useState<string[]>([]);
  const [templates, setTemplates] = useState<SubdomainTemplate[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'templates' | 'dns'>('overview');

  const [newSubdomainData, setNewSubdomainData] = useState({
    schoolId: '',
    schoolName: '',
    subdomain: ''
  });

  useEffect(() => {
    fetchSubdomains();
    loadTemplates();
  }, [fetchSubdomains]);

  const loadTemplates = async () => {
    try {
      const response = await getSubdomainTemplates();
      setTemplates(response.templates || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleCreateSubdomain = async () => {
    try {
      await createSubdomain(newSubdomainData);
      setIsModalOpen(false);
      setNewSubdomainData({ schoolId: '', schoolName: '', subdomain: '' });
    } catch (error) {
      console.error('Failed to create subdomain:', error);
    }
  };

  const handleUpdateSubdomain = async (id: string, updates: any) => {
    try {
      await updateSubdomain(id, updates);
      setEditingSubdomain(null);
    } catch (error) {
      console.error('Failed to update subdomain:', error);
    }
  };

  const handleDeleteSubdomain = async () => {
    if (!deletingSubdomain) return;
    try {
      await deleteSubdomain(deletingSubdomain.id);
      setDeletingSubdomain(null);
    } catch (error) {
      console.error('Failed to delete subdomain:', error);
    }
  };

  const handleHealthCheck = async (id: string) => {
    try {
      const health = await checkSubdomainHealth(id);
      console.log('Health check result:', health);
    } catch (error) {
      console.error('Failed to check health:', error);
    }
  };

  const handleProvisionSubdomain = async (id: string) => {
    try {
      await provisionSubdomain(id);
    } catch (error) {
      console.error('Failed to provision subdomain:', error);
    }
  };

  const handleBulkProvision = async () => {
    if (selectedSubdomains.length === 0) return;
    try {
      await bulkProvisionSubdomains(selectedSubdomains);
      setSelectedSubdomains([]);
    } catch (error) {
      console.error('Failed to bulk provision:', error);
    }
  };

  const handleApplyTemplate = async (subdomainId: string, templateId: string) => {
    try {
      await applySubdomainTemplate(subdomainId, templateId);
    } catch (error) {
      console.error('Failed to apply template:', error);
    }
  };

  const handleViewAnalytics = async (id: string) => {
    try {
      const analytics = await getSubdomainAnalytics(id);
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Failed to get analytics:', error);
    }
  };

  const handleSelectSubdomain = (id: string) => {
    setSelectedSubdomains(prev => 
      prev.includes(id) 
        ? prev.filter(subId => subId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubdomains.length === subdomains.length) {
      setSelectedSubdomains([]);
    } else {
      setSelectedSubdomains(subdomains.map(s => s.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Subdomain Management</h1>
          <p className="mt-1 text-gray-600">Manage custom subdomains for each school</p>
        </div>
        <div className="flex space-x-3">
          {selectedSubdomains.length > 0 && (
            <button
              onClick={handleBulkProvision}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Provision Selected ({selectedSubdomains.length})
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Subdomain
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('dns')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dns'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            DNS Management
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedSubdomains.length === subdomains.length && subdomains.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subdomain</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SSL Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Server Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subdomains.map((subdomain) => (
                  <tr key={subdomain.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedSubdomains.includes(subdomain.id)}
                        onChange={() => handleSelectSubdomain(subdomain.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{subdomain.schoolName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{subdomain.fullDomain}</div>
                      <div className="text-sm text-gray-500">{subdomain.url}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <SSLStatusBadge status={subdomain.sslStatus as SSLStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ServerStatusBadge status={subdomain.serverStatus as ServerStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subdomain.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleHealthCheck(subdomain.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Health Check
                      </button>
                      <button
                        onClick={() => handleProvisionSubdomain(subdomain.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Provision
                      </button>
                      <button
                        onClick={() => handleViewAnalytics(subdomain.id)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Analytics
                      </button>
                      <button
                        onClick={() => setEditingSubdomain(subdomain)}
                        className="text-primary hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingSubdomain(subdomain)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'analytics' && analyticsData && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Subdomain Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analyticsData.uptime}%</div>
                <div className="text-sm text-blue-600">Uptime</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{analyticsData.responseTime}ms</div>
                <div className="text-sm text-green-600">Response Time</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{analyticsData.monthlyVisits}</div>
                <div className="text-sm text-purple-600">Monthly Visits</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'templates' && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Subdomain Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                  <div className="mt-2">
                    <span className="text-lg font-bold text-primary">${template.price}</span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {template.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600">• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'dns' && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">DNS Management</h3>
            <p className="text-gray-600">Configure DNS records for your subdomains</p>
            {/* DNS management interface would go here */}
          </div>
        </Card>
      )}

      {/* Create Subdomain Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Subdomain">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">School ID</label>
            <input
              type="text"
              value={newSubdomainData.schoolId}
              onChange={(e) => setNewSubdomainData({ ...newSubdomainData, schoolId: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">School Name</label>
            <input
              type="text"
              value={newSubdomainData.schoolName}
              onChange={(e) => setNewSubdomainData({ ...newSubdomainData, schoolName: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subdomain</label>
            <input
              type="text"
              value={newSubdomainData.subdomain}
              onChange={(e) => setNewSubdomainData({ ...newSubdomainData, subdomain: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              placeholder="schoolname"
            />
            <p className="mt-1 text-sm text-gray-500">Will be available at: {newSubdomainData.subdomain}.jafasol.com</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateSubdomain}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary hover:bg-indigo-700"
          >
            Create Subdomain
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deletingSubdomain && (
        <ConfirmationModal
          isOpen={!!deletingSubdomain}
          onClose={() => setDeletingSubdomain(null)}
          onConfirm={handleDeleteSubdomain}
          title="Delete Subdomain"
          message={`Are you sure you want to delete the subdomain "${deletingSubdomain.fullDomain}"? This action cannot be undone.`}
          confirmButtonText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}
    </div>
  );
};

export default SubdomainManager;
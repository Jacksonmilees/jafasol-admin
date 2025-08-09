import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Modal from '../ui/Modal';
import { School } from '../../types';
import ModuleManagement from './ModuleManagement';

// School Credentials Tab Component
const SchoolCredentialsTab: React.FC<{ school: School | null }> = ({ school }) => {
  const [credentials, setCredentials] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const fetchCredentials = async () => {
    if (!school) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/schools/${school.id}/credentials`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCredentials(data.school);
      } else {
        console.error('Failed to fetch credentials');
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async () => {
    if (!school || !newPassword) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/schools/${school.id}/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });
      
      if (response.ok) {
        alert('Password updated successfully! The new password can now be used to login.');
        setNewPassword('');
        fetchCredentials();
      } else {
        const errorData = await response.json();
        alert(`Failed to update password: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePassword = async () => {
    if (!school) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/schools/${school.id}/generate-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneratedPassword(data.school.newPassword);
        fetchCredentials();
        alert('New password generated successfully! The generated password can now be used to login.');
      } else {
        const errorData = await response.json();
        alert(`Failed to generate password: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating password:', error);
      alert('Failed to generate password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, [school]);

  if (!school) return null;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">School Admin Credentials</h4>
        <p className="text-sm text-blue-700">
          Manage login credentials for {school.name} administrators.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading...</p>
        </div>
      ) : credentials ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Current Admin Account</h5>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-sm text-gray-900">{credentials.email}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Subdomain:</span>
                <span className="ml-2 text-sm text-gray-900">{credentials.schoolSubdomain}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`ml-2 text-sm px-2 py-1 rounded-full ${
                  credentials.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {credentials.status}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Update Password</h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <button
                onClick={updatePassword}
                disabled={!newPassword || newPassword.length < 6 || isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>

          <div className="border-t pt-4">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Generate New Password</h5>
            <p className="text-sm text-gray-600 mb-3">
              Generate a secure random password for the school admin.
            </p>
            <button
              onClick={generatePassword}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate New Password'}
            </button>
            
            {generatedPassword && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm font-medium text-green-800 mb-1">New Password Generated:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatedPassword}
                    readOnly
                    className="flex-1 text-sm font-mono bg-white border border-green-300 rounded px-2 py-1"
                  />
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(generatedPassword);
                        alert('Password copied to clipboard!');
                      } catch (error) {
                        console.error('Failed to copy password:', error);
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = generatedPassword;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        alert('Password copied to clipboard!');
                      }
                    }}
                    className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 border border-green-300 rounded hover:bg-green-200"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Please save this password securely. It won't be shown again.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No credentials found for this school.</p>
        </div>
      )}
    </div>
  );
};

interface ManageSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedSchool: School) => void;
  school: School | null;
}

const ManageSchoolModal: React.FC<ManageSchoolModalProps> = ({ isOpen, onClose, onSave, school }) => {
  const { state, updateSchool, uploadSchoolLogo } = useAdmin();
  const [activeTab, setActiveTab] = useState<'details' | 'billing' | 'modules' | 'features' | 'credentials'>('details');
  const [schoolData, setSchoolData] = useState<Partial<School>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [showModuleManagement, setShowModuleManagement] = useState(false);

  console.log('ManageSchoolModal rendered:', { isOpen, school: school?.name });

  useEffect(() => {
    if (school) {
      setSchoolData(school);
      setLogoPreview(school.logoUrl || '');
    }
  }, [school]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!school || !logoFile) return;

    try {
      const logoData = {
        logoUrl: logoPreview,
        fileName: logoFile.name,
        fileSize: logoFile.size,
        fileType: logoFile.type
      };
      
      await uploadSchoolLogo(school.id, logoData);
      alert('Logo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;

    setIsSubmitting(true);
    try {
      await updateSchool(school.id, schoolData);
      
      // Create updated school object
      const updatedSchool = { ...school, ...schoolData };
      
      // Call onSave if provided
      if (onSave) {
        onSave(updatedSchool);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating school:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof School, value: any) => {
    setSchoolData(prev => ({ ...prev, [field]: value }));
  };

  if (!school) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage ${school.name}`}>
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['details', 'billing', 'modules', 'features', 'credentials'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">School Name</label>
              <input
                type="text"
                value={schoolData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={schoolData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={schoolData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={schoolData.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">School Logo</label>
              <div className="mt-2 flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {logoPreview && (
                  <img src={logoPreview} alt="School Logo Preview" className="ml-4 h-10 w-10 rounded-full object-cover" />
                )}
                {logoFile && (
                  <button
                    type="button"
                    onClick={handleLogoUpload}
                    className="ml-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    Upload Logo
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Plan</label>
              <select
                value={schoolData.plan || ''}
                onChange={(e) => handleInputChange('plan', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Billing Information</h4>
              <p className="text-sm text-gray-500">Billing details will be managed through the billing system.</p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Module Management</h4>
              <p className="text-sm text-blue-700">Manage which modules are available to this school. These modules will appear in their sidebar.</p>
            </div>
            
            {/* Display current assigned modules */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Currently Assigned Modules</h4>
              {schoolData.modules && schoolData.modules.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {schoolData.modules.map((module, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium"
                    >
                      {module}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No modules assigned yet.</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowModuleManagement(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Manage Modules
              </button>
            </div>

            {showModuleManagement && school && (
              <ModuleManagement
                school={school}
                onClose={() => setShowModuleManagement(false)}
                onUpdate={(schoolId, modules) => {
                  handleInputChange('modules', modules);
                  setShowModuleManagement(false);
                }}
              />
            )}
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Feature Management</h4>
              <p className="text-sm text-gray-500">Feature toggles are managed globally through the Feature Toggles section.</p>
            </div>
          </div>
        )}

        {activeTab === 'credentials' && (
          <SchoolCredentialsTab school={school} />
        )}
      </div>
    </Modal>
  );
};

export default ManageSchoolModal;
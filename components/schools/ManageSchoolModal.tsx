import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Modal from '../ui/Modal';
import { School } from '../../types';

interface ManageSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedSchool: School) => void;
  school: School | null;
}

const ManageSchoolModal: React.FC<ManageSchoolModalProps> = ({ isOpen, onClose, onSave, school }) => {
  const { state, updateSchool, uploadSchoolLogo } = useAdmin();
  const [activeTab, setActiveTab] = useState<'details' | 'billing' | 'modules' | 'features'>('details');
  const [schoolData, setSchoolData] = useState<Partial<School>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

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
            {['details', 'billing', 'modules', 'features'].map((tab) => (
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Enabled Modules</label>
              <div className="mt-2 space-y-2">
                {[
                  { key: 'analytics', label: 'Analytics' },
                  { key: 'academics', label: 'Academics' },
                  { key: 'attendance', label: 'Attendance' },
                  { key: 'fees', label: 'Fee Management' },
                  { key: 'communication', label: 'Communication' },
                  { key: 'transport', label: 'Transport' },
                  { key: 'library', label: 'Library' }
                ].map((module) => (
                  <label key={module.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={schoolData.modules?.includes(module.key as any) || false}
                      onChange={(e) => {
                        const currentModules = schoolData.modules || [];
                        const newModules = e.target.checked
                          ? [...currentModules, module.key as any]
                          : currentModules.filter(m => m !== module.key);
                        handleInputChange('modules', newModules);
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{module.label}</span>
                  </label>
                ))}
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

        {activeTab === 'features' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Feature Management</h4>
              <p className="text-sm text-gray-500">Feature toggles are managed globally through the Feature Toggles section.</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ManageSchoolModal;
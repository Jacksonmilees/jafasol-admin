import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { PLANS, MODULES } from '../../constants';
import { PlanName, ModuleKey, School, SchoolStatus } from '../../types';

interface RegisterSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newSchoolData: Omit<School, 'id' | 'createdAt' | 'storageUsage' | 'logoUrl'>) => void;
}

const RegisterSchoolModal: React.FC<RegisterSchoolModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState<PlanName>(PlanName.Basic);
  const [subdomain, setSubdomain] = useState('');
  const [assignedModules, setAssignedModules] = useState<Set<ModuleKey>>(new Set());
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(event.target.files)]);
    }
  };

  const removeFile = (fileName: string) => {
      setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };


  const handleModuleToggle = (moduleKey: ModuleKey) => {
    setAssignedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleKey)) {
        newSet.delete(moduleKey);
      } else {
        newSet.add(moduleKey);
      }
      return newSet;
    });
  };
  
  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPlan(PlanName.Basic);
    setSubdomain('');
    setAssignedModules(new Set());
    setUploadedFiles([]);
  };

  const handleSave = () => {
    if (!name || !email || !subdomain) {
      alert("School Name, Email, and Subdomain are required.");
      return;
    }
    // Note: uploadedFiles state is managed but not passed in onCreate,
    // as file handling logic would be backend-dependent.
    onCreate({
      name,
      email,
      phone,
      plan,
      status: SchoolStatus.Active,
      subdomain: `${subdomain}.jafasol.com`,
      modules: Array.from(assignedModules),
    });
    resetForm();
    onClose();
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Register New School">
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">School Name</label>
            <input type="text" id="schoolName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="schoolEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input type="email" id="schoolEmail" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="schoolPhone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="tel" id="schoolPhone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="plan" className="block text-sm font-medium text-gray-700">Subscription Plan</label>
            <select id="plan" value={plan} onChange={e => setPlan(e.target.value as PlanName)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm">
              {Object.values(PLANS).map(p => (
                <option key={p.name} value={p.name}>{p.name} - KSh {p.price.toLocaleString()}/mo</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Logo and Subdomain */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-700">School Logo</label>
                <div className="mt-1 flex items-center">
                    <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </span>
                    <button type="button" className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Upload
                    </button>
                </div>
            </div>
            <div>
                 <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">Subdomain</label>
                 <div className="mt-1 flex rounded-md shadow-sm">
                    <input type="text" id="subdomain" value={subdomain} onChange={e => setSubdomain(e.target.value)} className="focus:ring-primary focus:border-primary flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300" placeholder="schoolname" />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">.jafasol.com</span>
                 </div>
            </div>
        </div>

        {/* Document Upload */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Required Documents</label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                            <span>Upload files</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                </div>
            </div>
            {uploadedFiles.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-600">Uploaded:</h4>
                    <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                        {uploadedFiles.map(file => (
                            <li key={file.name} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                <div className="w-0 flex-1 flex items-center">
                                    <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                    <button onClick={() => removeFile(file.name)} className="font-medium text-danger hover:text-red-700">Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        
        {/* Module Assignment */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-2">Assign Modules</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border rounded-lg p-4 max-h-60 overflow-y-auto">
            {MODULES.map(module => (
              <div key={module.key} className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={`reg-${module.key}`}
                    name={module.key}
                    type="checkbox"
                    checked={assignedModules.has(module.key)}
                    onChange={() => handleModuleToggle(module.key)}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={`reg-${module.key}`} className="font-medium text-gray-700">{module.name}</label>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="pt-4 flex justify-end space-x-3">
          <button type="button" onClick={handleClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={handleSave} className="bg-primary text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700">Create School</button>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterSchoolModal;
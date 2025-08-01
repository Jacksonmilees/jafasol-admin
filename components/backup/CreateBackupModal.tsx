import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Modal from '../ui/Modal';

interface CreateBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBackupModal: React.FC<CreateBackupModalProps> = ({ isOpen, onClose }) => {
  const { state } = useAdmin();
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [backupType, setBackupType] = useState<'full' | 'incremental'>('full');
  const [includeSettings, setIncludeSettings] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool) return;

    setIsCreating(true);
    try {
      // Here you would call the actual backup API
      console.log('Creating backup for school:', selectedSchool);
      console.log('Backup type:', backupType);
      console.log('Include settings:', includeSettings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onClose();
    } catch (error) {
      console.error('Error creating backup:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Backup">
      <form onSubmit={handleCreateBackup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select School</label>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Choose a school</option>
            {state.schools.map((school: any) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Backup Type</label>
          <select
            value={backupType}
            onChange={(e) => setBackupType(e.target.value as 'full' | 'incremental')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="full">Full Backup</option>
            <option value="incremental">Incremental Backup</option>
          </select>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeSettings}
              onChange={(e) => setIncludeSettings(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Include system settings</span>
          </label>
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
            disabled={isCreating || !selectedSchool}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isCreating ? 'Creating Backup...' : 'Create Backup'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBackupModal;
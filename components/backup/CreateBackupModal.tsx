import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { MOCK_SCHOOLS } from '../../constants';
import { School } from '../../types';

interface CreateBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (schoolId: string) => void;
}

const CreateBackupModal: React.FC<CreateBackupModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [selectedSchool, setSelectedSchool] = useState<string>(MOCK_SCHOOLS[0]?.id || '');

  const handleCreate = () => {
    if (selectedSchool) {
      onCreate(selectedSchool);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Manual Backup">
      <div className="space-y-4">
        <div>
          <label htmlFor="school" className="block text-sm font-medium text-gray-700">
            Select School
          </label>
          <select
            id="school"
            name="school"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
          >
            {MOCK_SCHOOLS.map((school: School) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-600">
          This action will trigger a new backup for the selected school. The backup will appear in the list once it begins processing.
        </p>
        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="bg-primary text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700"
            disabled={!selectedSchool}
          >
            Initiate Backup
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateBackupModal;
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Modal from '../ui/Modal';
import { UserRole, UserStatus } from '../../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: any;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, userToEdit }) => {
  const { state, createUser, updateUser } = useAdmin();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.SchoolAdmin);
  const [schoolId, setSchoolId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || '');
      setEmail(userToEdit.email || '');
      setRole(userToEdit.role || UserRole.SchoolAdmin);
      setSchoolId(userToEdit.schoolId || '');
    } else {
      setName('');
      setEmail('');
      setRole(UserRole.SchoolAdmin);
      setSchoolId('');
    }
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userData = userToEdit 
        ? { name, email, role, schoolId, schoolName: state.schools.find(s=>s.id === schoolId)?.name }
        : { name, email, role, schoolId, schoolName: state.schools.find(s=>s.id === schoolId)?.name };

      if (userToEdit) {
        await updateUser(userToEdit.id, userData);
      } else {
        await createUser(userData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={userToEdit ? 'Edit User' : 'Add New User'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value={UserRole.SchoolAdmin}>School Admin</option>
            <option value={UserRole.SuperAdmin}>Super Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">School</label>
          <select
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a school</option>
            {state.schools.map((school: any) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
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
            {isSubmitting ? 'Saving...' : (userToEdit ? 'Update User' : 'Add User')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
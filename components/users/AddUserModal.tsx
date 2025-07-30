import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { MOCK_SCHOOLS } from '../../constants';
import { School, UserRole, User } from '../../types';

interface UserEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: User | Omit<User, 'id' | 'status' | 'avatarUrl' | 'lastLogin'>) => void;
  onPasswordReset: (userId: string) => void;
  userToEdit: User | null;
}

const AddUserModal: React.FC<UserEditorModalProps> = ({ isOpen, onClose, onSave, userToEdit, onPasswordReset }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.SchoolAdmin);
  const [schoolId, setSchoolId] = useState<string>(MOCK_SCHOOLS[0]?.id || '');

  const isEditMode = userToEdit !== null;

  useEffect(() => {
    if (isEditMode) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setRole(userToEdit.role);
      setSchoolId(userToEdit.schoolId || MOCK_SCHOOLS[0]?.id || '');
    } else {
      // Reset for new user
      setName('');
      setEmail('');
      setRole(UserRole.SchoolAdmin);
      setSchoolId(MOCK_SCHOOLS[0]?.id || '');
    }
  }, [userToEdit, isOpen, isEditMode]);

  const handleSave = () => {
    if (!name || !email) {
      alert('Name and Email are required.');
      return;
    }
    
    if (isEditMode) {
        onSave({ ...userToEdit, name, email, role, schoolId: role === UserRole.SchoolAdmin ? schoolId : undefined });
    } else {
        const userData = role === UserRole.SchoolAdmin 
            ? { name, email, role, schoolId, schoolName: MOCK_SCHOOLS.find(s=>s.id === schoolId)?.name } 
            : { name, email, role };
        onSave(userData);
    }
    onClose();
  };

  const handlePasswordResetClick = () => {
      if(isEditMode) {
          onPasswordReset(userToEdit.id);
      }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit User' : 'Add New User'}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="userName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="userEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="userRole" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            id="userRole"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value={UserRole.SuperAdmin}>Super Admin</option>
            <option value={UserRole.SchoolAdmin}>School Admin</option>
          </select>
        </div>
        {role === UserRole.SchoolAdmin && (
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700">Assign to School</label>
            <select
              id="school"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            >
              {MOCK_SCHOOLS.map((school: School) => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </div>
        )}
        <div className="pt-4 flex justify-between items-center">
          <div>
            {isEditMode && (
                <button type="button" onClick={handlePasswordResetClick} className="text-sm font-medium text-warning hover:text-yellow-700">Reset Password</button>
            )}
          </div>
          <div className="flex space-x-3">
            <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="button" onClick={handleSave} className="bg-primary text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700">{isEditMode ? 'Save Changes' : 'Create User'}</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModal;
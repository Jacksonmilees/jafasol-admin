import React, { useState, useMemo, useEffect } from 'react';
import Card from '../ui/Card';
import { useAdmin } from '../../context/AdminContext';
import { User, UserStatus, UserRole } from '../../types';
import { PlusIcon } from '../icons/Icons';
import AddUserModal from './AddUserModal';
import ConfirmationModal from '../ui/ConfirmationModal';

const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
    const statusClasses = {
        [UserStatus.Active]: "bg-green-100 text-green-800",
        [UserStatus.Suspended]: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
    const roleClasses = {
        [UserRole.SuperAdmin]: "bg-purple-100 text-purple-800",
        [UserRole.SchoolAdmin]: "bg-blue-100 text-blue-800",
    };
    return <span className={`${baseClasses} ${roleClasses[role]}`}>{role}</span>;
};

type ActiveTab = 'all' | 'superAdmin' | 'schoolAdmin';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; count: number }> = ({ label, isActive, onClick, count }) => (
    <button onClick={onClick} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${ isActive ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' }`}>
        {label}
        <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${ isActive ? 'bg-white text-primary' : 'bg-gray-200 text-gray-700'}`}>{count}</span>
    </button>
);

const UserManagement: React.FC = () => {
    const { state, fetchUsers, createUser, updateUser, deleteUser, resetUserPassword, toggleUserStatus } = useAdmin();
    const { users, isLoading } = state;
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<ActiveTab>('all');

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };
    
    const handleOpenEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = async (userData: User | Omit<User, 'id' | 'status' | 'avatarUrl' | 'lastLogin'>) => {
        try {
            if ('id' in userData) {
                // Editing existing user
                await updateUser(userData.id, userData);
            } else {
                // Creating new user
                await createUser(userData);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save user:', error);
        }
    };
    
    const handlePasswordReset = async (userId: string) => {
        try {
            const response = await resetUserPassword(userId);
            alert(`Password reset successful. Temporary password: ${response.tempPassword}`);
        } catch (error) {
            console.error('Failed to reset password:', error);
            alert('Failed to reset password');
        }
    };
    
    const handleToggleStatus = async (userId: string) => {
        try {
            await toggleUserStatus(userId);
        } catch (error) {
            console.error('Failed to toggle user status:', error);
        }
    };

    const handleDeleteUser = async () => {
        if (!deletingUser) return;
        try {
            await deleteUser(deletingUser.id);
            setDeletingUser(null);
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const filteredUsers = useMemo(() => {
        const tabFiltered = users.filter(user => {
            if (activeTab === 'superAdmin') return user.role === UserRole.SuperAdmin;
            if (activeTab === 'schoolAdmin') return user.role === UserRole.SchoolAdmin;
            return true;
        });

        if (!searchTerm) return tabFiltered;

        return tabFiltered.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.schoolName && user.schoolName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm, activeTab]);

    return (
        <div className="space-y-6">
            <AddUserModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveUser}
                userToEdit={editingUser}
                onPasswordReset={handlePasswordReset}
             />
             
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">User & Admin Management</h1>
                    <p className="mt-1 text-gray-600">Manage all admin accounts for the platform and schools.</p>
                </div>
                <button onClick={handleOpenAddModal} className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Add New User
                </button>
            </div>

            <Card>
                <div className="p-4 border-b space-y-4">
                    <div className="flex space-x-2">
                        <TabButton label="All Users" isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} count={users.length} />
                        <TabButton label="Super Admins" isActive={activeTab === 'superAdmin'} onClick={() => setActiveTab('superAdmin')} count={users.filter(u => u.role === UserRole.SuperAdmin).length} />
                        <TabButton label="School Admins" isActive={activeTab === 'schoolAdmin'} onClick={() => setActiveTab('schoolAdmin')} count={users.filter(u => u.role === UserRole.SchoolAdmin).length} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, email, or school..."
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned School</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><RoleBadge role={user.role} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.schoolName || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={user.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-4">
                                            <button onClick={() => handleToggleStatus(user.id)} className={`text-sm font-medium ${user.status === UserStatus.Active ? 'text-warning hover:text-yellow-700' : 'text-secondary hover:text-green-700'}`}>
                                                {user.status === UserStatus.Active ? 'Suspend' : 'Activate'}
                                            </button>
                                            <button onClick={() => handleOpenEditModal(user)} className="text-primary hover:text-indigo-900">Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default UserManagement;
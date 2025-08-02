import React, { useState } from 'react';
import Card from '../ui/Card';
import { School, SchoolStatus, PlanName, Toast, ToastType } from '../../types';
import { PlusIcon } from '../icons/Icons';
import RegisterSchoolModal from './RegisterSchoolModal';
import ManageSchoolModal from './ManageSchoolModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import OnboardingSuccessModal from './OnboardingSuccessModal';
import ToastNotification from '../ui/ToastNotification';

interface SchoolsListProps {
  schools: School[];
  onCreateSchool: (newSchoolData: Omit<School, 'id' | 'createdAt' | 'storageUsage' | 'logoUrl'>) => Promise<School>;
  onUpdateSchool: (updatedSchool: School) => void;
  onDeleteSchool: (schoolId: string) => void;
  onRefreshSchools?: () => void;
}

const StatusBadge: React.FC<{ status: SchoolStatus }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
    const statusClasses = {
        [SchoolStatus.Active]: "bg-green-100 text-green-800",
        [SchoolStatus.Inactive]: "bg-gray-100 text-gray-800",
        [SchoolStatus.Suspended]: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const PlanBadge: React.FC<{ plan: PlanName }> = ({ plan }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
    const planClasses = {
        [PlanName.Free]: "bg-gray-100 text-gray-800",
        [PlanName.Basic]: "bg-blue-100 text-blue-800",
        [PlanName.Premium]: "bg-indigo-100 text-indigo-800",
        [PlanName.Enterprise]: "bg-purple-100 text-purple-800",
    };
    return <span className={`${baseClasses} ${planClasses[plan]}`}>{plan}</span>;
};

const SchoolsList: React.FC<SchoolsListProps> = ({ schools, onCreateSchool, onUpdateSchool, onDeleteSchool, onRefreshSchools }) => {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [editingSchool, setEditingSchool] = useState<School | null>(null);
    const [deletingSchool, setDeletingSchool] = useState<School | null>(null);
    const [onboardingInfo, setOnboardingInfo] = useState<{ isOpen: boolean; schoolName: string; credentials: {username: string; password: string} }>({ isOpen: false, schoolName: '', credentials: {username: '', password: ''} });
    const [isLoading, setIsLoading] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const handleCreateSchool = async (newSchoolData: Omit<School, 'id' | 'createdAt' | 'storageUsage' | 'logoUrl'>) => {
        try {
            setIsLoading(true);
            const newSchool = await onCreateSchool(newSchoolData);
            
            // Extract credentials from the API response
            const adminCredentials = (newSchool as any).adminCredentials;
            const username = adminCredentials?.username || `admin@${newSchool.subdomain}`;
            const password = adminCredentials?.password || Math.random().toString(36).slice(-8);
            
            setOnboardingInfo({
                isOpen: true,
                schoolName: newSchool.name,
                credentials: { username, password }
            });

            // Add success toast
            const successToast: Toast = {
                id: Date.now().toString(),
                type: 'success',
                message: `School "${newSchool.name}" created successfully!`,
                duration: 5000
            };
            setToasts(prev => [...prev, successToast]);

            setIsRegisterModalOpen(false);
        } catch (error) {
            console.error('Failed to create school:', error);
            
            // Add error toast
            const errorToast: Toast = {
                id: Date.now().toString(),
                type: 'error',
                message: 'Failed to create school. Please try again.',
                duration: 5000
            };
            setToasts(prev => [...prev, errorToast]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateSchool = (updatedSchool: School) => {
        onUpdateSchool(updatedSchool);
        setEditingSchool(null);
        
        // Add success toast
        const successToast: Toast = {
            id: Date.now().toString(),
            type: 'success',
            message: `School "${updatedSchool.name}" updated successfully!`,
            duration: 3000
        };
        setToasts(prev => [...prev, successToast]);
    };

    const handleDeleteSchool = () => {
        if (!deletingSchool) return;
        onDeleteSchool(deletingSchool.id);
        
        // Add success toast
        const successToast: Toast = {
            id: Date.now().toString(),
            type: 'success',
            message: `School "${deletingSchool.name}" deleted successfully!`,
            duration: 3000
        };
        setToasts(prev => [...prev, successToast]);
        
        setDeletingSchool(null);
    }

    const dismissToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const handleRefreshSchools = () => {
        if (onRefreshSchools) {
            setIsLoading(true);
            onRefreshSchools();
            
            // Add success toast after a short delay
            setTimeout(() => {
                const refreshToast: Toast = {
                    id: Date.now().toString(),
                    type: 'success',
                    message: 'Schools list refreshed successfully!',
                    duration: 3000
                };
                setToasts(prev => [...prev, refreshToast]);
                setIsLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toast Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <ToastNotification
                        key={toast.id}
                        toast={toast}
                        onDismiss={dismissToast}
                    />
                ))}
            </div>
            
            <RegisterSchoolModal 
                isOpen={isRegisterModalOpen} 
                onClose={() => setIsRegisterModalOpen(false)} 
                onCreate={handleCreateSchool} 
            />
            {editingSchool && (
                <ManageSchoolModal 
                    isOpen={!!editingSchool}
                    school={editingSchool} 
                    onClose={() => setEditingSchool(null)} 
                    onSave={handleUpdateSchool}
                />
            )}
            {deletingSchool && (
                <ConfirmationModal
                    isOpen={!!deletingSchool}
                    onClose={() => setDeletingSchool(null)}
                    onConfirm={handleDeleteSchool}
                    title="Delete School"
                    message={`Are you sure you want to permanently delete "${deletingSchool.name}"? This action will remove all associated data and cannot be undone.`}
                    confirmButtonText="Delete"
                />
            )}
            <OnboardingSuccessModal
                isOpen={onboardingInfo.isOpen}
                onClose={() => setOnboardingInfo({ ...onboardingInfo, isOpen: false })}
                schoolName={onboardingInfo.schoolName}
                credentials={onboardingInfo.credentials}
            />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Schools Management</h1>
                    <p className="mt-1 text-gray-600">View, manage, and onboard schools on the platform.</p>
                </div>
                <div className="flex items-center space-x-3">
                    {onRefreshSchools && (
                        <button 
                            onClick={handleRefreshSchools}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-1"></div>
                            ) : (
                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                            {isLoading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    )}
                    <button onClick={() => setIsRegisterModalOpen(true)} className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Register New School
                    </button>
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subdomain</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            <span className="ml-2 text-gray-600">Loading schools...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : schools.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No schools found. Create your first school to get started.
                                    </td>
                                </tr>
                            ) : (
                                schools.map((school, index) => (
                                    <tr key={school.id || `school-${index}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full" src={school.logoUrl} alt={`${school.name} logo`} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{school.name}</div>
                                                    <div className="text-sm text-gray-500">{school.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={school.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><PlanBadge plan={school.plan} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.storageUsage} GB</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.subdomain}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            <button onClick={() => {
                                                console.log('Manage button clicked for school:', school);
                                                setEditingSchool(school);
                                            }} className="text-primary hover:text-indigo-900">Manage</button>
                                            <button onClick={() => setDeletingSchool(school)} className="text-danger hover:text-red-700">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default SchoolsList;

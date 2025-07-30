import React, { useState } from 'react';
import Card from '../ui/Card';
import { School, SchoolStatus, PlanName } from '../../types';
import { PlusIcon } from '../icons/Icons';
import RegisterSchoolModal from './RegisterSchoolModal';
import ManageSchoolModal from './ManageSchoolModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import OnboardingSuccessModal from './OnboardingSuccessModal';

interface SchoolsListProps {
  schools: School[];
  onCreateSchool: (newSchoolData: Omit<School, 'id' | 'createdAt' | 'storageUsage' | 'logoUrl'>) => School;
  onUpdateSchool: (updatedSchool: School) => void;
  onDeleteSchool: (schoolId: string) => void;
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

const SchoolsList: React.FC<SchoolsListProps> = ({ schools, onCreateSchool, onUpdateSchool, onDeleteSchool }) => {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [editingSchool, setEditingSchool] = useState<School | null>(null);
    const [deletingSchool, setDeletingSchool] = useState<School | null>(null);
    const [onboardingInfo, setOnboardingInfo] = useState<{ isOpen: boolean; schoolName: string; credentials: {username: string; password: string} }>({ isOpen: false, schoolName: '', credentials: {username: '', password: ''} });

    const handleCreateSchool = (newSchoolData: Omit<School, 'id' | 'createdAt' | 'storageUsage' | 'logoUrl'>) => {
        const newSchool = onCreateSchool(newSchoolData);

        const generatedPassword = Math.random().toString(36).slice(-8);
        const generatedUsername = `admin@${newSchool.subdomain}`;
        
        setOnboardingInfo({
            isOpen: true,
            schoolName: newSchool.name,
            credentials: { username: generatedUsername, password: generatedPassword }
        });

        setIsRegisterModalOpen(false);
    };

    const handleUpdateSchool = (updatedSchool: School) => {
        onUpdateSchool(updatedSchool);
        setEditingSchool(null);
    };

    const handleDeleteSchool = () => {
        if (!deletingSchool) return;
        onDeleteSchool(deletingSchool.id);
        setDeletingSchool(null);
    }

    return (
        <div className="space-y-6">
            <RegisterSchoolModal 
                isOpen={isRegisterModalOpen} 
                onClose={() => setIsRegisterModalOpen(false)} 
                onCreate={handleCreateSchool} 
            />
            {editingSchool && (
                <ManageSchoolModal 
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
                <button onClick={() => setIsRegisterModalOpen(true)} className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Register New School
                </button>
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
                            {schools.map((school) => (
                                <tr key={school.id}>
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
                                        <button onClick={() => setEditingSchool(school)} className="text-primary hover:text-indigo-900">Manage</button>
                                        <button onClick={() => setDeletingSchool(school)} className="text-danger hover:text-red-700">Delete</button>
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

export default SchoolsList;

import React, { useState } from 'react';
import Card from '../ui/Card';
import { Backup, BackupStatus, BackupType } from '../../types';
import { PlusIcon } from '../icons/Icons';
import CreateBackupModal from './CreateBackupModal';
import ConfirmationModal from '../ui/ConfirmationModal';

interface BackupRestoreProps {
    backups: Backup[];
    onCreateBackup: (schoolId: string) => void;
}

const StatusBadge: React.FC<{ status: BackupStatus }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
    const statusClasses = {
        [BackupStatus.Completed]: "bg-green-100 text-green-800",
        [BackupStatus.InProgress]: "bg-blue-100 text-blue-800",
        [BackupStatus.Failed]: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const TypeBadge: React.FC<{ type: BackupType }> = ({ type }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full inline-block";
    const typeClasses = {
        [BackupType.Automatic]: "bg-gray-100 text-gray-700",
        [BackupType.Manual]: "bg-indigo-100 text-indigo-700",
    };
    return <span className={`${baseClasses} ${typeClasses[type]}`}>{type}</span>;
};


const BackupRestore: React.FC<BackupRestoreProps> = ({ backups, onCreateBackup }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [restoringBackup, setRestoringBackup] = useState<Backup | null>(null);

    const handleConfirmRestore = () => {
        if (!restoringBackup) return;
        // TODO: Implement real restore API call if needed
        setRestoringBackup(null);
    };

    const handleCreateBackup = (schoolId: string) => {
        onCreateBackup(schoolId);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <CreateBackupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateBackup} />
            {restoringBackup && (
                <ConfirmationModal
                    isOpen={!!restoringBackup}
                    onClose={() => setRestoringBackup(null)}
                    onConfirm={handleConfirmRestore}
                    title="Confirm Restore from Backup"
                    message={`Are you sure you want to restore the data for "${restoringBackup.schoolName}" from the backup created on ${restoringBackup.createdAt}? This will overwrite all current data for the school and cannot be undone.`}
                    confirmButtonText="Yes, Restore Now"
                />
            )}

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Backup & Restore</h1>
                    <p className="mt-1 text-gray-600">Manage manual and automatic backups for all schools.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Create New Backup
                </button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {backups.map((backup) => (
                                <tr key={backup.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{backup.schoolName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{backup.createdAt}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><TypeBadge type={backup.type} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={backup.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{backup.size}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <button onClick={() => setRestoringBackup(backup)} className="text-primary hover:text-indigo-900" disabled={backup.status !== BackupStatus.Completed}>Restore</button>
                                        <button className="text-primary hover:text-indigo-900" disabled={backup.status !== BackupStatus.Completed}>Download</button>
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

export default BackupRestore;

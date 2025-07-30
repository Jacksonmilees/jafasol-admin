import React, { useState } from 'react';
import Card from '../ui/Card';
import { MOCK_ANNOUNCEMENTS, MOCK_SYSTEM_ALERTS } from '../../constants';
import { Announcement, SystemAlert, AlertLevel } from '../../types';
import { PlusIcon, BellIcon, NotificationIcon as MegaphoneIcon } from '../icons/Icons';
import CreateAnnouncementModal from './CreateAnnouncementModal';

type ActiveTab = 'announcements' | 'alerts';

const AlertLevelBadge: React.FC<{ level: AlertLevel }> = ({ level }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
    const levelClasses = {
        [AlertLevel.Info]: "bg-blue-100 text-blue-800",
        [AlertLevel.Warning]: "bg-yellow-100 text-yellow-800",
        [AlertLevel.Critical]: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${levelClasses[level]}`}>{level}</span>;
};

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md ${
            isActive ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`}
    >
        {label}
    </button>
);

const NotificationsCenter: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('announcements');
    const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
    const [systemAlerts] = useState<SystemAlert[]>(MOCK_SYSTEM_ALERTS);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSendAnnouncement = (newAnnouncementData: Omit<Announcement, 'id' | 'sentAt'>) => {
        const newAnnouncement: Announcement = {
            ...newAnnouncementData,
            id: `ann_${Date.now()}`,
            sentAt: new Date().toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', ''),
        };
        setAnnouncements(prev => [newAnnouncement, ...prev]);
    };

    return (
        <div className="space-y-6">
            <CreateAnnouncementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSend={handleSendAnnouncement} />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Notifications Center</h1>
                    <p className="mt-1 text-gray-600">Send announcements and view system alerts.</p>
                </div>
                {activeTab === 'announcements' && (
                    <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        New Announcement
                    </button>
                )}
            </div>

            <div className="flex space-x-2 border-b border-gray-200 pb-2">
                <TabButton label="Announcements" isActive={activeTab === 'announcements'} onClick={() => setActiveTab('announcements')} />
                <TabButton label="System Alerts" isActive={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} />
            </div>

            <Card>
                {activeTab === 'announcements' ? (
                    <ul className="divide-y divide-gray-200">
                        {announcements.map(announcement => (
                            <li key={announcement.id} className="p-4 hover:bg-gray-50">
                                <div className="flex space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="bg-indigo-100 rounded-full p-2">
                                            <MegaphoneIcon className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900">{announcement.title}</p>
                                        <p className="text-sm text-gray-500 mt-1">{announcement.message}</p>
                                        <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                                            <span>To: <span className="font-medium text-gray-700">{announcement.targetName}</span></span>
                                            <span>Sent: <span className="font-medium text-gray-700">{announcement.sentAt}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {systemAlerts.map(alert => (
                            <li key={alert.id} className="p-4 hover:bg-gray-50">
                                 <div className="flex space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="bg-gray-100 rounded-full p-2">
                                            <BellIcon className="h-5 w-5 text-gray-600" />
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                                            <AlertLevelBadge level={alert.level} />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{alert.description}</p>
                                        <p className="mt-2 text-xs text-gray-500">{alert.timestamp}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                 {(activeTab === 'announcements' && announcements.length === 0 || activeTab === 'alerts' && systemAlerts.length === 0) && (
                    <div className="text-center p-12 text-gray-500">
                        <p>No {activeTab} to display.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default NotificationsCenter;
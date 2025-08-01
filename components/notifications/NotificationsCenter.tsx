import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import CreateAnnouncementModal from './CreateAnnouncementModal';
import Card from '../ui/Card';

const NotificationsCenter: React.FC = () => {
  const { state, fetchNotifications, fetchAnnouncements, createNotification } = useAdmin();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'announcements'>('notifications');

  useEffect(() => {
    fetchNotifications();
    fetchAnnouncements();
  }, [fetchNotifications, fetchAnnouncements]);

  const notifications = state.notifications || [];
  const announcements = state.announcements || [];

  const handleCreateNotification = async (notificationData: any) => {
    try {
      await createNotification(notificationData);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Notifications Center</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create Announcement
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            System Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'announcements'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Announcements ({announcements.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification: any) => (
              <Card key={notification.id}>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {notification.createdAt}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        notification.priority === 'high' 
                          ? 'bg-red-100 text-red-800'
                          : notification.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {notification.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No notifications available
            </div>
          )}
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement: any) => (
              <Card key={announcement.id}>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {announcement.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {announcement.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        Sent to: {announcement.targetSchool || 'All Schools'} • {announcement.sentAt}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No announcements available
            </div>
          )}
        </div>
      )}

      <CreateAnnouncementModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default NotificationsCenter;
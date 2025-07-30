import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { MOCK_SCHOOLS } from '../../constants';
import { School, Announcement } from '../../types';

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (announcement: Omit<Announcement, 'id' | 'sentAt'>) => void;
}

const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({ isOpen, onClose, onSend }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');

  const handleSend = () => {
    if (!title || !message) {
      alert('Title and message are required.');
      return;
    }
    
    const targetSchool = MOCK_SCHOOLS.find(s => s.id === target);
    const targetName = target === 'all' ? 'All Schools' : targetSchool?.name || 'Unknown School';

    onSend({
      title,
      message,
      target,
      targetName,
    });
    
    // Reset form and close
    setTitle('');
    setMessage('');
    setTarget('all');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Announcement">
      <div className="space-y-4">
        <div>
          <label htmlFor="announcement-title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="announcement-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="e.g., Scheduled Maintenance"
          />
        </div>
        <div>
          <label htmlFor="announcement-target" className="block text-sm font-medium text-gray-700">
            Send To
          </label>
          <select
            id="announcement-target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="all">All Schools</option>
            {MOCK_SCHOOLS.map((school: School) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="announcement-message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="announcement-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Compose your message here..."
          />
        </div>
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
            onClick={handleSend}
            className="bg-primary text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700"
          >
            Send Announcement
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateAnnouncementModal;

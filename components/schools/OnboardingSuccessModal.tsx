import React, { useState } from 'react';
import Modal from '../ui/Modal';

interface OnboardingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolName: string;
  credentials: {
    username: string;
    password: string;
  };
}

const OnboardingSuccessModal: React.FC<OnboardingSuccessModalProps> = ({ isOpen, onClose, schoolName, credentials }) => {
  const [copiedField, setCopiedField] = useState<'username' | 'password' | null>(null);

  const copyToClipboard = (text: string, field: 'username' | 'password') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Onboarding Complete for ${schoolName}!`}>
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">School Created Successfully!</h3>
        <p className="mt-2 text-sm text-gray-500">
          The school is now active. Please securely share the following credentials with the new School Administrator.
        </p>
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Admin Username</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input type="text" readOnly value={credentials.username} className="focus:ring-primary focus:border-primary flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 bg-gray-50" />
            <button onClick={() => copyToClipboard(credentials.username, 'username')} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 sm:text-sm">
              {copiedField === 'username' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Temporary Password</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input type="text" readOnly value={credentials.password} className="focus:ring-primary focus:border-primary flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 bg-gray-50 font-mono" />
            <button onClick={() => copyToClipboard(credentials.password, 'password')} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 sm:text-sm">
              {copiedField === 'password' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex justify-center rounded-md border border-transparent bg-primary px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Done
        </button>
      </div>
    </Modal>
  );
};

export default OnboardingSuccessModal;

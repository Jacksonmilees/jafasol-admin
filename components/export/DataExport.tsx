import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Card from '../ui/Card';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  format: 'csv' | 'json' | 'xlsx';
}

const DataExport: React.FC = () => {
  const { state, exportData } = useAdmin();
  const [selectedExport, setSelectedExport] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  const exportOptions: ExportOption[] = [
    {
      id: 'schools',
      name: 'Schools Data',
      description: 'Export all schools with their details, status, and module assignments.',
      format: 'csv'
    },
    {
      id: 'users',
      name: 'Users Data',
      description: 'Export user information like names, emails, roles, and status.',
      format: 'csv'
    },
    {
      id: 'invoices',
      name: 'Billing Data',
      description: 'Export invoices, payment history, accounts, statuses, and due dates.',
      format: 'xlsx'
    },
    {
      id: 'tickets',
      name: 'Support Tickets',
      description: 'Export support ticket history, status, and priority.',
      format: 'csv'
    },
    {
      id: 'audit',
      name: 'Audit Logs',
      description: 'Export security and compliance analysis.',
      format: 'json'
    }
  ];

  const handleExport = async () => {
    if (!selectedExport) return;

    setIsExporting(true);
    try {
      const data = await exportData(selectedExport);
      
      // Create and download file
      const option = exportOptions.find(opt => opt.id === selectedExport);
      const filename = `${option?.name.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${option?.format}`;
      
      if (option?.format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // For CSV/Excel, you would typically use a library like jsPDF or xlsx
        console.log('Export data:', data);
        alert(`Export completed! Data: ${JSON.stringify(data).substring(0, 100)}...`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Data Export</h2>
        <p className="text-sm text-gray-500">Export platform data in various formats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exportOptions.map((option) => (
          <Card key={option.id}>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{option.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{option.description}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      option.format === 'csv' ? 'bg-green-100 text-green-800' :
                      option.format === 'json' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {option.format.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={() => setSelectedExport(option.id)}
                  className={`w-full px-3 py-2 text-sm font-medium rounded-md ${
                    selectedExport === option.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedExport === option.id ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedExport && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Export: {exportOptions.find(opt => opt.id === selectedExport)?.name}
                </label>
                <p className="text-sm text-gray-500">
                  {exportOptions.find(opt => opt.id === selectedExport)?.description}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedExport('')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isExporting ? 'Exporting...' : 'Export Data'}
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DataExport;
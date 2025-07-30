import React, { useState } from 'react';
import Card from '../ui/Card';
import { MOCK_SCHOOLS, MOCK_USERS, MOCK_INVOICES, MOCK_TICKETS, MOCK_ACTIVITY_LOGS } from '../../constants';
import { ToastType } from '../../types';
import { useAdmin } from '../../context/AdminContext';

interface DataExportProps {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
}

type ExportFormat = 'csv' | 'json';
type DataType = 'schools' | 'users' | 'invoices' | 'tickets' | 'logs';

const EXPORT_ITEMS: { type: DataType; title: string; description: string; data: any[] }[] = [
  { type: 'schools', title: 'Schools Data', description: 'Export a full list of all registered schools, including their plan, status, and module assignments.', data: MOCK_SCHOOLS },
  { type: 'users', title: 'Users Data', description: 'Export a list of all super admin and school admin users, excluding sensitive information like passwords.', data: MOCK_USERS },
  { type: 'invoices', title: 'Invoices Data', description: 'Export a complete history of all generated invoices, including amounts, statuses, and due dates.', data: MOCK_INVOICES },
  { type: 'tickets', title: 'Support Tickets', description: 'Export all support tickets, including their conversation history, status, and priority.', data: MOCK_TICKETS },
  { type: 'logs', title: 'Activity Logs', description: 'Export the system-wide activity audit trail for security and compliance analysis.', data: MOCK_ACTIVITY_LOGS },
];

const jsonToCsv = (jsonData: any[]): string => {
    if (jsonData.length === 0) return '';
    const keys = Object.keys(jsonData[0]);
    const replacer = (key: string, value: any) => value === null ? '' : value;

    const csvRows = jsonData.map(row =>
        keys.map(fieldName => {
            let value = row[fieldName];
            if (typeof value === 'object' && value !== null) {
                value = JSON.stringify(value);
            }
            const stringValue = String(replacer(fieldName, value));
            return `"${stringValue.replace(/"/g, '""')}"`;
        }).join(',')
    );

    csvRows.unshift(keys.join(','));
    return csvRows.join('\r\n');
};

const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const DataExport: React.FC<DataExportProps> = ({ addToast }) => {
  const { exportData } = useAdmin();
  const [formats, setFormats] = useState<Record<DataType, ExportFormat>>(
      EXPORT_ITEMS.reduce((acc, item) => ({ ...acc, [item.type]: 'csv' }), {} as Record<DataType, ExportFormat>)
  );
  const [isExporting, setIsExporting] = useState<DataType | null>(null);

  const handleFormatChange = (type: DataType, format: ExportFormat) => {
    setFormats(prev => ({ ...prev, [type]: format }));
  };

  const handleExport = async (item: typeof EXPORT_ITEMS[0]) => {
    setIsExporting(item.type);
    addToast(`Exporting ${item.title}...`, 'info', 3000);
    try {
      const format = formats[item.type];
      const backendData = await exportData(item.type);
      let fileContent: string;
      let fileName: string;
      let mimeType: string;
      if (format === 'csv') {
        fileContent = jsonToCsv(backendData);
        fileName = `${item.type}_export_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv;charset=utf-8;';
      } else {
        fileContent = JSON.stringify(backendData, null, 2);
        fileName = `${item.type}_export_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json;charset=utf-8;';
      }
      downloadFile(fileContent, fileName, mimeType);
      addToast(`${item.title} exported successfully!`, 'success');
    } catch (error) {
      console.error('Export failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      addToast(`Export failed: ${errorMessage}`, 'error');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Data Export Center</h1>
        <p className="mt-1 text-gray-600">Download platform data in various formats for reporting and analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EXPORT_ITEMS.map(item => (
          <Card key={item.type} className="flex flex-col">
            <div className="p-6 flex-grow">
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{item.description}</p>
            </div>
            <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
              <div>
                <label htmlFor={`format-${item.type}`} className="sr-only">Export Format</label>
                <select
                  id={`format-${item.type}`}
                  value={formats[item.type]}
                  onChange={(e) => handleFormatChange(item.type, e.target.value as ExportFormat)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              <button
                onClick={() => handleExport(item)}
                disabled={isExporting === item.type}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isExporting === item.type ? 'Exporting...' : 'Export Data'}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DataExport;
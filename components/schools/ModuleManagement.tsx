import React, { useState, useEffect } from 'react';

interface Module {
  key: string;
  name: string;
  description: string;
}

interface School {
  id: string;
  name: string;
  email: string;
  subdomain: string;
  modules: string[];
}

interface ModuleManagementProps {
  school: School;
  onClose: () => void;
  onUpdate: (schoolId: string, modules: string[]) => void;
}

const ModuleManagement: React.FC<ModuleManagementProps> = ({ school, onClose, onUpdate }) => {
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>(school.modules || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableModules();
  }, []);

  const fetchAvailableModules = async () => {
    try {
      const response = await fetch('https://jafasol.com/api/admin/modules', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available modules');
      }

      const data = await response.json();
      setAvailableModules(data.modules);
    } catch (error) {
      console.error('Error fetching modules:', error);
      setError('Failed to load available modules');
    }
  };

  const handleModuleToggle = (moduleKey: string) => {
    setSelectedModules(prev => {
      if (prev.includes(moduleKey)) {
        return prev.filter(m => m !== moduleKey);
      } else {
        return [...prev, moduleKey];
      }
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://jafasol.com/api/admin/schools/${school.id}/modules`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ modules: selectedModules })
      });

      if (!response.ok) {
        throw new Error('Failed to update school modules');
      }

      const data = await response.json();
      onUpdate(school.id, selectedModules);
      onClose();
    } catch (error) {
      console.error('Error updating modules:', error);
      setError('Failed to update school modules');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Manage Modules - {school.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Select which modules this school should have access to. 
            These modules will appear in their sidebar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {availableModules.map((module) => (
            <div
              key={module.key}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedModules.includes(module.key)
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleModuleToggle(module.key)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{module.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                </div>
                <div className="ml-4">
                  {selectedModules.includes(module.key) ? (
                    <div className="h-5 w-5 bg-teal-600 text-white rounded flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  ) : (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="font-semibold text-gray-900 mb-2">Selected Modules ({selectedModules.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedModules.map((moduleKey) => {
              const module = availableModules.find(m => m.key === moduleKey);
              return (
                <span
                  key={moduleKey}
                  className="px-2 py-1 bg-teal-100 text-teal-800 text-sm rounded-md"
                >
                  {module?.name || moduleKey}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleManagement; 
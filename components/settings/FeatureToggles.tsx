import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Card from '../ui/Card';

interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
  createdAt: string;
}

const FeatureToggles: React.FC = () => {
  const { state, fetchFeatureToggles, toggleFeature } = useAdmin();
  const [features, setFeatures] = useState<FeatureToggle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadFeatures = async () => {
      setIsLoading(true);
      try {
        await fetchFeatureToggles();
        setFeatures(state.featureToggles || []);
      } catch (error) {
        console.error('Error loading feature toggles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeatures();
  }, [fetchFeatureToggles]);

  const handleToggle = async (featureId: string) => {
    try {
      await toggleFeature(featureId);
      // Update local state
      setFeatures(prev => prev.map(f => 
        f.id === featureId ? { ...f, enabled: !f.enabled } : f
      ));
    } catch (error) {
      console.error('Error toggling feature:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Feature Toggles</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading feature toggles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Feature Toggles</h2>
        <p className="text-sm text-gray-500">Manage feature flags and A/B testing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.length > 0 ? (
          features.map((feature) => (
            <Card key={feature.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {feature.category}
                      </span>
                      <span className="text-xs text-gray-400">{feature.createdAt}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleToggle(feature.id)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        feature.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          feature.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No feature toggles available
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureToggles;

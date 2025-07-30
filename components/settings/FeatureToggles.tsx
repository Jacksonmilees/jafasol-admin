import React, { useState } from 'react';
import Card from '../ui/Card';
import { MOCK_FEATURE_TOGGLES } from '../../constants';
import { FeatureToggle } from '../../types';
import ToggleSwitch from '../ui/ToggleSwitch';

const FeatureToggles: React.FC = () => {
  const [features, setFeatures] = useState<FeatureToggle[]>(MOCK_FEATURE_TOGGLES);

  const handleToggleChange = (featureId: string, newEnabledState: boolean) => {
    setFeatures(prevFeatures =>
      prevFeatures.map(feature =>
        feature.id === featureId ? { ...feature, enabled: newEnabledState } : feature
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Feature Toggles & Beta Modules</h1>
        <p className="mt-1 text-gray-600">Enable or disable experimental features across the platform.</p>
      </div>

      <Card>
        <div className="divide-y divide-gray-200">
          {features.map((feature, index) => (
            <div key={feature.id} className="p-6 flex items-center justify-between">
              <div className="flex-grow pr-4">
                <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
              </div>
              <div className="flex-shrink-0">
                <ToggleSwitch
                  id={`toggle-${feature.id}`}
                  enabled={feature.enabled}
                  onChange={(enabled) => handleToggleChange(feature.id, enabled)}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FeatureToggles;

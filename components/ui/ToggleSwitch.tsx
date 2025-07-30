import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  id: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, id }) => {
  const handleToggle = () => {
    onChange(!enabled);
  };

  return (
    <button
      type="button"
      className={`${
        enabled ? 'bg-primary' : 'bg-gray-200'
      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
      role="switch"
      aria-checked={enabled}
      onClick={handleToggle}
      id={id}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
      />
    </button>
  );
};

export default ToggleSwitch;

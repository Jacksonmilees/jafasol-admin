import React from 'react';
import Card from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <Card className="p-5">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClass}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;

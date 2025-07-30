import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { MOCK_SYSTEM_HEALTH_DATA } from '../../constants';
import { ServiceStatus, MonitoredService, SystemHealthData } from '../../types';

// Helper component for status indicator dots
const StatusIndicator: React.FC<{ status: ServiceStatus }> = ({ status }) => {
  const statusClasses = {
    [ServiceStatus.Operational]: 'bg-green-500',
    [ServiceStatus.Degraded]: 'bg-yellow-500',
    [ServiceStatus.Outage]: 'bg-red-500',
  };
  return <span className={`inline-block w-3 h-3 rounded-full ${statusClasses[status]}`}></span>;
};

// Helper component for individual service cards
const ServiceStatusCard: React.FC<{ service: MonitoredService }> = ({ service }) => {
  const statusTextClasses = {
    [ServiceStatus.Operational]: 'text-green-600',
    [ServiceStatus.Degraded]: 'text-yellow-600',
    [ServiceStatus.Outage]: 'text-red-600',
  };
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-gray-700">{service.name}</h4>
        <StatusIndicator status={service.status} />
      </div>
      <p className={`text-lg font-bold mt-2 ${statusTextClasses[service.status]}`}>{service.status}</p>
      <div className="text-xs text-gray-500 mt-2">
        {service.latency && <p>Latency: {service.latency}ms</p>}
        <p>Last check: {service.lastChecked}</p>
      </div>
    </Card>
  );
};

// Main SystemHealth component
const SystemHealth: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/health')
      .then(res => res.json())
      .then(data => {
        setHealthData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch health data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading system health...</div>;
  if (error) return <div>{error}</div>;

  // Use healthData if available, else fallback to MOCK_SYSTEM_HEALTH_DATA
  const data = healthData || MOCK_SYSTEM_HEALTH_DATA;

  const OverallStatusBanner: React.FC<{ status: ServiceStatus }> = ({ status }) => {
    const bannerInfo = {
      [ServiceStatus.Operational]: {
        bgColor: 'bg-green-100',
        borderColor: 'border-green-400',
        textColor: 'text-green-800',
        title: 'All Systems Operational',
      },
      [ServiceStatus.Degraded]: {
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-400',
        textColor: 'text-yellow-800',
        title: 'Degraded Performance',
      },
      [ServiceStatus.Outage]: {
        bgColor: 'bg-red-100',
        borderColor: 'border-red-400',
        textColor: 'text-red-800',
        title: 'System Outage Detected',
      },
    };
    const info = bannerInfo[status];

    return (
      <div className={`p-4 border-l-4 ${info.borderColor} ${info.bgColor} rounded-r-lg`}>
        <div className="flex items-center">
          <StatusIndicator status={status} />
          <p className={`ml-3 font-bold ${info.textColor}`}>{info.title}</p>
        </div>
      </div>
    );
  };

  const MetricChart: React.FC<{ data: any[]; dataKey: string; title: string; color: string; unit: string }> = ({ data, dataKey, title, color, unit }) => (
    <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `${value}${unit}`} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip
                    formatter={(value) => [`${value}${unit}`, 'Value']}
                    cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
        </ResponsiveContainer>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">System Health Status</h1>
        <p className="mt-1 text-gray-600">Real-time monitoring of all platform services and performance.</p>
      </div>

      <OverallStatusBanner status={data.overallStatus} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.services.map(service => (
          <ServiceStatusCard key={service.id} service={service} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricChart data={data.apiResponseTime} dataKey="value" title="API Response Time (last 30 mins)" color="#4F46E5" unit="ms" />
        <MetricChart data={data.dbQueryLoad} dataKey="value" title="Database Load (last 30 mins)" color="#10B981" unit="%" />
      </div>
    </div>
  );
};

export default SystemHealth;

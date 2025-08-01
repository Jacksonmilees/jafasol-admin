import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import StatCard from './StatCard';

const DashboardOverview: React.FC = () => {
  const { state } = useAdmin();
  const stats = state.dashboardStats;

  // Mock analytics data
  const monthlySignups = [
    { month: 'Jan', signups: 12 },
    { month: 'Feb', signups: 19 },
    { month: 'Mar', signups: 15 },
    { month: 'Apr', signups: 22 },
    { month: 'May', signups: 28 },
    { month: 'Jun', signups: 35 },
    { month: 'Jul', signups: 42 }
  ];

  const planDistribution = [
    { plan: 'Basic', count: 15, percentage: 30 },
    { plan: 'Standard', count: 25, percentage: 50 },
    { plan: 'Premium', count: 10, percentage: 20 }
  ];

  const moduleUsage = [
    { module: 'Attendance', usage: 85 },
    { module: 'Fees', usage: 92 },
    { module: 'Academics', usage: 78 },
    { module: 'Communication', usage: 65 },
    { module: 'Analytics', usage: 45 }
  ];

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard title="Total Schools" value="Loading..." icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} colorClass="bg-blue-500" />
        <StatCard title="Active Subscriptions" value="Loading..." icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} colorClass="bg-green-500" />
        <StatCard title="Monthly Revenue" value="Loading..." icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402 2.599-1" /></svg>} colorClass="bg-yellow-500" />
        <StatCard title="Total Users" value="Loading..." icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>} colorClass="bg-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard 
          title="Total Schools" 
          value={stats.totalSchools?.toString() || '0'} 
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} 
          colorClass="bg-blue-500" 
        />
        <StatCard 
          title="Active Subscriptions" 
          value={stats.activeSubscriptions?.toString() || '0'} 
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
          colorClass="bg-green-500" 
        />
        <StatCard 
          title="Monthly Revenue" 
          value={`KSh ${(stats.monthlyRevenue || 0).toLocaleString()}/mo`} 
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402 2.599-1" /></svg>} 
          colorClass="bg-yellow-500" 
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers?.toString() || '0'} 
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>} 
          colorClass="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Signups</h3>
          <div className="space-y-2">
            {monthlySignups.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(item.signups / 50) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.signups}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
          <div className="space-y-3">
            {planDistribution.map((plan, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{plan.plan}</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${plan.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{plan.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Usage</h3>
          <div className="space-y-3">
            {moduleUsage.map((module, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{module.module}</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${module.usage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{module.usage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

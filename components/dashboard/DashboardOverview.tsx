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
    { plan: 'Basic', count: 15, percentage: 30, color: 'bg-blue-500' },
    { plan: 'Standard', count: 25, percentage: 50, color: 'bg-green-500' },
    { plan: 'Premium', count: 10, percentage: 20, color: 'bg-purple-500' }
  ];

  const moduleUsage = [
    { module: 'Attendance', usage: 85, color: 'bg-blue-500' },
    { module: 'Fees', usage: 92, color: 'bg-green-500' },
    { module: 'Academics', usage: 78, color: 'bg-yellow-500' },
    { module: 'Communication', usage: 65, color: 'bg-purple-500' },
    { module: 'Analytics', usage: 45, color: 'bg-red-500' }
  ];

  if (!stats) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading skeleton for charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard 
          title="Total Schools" 
          value={stats.totalSchools?.toString() || '0'} 
          change="+12%"
          changeType="positive"
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} 
          colorClass="bg-blue-500" 
        />
        <StatCard 
          title="Active Subscriptions" 
          value={stats.activeSubscriptions?.toString() || '0'} 
          change="+8%"
          changeType="positive"
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
          colorClass="bg-green-500" 
        />
        <StatCard 
          title="Monthly Revenue" 
          value={`KSh ${(stats.monthlyRevenue || 0).toLocaleString()}`} 
          change="+15%"
          changeType="positive"
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402 2.599-1" /></svg>} 
          colorClass="bg-yellow-500" 
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers?.toString() || '0'} 
          change="+23%"
          changeType="positive"
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>} 
          colorClass="bg-purple-500" 
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Monthly Signups Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Signups</h3>
          <div className="space-y-3">
            {monthlySignups.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(item.signups / 50) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 min-w-[2rem]">{item.signups}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
          <div className="space-y-3">
            {planDistribution.map((plan, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{plan.plan}</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className={`${plan.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${plan.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{plan.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Usage */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Usage</h3>
          <div className="space-y-3">
            {moduleUsage.map((module, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{module.module}</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className={`${module.color} h-2 rounded-full transition-all duration-300`}
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

      {/* System Health */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-green-800">System Status</p>
              <p className="text-lg font-semibold text-green-900">{stats.systemHealth || 'Operational'}</p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-800">Uptime</p>
              <p className="text-lg font-semibold text-blue-900">{stats.uptime || 99.9}%</p>
            </div>
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-yellow-800">Response Time</p>
              <p className="text-lg font-semibold text-yellow-900">{stats.responseTime || 120}ms</p>
            </div>
            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-purple-800">Active Users</p>
              <p className="text-lg font-semibold text-purple-900">{stats.activeUsers || 0}</p>
            </div>
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

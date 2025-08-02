import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import StatCard from './StatCard';

const DashboardOverview: React.FC = () => {
  const { state } = useAdmin();
  const stats = state.dashboardStats;

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
          change={stats.newSchoolsThisMonth ? `+${stats.newSchoolsThisMonth}` : '0'}
          changeType="positive"
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} 
          colorClass="bg-blue-500" 
        />
        <StatCard 
          title="Active Subscriptions" 
          value={stats.activeSubscriptions?.toString() || '0'} 
          change={stats.activeSubscriptions ? `${Math.round((stats.activeSubscriptions / stats.totalSchools) * 100)}%` : '0%'}
          changeType="positive"
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
          colorClass="bg-green-500" 
        />
        <StatCard 
          title="Monthly Revenue" 
          value={`KSh ${(stats.monthlyRevenue || 0).toLocaleString()}`} 
          change={stats.totalRevenue ? `${Math.round((stats.monthlyRevenue / stats.totalRevenue) * 100)}%` : '0%'}
          changeType="positive"
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402 2.599-1" /></svg>} 
          colorClass="bg-yellow-500" 
        />
        <StatCard 
          title="System Health" 
          value={stats.systemHealth || 'Unknown'} 
          change={`${stats.uptime || 0}%`}
          changeType={stats.systemHealth === 'Operational' ? 'positive' : 'negative'}
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
          colorClass={stats.systemHealth === 'Operational' ? 'bg-green-500' : 'bg-red-500'} 
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* System Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-sm font-medium">{stats.responseTime || 0}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium">{stats.uptime || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">System Load</span>
              <span className="text-sm font-medium">{stats.systemLoad || 0}%</span>
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Users</span>
              <span className="text-sm font-medium">{stats.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-medium">{stats.activeUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Rate</span>
              <span className="text-sm font-medium">
                {stats.totalUsers && stats.activeUsers ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Monthly Revenue</span>
              <span className="text-sm font-medium">KSh {(stats.monthlyRevenue || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <span className="text-sm font-medium">KSh {(stats.totalRevenue || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Growth Rate</span>
              <span className="text-sm font-medium">
                {stats.monthlyRevenue && stats.totalRevenue ? `${Math.round((stats.monthlyRevenue / stats.totalRevenue) * 100)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      {stats.lastUpdated && (
        <div className="text-center text-sm text-gray-500">
          Last updated: {new Date(stats.lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import StatCard from '../dashboard/StatCard';
import Card from '../ui/Card';

interface AnalyticsData {
  totalSchools: number;
  activeSchools: number;
  totalRevenue: number;
  monthlySignups: any[];
  planDistribution: any[];
  moduleUsage: any[];
}

const GlobalAnalytics: React.FC = () => {
  const { state } = useAdmin();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSchools: 0,
    activeSchools: 0,
    totalRevenue: 0,
    monthlySignups: [],
    planDistribution: [],
    moduleUsage: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Use real data from state
        const dashboardStats = state.dashboardStats;
        const schools = state.schools || [];
        
        const analyticsData: AnalyticsData = {
          totalSchools: dashboardStats?.totalSchools || schools.length,
          activeSchools: dashboardStats?.activeSubscriptions || schools.filter(s => s.status === 'Active').length,
          totalRevenue: dashboardStats?.monthlyRevenue || 0,
          monthlySignups: [], // Would come from real analytics API
          planDistribution: [], // Would come from real analytics API
          moduleUsage: [] // Would come from real analytics API
        };
        
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [state.dashboardStats, state.schools]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Global Analytics</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Global Analytics</h2>
        <p className="text-sm text-gray-500">Platform-wide performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Schools" 
          value={analytics.totalSchools.toString()} 
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>} 
          colorClass="bg-blue-500" 
        />
        <StatCard 
          title="Active vs Inactive" 
          value={`${analytics.activeSchools} / ${analytics.totalSchools - analytics.activeSchools}`} 
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>} 
          colorClass="bg-green-500" 
        />
        <StatCard 
          title="Total Monthly Revenue" 
          value={`$${analytics.totalRevenue}/mo`} 
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>} 
          colorClass="bg-yellow-500" 
        />
        <StatCard 
          title="Avg. Revenue Per School" 
          value={`$${analytics.activeSchools > 0 ? (analytics.totalRevenue / analytics.activeSchools).toFixed(2) : '0'}`} 
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>} 
          colorClass="bg-purple-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Signups</h3>
            <div className="text-center text-gray-500 py-8">
              <p>Chart data will be available when analytics API is implemented</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Distribution</h3>
            <div className="text-center text-gray-500 py-8">
              <p>Chart data will be available when analytics API is implemented</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Module Usage */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Module Usage</h3>
          <div className="text-center text-gray-500 py-8">
            <p>Module usage data will be available when analytics API is implemented</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GlobalAnalytics;

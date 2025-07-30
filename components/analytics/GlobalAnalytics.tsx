import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../ui/Card';
import { MOCK_ANALYTICS, MOCK_REVENUE_GROWTH, MOCK_MODULE_USAGE } from '../../constants';
import StatCard from '../dashboard/StatCard';
import { SchoolIcon } from '../icons/Icons';

const GlobalAnalytics: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Global Analytics</h1>
        <p className="mt-1 text-gray-600">Deep dive into platform-wide trends and performance metrics.</p>
      </div>

      {/* Top Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Schools" value={MOCK_ANALYTICS.totalSchools.toString()} icon={<SchoolIcon className="h-6 w-6 text-white" />} colorClass="bg-primary" />
        <StatCard title="Active vs Inactive" value={`${MOCK_ANALYTICS.activeSchools} / ${MOCK_ANALYTICS.totalSchools - MOCK_ANALYTICS.activeSchools}`} icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} colorClass="bg-secondary" />
        <StatCard title="Total Monthly Revenue" value={`$${MOCK_ANALYTICS.totalRevenue}/mo`} icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} colorClass="bg-warning" />
        <StatCard title="Avg. Revenue Per School" value={`$${(MOCK_ANALYTICS.totalRevenue / MOCK_ANALYTICS.activeSchools).toFixed(2)}`} icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} colorClass="bg-info" />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Growth (Monthly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={MOCK_REVENUE_GROWTH}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `$${value}`} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} cursor={{ stroke: '#4F46E5', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4, fill: '#4F46E5' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Signups</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MOCK_ANALYTICS.monthlySignups}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} allowDecimals={false} />
              <Tooltip cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }} />
              <Legend />
              <Bar dataKey="signups" fill="#10B981" barSize={30} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Used Features/Modules</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={MOCK_MODULE_USAGE} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#374151', fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Usage']} cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}/>
              <Legend />
              <Bar dataKey="usage" fill="#3B82F6" barSize={20} radius={[0, 4, 4, 0]}>
                {MOCK_MODULE_USAGE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`rgba(59, 130, 246, ${1 - index * 0.08})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={MOCK_ANALYTICS.planDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                innerRadius={60}
                dataKey="value"
                nameKey="name"
              >
                {MOCK_ANALYTICS.planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default GlobalAnalytics;

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from './StatCard';
import Card from '../ui/Card';
import { MOCK_ANALYTICS } from '../../constants';
import { SchoolIcon, SupportIcon } from '../icons/Icons';
import { ActiveView, School, SchoolStatus, TicketStatus, SupportTicket } from '../../types';

interface DashboardOverviewProps {
    setActiveView: (view: ActiveView) => void;
    schools: School[];
    tickets: SupportTicket[];
}

const StatusBadge: React.FC<{ status: SchoolStatus }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
    const statusClasses = {
        [SchoolStatus.Active]: "bg-green-100 text-green-800",
        [SchoolStatus.Inactive]: "bg-gray-100 text-gray-800",
        [SchoolStatus.Suspended]: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setActiveView, schools, tickets }) => {
  const recentSchools = schools.slice(0, 5);
  const openTicketsCount = tickets.filter(t => t.status === TicketStatus.Open || t.status === TicketStatus.InProgress).length;
  const activeSchoolsCount = schools.filter(s => s.status === SchoolStatus.Active).length;
  const totalSchoolsCount = schools.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome, Super Admin!</h1>
        <p className="mt-1 text-gray-600">Here's a snapshot of the Jafasol platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button onClick={() => setActiveView('schools')} className="text-left">
          <StatCard title="Total Schools" value={totalSchoolsCount.toString()} icon={<SchoolIcon className="h-6 w-6 text-white" />} colorClass="bg-primary" />
        </button>
        <button onClick={() => setActiveView('schools')} className="text-left">
          <StatCard title="Active Subscriptions" value={activeSchoolsCount.toString()} icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} colorClass="bg-secondary" />
        </button>
        <button onClick={() => setActiveView('billing')} className="text-left">
          <StatCard title="Monthly Revenue" value={`$${MOCK_ANALYTICS.totalRevenue}/mo`} icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} colorClass="bg-warning" />
        </button>
        <button onClick={() => setActiveView('support')} className="text-left">
          <StatCard title="Open Tickets" value={openTicketsCount.toString()} icon={<SupportIcon className="h-6 w-6 text-white" />} colorClass="bg-danger" />
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Signups</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MOCK_ANALYTICS.monthlySignups}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}/>
              <Legend />
              <Bar dataKey="signups" fill="#4F46E5" barSize={30} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={MOCK_ANALYTICS.planDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={110}
                dataKey="value"
                nameKey="name"
              >
                {MOCK_ANALYTICS.planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Schools */}
      <Card>
        <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Recent Schools</h3>
            <button onClick={() => setActiveView('schools')} className="text-sm font-medium text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subdomain</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {recentSchools.map((school: School) => (
                        <tr key={school.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img className="h-10 w-10 rounded-full" src={school.logoUrl} alt="" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{school.name}</div>
                                        <div className="text-sm text-gray-500">{school.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.plan}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={school.status} /></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.subdomain}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;

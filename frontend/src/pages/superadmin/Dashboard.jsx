import { useState, useEffect } from 'react';
import { getDashboard } from '../../api/superadmin.api';
import { formatCurrency } from '../../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { HiOutlineUsers, HiOutlineCheckCircle, HiOutlineClock, HiOutlineCurrencyRupee } from 'react-icons/hi';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#ec4899'];

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="stat-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-surface-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-surface-900">{value}</p>
        {sub && <p className="text-xs text-surface-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(({ data }) => setData(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <p className="text-surface-500">Failed to load dashboard</p>;

  const sizeData = Object.entries(data.sizeBreakdown || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Super Admin Dashboard</h1>
        <p className="page-subtitle">Overview of all T-shirt orders across MNIT</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiOutlineUsers} label="Total Students" value={data.totalStudents} color="bg-primary-600" />
        <StatCard icon={HiOutlineCheckCircle} label="Confirmed" value={data.totalConfirmed} color="bg-emerald-600" sub={`${data.totalPending} pending`} />
        <StatCard icon={HiOutlineCurrencyRupee} label="Collected" value={formatCurrency(data.totalAmountCollected)} color="bg-accent-600" />
        <StatCard icon={HiOutlineClock} label="Form Status" value={data.formStatus === 'open' ? '🟢 Open' : '🔴 Locked'} color="bg-purple-600" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Branch Breakdown */}
        <div className="card">
          <h3 className="font-bold text-surface-900 mb-4">Branch-wise Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.branchBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="confirmed" name="Confirmed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Size Breakdown */}
        <div className="card">
          <h3 className="font-bold text-surface-900 mb-4">Size Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sizeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50}
                label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {sizeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Admin Stats Table */}
      <div className="card">
        <h3 className="font-bold text-surface-900 mb-4">Branch Admin Performance</h3>
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Admin</th>
                <th className="table-header">Branch</th>
                <th className="table-header">Students</th>
                <th className="table-header">Confirmed</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.adminStats?.map((admin, i) => (
                <tr key={i} className="table-row">
                  <td className="table-cell font-medium">{admin.adminName}</td>
                  <td className="table-cell"><span className="badge-info">{admin.branch}</span></td>
                  <td className="table-cell">{admin.studentsManaged}</td>
                  <td className="table-cell text-emerald-600 font-semibold">{admin.confirmed}</td>
                  <td className="table-cell">
                    <span className={admin.isActive ? 'badge-success' : 'badge-danger'}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

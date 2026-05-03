import { useState, useEffect } from 'react';
import { getDashboard } from '../../api/admin.api';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { HiOutlineUsers, HiOutlineCheckCircle, HiOutlineClock, HiOutlineCurrencyRupee } from 'react-icons/hi';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#ec4899'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getDashboard().then(({ data }) => setData(data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <p>Failed to load</p>;

  const sizeData = Object.entries(data.sizeBreakdown || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">{data.branch} Branch Dashboard</h1>
        <p className="page-subtitle">Welcome, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: HiOutlineUsers, label: 'Total Students', value: data.totalStudents, color: 'bg-primary-600' },
          { icon: HiOutlineCheckCircle, label: 'Confirmed', value: data.confirmed, color: 'bg-emerald-600' },
          { icon: HiOutlineClock, label: 'Pending', value: data.pending, color: 'bg-amber-500' },
          { icon: HiOutlineCurrencyRupee, label: 'Collected', value: formatCurrency(data.totalAmountReceived), color: 'bg-accent-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="stat-card">
            <div className="flex items-start justify-between">
              <div><p className="text-sm font-medium text-surface-500 mb-1">{label}</p><p className="text-3xl font-bold text-surface-900">{value}</p></div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-6 h-6 text-white" /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-bold text-surface-900 mb-4">Size Distribution</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={sizeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={45}
              label={({ name, value }) => `${name}: ${value}`}>
              {sizeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { StatCard, Card } from '../components/UIComponents';
import { attendanceService, eventService } from '../services/api';
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingDown,
  BarChart3,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await attendanceService.getStats();
        setStats(statsResponse.data);

        // Mock chart data
        setChartData([
          { name: 'Jan', attendance: 120, fines: 40 },
          { name: 'Feb', attendance: 140, fines: 50 },
          { name: 'Mar', attendance: 115, fines: 35 },
          { name: 'Apr', attendance: 160, fines: 60 },
          { name: 'May', attendance: 145, fines: 45 },
          { name: 'Jun', attendance: 170, fines: 55 },
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pieData = [
    { name: 'Present', value: stats?.presentToday || 0 },
    { name: 'Late', value: stats?.lateToday || 0 },
  ];

  const COLORS = ['#10b981', '#f59e0b'];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's your system overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats?.totalUsers || 0}
          subtitle="Registered students"
          color="blue"
        />
        <StatCard
          icon={Calendar}
          title="Total Events"
          value={stats?.totalEvents || 0}
          subtitle="Active events"
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          title="Attendance Today"
          value={stats?.presentToday || 0}
          subtitle="Students present"
          color="green"
        />
        <StatCard
          icon={Clock}
          title="Late Today"
          value={stats?.lateToday || 0}
          subtitle="Students late"
          color="yellow"
        />
        <StatCard
          icon={TrendingDown}
          title="Absent Students"
          value="0"
          subtitle="No absences recorded"
          color="red"
        />
        <StatCard
          icon={DollarSign}
          title="Total Fines"
          value={`$${stats?.totalFines?.toFixed(2) || '0.00'}`}
          subtitle="Collected amount"
          color="blue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-[#0052A2]" size={24} />
            <h2 className="text-xl font-bold text-white">Attendance Trends</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0052A2/20" />
              <XAxis stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#00264D',
                  border: '1px solid #0052A2/30',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="fines" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-[#0052A2]" size={24} />
            <h2 className="text-xl font-bold text-white">Today's Status</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#00264D',
                  border: '1px solid #0052A2/30',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="text-[#0052A2]" size={24} />
          <h2 className="text-xl font-bold text-white">Monthly Analytics</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0052A2/20" />
            <XAxis stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#00264D',
                border: '1px solid #0052A2/30',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="attendance" fill="#10b981" name="Attendance" />
            <Bar dataKey="fines" fill="#f59e0b" name="Fines" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Dashboard;

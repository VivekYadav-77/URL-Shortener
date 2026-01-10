import { useGetAdminStatsQuery } from "../Features/admin/adminApi";
import AdminLayout from "./AdminLayout";

import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useGetAdminStatsQuery();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 bg-white dark:bg-gray-800 border rounded-xl text-center">
          Loading dashboard…
        </div>
      </AdminLayout>
    );
  }

  const chartData = [
    { name: "Active", value: stats.activeUrls },
    { name: "Expired", value: stats.expiredUrls },
    { name: "Deleted", value: stats.deletedUrls },
    { name: "Abuse", value: stats.abuseUrls },
  ];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        📊 Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <StatCard
          title="Total URLs"
          value={stats.totalUrls}
          color="blue"
        />

        <StatCard
          title="Active URLs"
          value={stats.activeUrls}
          color="green"
        />

        <StatCard
          title="Expired URLs"
          value={stats.expiredUrls}
          color="yellow"
        />

        <StatCard
          title="Deleted URLs"
          value={stats.deletedUrls}
          color="red"
        />
      </div>


      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 mb-10">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
          URL Status Breakdown
        </h2>

        <div className="w-full h-72">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <StatCard
          title="Total Clicks"
          value={stats.totalClicks}
          color="indigo"
        />

        <StatCard
          title="Abuse URLs"
          value={stats.abuseUrls}
          color="rose"
        />
      </div>

    </AdminLayout>
  );
};

export default AdminDashboard;




const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    green:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    yellow:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    indigo:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
    rose: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
      <p className="text-sm text-slate-500 dark:text-gray-400">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
};

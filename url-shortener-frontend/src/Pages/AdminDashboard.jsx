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

import { useTheme } from "../App/themeStore";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useGetAdminStatsQuery();

  // ADD THEME — (You said it wasn't here, so adding now)
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <AdminLayout>
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-main)",
            color: "var(--text-body)",
          }}
          className="p-6 border rounded-xl text-center"
        >
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
      {/* TITLE */}
      <h1
        style={{ color: "var(--text-header)" }}
        className="text-3xl font-bold mb-8"
      >
        📊 Analytics Dashboard
      </h1>

      {/* TOP STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total URLs" value={stats.totalUrls} color="blue" />
        <StatCard title="Active URLs" value={stats.activeUrls} color="green" />
        <StatCard title="Expired URLs" value={stats.expiredUrls} color="yellow" />
        <StatCard title="Deleted URLs" value={stats.deletedUrls} color="red" />
      </div>

      {/* CHART BLOCK */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-main)",
        }}
        className="border rounded-xl p-6 mb-10 transition"
      >
        <h2
          style={{ color: "var(--text-header)" }}
          className="text-xl font-bold mb-4"
        >
          URL Status Breakdown
        </h2>

        <div className="w-full h-72">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              
              {/* GRID */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "light" ? "#e5e7eb" : "#374151"}
              />

              {/* X AXIS */}
              <XAxis
                dataKey="name"
                stroke={theme === "light" ? "#6b7280" : "#9ca3af"} 
              />

              {/* Y AXIS */}
              <YAxis stroke={theme === "light" ? "#6b7280" : "#9ca3af"} />

              {/* TOOLTIP */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-main)",
                  color: "var(--text-header)",
                  borderRadius: "8px",
                }}
              />

              {/* LINE */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--accent-blue)"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BOTTOM TWO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard title="Total Clicks" value={stats.totalClicks} color="indigo" />
        <StatCard title="Abuse URLs" value={stats.abuseUrls} color="rose" />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;



/* ----------------------------------- STAT CARD ----------------------------------- */

const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "var(--accent-blue)",
    green: "#16a34a",
    yellow: "#ca8a04",
    red: "#dc2626",
    indigo: "#4f46e5",
    rose: "#e11d48",
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-main)",
      }}
      className="border rounded-xl p-6"
    >
      <p
        style={{ color: "var(--text-muted)" }}
        className="text-sm mb-2"
      >
        {title}
      </p>

      <p
        style={{ color: colors[color] }}
        className="text-3xl font-bold"
      >
        {value}
      </p>
    </div>
  );
};

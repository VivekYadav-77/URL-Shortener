import { useGetAdminStatsQuery } from "../Features/admin/adminApi";
import AdminLayout from "./AdminLayout";
import { 
  AreaChart, 
  Area, 
  Tooltip, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";
import { 
  Activity, 
  Link2, 
  Clock, 
  Trash2, 
  ShieldAlert, 
  BarChart3, 
  MousePointer2 
} from "lucide-react";
import { useTheme } from "../App/themeStore";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useGetAdminStatsQuery();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  if (isLoading) {
    return (
      <AdminLayout>
        <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-[#050505]" : "bg-gray-50"}`}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className={`font-bold animate-pulse ${isDark ? "text-gray-400" : "text-gray-600"}`}>Syncing Analytics...</p>
          </div>
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
      <div className={`min-h-screen p-4 md:p-8 transition-colors duration-500 ${isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"}`}>
        
        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            System Overview
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>
            Real-time analytics and infrastructure health monitoring.
          </p>
        </div>

        {/* TOP STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total URLs" value={stats.totalUrls} color="blue" icon={<Link2 size={20} />} isDark={isDark} />
          <StatCard title="Active URLs" value={stats.activeUrls} color="green" icon={<Activity size={20} />} isDark={isDark} />
          <StatCard title="Expired URLs" value={stats.expiredUrls} color="yellow" icon={<Clock size={20} />} isDark={isDark} />
          <StatCard title="Deleted URLs" value={stats.deletedUrls} color="red" icon={<Trash2 size={20} />} isDark={isDark} />
        </div>

        {/* MAIN CHART SECTION */}
        <div className={`p-6 rounded-[2.5rem] border shadow-2xl mb-10 transition-all ${
          isDark ? "bg-white/5 border-white/10 shadow-black" : "bg-white border-gray-200 shadow-gray-200/50"
        }`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                <BarChart3 size={20} />
              </div>
              <h2 className="text-xl font-black tracking-tight">Traffic Breakdown</h2>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
              Live Updates
            </span>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} 
                />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#111" : "#fff",
                    borderRadius: "16px",
                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    fontWeight: 'bold'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECONDARY STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard title="Total Clicks" value={stats.totalClicks} color="indigo" icon={<MousePointer2 size={20} />} isDark={isDark} />
          <StatCard title="Abuse Reports" value={stats.abuseUrls} color="rose" icon={<ShieldAlert size={20} />} isDark={isDark} />
        </div>
      </div>
    </AdminLayout>
  );
};

/* ----------------------------------- STAT CARD ----------------------------------- */

const StatCard = ({ title, value, color, icon, isDark }) => {
  const colorMap = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    green: "text-green-500 bg-green-500/10 border-green-500/20",
    yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
    indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    rose: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <div className={`p-6 rounded-[2rem] border transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${
      isDark ? "bg-white/5 border-white/10 shadow-black" : "bg-white border-gray-200 shadow-sm"
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
          {icon}
        </div>
        <div className={`h-2 w-2 rounded-full animate-pulse ${colorMap[color].split(' ')[0]}`}></div>
      </div>
      
      <p className={`text-xs font-black uppercase tracking-[0.1em] mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        {title}
      </p>

      <p className="text-4xl font-black tracking-tight leading-none">
        {value.toLocaleString()}
      </p>
    </div>
  );
};

export default AdminDashboard;
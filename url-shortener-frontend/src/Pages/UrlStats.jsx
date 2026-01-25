import { useNavigate, useParams } from "react-router-dom";
import { useGetUrlStatsQuery } from "../Features/urls/urlApi";
import UserLayout from "./UserLayout";
import { 
  BarChart2, 
  Clock, 
  AlertTriangle, 
  ArrowLeft, 
  Activity, 
  ShieldAlert, 
  ExternalLink,
  Calendar,
  Share2,
  Sparkles,
  Zap
} from "lucide-react";
import { useTheme } from "../App/themeStore";

const UrlStats = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, isLoading, isError } = useGetUrlStatsQuery(id);

  return (
    <UserLayout>
      <div className={`min-h-screen px-4 md:px-8 py-10 transition-colors duration-500 ${isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"}`}>
        <main className="max-w-5xl mx-auto space-y-10">
          
          {/* TOP NAVIGATION BAR */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                isDark ? "bg-white/5 border border-white/10 hover:bg-white/10" : "bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
              }`}
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              isDark ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"
            }`}>
              Asset ID: {id?.slice(-8).toUpperCase()}
            </div>
          </div>

          {/* HEADER & HERO SECTION */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-3">
                <Sparkles size={12} /> Analytics Engine
              </div>
              <h2 className="text-5xl font-black tracking-tighter mb-2">
                Traffic <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Inspector</span>
              </h2>
              <p className={`text-lg font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Real-time performance metrics and link health.
              </p>
            </div>
          </div>

          {/* LOADING / ERROR STATES */}
          {isLoading && (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-gray-500 animate-pulse uppercase tracking-widest text-xs">Syncing Link Data...</p>
            </div>
          )}

          {isError && (
            <div className="p-10 rounded-[2.5rem] border border-red-500/20 bg-red-500/5 flex flex-col items-center gap-3 text-red-500">
              <AlertTriangle size={40} className="opacity-50" />
              <p className="font-black uppercase tracking-widest">Statistical Fetch Failed</p>
            </div>
          )}

          {data && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* PRIMARY URL CARD */}
              <div className={`relative overflow-hidden p-8 md:p-10 rounded-[2.5rem] border shadow-2xl ${
                isDark ? "bg-[#0A0A0A] border-white/10" : "bg-white border-gray-200 shadow-sm"
              }`}>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isDark ? "text-gray-600" : "text-gray-400"}`}>Shortened Endpoint</p>
                    <div className="flex items-center gap-3">
                      <a
                        href={`${import.meta.env.VITE_B_LOCATION}/${data.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-3xl md:text-4xl font-black text-blue-500 hover:text-blue-400 transition-colors break-all leading-tight"
                      >
                        {data.shortCode}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                   
                    <a 
                      href={`${import.meta.env.VITE_B_LOCATION}/${data.shortCode}`}
                      target="_blank"
                      className="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-600/20"
                    >
                      Open Link <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
                {/* Decoration */}
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl"></div>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatBox
                  isDark={isDark}
                  icon={<Activity size={20} />}
                  label="Total Clicks"
                  value={data.clicks.toLocaleString()}
                  color="blue"
                />
                <StatBox
                  isDark={isDark}
                  icon={<Calendar size={20} />}
                  label="Generated On"
                  value={new Date(data.createdAt).toLocaleDateString()}
                  color="green"
                />
                <StatBox
                  isDark={isDark}
                  icon={<Clock size={20} />}
                  label="Expiration"
                  value={data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : "Permanent"}
                  color="yellow"
                />
                <StatBox
                  isDark={isDark}
                  icon={<ShieldAlert size={20} />}
                  label="Infrastructure"
                  value={data.isActive ? "Active" : "Offline"}
                  statusColor={data.isActive ? "text-green-500" : "text-red-500"}
                  color={data.isActive ? "green" : "red"}
                />
              </div>

              {/* HEALTH STATUS INDICATORS */}
              <div className="flex flex-wrap gap-4">
                <HealthBadge status={data.status} label={data.status} color={data.status === 'active' ? 'green' : 'red'} isDark={isDark} />
                {!data.isActive && data.disabledByRole && (
                  <HealthBadge status="alert" label={`Suspended by ${data.disabledByRole}`} color="orange" isDark={isDark} />
                )}
                <HealthBadge status="shield" label={`Safety Score: ${100 - (data.abuseScore || 0)}%`} color="indigo" isDark={isDark} />
              </div>

              {/* DETAILED TECHNICAL LOGS */}
              <div className={`p-8 md:p-10 rounded-[2.5rem] border ${
                isDark ? "bg-[#0A0A0A] border-white/10" : "bg-white border-gray-200"
              }`}>
                <div className="flex items-center gap-3 mb-8">
                  <div className={`p-3 rounded-2xl ${isDark ? "bg-purple-500/10 text-purple-500" : "bg-purple-50 text-purple-600"}`}>
                    <Zap size={20} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">Technical Timeline</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <DetailItem label="Disabled At" value={data.disabledAt ? new Date(data.disabledAt).toLocaleString() : "---"} isDark={isDark} />
                    <DetailItem label="Disabled By" value={data.disabledByRole || "None"} isDark={isDark} />
                  </div>
                  <div className="space-y-6">
                    <DetailItem label="Deleted At" value={data.deletedAt ? new Date(data.deletedAt).toLocaleString() : "---"} isDark={isDark} />
                    <DetailItem label="Deleted By" value={data.deletedByRole || "None"} isDark={isDark} />
                  </div>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </UserLayout>
  );
};

// --- HELPER COMPONENTS ---

const StatBox = ({ icon, label, value, color, statusColor, isDark }) => {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    yellow: "text-yellow-500 bg-yellow-500/10",
    red: "text-red-500 bg-red-500/10",
  };

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.03] ${
      isDark ? "bg-white/5 border-white/5" : "bg-white border-gray-100 shadow-sm"
    }`}>
      <div className={`inline-flex p-3 rounded-2xl mb-4 ${colors[color]}`}>
        {icon}
      </div>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>{label}</p>
      <p className={`text-2xl font-black tracking-tight ${statusColor || (isDark ? "text-white" : "text-gray-900")}`}>{value}</p>
    </div>
  );
};

const HealthBadge = ({ label, color, isDark }) => {
  const styles = {
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  };

  return (
    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${styles[color]}`}>
      <div className={`h-1.5 w-1.5 rounded-full animate-pulse bg-current`} />
      {label}
    </span>
  );
};

const DetailItem = ({ label, value, isDark }) => (
  <div className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
    isDark ? "bg-black/20 border-white/5 hover:bg-black/40" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
  }`}>
    <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>{label}</span>
    <span className={`text-xs font-black ${isDark ? "text-gray-300" : "text-gray-700"}`}>{value}</span>
  </div>
);

export default UrlStats;
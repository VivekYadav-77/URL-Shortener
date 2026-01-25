import { useState } from "react";
import { useGetHistoryUrlsQuery } from "../Features/urls/urlApi";
import UserLayout from "./UserLayout";
import { useTheme } from "../App/themeStore";
import { 
  History as HistoryIcon, 
  Trash2, 
  Clock, 
  MousePointer2, 
  Calendar, 
  ShieldAlert, 
  User as UserIcon, 
  X, 
  ExternalLink,
  Filter,
  Link as LinkIcon
} from "lucide-react";

const History = () => {
  const { data: urls = [], isLoading, isError } = useGetHistoryUrlsQuery();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState("");

  const filtered = urls.filter(
    (u) => activeTab === "all" || u.status === activeTab,
  );

  const shortUrlPreview = (url) => {
    if (!url) return "";
    return url.length <= 50 ? url : url.slice(0, 50) + "...";
  };

  return (
    <UserLayout>
      <div className={`min-h-screen px-4 md:px-8 py-12 transition-colors duration-500 ${isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"}`}>
        <div className="max-w-4xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-3">
                <HistoryIcon size={12} /> Archive Management
              </div>
              <h1 className="text-5xl font-black tracking-tighter mb-2">Link <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">History</span></h1>
              <p className={`text-lg font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Review your inactive, deleted, and expired assets.
              </p>
            </div>

            {/* FILTER TABS */}
            <div className={`flex p-1.5 rounded-2xl border backdrop-blur-md ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"}`}>
              {["all", "deleted", "expired"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                    ${activeTab === tab
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* LOADING / ERROR STATES */}
          {isLoading && (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-gray-500 animate-pulse uppercase tracking-widest text-xs">Syncing Archive...</p>
            </div>
          )}
          
          {isError && (
            <div className="p-10 rounded-[2rem] border border-red-500/20 bg-red-500/5 text-center text-red-500 font-bold">
              Failed to retrieve historical data.
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && filtered.length === 0 && (
            <div className={`p-20 rounded-[2.5rem] border border-dashed text-center transition-all ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"}`}>
              <HistoryIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p className={`text-xl font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}>No historical links found in this category.</p>
            </div>
          )}

          {/* URL LIST */}
          <div className="space-y-8 pb-20">
            {filtered.map((url) => (
              <div
                key={url._id}
                className={`group relative overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-300 hover:scale-[1.01] ${
                  isDark ? "bg-[#0A0A0A] border-white/10 shadow-black" : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      {/* Short Link */}
                      <div className="flex items-center gap-3 mb-2">
                        <a
                          href={`${import.meta.env.VITE_B_LOCATION}/${url.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xl font-black text-blue-500 hover:text-blue-400 transition-colors break-all"
                        >
                          {import.meta.env.VITE_B_LOCATION}{url.shortCode}
                        </a>
                        <StatusBadge status={url.status} isDark={isDark} />
                      </div>

                      {/* Original Link Preview */}
                      <button
                        onClick={() => {
                          setModalUrl(url.originalUrl);
                          setShowModal(true);
                        }}
                        className={`flex items-center gap-2 text-sm font-medium transition-all hover:translate-x-1 text-left ${
                          isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <ExternalLink size={14} />
                        <span className="truncate max-w-sm md:max-w-lg underline decoration-dotted underline-offset-4">
                          {shortUrlPreview(url.originalUrl)}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={`my-8 border-t ${isDark ? "border-white/5" : "border-gray-100"}`} />

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <MetaBox icon={<MousePointer2 size={12} />} label="Clicks" value={url.clicks} isDark={isDark} />
                    <MetaBox icon={<Calendar size={12} />} label="Created" value={new Date(url.createdAt).toLocaleDateString()} isDark={isDark} />
                    <MetaBox icon={<Clock size={12} />} label="Expired" value={url.expiresAt ? new Date(url.expiresAt).toLocaleDateString() : "---"} isDark={isDark} />
                    <MetaBox icon={<ShieldAlert size={12} />} label="Abuse Score" value={url.abuseScore || "0"} isDark={isDark} />
                    <MetaBox 
                      icon={<UserIcon size={12} />} 
                      label="Originator" 
                      value={url.deletedByRole === "user" ? "You" : "Admin"} 
                      isDark={isDark} 
                      color={url.deletedByRole === "admin" ? "red" : "gray"}
                    />
                  </div>
                </div>

                {/* Decoration */}
                <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-[80px] opacity-20 pointer-events-none ${url.status === 'deleted' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PREMIUM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowModal(false)}>
          <div 
            className={`w-full max-w-2xl p-8 md:p-10 rounded-[2.5rem] border shadow-2xl transition-all scale-in-center ${
              isDark ? "bg-[#0A0A0A] border-white/10" : "bg-white border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                  <LinkIcon size={24} />
                </div>
                <h2 className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent uppercase tracking-tighter">Historical Target</h2>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-2 rounded-xl transition-colors ${isDark ? "hover:bg-white/10 text-gray-500" : "hover:bg-gray-100 text-gray-400"}`}>
                <X size={28} />
              </button>
            </div>

            <div className={`p-8 rounded-3xl mb-8 break-all font-mono text-sm leading-relaxed border ${
              isDark ? "bg-black/40 border-white/5 text-gray-300 shadow-inner" : "bg-gray-50 border-gray-100 text-gray-700"
            }`}>
              {modalUrl}
            </div>

            <button
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-95"
              onClick={() => setShowModal(false)}
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

// --- SUB-COMPONENTS ---

const StatusBadge = ({ status, isDark }) => {
  const styles = {
    deleted: isDark ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-100 text-red-700 border-red-200",
    expired: isDark ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${styles[status] || styles.expired}`}>
      {status === "deleted" ? <Trash2 size={10} /> : <Clock size={10} />}
      {status}
    </span>
  );
};

const MetaBox = ({ icon, label, value, isDark, color = "gray" }) => {
  const valueColors = {
    gray: isDark ? "text-gray-300" : "text-gray-700",
    red: "text-red-500",
  };

  return (
    <div className={`p-4 rounded-2xl border transition-colors ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100"}`}>
      <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
        {icon} {label}
      </p>
      <p className={`text-xs font-bold truncate ${valueColors[color]}`}>{value}</p>
    </div>
  );
};

export default History;
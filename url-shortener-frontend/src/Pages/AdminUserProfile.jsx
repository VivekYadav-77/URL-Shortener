import { useParams, useNavigate } from "react-router-dom";
import { 
  useGetUserProfileQuery, 
  useGetUserUrlsQuery, 
  useBlockUserMutation, 
  useUnblockUserMutation 
} from "../Features/admin/adminApi.js";
import AdminLayout from "./AdminLayout";
import { useTheme } from "../App/themeStore";
import { 
  ArrowLeft, 
  ExternalLink, 
  Activity, 
  Link as LinkIcon, 
  AlertCircle, 
  Clock, 
  UserX, 
  ShieldCheck, 
  X, 
  Hammer,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const AdminUserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // --- MODAL & FORM STATE ---
  const [showModal, setShowModal] = useState(false);
  const [blockReason, setBlockReason] = useState("Violation of platform terms");

  // --- API HOOKS ---
  const { data: userData, isLoading: loadingUser } = useGetUserProfileQuery(id, { skip: !id });
  const { data: urls = [], isLoading: loadingUrls } = useGetUserUrlsQuery(id, { skip: !id });

  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

  const user = userData?.user;
  const isBlocked = user?.status === "blocked";

  // --- HANDLERS ---
  const handleConfirmAction = async () => {
    try {
      if (isBlocked) {
        await unblockUser(id).unwrap();
      } else {
        await blockUser({ id, reason: blockReason }).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Administrative action failed:", err);
    }
  };

  return (
    <AdminLayout>
      <div className={`min-h-screen p-4 md:p-8 transition-colors duration-500 ${isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"}`}>
        
        {/* ---------------------------------------------------------
            CUSTOM MODAL POPUP
        ---------------------------------------------------------- */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border animate-in zoom-in duration-300 ${
              isDark ? "bg-[#0A0A0A] border-white/10" : "bg-white border-gray-200"
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  {isBlocked ? <ShieldCheck className="text-green-500" /> : <Hammer className="text-red-500" />}
                  {isBlocked ? "Unblock Account" : "Confirm Block"}
                </h3>
                <button 
                  onClick={() => setShowModal(false)} 
                  className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-gray-100"}`}
                >
                  <X size={20} />
                </button>
              </div>

              <p className={`mb-6 text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {isBlocked 
                  ? "Are you sure you want to restore access for this user? All their previously active links will remain in their last known state."
                  : "Blocking this user will instantly revoke all their active sessions. They will be logged out and unable to access the dashboard."}
              </p>

              {!isBlocked && (
                <div className="mb-8">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2 ml-1">
                    Reason for enforcement
                  </label>
                  <textarea 
                    rows="3"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all resize-none ${
                      isDark 
                        ? "bg-white/5 border-white/10 focus:border-red-500 text-white" 
                        : "bg-gray-50 border-gray-200 focus:border-red-500 text-gray-900"
                    }`}
                    placeholder="e.g. Spreading malicious links, multiple abuse reports..."
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowModal(false)} 
                  className={`flex-1 py-4 rounded-2xl font-bold border transition-colors ${
                    isDark ? "border-white/10 hover:bg-white/5 text-gray-400" : "border-gray-200 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmAction}
                  disabled={isBlocking || isUnblocking}
                  className={`flex-1 py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 ${
                    isBlocked 
                      ? "bg-green-600 hover:bg-green-700 shadow-green-900/20" 
                      : "bg-red-600 hover:bg-red-700 shadow-red-900/20"
                  } disabled:opacity-50`}
                >
                  {isBlocking || isUnblocking ? "Processing..." : "Confirm Action"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------
            HEADER SECTION
        ---------------------------------------------------------- */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/admin/users")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
              isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-white border shadow-sm hover:bg-gray-50 text-gray-700"
            }`}
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
            isDark ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"
          }`}>
            User Intelligence / ID: {id.slice(-8)}
          </div>
        </div>

        {/* ---------------------------------------------------------
            USER HERO CARD
        ---------------------------------------------------------- */}
        {loadingUser ? (
          <div className="h-48 animate-pulse bg-white/5 rounded-[2.5rem] mb-10"></div>
        ) : (
          <div className={`relative overflow-hidden p-8 rounded-[2.5rem] mb-10 border shadow-2xl transition-all ${
            isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
          } ${isBlocked ? "border-red-500/30 ring-1 ring-red-500/10" : ""}`}>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className={`h-24 w-24 rounded-3xl flex items-center justify-center text-4xl font-black shadow-2xl rotate-3 transform transition hover:rotate-0 ${
                  isBlocked ? "bg-red-600" : (isDark ? "bg-gradient-to-br from-blue-600 to-purple-600" : "bg-blue-600")
                } text-white`}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex items-center flex-col md:flex-row gap-3 mb-1">
                    <h2 className="text-4xl font-black tracking-tight">{user?.name}</h2>
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-lg border ${
                      isBlocked 
                        ? "bg-red-500/20 text-red-500 border-red-500/30" 
                        : (isDark ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-green-100 text-green-700")
                    }`}>
                      {isBlocked ? "ACCOUNT BLOCKED" : "VERIFIED ACCOUNT"}
                    </span>
                  </div>
                  <p className={`text-lg mb-4 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>{user?.email}</p>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center">
                    <div className={`px-4 py-2 rounded-2xl border ${isDark ? "bg-black/40 border-white/10" : "bg-gray-100 border-gray-200 text-gray-700"}`}>
                      <span className="text-[9px] uppercase font-black text-gray-500 block">Role</span>
                      <span className="font-black text-blue-500">{user?.role?.toUpperCase()}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl border ${isDark ? "bg-black/40 border-white/10" : "bg-gray-100 border-gray-200 text-gray-700"}`}>
                      <span className="text-[9px] uppercase font-black text-gray-500 block">Member Since</span>
                      <span className="font-bold">{new Date(user?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={() => setShowModal(true)}
                className={`w-full lg:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-[2rem] font-black transition-all active:scale-95 shadow-2xl ${
                  isBlocked 
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-green-900/40" 
                    : "bg-red-600 hover:bg-red-700 text-white shadow-red-900/40"
                }`}
              >
                {isBlocked ? (
                  <><ShieldCheck size={24} /> Reactivate User</>
                ) : (
                  <><UserX size={24} /> Terminate Access</>
                )}
              </button>
            </div>
            
            <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[120px] ${isBlocked ? "bg-red-600/20" : "bg-blue-600/10"}`}></div>
          </div>
        )}

        {/* ---------------------------------------------------------
            STATS GRID
        ---------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total URLs" value={urls.length} icon={<LinkIcon />} color="blue" isDark={isDark} />
          <StatCard title="Active Links" value={urls.filter(u => u.status === "active").length} icon={<Activity />} color="green" isDark={isDark} />
          <StatCard title="Suspended" value={urls.filter(u => u.status === "inactive").length} icon={<AlertCircle />} color="yellow" isDark={isDark} />
          <StatCard title="Archived" value={urls.filter(u => ["deleted", "expired"].includes(u.status)).length} icon={<Clock />} color="red" isDark={isDark} />
        </div>

        {/* ---------------------------------------------------------
            URL ASSETS TABLE
        ---------------------------------------------------------- */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black tracking-tight">Digital Assets</h3>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
            <span className="text-gray-500 font-bold text-sm">{urls.length} Links</span>
          </div>
        </div>

        <div className={`rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all ${
          isDark ? "bg-[#0A0A0A] border-white/10" : "bg-white border-gray-200"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead className={`${isDark ? "bg-white/5" : "bg-gray-50"} text-[10px] uppercase font-black text-gray-500 tracking-widest`}>
                <tr>
                  <th className="p-6">Link Details</th>
                  <th className="p-6">Engagement</th>
                  <th className="p-6">Current Status</th>
                  <th className="p-6">Enforcement History</th>
                  <th className="p-6">TTL / Expiry</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-gray-100"}`}>
                {loadingUrls ? (
                  <tr><td colSpan="5" className="p-20 text-center animate-pulse font-bold text-blue-500">Retrieving user link data...</td></tr>
                ) : urls.length === 0 ? (
                  <tr><td colSpan="5" className="p-20 text-center text-gray-500 font-medium italic">No link assets found for this profile.</td></tr>
                ) : (
                  urls.map((url) => (
                    <tr key={url._id} className={`group transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-blue-50/30"}`}>
                      <td className="p-6 max-w-xs">
                        <div className="flex items-center gap-2 font-bold text-blue-500 mb-1 group-hover:translate-x-1 transition-transform">
                          <ExternalLink size={14} />
                          <a href={`${import.meta.env.VITE_B_LOCATION}/${url.shortCode}`} target="_blank" rel="noreferrer" className="hover:underline">
                            {url.shortCode}
                          </a>
                        </div>
                        <div className={`text-[10px] font-mono ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          Created: {new Date(url.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-xl font-black tracking-tighter">{url.clicks.toLocaleString()}</span>
                          <span className="text-[9px] uppercase font-black text-gray-400">Total Interactions</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <StatusBadge status={url.status} isDark={isDark} />
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          {url.disabledAt && (
                            <div className="text-yellow-500 text-[10px] font-bold flex items-center gap-1">
                              <AlertCircle size={10} /> Disabled by {url.disabledByRole}
                            </div>
                          )}
                          {url.deletedAt && (
                            <div className="text-red-500 text-[10px] font-bold flex items-center gap-1">
                              <X size={10} /> Deleted by {url.deletedByRole}
                            </div>
                          )}
                          {!url.disabledAt && !url.deletedAt && (
                            <span className="text-gray-400 text-[10px] italic">Clear History</span>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                         <div className={`text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {url.expiresAt ? new Date(url.expiresAt).toLocaleDateString() : "Permanent"}
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// ---------------------------------------------------------
// HELPER COMPONENTS
// ---------------------------------------------------------

const StatusBadge = ({ status, isDark }) => {
  const styles = {
    active: isDark ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-green-50 text-green-700 border-green-200",
    inactive: isDark ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-yellow-50 text-yellow-700 border-yellow-200",
    deleted: isDark ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-50 text-red-700 border-red-200",
    expired: isDark ? "bg-gray-500/10 text-gray-400 border-gray-500/20" : "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${styles[status]}`}>
      {status}
    </span>
  );
};

const StatCard = ({ title, value, icon, color, isDark }) => {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    yellow: "text-yellow-500 bg-yellow-500/10",
    red: "text-red-500 bg-red-500/10",
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02] active:scale-95 cursor-default ${
      isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-xl shadow-gray-200/50"
    }`}>
      <div className="flex items-center justify-between mb-5">
        <div className={`p-4 rounded-2xl ${colors[color]}`}>{icon}</div>
        <ChevronRight className="opacity-10" size={20} />
      </div>
      <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{title}</div>
      <div className="text-4xl font-black mt-2 tracking-tighter">{value.toLocaleString()}</div>
    </div>
  );
};

export default AdminUserProfilePage;
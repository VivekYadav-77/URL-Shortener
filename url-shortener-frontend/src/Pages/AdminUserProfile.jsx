import { useParams, useNavigate } from "react-router-dom";
import { useGetUserProfileQuery, useGetUserUrlsQuery } from "../Features/admin/adminApi.js";
import AdminLayout from "./AdminLayout";
import { useTheme } from "../App/themeStore";
import { ArrowLeft, ExternalLink, Activity, Link as LinkIcon, AlertCircle, Clock } from "lucide-react";

const AdminUserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data: userData, isLoading: loadingUser } = useGetUserProfileQuery(id, { skip: !id });
  const { data: urls = [], isLoading: loadingUrls } = useGetUserUrlsQuery(id, { skip: !id });

  const user = userData?.user;

  return (
    <AdminLayout>
      <div className={`min-h-screen p-4 md:p-8 transition-colors duration-500 ${isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"}`}>
        
        {/* BACK BUTTON & TITLE */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/admin/users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              isDark ? "bg-white/5 hover:bg-white/10" : "bg-white border shadow-sm hover:bg-gray-50"
            }`}
          >
            <ArrowLeft size={18} /> Back to Users
          </button>
          <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border ${
            isDark ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"
          }`}>
            Admin Panel / Inspector
          </div>
        </div>

        {/* USER HERO CARD */}
        {loadingUser ? (
          <div className="h-40 animate-pulse bg-white/5 rounded-3xl mb-8"></div>
        ) : (
          <div className={`relative overflow-hidden p-8 rounded-[2.5rem] mb-10 border shadow-2xl ${
            isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
          }`}>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className={`h-24 w-24 rounded-3xl flex items-center justify-center text-4xl font-black shadow-2xl rotate-3 transform transition hover:rotate-0 ${
                isDark ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white" : "bg-blue-600 text-white"
              }`}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <div className="flex items-center flex-col md:flex-row gap-3 mb-1">
                  <h2 className="text-4xl font-black tracking-tight">{user?.name}</h2>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-lg ${isDark ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-green-100 text-green-700"}`}>
                    ID: {id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <p className={`text-lg mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{user?.email}</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className={`px-4 py-2 rounded-2xl border ${isDark ? "bg-black/40 border-white/10" : "bg-gray-100 border-gray-200 text-gray-700"}`}>
                    <span className="text-xs uppercase font-bold text-gray-500 block">System Role</span>
                    <span className="font-black text-blue-500">{user?.role?.toUpperCase()}</span>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl border ${isDark ? "bg-black/40 border-white/10" : "bg-gray-100 border-gray-200 text-gray-700"}`}>
                    <span className="text-xs uppercase font-bold text-gray-500 block">Member Since</span>
                    <span className="font-bold">{new Date(user?.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute -right-20 -top-20 h-64 w-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
          </div>
        )}

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total URLs" value={urls.length} icon={<LinkIcon />} color="blue" isDark={isDark} />
          <StatCard title="Active Links" value={urls.filter(u => u.status === "active").length} icon={<Activity />} color="green" isDark={isDark} />
          <StatCard title="Suspended" value={urls.filter(u => u.status === "inactive").length} icon={<AlertCircle />} color="yellow" isDark={isDark} />
          <StatCard title="Archived" value={urls.filter(u => ["deleted", "expired"].includes(u.status)).length} icon={<Clock />} color="red" isDark={isDark} />
        </div>

        {/* URL TABLE SECTION */}
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-2xl font-black tracking-tight">User's Link Assets</h3>
          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-md">{urls.length} Total</span>
        </div>

        <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-all ${isDark ? "bg-[#0A0A0A] border-white/10" : "bg-white border-gray-200"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1200px]">
              <thead className={`${isDark ? "bg-white/5" : "bg-gray-50"} text-xs uppercase font-black text-gray-400`}>
                <tr>
                  <th className="p-5">Link Details</th>
                  <th className="p-5">Stats</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">History (Disabled/Deleted)</th>
                  <th className="p-5">Expiration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loadingUrls ? (
                  <tr><td colSpan="5" className="p-10 text-center animate-pulse">Loading links...</td></tr>
                ) : urls.length === 0 ? (
                  <tr><td colSpan="5" className="p-20 text-center text-gray-500">This user hasn't created any links yet.</td></tr>
                ) : (
                  urls.map((url) => (
                    <tr key={url._id} className={`group transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-blue-50/50"}`}>
                      <td className="p-5 max-w-xs">
                        <div className="flex items-center gap-2 font-bold text-blue-500 mb-1">
                          <ExternalLink size={14} />
                          <a href={`${import.meta.env.VITE_B_LOCATION}/${url.shortCode}`} target="_blank" rel="noreferrer" className="hover:underline">
                            {url.shortCode}
                          </a>
                        </div>
                        <div className={`text-xs truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}>Created: {new Date(url.createdAt).toLocaleString()}</div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="text-lg font-black">{url.clicks}</span>
                          <span className="text-[10px] uppercase font-bold text-gray-500">Total Clicks</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <StatusBadge status={url.status} isDark={isDark} />
                      </td>
                      <td className="p-5 text-[11px]">
                        <div className="space-y-1">
                          {url.disabledAt && <div className="text-yellow-500">Disabled: {new Date(url.disabledAt).toLocaleDateString()} (By {url.disabledByRole})</div>}
                          {url.deletedAt && <div className="text-red-500">Deleted: {new Date(url.deletedAt).toLocaleDateString()} (By {url.deletedByRole})</div>}
                          {!url.disabledAt && !url.deletedAt && <span className="text-gray-500 italic">No restrictions</span>}
                        </div>
                      </td>
                      <td className="p-5">
                         <div className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {url.expiresAt ? new Date(url.expiresAt).toLocaleString() : "Permanent"}
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

// HELPER COMPONENTS
const StatusBadge = ({ status, isDark }) => {
  const styles = {
    active: isDark ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-green-100 text-green-700 border-green-200",
    inactive: isDark ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-yellow-100 text-yellow-700 border-yellow-200",
    deleted: isDark ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-100 text-red-700 border-red-200",
    expired: isDark ? "bg-gray-500/10 text-gray-400 border-gray-500/20" : "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
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
    <div className={`p-6 rounded-[2rem] border transition-all hover:scale-[1.02] ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>{icon}</div>
      </div>
      <div className="text-sm font-bold text-gray-500 uppercase tracking-tight">{title}</div>
      <div className="text-3xl font-black mt-1">{value}</div>
    </div>
  );
};

export default AdminUserProfilePage;
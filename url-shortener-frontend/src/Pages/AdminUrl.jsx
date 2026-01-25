import { useState } from "react";
import {
  useGetAllAdminUrlsQuery,
  useAdminEnableUrlMutation,
  useAdminDisableUrlMutation,
  useAdminDeleteUrlMutation,
} from "../Features/admin/adminApi.js";

import AdminLayout from "./AdminLayout";
import { useTheme } from "../App/themeStore";
import { 
  ArrowRight, 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  Trash2, 
  Power, 
  X, 
  Link as LinkIcon, 
  Search 
} from "lucide-react";

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Expired", value: "expired" },
  { label: "Deleted", value: "deleted" },
];

const AdminURLsPage = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUrl, setSelectedUrl] = useState(null); // Detail Modal
  const [feedback, setFeedback] = useState(null); // Toast state

  const { theme } = useTheme();

  // Unified Theme Variables
  const pageBg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const softText = theme === "light" ? "text-gray-600" : "text-gray-400";
  const strongText = theme === "light" ? "text-black" : "text-white";
  const tableHeadBg = theme === "light" ? "bg-gray-100" : "bg-gray-800";
  const rowHover = theme === "light" ? "hover:bg-blue-50" : "hover:bg-gray-700";

  const { data: urls = [], isLoading } = useGetAllAdminUrlsQuery({
    status: statusFilter,
    page,
    limit: 15,
  });

  const [enableUrl] = useAdminEnableUrlMutation();
  const [disableUrl] = useAdminDisableUrlMutation();
  const [deleteUrl] = useAdminDeleteUrlMutation();

  const toast = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 2200);
  };

  const handleCopy = (s) => {
    navigator.clipboard.writeText(s);
    toast("URL copied to clipboard");
  };

  const handleEnable = async (id) => {
    try {
      await enableUrl(id).unwrap();
      toast("URL enabled successfully");
    } catch {
      toast("Action failed", "error");
    }
  };

  const handleDisable = async (id) => {
    try {
      await disableUrl(id).unwrap();
      toast("URL disabled successfully");
    } catch {
      toast("Action failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Permanently delete this URL? This cannot be undone.")) {
      try {
        await deleteUrl(id).unwrap();
        toast("URL deleted permanently");
      } catch {
        toast("Deletion failed", "error");
      }
    }
  };

  return (
    <AdminLayout>
      <div className={`min-h-screen ${pageBg} transition-colors duration-300`}>
        
        {/* TOAST NOTIFICATION */}
        {feedback && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className={`px-5 py-3 rounded-2xl shadow-2xl text-sm font-black border ${feedback.type === "success" ? "bg-green-600 text-white border-green-500" : "bg-red-600 text-white border-red-500"}`}>
              {feedback.msg}
            </div>
          </div>
        )}

        {/* URL DETAIL MODAL */}
        {selectedUrl && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className={`w-full max-w-lg rounded-3xl p-8 shadow-2xl border ${cardBg} ${border}`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                   <LinkIcon className="text-blue-500" size={24} />
                   <h3 className={`font-black text-xl ${strongText}`}>Original Destination</h3>
                </div>
                <button onClick={() => setSelectedUrl(null)} className={softText}>
                  <X size={24} />
                </button>
              </div>
              <div className={`p-5 rounded-2xl mb-8 break-all text-sm font-mono border ${theme === "light" ? "bg-gray-100 border-gray-200" : "bg-gray-800 border-gray-700"} ${strongText}`}>
                {selectedUrl}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleCopy(selectedUrl)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/20"
                >
                  <Copy size={18} /> Copy
                </button>
                <a
                  href={selectedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex-1 border-2 ${border} ${strongText} py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition`}
                >
                  <ExternalLink size={18} /> Visit
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className={` text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent`}>Global URL Registry</h2>
          <p className={`mt-2 ${softText}`}>Overview and management of all shortened links across the platform.</p>
        </div>

        {/* FILTERS & SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-transparent dark:border-gray-700 overflow-x-auto no-scrollbar">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  setPage(1);
                  setStatusFilter(s.value);
                }}
                className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${statusFilter === s.value ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : `${softText} hover:bg-gray-200 dark:hover:bg-gray-700`}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className={`flex items-center px-6 py-3 rounded-2xl border-2 ${border} ${cardBg} w-full md:w-80 transition-all focus-within:border-blue-500`}>
            <Search size={20} className={softText} />
            <input
              type="text"
              placeholder="Search by short code..."
              className="ml-3 flex-1 bg-transparent outline-none text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className={`rounded-3xl border shadow-2xl overflow-hidden ${cardBg} ${border}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead className={`${tableHeadBg} border-b ${border}`}>
                <tr className="text-xs uppercase font-black tracking-widest">
                  <th className="p-5">Short Link</th>
                  <th className="p-5">Original url</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-center">Engagement</th>
                  <th className="p-5 text-center">Registration</th>
                  <th className="p-5 text-center">Owner</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${border}`}>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-20 text-center font-bold text-blue-500 animate-pulse">
                      Fetching Registry Data...
                    </td>
                  </tr>
                ) : urls.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-20 text-center font-bold text-gray-500">
                      No URLs matching the current filter.
                    </td>
                  </tr>
                ) : (
                  urls.map((url) => {
                    const shortUrl = `${import.meta.env.VITE_B_LOCATION}/${url.shortCode}`;
                    return (
                      <tr key={url._id} className={`${rowHover} transition-colors`}>
                        <td className="p-5">
                          <div className="flex flex-col">
                            <a href={shortUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-black hover:underline">{import.meta.env.VITE_B_LOCATION}{url.shortCode}</a>
                            
                          </div>
                        </td>
                        <td><p 
                              onClick={() => setSelectedUrl(url.originalUrl)}
                              className={`text-[11px] truncate max-w-[180px] cursor-pointer hover:text-blue-500 font-medium ${softText}`}
                            >
                              {url.originalUrl}
                            </p></td>
                        <td className="p-5">
                          <StatusBadge status={url.status} theme={theme} />
                        </td>
                        <td className="p-5 text-center">
                          <span className="text-sm font-bold">{url.clicks} clicks</span>
                        </td>
                        <td className="p-5 text-center">
                           <p className="text-xs font-bold">{new Date(url.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="p-5 text-center">
                          <span className="text-xs font-medium text-gray-500">{url.owner?.email || "N/A"}</span>
                        </td>
                        <td className="p-5">
                           <div className="flex justify-center items-center gap-3">
                              {url.status === "inactive" && (
                                <button onClick={() => handleEnable(url._id)} className="p-2.5 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition" title="Enable">
                                  <Power size={18} />
                                </button>
                              )}
                              {url.status === "active" && (
                                <button onClick={() => handleDisable(url._id)} className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500 hover:text-white transition" title="Disable">
                                  <Power size={18} />
                                </button>
                              )}
                              <button onClick={() => handleDelete(url._id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition" title="Delete">
                                <Trash2 size={18} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-6 mt-10 mb-20">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`p-3 rounded-xl border-2 transition-all ${page === 1 ? 'opacity-30 border-gray-300' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
          >
            <ArrowLeft size={20} />
          </button>
          <span className="font-black text-sm uppercase tracking-tighter">
            Registry Page {page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={urls.length < 15}
            className={`p-3 rounded-xl border-2 transition-all ${urls.length < 15 ? 'opacity-30 border-gray-300' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

const StatusBadge = ({ status, theme }) => {
  const styles = {
    active: theme === "light" ? "bg-green-100 text-green-700 border-green-200" : "bg-green-900/40 text-green-300 border-green-800",
    inactive: theme === "light" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : "bg-yellow-900/40 text-yellow-300 border-yellow-800",
    deleted: theme === "light" ? "bg-red-100 text-red-700 border-red-200" : "bg-red-900/40 text-red-300 border-red-800",
    expired: theme === "light" ? "bg-gray-100 text-gray-700 border-gray-200" : "bg-gray-800 text-gray-300 border-gray-700",
  };

  return (
    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.expired}`}>
      {status}
    </span>
  );
};

export default AdminURLsPage;
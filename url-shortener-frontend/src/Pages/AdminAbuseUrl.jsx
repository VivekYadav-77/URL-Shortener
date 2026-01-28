import { useState } from "react";
import {
  useGetAbuseUrlsQuery,
  useAdminDisableUrlMutation,
  useAdminDeleteUrlMutation,
} from "../Features/admin/adminApi.js";

import AdminLayout from "./AdminLayout";
import { useTheme } from "../App/themeStore";
import { Copy, X, ExternalLink, ShieldAlert, Trash2, Power, History, UserCheck, ShieldCheck } from "lucide-react";

const severityTabs = [
  { label: "All", value: "" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export default function AdminAbuseUrlsPage() {
  const [severity, setSeverity] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUrl, setSelectedUrl] = useState(null); 
  const [feedback, setFeedback] = useState(null);

  const { theme } = useTheme();

  const pageBg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const softText = theme === "light" ? "text-gray-600" : "text-gray-400";
  const strongText = theme === "light" ? "text-black" : "text-white";
  const tableHeadBg = theme === "light" ? "bg-gray-100" : "bg-gray-800";
  const inputBg = theme === "light" ? "bg-white" : "bg-gray-800";
  const rowHover = theme === "light" ? "hover:bg-blue-50" : "hover:bg-gray-700";

  const { data: urls = [], isLoading } = useGetAbuseUrlsQuery();
  const [disableUrl] = useAdminDisableUrlMutation();
  const [deleteUrl] = useAdminDeleteUrlMutation();

  const toast = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 2200);
  };

  const handleCopy = (s) => {
    navigator.clipboard.writeText(s);
    toast("Copied to clipboard");
  };

  const handleDisable = async (id) => {
    try {
      await disableUrl(id).unwrap();
      toast("URL disabled successfully");
    } catch {
      toast("Failed to disable URL", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this flagged URL?")) return;
    try {
      await deleteUrl(id).unwrap();
      toast("URL deleted permanently");
    } catch {
      toast("Deletion failed", "error");
    }
  };

  const filteredUrls = urls.filter((url) => {
    const s = url.abuseScore;
    if (severity === "low" && s <= 3) return true;
    if (severity === "medium" && s > 3 && s <= 10) return true;
    if (severity === "high" && s > 10) return true;
    return severity === "" ? true : false;
  });

  const searchedUrls = filteredUrls.filter(
    (u) =>
      u.shortCode.includes(search) ||
      u.originalUrl.toLowerCase().includes(search.toLowerCase())
  );

  const getSeverityBadge = (score) => {
    if (score > 10) return "bg-red-100 text-red-700 border-red-200";
    if (score > 3) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  return (
    <AdminLayout>
      <div className={`min-h-screen ${pageBg} transition-colors duration-300`}>
        {feedback && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce">
            <div className={`px-4 py-3 rounded-xl shadow-2xl text-sm font-bold border ${feedback.type === "success" ? "bg-green-600 text-white border-green-500" : "bg-red-600 text-white border-red-500"}`}>
              {feedback.msg}
            </div>
          </div>
        )}

        {selectedUrl && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className={`w-full max-w-lg rounded-3xl p-8 shadow-2xl border ${cardBg} ${border}`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="text-red-500" size={24} />
                  <h3 className={`font-black text-xl ${strongText}`}>Original URL Details</h3>
                </div>
                <button onClick={() => setSelectedUrl(null)} className={softText}>
                  <X size={24} />
                </button>
              </div>
              <div className={`p-5 rounded-2xl mb-8 break-all text-sm font-mono border ${theme === "light" ? "bg-gray-100 border-gray-200" : "bg-gray-800 border-gray-700"} ${strongText}`}>
                {selectedUrl.originalUrl}
              </div>
              
              {/* Added: Admin Status in Modal Body */}
              {(selectedUrl.status === 'deleted' || selectedUrl.status === 'inactive') && (
                <div className={`mb-6 p-4 rounded-xl border ${selectedUrl.status === 'deleted' ? 'bg-red-500/10 border-red-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                   <p className="text-sm font-bold flex items-center gap-2">
                     <History size={16} /> 
                     Action History: {selectedUrl.status.toUpperCase()}
                   </p>
                   <p className="text-xs mt-1 opacity-80">
                     By: {selectedUrl.deletedByRole || selectedUrl.disabledByRole || 'System'}
                   </p>
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => handleCopy(selectedUrl.originalUrl)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition">
                  <Copy size={18} /> Copy
                </button>
                <a href={selectedUrl.originalUrl} target="_blank" rel="noreferrer" className={`flex-1 border-2 ${border} ${strongText} py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition`}>
                  <ExternalLink size={18} /> Visit
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Abuse Reports</h2>
          <p className={`mt-2 ${softText}`}>Investigate URLs flagged by the anti-abuse system.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-transparent dark:border-gray-700">
            {severityTabs.map((tab) => (
              <button key={tab.value} onClick={() => setSeverity(tab.value)} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${severity === tab.value ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : `${softText} hover:bg-gray-200 dark:hover:bg-gray-700`}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className={`ml-auto px-6 py-3 rounded-2xl border-2 ${border} ${inputBg} ${strongText} outline-none w-full sm:w-80 focus:border-blue-500 transition-all`} />
        </div>

        <div className={`rounded-3xl border shadow-2xl overflow-hidden ${cardBg} ${border}`}>
          {isLoading ? (
            <div className="p-16 text-center animate-pulse font-bold text-blue-500">Scanning Database...</div>
          ) : searchedUrls.length === 0 ? (
            <div className="p-16 text-center font-bold text-gray-500">No records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className={`${tableHeadBg} border-b ${border}`}>
                  <tr>
                    <th className="p-5 font-bold uppercase text-xs tracking-widest">Shortcode</th>
                    <th className="p-5 font-bold uppercase text-xs tracking-widest">Details</th>
                    <th className="p-5 font-bold uppercase text-xs tracking-widest text-center">Score</th>
                    <th className="p-5 font-bold uppercase text-xs tracking-widest text-center">Audit</th>
                    <th className="p-5 font-bold uppercase text-xs tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${border}`}>
                  {searchedUrls.map((url) => {
                    const shortUrl = `${import.meta.env.VITE_B_LOCATION}/${url.shortCode}`;
                    
                    // Logic: Is it already permanently handled by admin?
                    const isAdminDeleted = url.status === "deleted" && url.deletedByRole === "admin";
                    const isAdminDisabled = url.status === "inactive" && url.disabledByRole === "admin";

                    return (
                      <tr key={url._id} className={`${rowHover} transition-colors ${isAdminDeleted ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                        <td className="p-5">
                          <a href={shortUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-black hover:underline">{url.shortCode}</a>
                        </td>
                        <td className="p-5 max-w-xs">
                          <p onClick={() => setSelectedUrl(url)} className={`text-sm truncate cursor-pointer hover:text-blue-500 font-medium ${softText}`}>
                            {url.originalUrl}
                          </p>
                        </td>
                        <td className="p-5 text-center">
                          <span className={`px-4 py-1 rounded-lg text-xs font-black border ${getSeverityBadge(url.abuseScore)}`}>
                            {url.abuseScore}
                          </span>
                        </td>
                        
                        {/* Audit Column: Showing who disabled/deleted it */}
                        <td className="p-5 text-center">
                          <div className="flex flex-col items-center">
                            {url.status === 'deleted' ? (
                               <span className="text-red-500 text-[10px] font-bold uppercase flex items-center gap-1">
                                 <Trash2 size={10} /> Deleted by {url.deletedByRole}
                               </span>
                            ) : url.status === 'inactive' ? (
                               <span className="text-yellow-600 text-[10px] font-bold uppercase flex items-center gap-1">
                                 <Power size={10} /> Disabled by {url.disabledByRole}
                               </span>
                            ) : (
                               <span className="text-green-500 text-[10px] font-bold uppercase">Active</span>
                            )}
                            <span className="text-[10px] text-gray-400 font-mono mt-1">{url.owner?.email || "anonymous"}</span>
                          </div>
                        </td>

                        <td className="p-5">
                            <div className="flex justify-center items-center gap-3">
                              {/* Conditionally hide buttons if admin has already acted */}
                              {!isAdminDeleted && !isAdminDisabled ? (
                                <>
                                  <button onClick={() => handleDisable(url._id)} className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500 hover:text-white transition" title="Disable URL">
                                    <Power size={18} />
                                  </button>
                                  <button onClick={() => handleDelete(url._id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition" title="Delete Permanently">
                                    <Trash2 size={18} />
                                  </button>
                                </>
                              ) : (
                                <div className="flex items-center gap-1 text-gray-400 italic text-xs">
                                  <ShieldCheck size={14} className="text-green-500"/> Resolved
                                </div>
                              )}
                            </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
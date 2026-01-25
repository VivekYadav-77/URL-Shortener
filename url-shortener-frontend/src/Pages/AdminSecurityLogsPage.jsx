import { useState, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import {
  useGetSecurityLogsQuery,
  useGetHighRiskLogsQuery,
  useDeleteSecurityLogsMutation,
} from "../Features/admin/adminApi";
import { useTheme } from "../App/themeStore";
import { Search, Trash2, ShieldAlert, X, Copy, ExternalLink, Filter } from "lucide-react";

const FILTER_OPTIONS = [
  { label: "All Events", value: "all" },
  { label: "High-Risk Only", value: "high" },
];

export default function AdminSecurityLogsPage() {
  const { theme } = useTheme();
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUrl, setSelectedUrl] = useState(null); // URL Detail Modal
  const [feedback, setFeedback] = useState(null); // Toast state

  const { data: allLogs = [], isLoading: loadingAll } = useGetSecurityLogsQuery();
  const { data: highRiskLogs = [], isLoading: loadingHigh } = useGetHighRiskLogsQuery();
  const [deleteLogs, { isLoading: deleting }] = useDeleteSecurityLogsMutation();

  const logs = filterType === "all" ? allLogs : highRiskLogs;
  const isLoading = filterType === "all" ? loadingAll : loadingHigh;

  // Theme Variables
  const pageBg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const softText = theme === "light" ? "text-gray-600" : "text-gray-400";
  const strongText = theme === "light" ? "text-black" : "text-white";
  const tableHeadBg = theme === "light" ? "bg-gray-100" : "bg-gray-800";

  const toast = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 2200);
  };

  const handleCopy = (s) => {
    navigator.clipboard.writeText(s);
    toast("URL copied to clipboard");
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) =>
      log.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
      (log.shortCode && log.shortCode.includes(search))
    );
  }, [logs, search]);

  const ITEMS_PER_PAGE = 15;
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginated = filteredLogs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleDeleteLogs = async () => {
    if (confirm("Permanently delete ALL security logs? This action is irreversible.")) {
      try {
        await deleteLogs().unwrap();
        toast("Security logs cleared");
      } catch {
        toast("Failed to clear logs", "error");
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
                   <ShieldAlert className="text-red-500" size={24} />
                   <h3 className={`font-black text-xl ${strongText}`}>Full Original URL</h3>
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

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className={` text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent`}>Security Audit</h2>
           
            <p className={`mt-2 ${softText}`}>Monitor suspicious activities and system scans.</p>
          </div>
          <button
            onClick={handleDeleteLogs}
            disabled={deleting}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all disabled:opacity-50"
          >
            <Trash2 size={20} /> Clear Audit Trail
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-transparent dark:border-gray-700">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setFilterType(f.value);
                  setPage(1);
                }}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${filterType === f.value ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : `${softText} hover:bg-gray-200 dark:hover:bg-gray-700`}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className={`flex items-center px-6 py-3 rounded-2xl border-2 ${border} ${cardBg} ml-auto w-full sm:w-80 transition-all focus-within:border-blue-500`}>
            <Search size={20} className={softText} />
            <input
              type="text"
              placeholder="Search logs..."
              className="ml-3 flex-1 bg-transparent outline-none text-sm font-medium"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* LOGS TABLE */}
        <div className={`rounded-3xl border shadow-2xl overflow-hidden ${cardBg} ${border}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead className={`${tableHeadBg} border-b ${border}`}>
                <tr className="text-xs uppercase font-black tracking-widest">
                  <th className="p-5">Event Type</th>
                  <th className="p-5">URL Context</th>
                  <th className="p-5 text-center">Shortcode</th>
                  <th className="p-5 text-center">Engine / Risk</th>
                  <th className="p-5 text-center">Source IP</th>
                  <th className="p-5 text-center">Timestamp</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${border}`}>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-20 text-center font-bold text-blue-500 animate-pulse">
                      Analyzing Security Database...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-20 text-center font-bold text-gray-500">
                      No security anomalies detected.
                    </td>
                  </tr>
                ) : (
                  paginated.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${log.metadata?.riskScore > 10 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                          {log.type.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-5 max-w-xs">
                        <p 
                          onClick={() => setSelectedUrl(log.originalUrl)}
                          className={`text-sm truncate font-medium cursor-pointer hover:text-blue-500 transition-all ${softText}`}
                        >
                          {log.originalUrl}
                        </p>
                      </td>
                      <td className="p-5 text-center font-bold text-blue-600">{log.shortCode || "—"}</td>
                      <td className="p-5 text-center">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold">{log.metadata?.scannerUsed || "N/A"}</span>
                           <span className={`text-[10px] font-black ${log.metadata?.riskScore > 10 ? 'text-red-500' : 'text-green-500'}`}>
                              Score: {log.metadata?.riskScore ?? "0"}
                           </span>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <span className="text-xs font-mono text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                          {log.metadata?.ip || "—"}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <p className="text-xs font-bold">{new Date(log.createdAt).toLocaleDateString()}</p>
                        <p className="text-[10px] text-gray-400">{new Date(log.createdAt).toLocaleTimeString()}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-10 mb-20">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-6 py-2 rounded-xl font-bold border-2 transition-all ${page === 1 ? 'opacity-30 border-gray-300' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
            >
              Previous
            </button>
            <span className="font-black text-sm uppercase tracking-tighter">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className={`px-6 py-2 rounded-xl font-bold border-2 transition-all ${page === totalPages ? 'opacity-30 border-gray-300' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
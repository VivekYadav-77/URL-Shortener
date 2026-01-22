import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetMyUrlsQuery,
  useUpdateUrlMutation,
  useDeleteUrlMutation,
} from "../Features/urls/urlApi";

import UserLayout from "./UserLayout";
import { useTheme } from "../App/themeStore";

import {
  getUrlStatusLabel,
  getStatusStyles,
  getActionLabel,
} from "../../utils/urlStatusLabel.js";

import { Copy, Trash2, BarChart2, Power, X, ExternalLink } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { data: urls = [], isLoading, isError } = useGetMyUrlsQuery();
  console.log(urls)
  const [updateUrl] = useUpdateUrlMutation();
  const [deleteUrl] = useDeleteUrlMutation();
  const [feedback, setFeedback] = useState(null);
  
  // State for the URL Popup
  const [selectedUrl, setSelectedUrl] = useState(null);

  const pageBg = theme === "light" ? "bg-white text-black" : "text-white dark:from-gray-900 dark:to-black py-10";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const softText = theme === "light" ? "text-gray-600" : "text-gray-400";
  const strongText = theme === "light" ? "text-black" : "text-white";
  const muted = theme === "light" ? "text-gray-500" : "text-gray-400";

  const toast = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 2200);
  };

  const handleCopy = (s) => {
    navigator.clipboard.writeText(s);
    toast("Copied to clipboard");
  };

  const handleToggle = async (url) => {
    try {
      await updateUrl({
        id: url._id,
        data: { isActive: !url.isActive },
      }).unwrap();
      toast(url.isActive ? "URL disabled" : "URL enabled");
    } catch {
      toast("Failed to update URL", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this URL?")) return;
    try {
      await deleteUrl(id).unwrap();
      toast("URL deleted");
    } catch {
      toast("Delete failed", "error");
    }
  };

  return (
    <UserLayout>
      <div className={`min-h-screen px-4 sm:px-6 py-10 transition-colors duration-300 ${pageBg}`}>
        
        {/* TOAST */}
        {feedback && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className={`px-4 py-3 rounded-xl shadow-lg text-sm font-semibold ${feedback.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
              {feedback.msg}
            </div>
          </div>
        )}

        {/* URL DETAIL MODAL */}
        {selectedUrl && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border ${cardBg} ${border}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold ${strongText}`}>Original URL</h3>
                <button onClick={() => setSelectedUrl(null)} className={muted}><X size={20} /></button>
              </div>
              <div className={`p-4 rounded-lg mb-6 break-all text-sm font-mono ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} ${strongText}`}>
                {selectedUrl}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleCopy(selectedUrl)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Copy size={16} /> Copy URL
                </button>
                <a 
                  href={selectedUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className={`flex-1 border ${border} ${strongText} py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800`}
                >
                  <ExternalLink size={16} /> Visit
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className={`text-4xl font-extrabold ${strongText}`}>My URLs</h1>
            <p className={`mt-1 text-sm ${softText}`}>Manage and track all your shortened URLs</p>
          </div>
          <button onClick={() => navigate("/create")} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-md transition">
            + Create New Link
          </button>
        </div>

        <div className={`rounded-2xl shadow-xl border ${cardBg} ${border} transition`}>
          {isLoading && <p className={`p-8 text-center ${softText}`}>Loading your links…</p>}
          {isError && <div className="p-8 text-center text-red-500 font-semibold">Failed to load URLs.</div>}

          {!isLoading && urls.length > 0 && (
            <div className={`divide-y ${border}`}>
              {urls.map((url) => {
                const shortUrl = `${import.meta.env.VITE_B_LOCATION}/${url.shortCode}`;
                const label = getUrlStatusLabel(url);
                const badge = getStatusStyles(label);
                const extraLabel = getActionLabel(url);

                return (
                  <div key={url._id} className="p-6 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-blue-600 font-semibold break-all">{shortUrl}</p>
                        
                        {/* CLICKABLE TRUNCATED URL */}
                        <p 
                          onClick={() => setSelectedUrl(url.originalUrl)}
                          className={`text-sm truncate cursor-pointer hover:underline decoration-dotted transition-all ${muted} max-w-md`}
                          title="Click to view full URL"
                        >
                          {url.originalUrl}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3 items-center">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-xl ${badge}`}>{label}</span>
                          {extraLabel && <span className={`text-xs ${muted}`}>{extraLabel}</span>}
                          <span className={`text-xs ${muted}`}>{url.clicks} clicks</span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          <Meta label="Created" value={new Date(url.createdAt).toLocaleString()} theme={theme} />
                          <Meta label="Expires" value={url.expiresAt ? new Date(url.expiresAt).toLocaleString() : "—"} theme={theme} />
                          <Meta label="Deleted" value={url.deletedAt ? new Date(url.deletedAt).toLocaleString() : "—"} theme={theme} />
                          <Meta label="Disabled" value={url.disabledAt ? new Date(url.disabledAt).toLocaleString() : "—"} theme={theme} />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4">
                        <IconBtn onClick={() => handleCopy(shortUrl)} theme={theme}><Copy size={19} /></IconBtn>
                        <IconBtn onClick={() => navigate(`/urls/${url._id}/stats`)} theme={theme}><BarChart2 size={19} /></IconBtn>
                        <IconBtn onClick={() => handleToggle(url)} theme={theme}><Power size={19} /></IconBtn>
                        <IconBtn onClick={() => handleDelete(url._id)} theme={theme}><Trash2 size={19} /></IconBtn>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

// META BOX (remains the same)
const Meta = ({ label, value, theme }) => {
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const bg = theme === "light" ? "bg-gray-50" : "bg-gray-800";
  const labelColor = theme === "light" ? "text-gray-600" : "text-gray-400";
  const valueColor = theme === "light" ? "text-black" : "text-white";

  return (
    <div className={`p-3 rounded-xl border ${bg} ${border}`}>
      <p className={`text-[11px] uppercase font-bold ${labelColor}`}>{label}</p>
      <p className={`text-sm font-semibold break-all ${valueColor}`}>{value}</p>
    </div>
  );
};

// ICON BUTTON (remains the same)
const IconBtn = ({ children, onClick, theme }) => {
  const hover = theme === "light" ? "hover:bg-gray-200 text-black" : "hover:bg-gray-800 text-white";
  return (
    <button onClick={onClick} className={`p-2 rounded-xl transition ${hover}`}>
      {children}
    </button>
  );
};

export default UserDashboard;
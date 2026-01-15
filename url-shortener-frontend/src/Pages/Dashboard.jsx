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

import { Copy, Trash2, BarChart2, Power } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { data: urls = [], isLoading, isError } = useGetMyUrlsQuery();
  const [updateUrl] = useUpdateUrlMutation();
  const [deleteUrl] = useDeleteUrlMutation();
  const [feedback, setFeedback] = useState(null);

  const pageBg = theme === "light" ? "bg-white text-black" : "text-white dark:from-gray-900 dark:to-black py-10";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const softText = theme === "light" ? "text-gray-600" : "text-gray-400";
  const strongText = theme === "light" ? "text-black" : "text-white";
  const muted = theme === "light" ? "text-gray-500" : "text-gray-400";
  const metaBg = theme === "light" ? "bg-gray-50" : "bg-gray-800";

  const toast = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 2200);
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

  const handleCopy = (s) => {
    navigator.clipboard.writeText(s);
    toast("Copied to clipboard");
  };

  return (
    <UserLayout>
      <div className={`min-h-screen px-4 sm:px-6 py-10 transition-colors duration-300 ${pageBg}`}>
        
        {/* TOAST */}
        {feedback && (
          <div className="fixed bottom-6 right-6 z-50">
            <div
              className={`px-4 py-3 rounded-xl shadow-lg text-sm font-semibold ${
                feedback.type === "success"
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {feedback.msg}
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className={`text-4xl font-extrabold ${strongText}`}>My URLs</h1>
            <p className={`mt-1 text-sm ${softText}`}>
              Manage and track all your shortened URLs
            </p>
          </div>

          <button
            onClick={() => navigate("/create")}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-md transition"
          >
            + Create New Link
          </button>
        </div>

        {/* MAIN CARD */}
        <div className={`rounded-2xl shadow-xl border ${cardBg} ${border} transition`}>

          {/* LOADING */}
          {isLoading && (
            <p className={`p-8 text-center ${softText}`}>Loading your links…</p>
          )}

          {/* ERROR */}
          {isError && (
            <div className="p-8 text-center text-red-500 font-semibold">
              Failed to load URLs.
            </div>
          )}

          {/* EMPTY */}
          {!isLoading && urls.length === 0 && (
            <div className="p-14 text-center">
              <h3 className={`text-xl font-semibold ${strongText}`}>
                No URLs found
              </h3>
              <p className={`mt-1 ${muted}`}>
                Create your first shortened URL to get started.
              </p>
            </div>
          )}

          {/* LIST */}
          {!isLoading && urls.length > 0 && (
            <div className={`divide-y ${border}`}>
              {urls.map((url) => {
                const shortUrl = `${window.location.origin}/${url.shortCode}`;
                const label = getUrlStatusLabel(url);
                const badge = getStatusStyles(label);
                const extraLabel = getActionLabel(url);

                return (
                  <div key={url._id} className="p-6 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      
                      {/* LEFT */}
                      <div className="min-w-0 flex-1">
                        <p className="text-blue-600 font-semibold break-all">{shortUrl}</p>
                        <p className={`text-sm truncate ${muted}`}>{url.originalUrl}</p>

                        <div className="flex flex-wrap gap-2 mt-3 items-center">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-xl ${badge}`}>
                            {label}
                          </span>

                          {extraLabel && (
                            <span className={`text-xs ${muted}`}>{extraLabel}</span>
                          )}

                          <span className={`text-xs ${muted}`}>
                            {url.clicks} clicks
                          </span>
                        </div>

                        {/* METADATA */}
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          <Meta label="Created" value={new Date(url.createdAt).toLocaleString()} theme={theme} />
                          <Meta label="Expires" value={url.expiresAt ? new Date(url.expiresAt).toLocaleString() : "—"} theme={theme} />
                          <Meta label="Deleted" value={url.deletedAt ? new Date(url.deletedAt).toLocaleString() : "—"} theme={theme} />
                          <Meta label="Disabled" value={url.disabledAt ? new Date(url.disabledAt).toLocaleString() : "—"} theme={theme} />
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <IconBtn onClick={() => handleCopy(shortUrl)}  theme={theme}>
                          <Copy size={19} />
                        </IconBtn>

                        <IconBtn onClick={() => navigate(`/urls/${url._id}/stats`)} theme={theme}>
                          <BarChart2 size={19} />
                        </IconBtn>

                        <IconBtn onClick={() => handleToggle(url)} theme={theme}>
                          <Power size={19} />
                        </IconBtn>

                        <IconBtn onClick={() => handleDelete(url._id)} theme={theme}>
                          <Trash2 size={19} />
                        </IconBtn>
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

// META BOX
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

// ICON BUTTON
const IconBtn = ({ children, onClick, theme }) => {
  const hover =
    theme === "light"
      ? "hover:bg-gray-200 text-black"
      : "hover:bg-gray-800 text-white";

  return (
    <button onClick={onClick} className={`p-2 rounded-xl transition ${hover}`}>
      {children}
    </button>
  );
};

export default UserDashboard;

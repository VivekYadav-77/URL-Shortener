import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetMyUrlsQuery,
  useUpdateUrlMutation,
  useDeleteUrlMutation,
} from "../Features/urls/urlApi";

import UserLayout from "./UserLayout";

import {
  getUrlStatusLabel,
  getStatusStyles,
  getActionLabel,
} from "../../utils/urlStatusLabel.js";

import { Copy, Trash2, BarChart2, Power } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { data: urls = [], isLoading, isError } = useGetMyUrlsQuery();

  const [updateUrl] = useUpdateUrlMutation();
  const [deleteUrl] = useDeleteUrlMutation();
  const [feedback, setFeedback] = useState(null);

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
      <div className="min-h-screen px-4 sm:px-6 py-10 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        {/* TOAST */}
        {feedback && (
          <div className="fixed bottom-6 right-6 z-50">
            <div
              className={`
              px-4 py-3 rounded-xl shadow-lg backdrop-blur 
              text-sm font-semibold
              ${
                feedback.type === "success"
                  ? "bg-green-600/90 text-white"
                  : "bg-red-600/90 text-white"
              }
            `}
            >
              {feedback.msg}
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-snug">
              My URLs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
              Manage and track all your shortened URLs
            </p>
          </div>

          <button
            onClick={() => navigate("/create")}
            className="
      w-full sm:w-auto
      bg-blue-600 hover:bg-blue-700
      text-white px-5 py-3 rounded-xl
      font-semibold shadow-md
      transition text-center
    "
          >
            + Create New Link
          </button>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white/70 dark:bg-gray-900/40 backdrop-blur rounded-2xl border shadow-xl">
          {/* LOADING */}
          {isLoading && (
            <p className="p-8 text-center text-gray-600 dark:text-gray-300">
              Loading your links…
            </p>
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                No URLs found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Create your first shortened URL to get started.
              </p>
            </div>
          )}

          {/* LIST */}
          {!isLoading && urls.length > 0 && (
            <div className="divide-y dark:divide-gray-800">
              {urls.map((url) => {
                const shortUrl = `${window.location.origin}/${url.shortCode}`;
                const label = getUrlStatusLabel(url);
                const badge = getStatusStyles(label);
                const extraLabel = getActionLabel(url);

                return (
                  <div
                    key={url._id}
                    className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition flex-1 min-w-0 text-left"
                  >
                    {/* MAIN FLEX */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* LEFT BLOCK */}
                      <div className="min-w-0 flex-1">
                        {/* SHORT URL */}
                        <p className="text-blue-600 dark:text-blue-400 text-sm sm:text-base font-semibold break-all">
                          {shortUrl}
                        </p>

                        {/* ORIGINAL */}
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                          {url.originalUrl}
                        </p>

                        {/* BADGES + CLICKS */}
                        <div className="flex flex-wrap gap-2 mt-3 items-center">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-xl ${badge}`}
                          >
                            {label}
                          </span>

                          {extraLabel && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {extraLabel}
                            </span>
                          )}

                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {url.clicks} clicks
                          </span>
                        </div>

                        {/* METADATA GRID (premium style like history page) */}
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          <Meta
                            label="Created"
                            value={new Date(url.createdAt).toLocaleString()}
                          />
                          <Meta
                            label="Expires"
                            value={
                              url.expiresAt
                                ? new Date(url.expiresAt).toLocaleString()
                                : "—"
                            }
                          />
                          <Meta
                            label="Deleted"
                            value={
                              url.deletedAt
                                ? new Date(url.deletedAt).toLocaleString()
                                : "—"
                            }
                          />
                          <Meta
                            label="Disabled"
                            value={
                              url.disabledAt
                                ? new Date(url.disabledAt).toLocaleString()
                                : "—"
                            }
                          />
                        </div>
                      </div>

                      {/* RIGHT ICONS */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* COPY */}
                        <IconBtn
                          onClick={() => handleCopy(shortUrl)}
                          color="blue"
                        >
                          <Copy size={19} />
                        </IconBtn>

                        {/* STATS */}
                        <IconBtn
                          onClick={() => navigate(`/urls/${url._id}/stats`)}
                          color="yellow"
                        >
                          <BarChart2 size={19} />
                        </IconBtn>

                        {/* TOGGLE */}
                        <IconBtn onClick={() => handleToggle(url)} color="red">
                          <Power size={19} />
                        </IconBtn>

                        {/* DELETE */}
                        <IconBtn
                          onClick={() => handleDelete(url._id)}
                          color="red"
                        >
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

export default UserDashboard;


const Meta = ({ label, value }) => (
  <div className="p-3 bg-gray-50/70 dark:bg-gray-800/30 border dark:border-gray-700 rounded-xl backdrop-blur">
    <p className="text-[11px] text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 break-all">
      {value}
    </p>
  </div>
);

const IconBtn = ({ children, onClick, color }) => {
  const colors = {
    blue: "hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    yellow:
      "hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    red: "hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-xl transition ${colors[color]}`}
    >
      {children}
    </button>
  );
};

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

import {
  Copy,
  Trash2,
  BarChart2,
  Power,
  X,
  ExternalLink,
  Plus,
  MousePointer2,
  Calendar,
  Clock,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data: urls = [], isLoading, isError } = useGetMyUrlsQuery();
  const [updateUrl] = useUpdateUrlMutation();
  const [deleteUrl] = useDeleteUrlMutation();

  const [feedback, setFeedback] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const f = "/";
  const toast = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleCopy = (s) => {
    navigator.clipboard.writeText(s);
    toast("Copied to clipboard", "success");
  };

  const handleToggle = async (url) => {
    try {
      await updateUrl({
        id: url._id,
        data: { isActive: !url.isActive },
      }).unwrap();
      toast(url.isActive ? "Link deactivated" : "Link activated", "success");
    } catch {
      toast("Action failed", "error");
    }
  };

  const handleDeleteRequest = (id) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = async () => {
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      await deleteUrl(id).unwrap();
      toast("Link removed forever", "success");
    } catch {
      toast("Delete operation failed", "error");
    }
  };

  return (
    <UserLayout>
      <div
        className={`min-h-screen px-4 md:px-8 py-10 transition-colors duration-500 ${isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"}`}
      >
        {/* ENHANCED TOAST NOTIFICATION */}
        {feedback && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 ${
                feedback.type === "success"
                  ? "bg-green-600/90 text-white"
                  : "bg-red-600/90 text-white"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span className="font-bold text-sm tracking-wide">
                {feedback.msg}
              </span>
            </div>
          </div>
        )}

        {/* NEW: DELETE CONFIRMATION MODAL */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div
              className={`w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border transition-all scale-in-center text-center ${
                isDark
                  ? "bg-[#0F0F0F] border-white/10 shadow-black"
                  : "bg-white border-gray-200 shadow-xl"
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
                  <ShieldAlert size={40} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">
                  Confirm Destruction
                </h3>
                <p
                  className={`text-sm font-medium mb-8 leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  This action is irreversible. The link and all associated
                  tracking data will be purged from our servers.
                </p>

                <div className="flex flex-col w-full gap-3">
                  <button
                    onClick={executeDelete}
                    className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-600/20"
                  >
                    Yes, Purge Link
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border ${
                      isDark
                        ? "border-white/10 text-white hover:bg-white/5"
                        : "border-gray-200 text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* URL DETAIL MODAL (Existing) */}
        {selectedUrl && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              className={`w-full max-w-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border transition-all scale-in-center ${
                isDark
                  ? "bg-[#0A0A0A] border-white/10 shadow-black"
                  : "bg-white border-gray-200 shadow-xl"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <LinkIcon size={20} />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">
                    Target Destination
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedUrl(null)}
                  className={`p-2 rounded-xl transition-colors ${isDark ? "hover:bg-white/10 text-gray-500" : "hover:bg-gray-100 text-gray-400"}`}
                >
                  <X size={24} />
                </button>
              </div>

              <div
                className={`p-6 rounded-3xl mb-8 break-all font-mono text-sm leading-relaxed border ${
                  isDark
                    ? "bg-black/40 border-white/5 text-gray-300"
                    : "bg-gray-50 border-gray-100 text-gray-700"
                }`}
              >
                {selectedUrl}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleCopy(selectedUrl)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  <Copy size={16} /> Copy Full Link
                </button>
                <a
                  href={selectedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex-1 border py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isDark
                      ? "border-white/10 text-white hover:bg-white/5"
                      : "border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  <ExternalLink size={16} /> Visit Page
                </a>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD HEADER */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4">
              Dashboard Overview
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-2">
              My{" "}
              <span className="bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Assets
              </span>
            </h1>
            <p
              className={`text-lg font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              {urls.length} links optimized and tracking.
            </p>
          </div>
          <button
            onClick={() => navigate("/create")}
            className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 transition-all active:scale-95"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform"
            />
            Create New Link
          </button>
        </div>

        {/* URL LIST CONTAINER */}
        <div
          className={`rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all ${
            isDark
              ? "bg-[#0A0A0A] border-white/10 shadow-black"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          {isLoading && (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-gray-500 animate-pulse">
                Loading Assets...
              </p>
            </div>
          )}

          {isError && (
            <div className="p-20 text-center text-red-500 font-black">
              <AlertCircle size={40} className="mx-auto mb-4 opacity-20" />
              Failed to sync with link engine.
            </div>
          )}

          {!isLoading && urls.length === 0 && (
            <div className="p-20 text-center">
              <LinkIcon size={48} className="mx-auto mb-6 text-gray-500/20" />
              <p className="text-xl font-bold text-gray-500">
                No links found yet.
              </p>
              <button
                onClick={() => navigate("/create")}
                className="mt-4 text-blue-500 font-black hover:underline underline-offset-8"
              >
                Start Shortening →
              </button>
            </div>
          )}

          {!isLoading && urls.length > 0 && (
            <div className="divide-y divide-white/5">
              {urls.map((url) => {
                const shortUrl = `${import.meta.env.VITE_B_LOCATION}/${url.shortCode}`;
                const statusLabel = getUrlStatusLabel(url);
                const badgeStyle = getStatusStyles(statusLabel);

                return (
                  <div
                    key={url._id}
                    className={`group p-6 md:p-8 transition-all ${isDark ? "hover:bg-white/2" : "hover:bg-blue-50/30"}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      {/* LINK INFO SECTION */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl font-black text-blue-500 hover:text-blue-400 transition-colors break-all"
                          >
                            {import.meta.env.VITE_B_LOCATION}
                            {f}
                            {url.shortCode}
                          </a>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                              isDark
                                ? "bg-white/5 border-white/10 text-gray-500"
                                : "bg-gray-100 border-gray-200 text-gray-400"
                            }`}
                          >
                            ID: {url._id.slice(-4)}
                          </span>
                        </div>

                        <p
                          onClick={() => setSelectedUrl(url.originalUrl)}
                          className={`flex items-center gap-2 text-sm font-medium transition-all cursor-pointer hover:translate-x-1 ${
                            isDark
                              ? "text-gray-500 hover:text-gray-300"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                        >
                          <ExternalLink size={14} />
                          <span className="truncate max-w-sm md:max-w-md">
                            {url.originalUrl}
                          </span>
                        </p>

                        {/* STATUS & CLICKS BADGES */}
                        <div className="flex flex-wrap gap-3 mt-5 items-center">
                          <StatusBadge
                            label={statusLabel}
                            style={badgeStyle}
                            isDark={isDark}
                          />
                          <div
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter ${
                              isDark
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            <MousePointer2 size={12} /> {url.clicks} Clicks
                          </div>
                          {getActionLabel(url) && (
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                              {getActionLabel(url)}
                            </span>
                          )}
                        </div>

                        {/* META DATA GRID */}
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <MetaBox
                            icon={<Calendar size={12} />}
                            label="Created"
                            value={new Date(url.createdAt).toLocaleDateString()}
                            isDark={isDark}
                          />
                          <MetaBox
                            icon={<Clock size={12} />}
                            label="Expires"
                            value={
                              url.expiresAt
                                ? new Date(url.expiresAt).toLocaleDateString()
                                : "Never"
                            }
                            isDark={isDark}
                          />
                          {url.deletedAt && (
                            <MetaBox
                              icon={<Trash2 size={12} />}
                              label="Deleted"
                              value={new Date(
                                url.deletedAt,
                              ).toLocaleDateString()}
                              isDark={isDark}
                              color="red"
                            />
                          )}
                          {url.disabledAt && (
                            <MetaBox
                              icon={<Power size={12} />}
                              label="Disabled"
                              value={new Date(
                                url.disabledAt,
                              ).toLocaleDateString()}
                              isDark={isDark}
                              color="yellow"
                            />
                          )}
                        </div>
                      </div>

                      {/* ACTION BUTTONS GROUP */}
                      <div className="flex items-center gap-3 self-end lg:self-center">
                        <ActionButton
                          onClick={() => handleCopy(shortUrl)}
                          icon={<Copy size={18} />}
                          label="Copy"
                          isDark={isDark}
                          color="blue"
                        />
                        <ActionButton
                          onClick={() => navigate(`/urls/${url._id}/stats`)}
                          icon={<BarChart2 size={18} />}
                          label="Stats"
                          isDark={isDark}
                          color="yellow"
                        />
                        <ActionButton
                          onClick={() => handleToggle(url)}
                          icon={<Power size={18} />}
                          label={url.isActive ? "Disable" : "Enable"}
                          isDark={isDark}
                          color={url.isActive ? "yellow" : "green"}
                        />
                        <ActionButton
                          onClick={() => handleDeleteRequest(url._id)} // CHANGED
                          icon={<Trash2 size={18} />}
                          label="Delete"
                          isDark={isDark}
                          color="red"
                        />
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
// --- HELPER COMPONENTS ---

const StatusBadge = ({ label, isDark }) => {
  const styles = {
    active: isDark
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : "bg-green-100 text-green-700 border-green-200",
    inactive: isDark
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      : "bg-yellow-100 text-yellow-700 border-yellow-200",
    deleted: isDark
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : "bg-red-100 text-red-700 border-red-200",
    expired: isDark
      ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
      : "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${styles[label.toLowerCase()] || styles.expired}`}
    >
      {label}
    </span>
  );
};

const MetaBox = ({ icon, label, value, isDark, color = "gray" }) => {
  const textColors = {
    gray: isDark ? "text-gray-400" : "text-gray-600",
    red: "text-red-500",
    yellow: "text-yellow-500",
  };

  return (
    <div
      className={`p-3 rounded-2xl border transition-colors ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100"}`}
    >
      <p
        className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
      >
        {icon} {label}
      </p>
      <p className={`text-xs font-bold truncate ${textColors[color]}`}>
        {value}
      </p>
    </div>
  );
};

const ActionButton = ({ icon, onClick, isDark, color, label }) => {
  const colors = {
    blue: "hover:bg-blue-500/10 hover:text-blue-500",
    indigo: "hover:bg-indigo-500/10 hover:text-indigo-500",
    green: "hover:bg-green-500/10 hover:text-green-500",
    yellow: "hover:bg-yellow-500/10 hover:text-yellow-500",
    red: "hover:bg-red-500/10 hover:text-red-500",
  };

  return (
    <div className="flex flex-col items-center gap-1 group/btn">
      <button
        onClick={onClick}
        className={`p-3 rounded-2xl border transition-all duration-300 active:scale-90 ${
          isDark
            ? "bg-white/5 border-white/5 text-gray-500"
            : "bg-white border-gray-200 text-gray-400 shadow-sm"
        } ${colors[color]}`}
      >
        {icon}
      </button>
      <span className="text-[9px] font-black uppercase tracking-tighter opacity-0 group-hover/btn:opacity-100 transition-opacity">
        {label}
      </span>
    </div>
  );
};

export default UserDashboard;

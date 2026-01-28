import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUrlMutation } from "../Features/urls/urlApi";
import { useTheme } from "../App/themeStore";
import UserLayout from "./UserLayout";
import {
  Link as LinkIcon,
  Type,
  Calendar,
  Zap,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const CreateUrl = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [expiryError, setExpiryError] = useState("");

  const navigate = useNavigate();
  const [createUrl, { isLoading, isError, error }] = useCreateUrlMutation();

  const today = new Date();
  const maxExpiry = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const formatDate = (date) => date.toISOString().split("T")[0];

  const shortPreview = customAlias
    ? `${import.meta.env.VITE_B_LOCATION}/${customAlias}`
    : `${import.meta.env.VITE_B_LOCATION}/auto-generated`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    let expiryToSend = null;

    if (expiresAt) {
      const selected = new Date(expiresAt);
      const diffDays = (selected - today) / (1000 * 3600 * 24);

      if (diffDays > 7) return setExpiryError("Expiry cannot exceed 7 days");
      if (diffDays < 0) return setExpiryError("Cannot choose past dates");

      expiryToSend = selected.toISOString();
    } else {
      const def = new Date();
      def.setDate(def.getDate() + 5);
      expiryToSend = def.toISOString();
    }

    try {
      await createUrl({
        originalUrl,
        customAlias: customAlias.trim() === "" ? undefined : customAlias.trim(),
        expiresAt: expiryToSend ?? undefined,
      }).unwrap();

      navigate("/");
    } catch (err) {}
  };

  return (
    <UserLayout>
      <div
        className={`min-h-screen py-12 px-4 transition-colors duration-500 ${isDark ? "bg-[#050505]" : "bg-gray-50"}`}
      >
        <main className="max-w-2xl mx-auto">
          {/* HEADER SECTION */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-black uppercase tracking-widest mb-4">
              <Sparkles size={14} /> New Link Engine
            </div>
            <h2
              className={`text-5xl font-black tracking-tight mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Create{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Short Link
              </span>
            </h2>
            <p
              className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Optimize your destination with custom aliases and expiration
              tracking.
            </p>
          </div>

          {/* MAIN FORM CARD */}
          <form
            onSubmit={handleSubmit}
            className={`relative overflow-hidden rounded-[2.5rem] border shadow-2xl p-8 md:p-10 transition-all ${
              isDark
                ? "bg-white/5 border-white/10 shadow-black"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="space-y-8 relative z-10">
              {/* ORIGINAL URL INPUT */}
              <div className="space-y-2">
                <label
                  className={`flex items-center gap-2 text-sm font-black uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  <LinkIcon size={16} className="text-blue-500" /> Destination
                  URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://very-long-destination.com/path"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className={`w-full px-5 py-4 rounded-2xl border font-medium transition-all outline-none ${
                    isDark
                      ? "bg-black/40 border-white/10 text-white focus:border-blue-500 focus:bg-black"
                      : "bg-gray-50 border-gray-200 focus:border-blue-400 focus:bg-white"
                  }`}
                />
              </div>

              {/* CUSTOM ALIAS INPUT */}
              <div className="space-y-2">
                <label
                  className={`flex items-center gap-2 text-sm font-black uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  <Type size={16} className="text-purple-500" /> Custom Alias
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="my-custom-path"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    className={`w-full px-5 py-4 rounded-2xl border font-medium transition-all outline-none ${
                      isDark
                        ? "bg-black/40 border-white/10 text-white focus:border-purple-500 focus:bg-black"
                        : "bg-gray-50 border-gray-200 focus:border-purple-400 focus:bg-white"
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 uppercase">
                    Optional
                  </div>
                </div>
              </div>

              {/* LIVE PREVIEW BOX */}
              <div
                className={`p-6 rounded-3xl border transition-all ${
                  isDark
                    ? "bg-blue-500/5 border-blue-500/20"
                    : "bg-blue-50 border-blue-100"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-blue-400/60" : "text-blue-500"}`}
                  >
                    Live Short Link Preview
                  </p>
                  <Zap size={14} className="text-yellow-500 animate-pulse" />
                </div>
                <p className="text-lg font-black text-blue-600 break-all">
                  {shortPreview}
                </p>
              </div>

              {/* EXPIRY DATE INPUT */}
              <div className="space-y-2">
                <label
                  className={`flex items-center gap-2 text-sm font-black uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  <Calendar size={16} className="text-pink-500" /> Link
                  Expiration
                </label>
                <input
                  type="date"
                  min={formatDate(today)}
                  max={formatDate(maxExpiry)}
                  value={expiresAt}
                  onChange={(e) => {
                    setExpiresAt(e.target.value);
                    setExpiryError("");
                  }}
                  className={`w-full px-5 py-4 rounded-2xl border font-medium transition-all outline-none 
    ${
      isDark
        ? "bg-black/40 border-white/10 text-white focus:border-pink-500 focus:bg-black"
        : "bg-gray-50 border-gray-200 focus:border-pink-400 focus:bg-white"
    } 
    /* This targets the calendar icon and turns it pink */
    [&::-webkit-calendar-picker-indicator]:invert-[44%] 
    [&::-webkit-calendar-picker-indicator]:sepia-[91%] 
    [&::-webkit-calendar-picker-indicator]:saturate-[1243%] 
    [&::-webkit-calendar-picker-indicator]:hue-rotate-[301deg] 
    [&::-webkit-calendar-picker-indicator]:brightness-[94%] 
    [&::-webkit-calendar-picker-indicator]:contrast-[92%] 
    cursor-pointer`}
                />
                <div className="flex justify-between items-center px-1">
                  <p
                    className={`text-[10px] font-bold ${isDark ? "text-gray-600" : "text-gray-400"}`}
                  >
                    DEFAULT: 5 DAYS • MAX: 7 DAYS
                  </p>
                  {expiryError && (
                    <p className="text-[10px] text-red-500 font-black uppercase flex items-center gap-1">
                      <AlertCircle size={10} /> {expiryError}
                    </p>
                  )}
                </div>
              </div>

              {/* ERROR STATE */}
              {isError && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500">
                  <AlertCircle size={18} />
                  <p className="text-sm font-bold">
                    {error?.data?.message || "Internal Service Error"}
                  </p>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black transition-all ${
                    isDark
                      ? "bg-white/5 text-white hover:bg-white/10"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ArrowLeft size={18} /> Discard
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-[2] flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Generate Short Link <Zap size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -left-24 -bottom-24 h-64 w-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -right-24 -top-24 h-64 w-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          </form>
        </main>
      </div>
    </UserLayout>
  );
};

export default CreateUrl;

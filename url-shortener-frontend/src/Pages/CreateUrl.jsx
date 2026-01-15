import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUrlMutation } from "../Features/urls/urlApi";
import { useTheme } from "../App/themeStore";
import UserLayout from "./UserLayout";

const CreateUrl = () => {
  const { theme } = useTheme();

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
    ? `${window.location.origin}/${customAlias}`
    : `${window.location.origin}/auto-generated`;

  const pageBg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const inputBg = theme === "light" ? "bg-gray-100" : "bg-gray-800";
  const inputText = theme === "light" ? "text-black" : "text-white";
  const muted = theme === "light" ? "text-gray-600" : "text-gray-400";
  const strongText = theme === "light" ? "text-black" : "text-white";

  const previewBg = theme === "light" ? "bg-gray-100" : "bg-gray-800";
  const previewBorder = theme === "light" ? "border-gray-300" : "border-gray-700";

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
        customAlias: customAlias || undefined,
        expiresAt: expiryToSend,
      }).unwrap();

      navigate("/");
    } catch {}
  };

  return (
    <UserLayout>
      <div className={`min-h-screen py-10 transition-colors duration-300 ${pageBg}`}>
        <main className="max-w-lg mx-auto px-4 sm:px-6">

          {/* HEADER */}
          <div className="text-center mb-10">
            <h2 className={`text-4xl font-extrabold tracking-tight ${strongText}`}>
              Create Short Link
            </h2>
            <p className={`mt-2 text-sm ${muted}`}>
              Convert long URLs into clean, trackable short links.
            </p>
          </div>

          {/* CARD */}
          <form
            onSubmit={handleSubmit}
            className={`rounded-2xl shadow-xl p-6 sm:p-7 border ${border} ${cardBg}`}
          >
            {/* ORIGINAL URL */}
            <div>
              <label className={`text-sm font-semibold mb-1 block ${strongText}`}>
                Original URL
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com/article"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className={`w-full px-4 py-3 text-sm rounded-xl border ${border} ${inputBg} ${inputText} outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* CUSTOM ALIAS */}
            <div>
              <label className={`text-sm font-semibold mb-1 block ${strongText}`}>
                Custom Alias <span className={muted}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="my-short-link"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className={`w-full px-4 py-3 text-sm rounded-xl border ${border} ${inputBg} ${inputText} outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <p className={`text-xs mt-1 ${muted}`}>
                Allowed: letters, numbers, hyphens only
              </p>
            </div>

            {/* PREVIEW */}
            <div className={`p-4 rounded-xl border ${previewBg} ${previewBorder}`}>
              <p className={`text-xs font-semibold ${muted}`}>Preview</p>
              <p className="text-sm font-semibold text-blue-600 break-all">
                {shortPreview}
              </p>
            </div>

            {/* EXPIRY */}
            <div>
              <label className={`text-sm font-semibold mb-1 block ${strongText}`}>
                Expiry Date <span className={muted}>(optional)</span>
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
                className={`w-full px-4 py-3 text-sm rounded-xl border ${border} ${inputBg} ${inputText} outline-none focus:ring-2 focus:ring-blue-500`}
              />

              {expiryError && (
                <p className="text-xs text-red-500 mt-1">{expiryError}</p>
              )}

              <p className={`text-xs mt-1 ${muted}`}>
                Default = 5 days • Maximum = 7 days
              </p>
            </div>

            {/* ERROR */}
            {isError && (
              <p className="text-sm text-red-500 font-medium">
                {error?.data?.message || "Failed to create link"}
              </p>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">

              {/* CANCEL */}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full sm:w-1/3 bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-3 rounded-xl transition"
              >
                Cancel
              </button>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl transition disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Link"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </UserLayout>
  );
};

export default CreateUrl;

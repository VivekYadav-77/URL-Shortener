import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUrlMutation } from "../Features/urls/urlApi";
import UserLayout from "./UserLayout";

const CreateUrl = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    let expiryToSend = null;

    if (expiresAt) {
      const selected = new Date(expiresAt);
      const diffDays = (selected - today) / (1000 * 3600 * 24);

      if (diffDays > 7) {
        setExpiryError("Expiry cannot exceed 7 days");
        return;
      }
      if (diffDays < 0) {
        setExpiryError("Cannot choose past dates");
        return;
      }
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
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-10">

        <main className="max-w-lg mx-auto px-4 sm:px-6">

          {/* HEADER */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Create Short Link
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Convert long URLs into clean, trackable short links.
            </p>
          </div>

          {/* FORM CARD */}
          <form
            onSubmit={handleSubmit}
            className="
              backdrop-blur-xl 
              bg-white/80 dark:bg-gray-800/60
              border border-gray-200 dark:border-gray-700
              shadow-xl rounded-2xl p-6 sm:p-7 space-y-6
            "
          >
            {/* ORIGINAL URL */}
            <div>
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 block">
                Original URL
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com/article"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="
                  w-full px-4 py-3 text-sm rounded-xl
                  bg-gray-50 dark:bg-gray-900
                  border dark:border-gray-700
                  text-gray-900 dark:text-gray-200
                  focus:ring-2 focus:ring-blue-500 outline-none
                "
              />
            </div>

            {/* CUSTOM ALIAS */}
            <div>
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 block">
                Custom Alias <span className="text-gray-400">(optional)</span>
              </label>

              <input
                type="text"
                placeholder="my-short-link"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="
                  w-full px-4 py-3 text-sm rounded-xl
                  bg-gray-50 dark:bg-gray-900
                  border dark:border-gray-700
                  text-gray-900 dark:text-gray-200
                  focus:ring-2 focus:ring-blue-500 outline-none
                "
              />

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Allowed: letters, numbers, hyphens only
              </p>
            </div>

            {/* PREVIEW */}
            <div className="bg-gray-100 dark:bg-gray-700/30 border dark:border-gray-600 rounded-xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                Preview
              </p>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 break-all">
                {shortPreview}
              </p>
            </div>

            {/* EXPIRY DATE */}
            <div>
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 block">
                Expiry Date <span className="text-gray-400">(optional)</span>
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
                className="
                  w-full px-4 py-3 text-sm rounded-xl
                  bg-gray-50 dark:bg-gray-900
                  border dark:border-gray-700
                  text-gray-900 dark:text-gray-200
                  focus:ring-2 focus:ring-blue-500 outline-none
                "
              />

              {expiryError && (
                <p className="text-xs text-red-500 mt-1">{expiryError}</p>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Default = 5 days • Maximum = 7 days
              </p>
            </div>

            {/* ERROR MESSAGE */}
            {isError && (
              <p className="text-sm text-red-500 dark:text-red-400 font-medium">
                {error?.data?.message || "Failed to create link"}
              </p>
            )}

            {/* ACTION BUTTONS (FIXED ALIGNMENT) */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">

              {/* CANCEL */}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="
                  w-full sm:w-1/3
                  bg-red-600 hover:bg-red-500
                  text-white font-semibold
                  px-4 py-3 rounded-xl
                  transition
                "
              >
                Cancel
              </button>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  w-full sm:flex-1
                  bg-blue-600 hover:bg-blue-700
                  text-white font-semibold
                  px-4 py-3 rounded-xl
                  transition disabled:opacity-50
                "
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

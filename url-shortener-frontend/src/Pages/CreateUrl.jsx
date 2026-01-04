import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useCreateUrlMutation } from "../Features/urls/urlApi";

const CreateUrl = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [expiryError, setExpiryError] = useState("");

  const navigate = useNavigate();
  const today = new Date();
  const maxExpiry = new Date();
  maxExpiry.setDate(today.getDate() + 7);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const [createUrl, { isLoading, isError, error }] = useCreateUrlMutation();

  const shortPreview = customAlias
    ? `${window.location.origin}/${customAlias}`
    : `${window.location.origin}/auto-generated`;

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!originalUrl) return;

  let expiryToSend = null;

  if (expiresAt) {
    const selected = new Date(expiresAt);
    const diffDays =
      (selected - today) / (1000 * 60 * 60 * 24);

    if (diffDays > 7) {
      setExpiryError("Expiry cannot be more than 7 days");
      return;
    }

    if (diffDays < 0) {
      setExpiryError("Expiry date cannot be in the past");
      return;
    }

    expiryToSend = selected.toISOString();
  } else {
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 5);
    expiryToSend = defaultExpiry.toISOString();
  }


    try {
      await createUrl({
        originalUrl,
        customAlias: customAlias || undefined,
        expiresAt: expiryToSend,
      }).unwrap();
      navigate("/");
    } catch {
      // error handled by RTK Query
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* HEADER */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-[#1E293B]">
            Create a short link
          </h2>
          <p className="text-slate-500 mt-2">
            Shorten long URLs and track their performance
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          className="
            bg-white rounded-xl border
            p-8 space-y-6
          "
        >
          {/* ORIGINAL URL */}
          <div>
            <label className="block text-sm font-bold text-[#1E293B] mb-1">
              Original URL
            </label>
            <input
              type="url"
              className="
                w-full border rounded-lg px-4 py-2.5
                focus:outline-none focus:ring-2 focus:ring-[#2563EB]
              "
              placeholder="https://example.com/article"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
            <p className="text-xs font-extrabold text-slate-500 mt-1">
              Enter the full URL you want to shorten
            </p>
          </div>

          {/* CUSTOM ALIAS */}
          <div>
            <label className="block text-sm font-bold text-[#1E293B] mb-1">
              Custom alias <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              className="
                w-full border rounded-lg px-4 py-2.5
                focus:outline-none focus:ring-2 focus:ring-[#2563EB]
              "
              placeholder="my-awesome-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
            <p className="text-xs font-extrabold text-slate-500 mt-1">
              Use letters, numbers, hyphens only
            </p>
          </div>

          {/* PREVIEW */}
          <div className="bg-slate-50 border rounded-lg p-4">
            <p className="text-xs font-bold text-slate-500 mb-1">Short URL preview</p>
            <p className="text-sm font-medium text-[#2563EB] break-all">
              {shortPreview}
            </p>
          </div>
          {/* EXPIRY DATE */}
          <div>
            <label className="block text-sm font-bold text-[#1E293B] mb-1">
              Expiry date <span className="text-slate-400">(optional)</span>
            </label>

            <input
              type="date"
              className="
      w-full border rounded-lg px-4 py-2.5
      focus:outline-none focus:ring-2 focus:ring-[#2563EB]
    "
              min={formatDate(today)}
              max={formatDate(maxExpiry)}
              value={expiresAt}
              onChange={(e) => {
                setExpiresAt(e.target.value);
                setExpiryError("");
              }}
            />

            <p className="text-xs font-extrabold text-slate-500 mt-1">
              **Maximum expiry allowed is 7 days. If not set, link expires
              automatically in 5 days**.
            </p>

            {expiryError && (
              <p className="text-xs text-red-600 mt-1">{expiryError}</p>
            )}
          </div>

          {/* ERROR */}
          {isError && (
            <p className="text-red-600 text-sm">
              {error?.data?.message || "Failed to create URL"}
            </p>
          )}

          {/* ACTIONS */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className=" bg-[#eb2525] text-white
                px-6 py-2.5 rounded-lg
                hover:bg-red-400 transition
                disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="
                bg-[#2563EB] text-white
                px-6 py-2.5 rounded-lg
                hover:bg-blue-700 transition
                disabled:opacity-50
              "
            >
              {isLoading ? "Creating..." : "Create short link"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateUrl;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useCreateUrlMutation } from "../Features/urls/urlApi";

const CreateUrl = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");

  const navigate = useNavigate();

  const [createUrl, { isLoading, isError, error }] =
    useCreateUrlMutation();

  const shortPreview =
    customAlias
      ? `${window.location.origin}/${customAlias}`
      : `${window.location.origin}/auto-generated`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl) return;

    try {
      await createUrl({
        originalUrl,
        customAlias: customAlias || undefined,
      }).unwrap();
      navigate("/");
    } catch {
      // handled below
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
            <label className="block text-sm font-medium text-[#1E293B] mb-1">
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
            <p className="text-xs text-slate-500 mt-1">
              Enter the full URL you want to shorten
            </p>
          </div>

          {/* CUSTOM ALIAS */}
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-1">
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
            <p className="text-xs text-slate-500 mt-1">
              Use letters, numbers, hyphens only
            </p>
          </div>

          {/* PREVIEW */}
          <div className="bg-slate-50 border rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">
              Short URL preview
            </p>
            <p className="text-sm font-medium text-[#2563EB] break-all">
              {shortPreview}
            </p>
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

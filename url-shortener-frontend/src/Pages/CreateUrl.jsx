import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useCreateUrlMutation } from "../Features/urls/urlApi";

const CreateUrl = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");

  const navigate = useNavigate();

  const [
    createUrl,
    { isLoading, isError, error }
  ] = useCreateUrlMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalUrl) return;

    try {
      await createUrl({
        originalUrl,
        customAlias: customAlias || undefined
      }).unwrap();

      navigate("/");
    } catch {
      // error handled below
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">
          Create Short URL
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow"
        >
          {/* ORIGINAL URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Original URL
            </label>
            <input
              type="url"
              className="w-full border rounded px-3 py-2"
              placeholder="https://example.com"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
          </div>

          {/* CUSTOM ALIAS */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Custom Alias (optional)
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="my-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>

          {/* ERROR */}
          {isError && (
            <p className="text-red-600 text-sm mb-4">
              {error?.data?.message || "Failed to create URL"}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateUrl;

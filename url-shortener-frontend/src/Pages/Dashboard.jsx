import Navbar from "../components/layout/Navbar";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetMyUrlsQuery,
  useUpdateUrlMutation,
  useDeleteUrlMutation,
} from "../Features/urls/urlApi";
import UrlList from "./UrlList";

const UserDashboard = () => {
  const navigate = useNavigate();

  const { data: urls = [], isLoading, isError } = useGetMyUrlsQuery();

  const [updateUrl] = useUpdateUrlMutation();
  const [deleteUrl] = useDeleteUrlMutation();
  // TOP of component
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleToggle = async(url) => {
    try {
      await updateUrl({
        id: url._id,
        data: { isActive: !url.isActive },
      }).unwrap();

      showFeedback(
        url.isActive ? "URL disabled" : "URL enabled"
      );
    } catch {
      showFeedback("Failed to update URL", "error");
    }
  };

  const handleDelete = async(id) => {
    if (!confirm("Delete this URL?")) return;

    try {
      await deleteUrl(id).unwrap();
      showFeedback("URL deleted");
    } catch {
      showFeedback("Delete failed", "error");
    }
  };
  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    showFeedback("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      {feedback && (
        <div
          className={`
            fixed top-5 right-5 z-50
            px-4 py-3 rounded-lg shadow-lg text-sm font-semibold
            transition-all
            ${
              feedback.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }
          `}
        >
          {feedback.message}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#1E293B]">My URLs</h2>
            <p className="text-sm text-slate-500 mt-1">
              Create, manage and track your shortened links
            </p>
          </div>

          <button
            onClick={() => navigate("/create")}
            className="
              inline-flex items-center justify-center
              bg-[#2563EB] text-white
              px-5 py-2.5 rounded-lg
              hover:bg-blue-700 transition
              shadow-sm
            "
          >
            + Create URL
          </button>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="bg-white border rounded-xl p-6">
            Loading your URLs…
          </div>
        )}

        {/* ERROR */}
        {isError && !isLoading && (
          <div className="bg-white border rounded-xl p-6 text-red-600">
            Failed to load your URLs. Please try again.
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && urls.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border">
            <p className="text-lg font-medium text-[#1E293B]">
              You haven’t created any URLs yet
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Shorten your first link and start tracking clicks
            </p>

            <button
              onClick={() => navigate("/create")}
              className="
                mt-6 bg-[#2563EB] text-white
                px-6 py-2.5 rounded-lg
                hover:bg-blue-700 transition
              "
            >
              Create your first URL
            </button>
          </div>
        )}
        
        {/* LIST */}
        {!isLoading && urls.length > 0 && (
          <UrlList
            urls={urls}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onCopy={handleCopy}
          />
        )}
      </main>
    </div>
  );
};

export default UserDashboard;

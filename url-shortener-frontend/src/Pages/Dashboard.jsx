import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetMyUrlsQuery,
  useUpdateUrlMutation,
  useDeleteUrlMutation,
} from "../Features/urls/urlApi";
import UrlList from "./UrlList";
import UserLayout from "./UserLayout";

const UserDashboard = () => {
  const navigate = useNavigate();

  const { data: urls = [], isLoading, isError } = useGetMyUrlsQuery();

  const [updateUrl] = useUpdateUrlMutation();
  const [deleteUrl] = useDeleteUrlMutation();

  const [feedback, setFeedback] = useState(null);

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleToggle = async (url) => {
    try {
      await updateUrl({
        id: url._id,
        data: { isActive: !url.isActive },
      }).unwrap();
      showFeedback(url.isActive ? "URL disabled" : "URL enabled");
    } catch {
      showFeedback("Failed to update", "error");
    }
  };

  const handleDelete = async (id) => {
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
    showFeedback("Copied!");
  };

  return (
    <UserLayout>
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg text-sm text-white
            ${feedback.type === "success" ? "bg-green-600" : "bg-red-600"}
            `}
          >
            {feedback.message}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              My URLs
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage your shortened links
            </p>
          </div>

          <button
            onClick={() => navigate("/create")}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg
            hover:bg-blue-700 active:scale-95 transition"
          >
            + Create URL
          </button>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
            Loading…
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 text-red-600">
            Failed to load URLs.
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && urls.length === 0 && (
          <div className="bg-white dark:bg-gray-800 p-10 text-center rounded-xl border dark:border-gray-700">
            <p className="text-lg font-semibold dark:text-white">No URLs yet.</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Shorten your first link
            </p>

            <button
              onClick={() => navigate("/create")}
              className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700"
            >
              Create URL
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
      </div>
    </UserLayout>
  );
};

export default UserDashboard;

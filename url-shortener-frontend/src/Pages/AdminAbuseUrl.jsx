import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import {
  useGetAbuseUrlsQuery,
  useAdminDisableUrlMutation,
  useAdminDeleteUrlMutation,
} from "../Features/admin/adminApi.js"

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-200 text-gray-700",
  expired: "bg-yellow-100 text-yellow-700",
  deleted: "bg-red-100 text-red-700",
};

const AdminAbuseUrls = () => {
  const { data: urls = [], isLoading } = useGetAbuseUrlsQuery();

  const [disableUrl] = useAdminDisableUrlMutation();
  const [deleteUrl] = useAdminDeleteUrlMutation();

  const [feedback, setFeedback] = useState(null);

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleAction = async (fn, id, msg) => {
    try {
      await fn(id).unwrap();
      showFeedback(msg);
    } catch {
      showFeedback("Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-[#1E293B] mb-6">
          Abuse Detection & Monitoring
        </h2>

        {/* FEEDBACK */}
        {feedback && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg font-semibold text-sm ${
              feedback.type === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="bg-white border rounded-xl p-4 shadow-sm overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : urls.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              No abusive URLs detected
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Short URL</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">Abuse Score</th>
                  <th className="p-3">Last Abuse</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {urls.map((url) => (
                  <tr key={url._id} className="border-b">
                    <td className="p-3 font-medium text-blue-600">
                      {window.location.origin}/{url.shortCode}
                    </td>

                    <td className="p-3 text-sm">{url.owner?.email}</td>

                    <td className="p-3">{url.clicks}</td>

                    <td className="p-3 font-bold text-red-600">
                      {url.abuseScore}
                    </td>

                    <td className="p-3 text-sm text-slate-600">
                      {url.lastAbuseAt
                        ? new Date(url.lastAbuseAt).toLocaleString()
                        : "—"}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[url.status]
                        }`}
                      >
                        {url.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3 space-x-2">
                      <button
                        onClick={() =>
                          handleAction(disableUrl, url._id, "URL disabled")
                        }
                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
                      >
                        Disable
                      </button>

                      <button
                        onClick={() =>
                          handleAction(deleteUrl, url._id, "URL deleted")
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAbuseUrls;

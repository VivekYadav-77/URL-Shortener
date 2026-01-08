import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import {
  useGetAllAdminUrlsQuery,
  useAdminEnableUrlMutation,
  useAdminDisableUrlMutation,
  useAdminDeleteUrlMutation,
} from "../Features/admin/adminApi.js"

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-200 text-gray-700",
  expired: "bg-yellow-100 text-yellow-700",
  deleted: "bg-red-100 text-red-700",
};

const AdminUrls = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data: urls = [], isLoading } = useGetAllAdminUrlsQuery({
    status: statusFilter || undefined,
    page,
    limit: 20,
  });

  const [enableUrl] = useAdminEnableUrlMutation();
  const [disableUrl] = useAdminDisableUrlMutation();
  const [deleteUrl] = useAdminDeleteUrlMutation();

  const [feedback, setFeedback] = useState(null);

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleAction = async (actionFn, id, message) => {
    try {
      await actionFn(id).unwrap();
      showFeedback(message);
    } catch {
      showFeedback("Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#1E293B]">Manage URLs</h2>

          <select
            className="border px-3 py-2 rounded-lg bg-white"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All URLs</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>

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

        {/* TABLE */}
        <div className="bg-white border rounded-xl p-4 overflow-x-auto shadow-sm">
          {isLoading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : urls.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No URLs found</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Short</th>
                  <th className="p-3">Original</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Clicks</th>
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

                    <td className="p-3 truncate max-w-xs">
                      <span className="text-sm text-slate-600">
                        {url.originalUrl}
                      </span>
                    </td>

                    <td className="p-3 text-sm text-slate-700">
                      {url.owner?.email}
                    </td>

                    <td className="p-3 font-semibold">{url.clicks}</td>

                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[url.status]}`}>
                        {url.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3 space-x-2">
                      {/* ENABLE */}
                      {url.status !== "active" && (
                        <button
                          onClick={() =>
                            handleAction(
                              enableUrl,
                              url._id,
                              "URL enabled"
                            )
                          }
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Enable
                        </button>
                      )}

                      {/* DISABLE */}
                      {url.status === "active" && (
                        <button
                          onClick={() =>
                            handleAction(
                              disableUrl,
                              url._id,
                              "URL disabled"
                            )
                          }
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Disable
                        </button>
                      )}
                     

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          handleAction(
                            deleteUrl,
                            url._id,
                            "URL deleted"
                          )
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

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-slate-200 rounded"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminUrls;

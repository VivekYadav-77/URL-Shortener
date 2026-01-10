import { useState } from "react";
import {
  useGetAllAdminUrlsQuery,
  useAdminEnableUrlMutation,
  useAdminDisableUrlMutation,
  useAdminDeleteUrlMutation,
} from "../Features/admin/adminApi.js";

import AdminLayout from "./AdminLayout";

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Expired", value: "expired" },
  { label: "Deleted", value: "deleted" },
];

const AdminURLsPage = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data: urls = [], isLoading } = useGetAllAdminUrlsQuery({
    status: statusFilter,
    page,
    limit: 15,
  });

  const [enableUrl] = useAdminEnableUrlMutation();
  const [disableUrl] = useAdminDisableUrlMutation();
  const [deleteUrl] = useAdminDeleteUrlMutation();

  const handleEnable = async (id) => {
    await enableUrl(id);
  };

  const handleDisable = async (id) => {
    await disableUrl(id);
  };

  const handleDelete = async (id) => {
    if (confirm("You are deleting this URL permanently. Continue?")) {
      await deleteUrl(id);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        All URLs
      </h2>

      {/* FILTERS + SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          className="
            px-4 py-2 rounded-lg border dark:border-gray-700
            bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200
          "
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search by short code..."
          onChange={() => {}}
          className="
            px-4 py-2 rounded-lg border dark:border-gray-700 w-full md:w-72
            bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200
          "
        />
      </div>

      {/* URL TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-x-auto">
        <table className="w-full min-w-225">

          <thead className="bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-200">
            <tr>
              <th className="p-3 text-left">Short URL</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Clicks</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Owner</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  <span className="text-slate-600 dark:text-gray-300">
                    Loading URLs…
                  </span>
                </td>
              </tr>
            ) : urls.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  <span className="text-slate-600 dark:text-gray-300">
                    No URLs found.
                  </span>
                </td>
              </tr>
            ) : (
              urls.map((url) => (
                <tr
                  key={url._id}
                  className="
                    border-t dark:border-gray-700 
                    hover:bg-blue-50 dark:hover:bg-gray-700/40 transition
                  "
                >
                  <td className="p-3 text-blue-600 dark:text-blue-400 break-all">
                    {window.location.origin}/{url.shortCode}
                  </td>

                  <td className="p-3">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          url.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : url.status === "inactive"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                            : url.status === "deleted"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                            : "bg-slate-200 text-slate-700 dark:bg-gray-700 dark:text-gray-300"
                        }
                      `}
                    >
                      {url.status}
                    </span>
                  </td>

                  <td className="p-3">{url.clicks}</td>

                  <td className="p-3 text-sm text-slate-500 dark:text-gray-400">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 text-sm text-slate-500 dark:text-gray-400">
                    {url.owner?.email}
                  </td>

                  <td className="p-3 space-x-3">

                    {url.status === "inactive" && (
                      <button
                        onClick={() => handleEnable(url._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Enable
                      </button>
                    )}

                    {url.status === "active" && (
                      <button
                        onClick={() => handleDisable(url._id)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Disable
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(url._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-gray-700 text-sm"
        >
          Previous
        </button>

        <span className="text-slate-700 dark:text-gray-300 font-semibold">
          Page {page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-gray-700 text-sm"
        >
          Next
        </button>
      </div>

    </AdminLayout>
  );
};

export default AdminURLsPage;

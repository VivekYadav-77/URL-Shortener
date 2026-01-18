import { useState } from "react";
import {
  useGetAllAdminUrlsQuery,
  useAdminEnableUrlMutation,
  useAdminDisableUrlMutation,
  useAdminDeleteUrlMutation,
} from "../Features/admin/adminApi.js";

import AdminLayout from "./AdminLayout";
import { useTheme } from "../App/themeStore";
import {ArrowRight, ArrowLeft} from 'lucide-react'
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

  const { theme } = useTheme();

  const pageBg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const cardBorder = theme === "light" ? "border-gray-300" : "border-gray-700";
  const textMuted = theme === "light" ? "text-gray-600" : "text-gray-400";
  const tableHeadBg = theme === "light" ? "bg-gray-100" : "bg-gray-800";
  const rowHover = theme === "light" ? "hover:bg-blue-50" : "hover:bg-gray-700";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const text = theme==="light"?"text-black":"text-white"

  const { data: urls = [], isLoading } = useGetAllAdminUrlsQuery({
    status: statusFilter,
    page,
    limit: 15,
  });

  const [enableUrl] = useAdminEnableUrlMutation();
  const [disableUrl] = useAdminDisableUrlMutation();
  const [deleteUrl] = useAdminDeleteUrlMutation();

  const handleEnable = async (id) => await enableUrl(id);
  const handleDisable = async (id) => await disableUrl(id);
  const handleDelete = async (id) => {
    if (confirm("You are deleting this URL permanently. Continue?")) {
      await deleteUrl(id);
    }
  };

  return (
    <AdminLayout>
      <div className={`min-h-screen ${pageBg} transition-colors`}>

        <h2 className="text-3xl font-bold mb-6">All URLs</h2>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ">

          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className={`px-4 py-2 rounded-lg border ${cardBorder} ${cardBg}`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by short code..."
            className={`px-4 py-2 rounded-lg border ${cardBorder} w-full md:w-72 ${cardBg} ${text}`}
            onChange={() => {}}
          />
        </div>

        {/* 100% FIXED → ONLY TABLE SCROLLS */}
        <div className={`rounded-xl border ${cardBorder} ${cardBg}`}>
          <div className="overflow-x-auto w-full">
            <table className="min-w-[950px] w-full">

              <thead className={tableHeadBg}>
                <tr className="text-left">
                  {["Short URL", "Status", "Clicks", "Created", "Owner", "Actions"].map((h) => (
                    <th key={h} className="p-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center">
                      <span className={textMuted}>Loading URLs…</span>
                    </td>
                  </tr>
                ) : urls.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center">
                      <span className={textMuted}>No URLs found.</span>
                    </td>
                  </tr>
                ) : (
                  urls.map((url) => (
                    <tr
                      key={url._id}
                      className={`border-t ${cardBorder} transition ${rowHover}`}
                    >
                      <td className="p-3 text-blue-600 break-all">
                        {window.location.origin}/{url.shortCode}
                      </td>

                      <td className="p-3">
                        <StatusBadge status={url.status} theme={theme} />
                      </td>

                      <td className="p-3">{url.clicks}</td>

                      <td className={`p-3 text-sm ${textMuted}`}>
                        {new Date(url.createdAt).toLocaleDateString()}
                      </td>

                      <td className={`p-3 text-sm ${textMuted}`}>
                        {url.owner?.email}
                      </td>

                      <td className="p-3 flex gap-2">

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
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-4 py-2 rounded-lg ${pageBg} border ${border} `}
          >
            <ArrowLeft size={18}/>
          </button>

          <span className="font-semibold">Page {page}</span>

          <button
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded-lg ${pageBg} border ${border} `}
          >
            <ArrowRight size={18}/>
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminURLsPage;



const StatusBadge = ({ status, theme }) => {
  const bg = {
    active:
      theme === "light"
        ? "bg-green-100 text-green-700"
        : "bg-green-900/40 text-green-300",

    inactive:
      theme === "light"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-yellow-900/40 text-yellow-300",

    deleted:
      theme === "light"
        ? "bg-red-100 text-red-700"
        : "bg-red-900/40 text-red-300",

    expired:
      theme === "light"
        ? "bg-gray-200 text-gray-700"
        : "bg-gray-800 text-gray-300",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bg[status]}`}>
      {status}
    </span>
  );
};

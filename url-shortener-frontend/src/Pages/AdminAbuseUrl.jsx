import { useState } from "react";
import {
  useGetAbuseUrlsQuery,
  useAdminDisableUrlMutation,
  useAdminDeleteUrlMutation,
} from "../Features/admin/adminApi.js";
import AdminLayout from "./AdminLayout";

const severityTabs = [
  { label: "All", value: "" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export default function AdminAbuseUrlsPage() {
  const [severity, setSeverity] = useState("");
  const [search, setSearch] = useState("");

  const { data: urls = [], isLoading } = useGetAbuseUrlsQuery();
  const [disableUrl] = useAdminDisableUrlMutation();
  const [deleteUrl] = useAdminDeleteUrlMutation();

  // Filter processing
  const filteredUrls = urls.filter((url) => {
    const s = url.abuseScore;

    if (severity === "low" && s <= 3) return true;
    if (severity === "medium" && s > 3 && s <= 10) return true;
    if (severity === "high" && s > 10) return true;
    if (!severity) return true;

    return false;
  });

  const searchedUrls = filteredUrls.filter(
    (u) =>
      u.shortCode.includes(search) ||
      u.originalUrl.toLowerCase().includes(search.toLowerCase())
  );

  const getSeverityBadge = (score) => {
    if (score > 10)
      return "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300";
    if (score > 3)
      return "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300";
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Abuse-Flagged URLs
        </h2>
        <p className="text-slate-600 dark:text-gray-300 mt-1">
          These URLs have unusual traffic patterns or suspected abuse.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {severityTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSeverity(tab.value)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-semibold border transition
              ${
                severity === tab.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700"
              }
            `}
          >
            {tab.label}
          </button>
        ))}

        <input
          type="text"
          placeholder="Search flagged urls…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-x-auto">
        {isLoading ? (
          <div className="p-6 text-center text-slate-600 dark:text-gray-300">
            Loading flagged URLs…
          </div>
        ) : searchedUrls.length === 0 ? (
          <div className="p-6 text-center text-slate-600 dark:text-gray-300">
            No abuse-flagged URLs found.
          </div>
        ) : (
          <table className="w-full min-w-225">
            <thead className="bg-slate-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left">Short</th>
                <th className="p-3 text-left">Original</th>
                <th className="p-3">Score</th>
                <th className="p-3">Last Abuse</th>
                <th className="p-3">Clicks</th>
                <th className="p-3">Owner</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {searchedUrls.map((url) => (
                <tr
                  key={url._id}
                  className="border-t dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700/50"
                >
                  <td className="p-3 text-blue-600 dark:text-blue-400 break-all">
                    {window.location.origin}/{url.shortCode}
                  </td>

                  <td className="p-3 break-all text-slate-700 dark:text-gray-300">
                    {url.originalUrl}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityBadge(
                        url.abuseScore
                      )}`}
                    >
                      {url.abuseScore}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    {url.lastAbuseAt
                      ? new Date(url.lastAbuseAt).toLocaleString()
                      : "---"}
                  </td>

                  <td className="p-3 text-center">{url.clicks}</td>

                  <td className="p-3 text-center">
                    {url.owner?.email || "---"}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => disableUrl(url._id)}
                      className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-500"
                    >
                      Disable
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Delete this suspicious URL?"))
                          deleteUrl(url._id);
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
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
    </AdminLayout>
  );
}

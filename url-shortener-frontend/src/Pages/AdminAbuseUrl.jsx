import { useState } from "react";
import {
  useGetAbuseUrlsQuery,
  useAdminDisableUrlMutation,
  useAdminDeleteUrlMutation,
} from "../Features/admin/adminApi.js";

import AdminLayout from "./AdminLayout";
import { useTheme } from "../App/themeStore";

const severityTabs = [
  { label: "All", value: "" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export default function AdminAbuseUrlsPage() {
  const [severity, setSeverity] = useState("");
  const [search, setSearch] = useState("");

  const { theme } = useTheme();

  const pageBg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const borderColor = theme === "light" ? "border-gray-300" : "border-gray-700";
  const textMuted = theme === "light" ? "text-gray-600" : "text-gray-400";
  const tableHeadBg = theme === "light" ? "bg-gray-100" : "bg-gray-800";
  const inputBg = theme === "light" ? "bg-white" : "bg-gray-800";
  const inputText = theme === "light" ? "text-black" : "text-white";
  const placeholderText = theme === "light" ? "text-gray-500" : "text-gray-400";
  const rowHover = theme === "light" ? "hover:bg-blue-50" : "hover:bg-gray-700";

  const { data: urls = [], isLoading } = useGetAbuseUrlsQuery();
  const [disableUrl] = useAdminDisableUrlMutation();
  const [deleteUrl] = useAdminDeleteUrlMutation();

  // Filter processing
  const filteredUrls = urls.filter((url) => {
    const s = url.abuseScore;

    if (severity === "low" && s <= 3) return true;
    if (severity === "medium" && s > 3 && s <= 10) return true;
    if (severity === "high" && s > 10) return true;

    return severity === "" ? true : false;
  });

  const searchedUrls = filteredUrls.filter(
    (u) =>
      u.shortCode.includes(search) ||
      u.originalUrl.toLowerCase().includes(search.toLowerCase())
  );

  const getSeverityBadge = (score) => {
    if (score > 10)
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    if (score > 3)
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
  };

  return (
    <AdminLayout>
      <div className={`min-h-screen ${pageBg} transition-colors duration-300`}>

        <div className="mb-8">
          <h2 className="text-3xl font-bold">Abuse-Flagged URLs</h2>
          <p className={`mt-1 ${textMuted}`}>
            These URLs have unusual traffic patterns or suspected abuse.
          </p>
        </div>

        {/* FILTER TABS */}
        <div className="flex flex-wrap items-center gap-3 mb-6">

          {severityTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSeverity(tab.value)}
              className={`
                px-4 py-2 rounded-full text-sm font-semibold border transition
                ${
                  severity === tab.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : `${cardBg} ${borderColor} ${textMuted} hover:bg-gray-200 dark:hover:bg-gray-700`
                }
              `}
            >
              {tab.label}
            </button>
          ))}

          {/* SEARCH BAR */}
          <input
            type="text"
            placeholder="Search flagged urls…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`
              ml-auto px-4 py-2 rounded-lg border ${borderColor}
              ${inputBg} ${inputText}
              placeholder:${placeholderText}
              outline-none w-full sm:w-72
            `}
          />
        </div>

        {/* TABLE CARD */}
        <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-x-auto`}>
          {isLoading ? (
            <div className="p-6 text-center">
              <span className={textMuted}>Loading flagged URLs…</span>
            </div>
          ) : searchedUrls.length === 0 ? (
            <div className="p-6 text-center">
              <span className={textMuted}>No abuse-flagged URLs found.</span>
            </div>
          ) : (
            <table className="w-full min-w-225">
              <thead className={tableHeadBg}>
                <tr>
                  <th className="p-3 text-left font-semibold">Short</th>
                  <th className="p-3 text-left font-semibold">Original</th>
                  <th className="p-3 text-center font-semibold">Score</th>
                  <th className="p-3 text-center font-semibold">Last Abuse</th>
                  <th className="p-3 text-center font-semibold">Clicks</th>
                  <th className="p-3 text-center font-semibold">Owner</th>
                  <th className="p-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {searchedUrls.map((url) => (
                  <tr
                    key={url._id}
                    className={`border-t ${borderColor} ${rowHover}`}
                  >
                    <td className="p-3 text-blue-600 dark:text-blue-400 break-all">
                      {window.location.origin}/{url.shortCode}
                    </td>

                    <td className={`p-3 break-all ${textMuted}`}>
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

                    <td className="p-3 text-center text-sm">
                      {url.lastAbuseAt
                        ? new Date(url.lastAbuseAt).toLocaleString()
                        : "---"}
                    </td>

                    <td className="p-3 text-center">{url.clicks}</td>

                    <td className="p-3 text-center text-sm">
                      {url.owner?.email || "---"}
                    </td>

                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={() => disableUrl(url._id)}
                        className="
                          px-3 py-1 bg-yellow-600 text-white rounded
                          hover:bg-yellow-500
                        "
                      >
                        Disable
                      </button>

                      <button
                        onClick={() => {
                          if (confirm("Delete this suspicious URL?"))
                            deleteUrl(url._id);
                        }}
                        className="
                          px-3 py-1 bg-red-600 text-white rounded
                          hover:bg-red-500
                        "
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

      </div>
    </AdminLayout>
  );
}

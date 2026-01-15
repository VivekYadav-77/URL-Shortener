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

  // Filtering logic
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

  // Theme-consistent severity colors
  const getSeverityBadge = (score) => {
    if (score > 10)
      return "background-color:#fee2e2; color:#991b1b; border-color:#fecaca;";
    if (score > 3)
      return "background-color:#fef9c3; color:#854d0e; border-color:#fde68a;";
    return "background-color:#dbeafe; color:#1e3a8a; border-color:#bfdbfe;";
  };

  return (
    <AdminLayout>

      {/* HEADER */}
      <div className="mb-8">
        <h2
          style={{ color: "var(--text-header)" }}
          className="text-3xl font-bold"
        >
          Abuse-Flagged URLs
        </h2>
        <p style={{ color: "var(--text-body)" }} className="mt-1">
          URLs with suspicious patterns or abuse detection.
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-3 mb-6">

        {severityTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSeverity(tab.value)}
            className="px-3 py-1.5 rounded-full text-sm font-semibold border transition"
            style={{
              backgroundColor:
                severity === tab.value ? "var(--accent-blue)" : "var(--bg-card)",
              color:
                severity === tab.value ? "white" : "var(--text-body)",
              borderColor:
                severity === tab.value
                  ? "var(--accent-blue)"
                  : "var(--border-main)",
            }}
          >
            {tab.label}
          </button>
        ))}

        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search flagged URLs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto px-4 py-2 rounded-lg border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-main)",
            color: "var(--text-body)",
          }}
        />
      </div>

      {/* TABLE WRAPPER */}
      <div
        className="rounded-xl overflow-x-auto border"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-main)",
        }}
      >
        {isLoading ? (
          <div className="p-6 text-center" style={{ color: "var(--text-body)" }}>
            Loading flagged URLs…
          </div>
        ) : searchedUrls.length === 0 ? (
          <div className="p-6 text-center" style={{ color: "var(--text-body)" }}>
            No abuse-flagged URLs found.
          </div>
        ) : (
          <table className="w-full min-w-225">
            <thead
              style={{
                backgroundColor: "var(--bg-meta)",
                color: "var(--text-header)",
              }}
            >
              <tr>
                <th className="p-3 text-left">Short</th>
                <th className="p-3 text-left">Original</th>
                <th className="p-3 text-center">Score</th>
                <th className="p-3 text-center">Last Abuse</th>
                <th className="p-3 text-center">Clicks</th>
                <th className="p-3 text-center">Owner</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {searchedUrls.map((url) => (
                <tr
                  key={url._id}
                  className="transition"
                  style={{
                    borderTop: `1px solid var(--border-main)`,
                  }}
                >
                  <td className="p-3">
                    <span
                      style={{ color: "var(--accent-blue)" }}
                      className="break-all"
                    >
                      {window.location.origin}/{url.shortCode}
                    </span>
                  </td>

                  <td
                    className="p-3 break-all"
                    style={{ color: "var(--text-body)" }}
                  >
                    {url.originalUrl}
                  </td>

                  {/* SCORE */}
                  <td className="p-3 text-center">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold border"
                      style={getSeverityBadge(url.abuseScore)}
                    >
                      {url.abuseScore}
                    </span>
                  </td>

                  <td className="p-3 text-center" style={{ color: "var(--text-muted)" }}>
                    {url.lastAbuseAt
                      ? new Date(url.lastAbuseAt).toLocaleString()
                      : "---"}
                  </td>

                  <td className="p-3 text-center" style={{ color: "var(--text-body)" }}>
                    {url.clicks}
                  </td>

                  <td className="p-3 text-center" style={{ color: "var(--text-body)" }}>
                    {url.owner?.email || "---"}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => disableUrl(url._id)}
                      className="px-3 py-1 rounded"
                      style={{
                        backgroundColor: "#facc15",
                        color: "black",
                      }}
                    >
                      Disable
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Delete this suspicious URL?"))
                          deleteUrl(url._id);
                      }}
                      className="px-3 py-1 rounded"
                      style={{
                        backgroundColor: "#dc2626",
                        color: "white",
                      }}
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

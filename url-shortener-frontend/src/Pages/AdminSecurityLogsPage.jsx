import { useState, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import {
  useGetSecurityLogsQuery,
  useGetHighRiskLogsQuery,
  useDeleteSecurityLogsMutation,
} from "../Features/admin/adminApi";

import { Search, Trash2 } from "lucide-react";

const FILTER_OPTIONS = [
  { label: "All Events", value: "all" },
  { label: "High-Risk Only", value: "high" },
];

export default function AdminSecurityLogsPage() {
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: allLogs = [], isLoading: loadingAll } = useGetSecurityLogsQuery();
  const { data: highRiskLogs = [], isLoading: loadingHigh } = useGetHighRiskLogsQuery();

  const [deleteLogs, { isLoading: deleting }] = useDeleteSecurityLogsMutation();

  const logs = filterType === "all" ? allLogs : highRiskLogs;
  console.log("logs",allLogs)
  const isLoading = filterType === "all" ? loadingAll : loadingHigh;
  const filteredLogs = useMemo(() => {
    return logs.filter((log) =>
      log.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
      (log.shortCode && log.shortCode.includes(search))
    );
  }, [logs, search]);

  const ITEMS_PER_PAGE = 15;
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginated = filteredLogs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  console.log("paginated",paginated)


  const handleDeleteLogs = async () => {
    if (confirm("This will permanently delete all security logs. Proceed?")) {
      await deleteLogs();
    }
  };

  return (
    <AdminLayout>
      {/* TITLE */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-3xl font-bold"
          style={{ color: "var(--text-header)" }}
        >
          🔐 Security Logs
        </h2>

        {/* DELETE ALL LOGS BUTTON */}
        <button
          onClick={handleDeleteLogs}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
        >
          <Trash2 size={18} />
          Clear Logs
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-3 mb-6">

        {/* FILTER DROPDOWN */}
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(1);
          }}
          className="
            px-4 py-2 rounded-lg border
            bg-[var(--bg-card)] border-[var(--border-main)]
            text-[var(--text-body)]
          "
        >
          {FILTER_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        {/* SEARCH BAR */}
        <div
          className="
            flex items-center px-4 py-2 rounded-lg border
            bg-[var(--bg-card)] border-[var(--border-main)]
            w-full sm:w-80
          "
        >
          <Search size={18} className="text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by URL or shortcode..."
            className="ml-2 flex-1 bg-transparent outline-none text-[var(--text-body)]"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* TABLE */}
      <div
        className="
          overflow-x-auto rounded-xl border
          bg-[var(--bg-card)] border-[var(--border-main)]
        "
      >
        <table className="min-w-[900px] w-full">
          <thead className="bg-[var(--bg-table-head)]">
            <tr>
              <th className="p-3 text-left">Event</th>
              <th className="p-3 text-left">URL</th>
              <th className="p-3 text-left">Shortcode</th>
              <th className="p-3 text-left">Scanner</th>
              <th className="p-3 text-left">Risk</th>
              <th className="p-3 text-left">IP</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-[var(--text-muted)]">
                  Loading logs…
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-[var(--text-muted)]">
                  No logs found
                </td>
              </tr>
            ) : (
              paginated.map((log) => (
                <tr
                  key={log._id}
                  className="
                    border-t border-[var(--border-main)]
                    hover:bg-[var(--bg-table-hover)]
                    transition
                  "
                >
                  <td className="p-3 capitalize">{log.type.replace(/_/g, " ")}</td>
                  <td className="p-3 break-all">{log.originalUrl}</td>
                  <td className="p-3">{log.shortCode?.shortCode|| "—"}</td>
                  <td className="p-3">{log.metadata?.scannerUsed || "—"}</td>
                  <td className="p-3">{log.metadata?.riskScore ?? "—"}</td>
                  <td className="p-3">{log.metadata?.ip || "—"}</td>
                  <td className="p-3">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 rounded-lg border bg-[var(--bg-card)] border-[var(--border-main)]"
        >
          Previous
        </button>

        <span className="font-semibold text-[var(--text-header)]">
          Page {page} / {totalPages || 1}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg border bg-[var(--bg-card)] border-[var(--border-main)]"
        >
          Next
        </button>
      </div>
    </AdminLayout>
  );
}

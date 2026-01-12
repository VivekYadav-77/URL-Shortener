import { useState } from "react";
import { useGetHistoryUrlsQuery } from "../Features/urls/urlApi";
import UserLayout from "./UserLayout";

const History = () => {
  const { data: urls = [], isLoading, isError } = useGetHistoryUrlsQuery();
  const [activeTab, setActiveTab] = useState("all");

  const filteredUrls = urls.filter((url) => {
    if (activeTab === "all") return true;
    return url.status === activeTab;
  });

  const tabs = [
    { key: "all", label: "All" },
    { key: "deleted", label: "Deleted" },
    { key: "expired", label: "Expired" }
  ];

  return (
    <UserLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 
                      dark:from-gray-900 dark:to-black">

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">

          {/* HEADER */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              History
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Expired and deleted URLs with detailed metadata
            </p>
          </div>

          {/* FILTER TABS */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                  border shadow-sm backdrop-blur transition
                  ${
                    activeTab === t.key
                      ? "bg-blue-600 text-white border-blue-700"
                      : "bg-white/70 dark:bg-gray-900/40  border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* LOADING */}
          {isLoading && (
            <div className="p-6 bg-white/70 dark:bg-gray-900/40
                            border rounded-2xl shadow-md backdrop-blur">
              <p className="text-gray-700 dark:text-gray-300">Loading history…</p>
            </div>
          )}

          {/* ERROR */}
          {isError && (
            <div className="p-6 bg-red-50 border border-red-300 
                            dark:bg-red-900/30 dark:border-red-700 
                            rounded-2xl">
              <p className="text-red-700 dark:text-red-300">
                Failed to load history.
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!isLoading && filteredUrls.length === 0 && (
            <div className="p-10 text-center rounded-2xl border shadow-md
                            bg-white/70 dark:bg-gray-900/40 backdrop-blur">
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                No {activeTab !== "all" ? activeTab : ""} URLs found
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                URLs will appear here once they expire or get deleted.
              </p>
            </div>
          )}

          {/* LIST */}
          <div className="space-y-5">
            {filteredUrls.map((url) => (
              <div
                key={url._id}
                className="p-6 rounded-2xl border shadow-md 
                           bg-white/70 dark:bg-gray-900/40 
                           backdrop-blur transition hover:shadow-lg"
              >
                {/* SHORT URL */}
                <div>
                  <p className="text-blue-600 text-lg font-semibold break-all">
                    {`${window.location.origin}/${url.shortCode}`}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {url.originalUrl}
                  </p>
                </div>

                {/* STATUS */}
                <div className="mt-3 flex flex-wrap gap-3 text-sm">

                  <span
                    className={`
                      px-3 py-1 rounded-xl text-xs font-semibold
                      ${
                        url.status === "deleted"
                          ? "bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300"
                      }
                    `}
                  >
                    {url.status.toUpperCase()}
                  </span>

                  {url.deletedByRole && (
                    <span className="text-gray-600 dark:text-gray-400 text-xs">
                      Deleted by: <b>{url.deletedByRole}</b>
                    </span>
                  )}

                  {url.disabledByRole && (
                    <span className="text-gray-600 dark:text-gray-400 text-xs">
                      Disabled by: <b>{url.disabledByRole}</b>
                    </span>
                  )}
                </div>

                {/* METADATA GRID */}
                <div
                  className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                             gap-4 text-sm"
                >
                  <Meta label="Clicks" value={url.clicks} />

                  <Meta
                    label="Created At"
                    value={new Date(url.createdAt).toLocaleString()}
                  />

                  <Meta
                    label="Expires At"
                    value={
                      url.expiresAt
                        ? new Date(url.expiresAt).toLocaleString()
                        : "—"
                    }
                  />

                  <Meta
                    label="Deleted At"
                    value={
                      url.deletedAt
                        ? new Date(url.deletedAt).toLocaleString()
                        : "—"
                    }
                  />

                  <Meta
                    label="Disabled At"
                    value={
                      url.disabledAt
                        ? new Date(url.disabledAt).toLocaleString()
                        : "—"
                    }
                  />

                  <Meta label="Abuse Score" value={url.abuseScore} />

                  <Meta
                    label="Last Abuse Report"
                    value={
                      url.lastAbuseAt
                        ? new Date(url.lastAbuseAt).toLocaleString()
                        : "—"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </UserLayout>
  );
};

export default History;


// -------- Meta Component ----------
const Meta = ({ label, value }) => (
  <div className="p-3 rounded-xl border bg-gray-50/70 dark:bg-gray-800/40 
                  dark:border-gray-700 backdrop-blur">
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className="font-medium text-gray-900 dark:text-gray-200 break-all">
      {value}
    </p>
  </div>
);

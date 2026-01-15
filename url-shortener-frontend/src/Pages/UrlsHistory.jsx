import { useState } from "react";
import { useGetHistoryUrlsQuery } from "../Features/urls/urlApi";
import UserLayout from "./UserLayout";
import { useTheme } from "../App/themeStore";

const History = () => {
  const { data: urls = [], isLoading, isError } = useGetHistoryUrlsQuery();
  const [activeTab, setActiveTab] = useState("all");
  const { theme } = useTheme();

  const bgPage = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const softCard = theme === "light" ? "bg-white" : "bg-gray-800";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const textSoft = theme === "light" ? "text-gray-600" : "text-gray-400";
  const textStrong = theme === "light" ? "text-black" : "text-white";

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
      <div className={`min-h-screen transition-colors duration-300 ${bgPage}`}>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">

          {/* HEADER */}
          <div>
            <h2 className={`text-3xl font-extrabold ${textStrong}`}>History</h2>
            <p className={`${textSoft} mt-1`}>
              Expired and deleted URLs with detailed metadata
            </p>
          </div>

          {/* FILTER TABS */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border shadow-sm transition-all
                  ${activeTab === t.key
                    ? "bg-blue-600 text-white border-blue-700"
                    : `${cardBg} ${border} ${textSoft} hover:opacity-80`
                  }
                `}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* LOADING & ERROR */}
          {isLoading && (
            <p className={`${textSoft}`}>Loading history…</p>
          )}

          {isError && (
            <p className="text-red-500">Failed to load history.</p>
          )}

          {/* HISTORY LIST */}
          <div className="space-y-5">
            {filteredUrls.map((url) => (
              <div
                key={url._id}
                className={`p-6 rounded-2xl border shadow-md transition hover:shadow-lg ${cardBg} ${border}`}
              >
                {/* SHORT URL */}
                <p className="text-lg font-semibold text-blue-600 break-all">
                  {`${window.location.origin}/${url.shortCode}`}
                </p>

                <p className={`${textSoft} text-sm truncate`}>
                  {url.originalUrl}
                </p>

                {/* STATUS BADGE */}
                <div className="mt-3">
                  <span
                    className={`
                      px-3 py-1 rounded-xl text-xs font-semibold
                      ${
                        url.status === "deleted"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }
                    `}
                  >
                    {url.status.toUpperCase()}
                  </span>
                </div>

                {/* METADATA GRID */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <Meta label="Clicks" value={url.clicks} theme={theme} />
                  <Meta label="Created At" value={new Date(url.createdAt).toLocaleDateString()} theme={theme} />
                  <Meta label="Expires At" value={url.expiresAt ? new Date(url.expiresAt).toLocaleDateString() : "—"} theme={theme} />
                  <Meta label="Abuse Score" value={url.abuseScore} theme={theme} />
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </UserLayout>
  );
};



const Meta = ({ label, value, theme }) => {
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const textSoft = theme === "light" ? "text-gray-600" : "text-gray-400";
  const textStrong = theme === "light" ? "text-black" : "text-white";

  return (
    <div className={`p-3 rounded-xl border ${cardBg} ${border}`}>
      <p className={`text-xs uppercase font-bold ${textSoft}`}>{label}</p>
      <p className={`font-medium break-all ${textStrong}`}>{value}</p>
    </div>
  );
};

export default History;

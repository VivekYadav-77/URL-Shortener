import { useNavigate, useParams } from "react-router-dom";
import { useGetUrlStatsQuery } from "../Features/urls/urlApi";
import UserLayout from "./UserLayout";
import { BarChart2, Link2, Clock, AlertTriangle } from "lucide-react";

const UrlStats = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetUrlStatsQuery(id);

  return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-br 
          from-gray-50 to-gray-200 
          dark:from-gray-900 dark:to-black">

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 
              bg-white/80 dark:bg-gray-900/40 
              border border-gray-200 dark:border-gray-700
              text-gray-700 dark:text-gray-300
              px-4 py-2 rounded-xl shadow-sm backdrop-blur
              hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            ← Back
          </button>

          {/* HEADER */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Link Statistics
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Insights of your shortened link
            </p>
          </div>

          {/* LOADING */}
          {isLoading && (
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-gray-900/40 
                border shadow-md backdrop-blur text-center text-gray-600 
                dark:text-gray-300">
              Loading stats…
            </div>
          )}

          {/* ERROR */}
          {isError && (
            <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/30 
                border border-red-300 dark:border-red-700 text-red-700 
                dark:text-red-300 shadow">
              Failed to load URL stats.
            </div>
          )}

          {/* DATA */}
          {data && (
            <div className="space-y-8">

              {/* URL PREVIEW BOX */}
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-900/40 
                border shadow-lg backdrop-blur">
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Short URL
                </p>
                <p className="text-lg font-semibold text-blue-600 break-all">
                  {`${window.location.origin}/${data.shortCode}`}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  Destination
                </p>
                <p className="text-gray-800 dark:text-gray-200 break-all">
                  {data.originalUrl}
                </p>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                <StatBox
                  icon={<BarChart2 className="text-blue-600 dark:text-blue-400" size={20} />}
                  label="Total Clicks"
                  value={data.clicks}
                />

                <StatBox
                  icon={<Clock className="text-green-600 dark:text-green-400" size={20} />}
                  label="Created At"
                  value={new Date(data.createdAt).toLocaleString()}
                />

                <StatBox
                  icon={<Clock className="text-yellow-600 dark:text-yellow-400" size={20} />}
                  label="Expires At"
                  value={
                    data.expiresAt
                      ? new Date(data.expiresAt).toLocaleString()
                      : "Never"
                  }
                />

                <StatBox
                  icon={<AlertTriangle className="text-red-500 dark:text-red-400" size={20} />}
                  label="Status"
                  value={data.isActive ? "Active" : "Disabled"}
                  color={
                    data.isActive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                />
              </div>

              {/* BADGES / STATUS LABEL */}
              <div className="flex flex-wrap gap-3">
                {data.status === "expired" && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full
                    bg-yellow-100 text-yellow-700 
                    dark:bg-yellow-700/30 dark:text-yellow-300">
                    Expired
                  </span>
                )}

                {data.status === "deleted" && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full
                    bg-red-100 text-red-700 
                    dark:bg-red-700/30 dark:text-red-300">
                    Deleted
                  </span>
                )}

                {!data.isActive && data.disabledByRole && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full
                    bg-orange-100 text-orange-700
                    dark:bg-orange-700/30 dark:text-orange-300">
                    Disabled by {data.disabledByRole}
                  </span>
                )}
              </div>

              {/* QUICK INFO BLOCK */}
              <div className="p-5 rounded-2xl border 
                bg-white/80 dark:bg-gray-900/40 shadow backdrop-blur">
                <h3 className="text-lg font-semibold mb-3 
                    text-gray-900 dark:text-white">
                  Additional Details
                </h3>

                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li><b>Disabled At:</b> {data.disabledAt ? new Date(data.disabledAt).toLocaleString() : "—"}</li>
                  <li><b>Disabled By:</b> {data.disabledByRole || "—"}</li>
                  <li><b>Deleted At:</b> {data.deletedAt ? new Date(data.deletedAt).toLocaleString() : "—"}</li>
                  <li><b>Deleted By:</b> {data.deletedByRole || "—"}</li>
                  <li><b>Abuse Score:</b> {data.abuseScore}</li>
                </ul>
              </div>

            </div>
          )}
        </main>
      </div>
    </UserLayout>
  );
};

export default UrlStats;


// =========================
//   REUSABLE COMPONENT
// =========================
const StatBox = ({ icon, label, value, color }) => {
  return (
    <div
      className="p-5 rounded-2xl border bg-gray-50/80 dark:bg-gray-800/40 
                 dark:border-gray-700 shadow backdrop-blur"
    >
      <div className="flex items-center gap-3">
        <div>{icon}</div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`font-semibold text-gray-900 dark:text-gray-200 ${color}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

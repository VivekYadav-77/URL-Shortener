import { useNavigate, useParams } from "react-router-dom";
import { useGetUrlStatsQuery } from "../Features/urls/urlApi";
import UserLayout from "./UserLayout";
import { BarChart2, Link2, Clock, AlertTriangle } from "lucide-react";
import { useTheme } from "../App/themeStore";

const UrlStats = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const bg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const softCard = theme === "light" ? "bg-white" : "bg-gray-800";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const softText = theme === "light" ? "text-gray-600" : "text-gray-400";
  const normalText = theme === "light" ? "text-black" : "text-white";

  const { data, isLoading, isError } = useGetUrlStatsQuery(id);

  return (
    <UserLayout>
      <div className={`min-h-screen ${bg}`}>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm
              ${cardBg} ${border}
              ${theme === "light" ? "text-black hover:bg-gray-100" : "text-white hover:bg-gray-800"}
            `}
          >
            ← Back
          </button>

          {/* HEADER */}
          <div>
            <h2 className={`text-3xl font-extrabold ${normalText}`}>
              Link Statistics
            </h2>
            <p className={`${softText} mt-1`}>
              Insights of your shortened link
            </p>
          </div>

          {/* LOADING */}
          {isLoading && (
            <div
              className={`p-6 rounded-2xl border text-center shadow ${cardBg} ${border} ${softText}`}
            >
              Loading stats…
            </div>
          )}

          {/* ERROR */}
          {isError && (
            <div
              className={`p-6 rounded-2xl border shadow ${border} 
                ${theme === "light" ? "bg-red-50 text-red-700" : "bg-red-900/40 text-red-300"}
              `}
            >
              Failed to load URL stats.
            </div>
          )}

          {/* DATA */}
          {data && (
            <div className="space-y-8">

              {/* URL BOX */}
              <div className={`p-6 rounded-2xl border shadow ${cardBg} ${border}`}>
                <p className={`${softText} text-sm`}>Short URL</p>
                <p className="text-lg font-semibold text-blue-600 break-all">
                  {`${window.location.origin}/${data.shortCode}`}
                </p>

                <p className={`${softText} text-sm mt-3`}>Destination</p>
                <p className={`${normalText} break-all`}>
                  {data.originalUrl}
                </p>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                <StatBox
                  theme={theme}
                  icon={<BarChart2 size={20} className="text-blue-600" />}
                  label="Total Clicks"
                  value={data.clicks}
                />

                <StatBox
                  theme={theme}
                  icon={<Clock size={20} className="text-green-600" />}
                  label="Created At"
                  value={new Date(data.createdAt).toLocaleString()}
                />

                <StatBox
                  theme={theme}
                  icon={<Clock size={20} className="text-yellow-600" />}
                  label="Expires At"
                  value={
                    data.expiresAt
                      ? new Date(data.expiresAt).toLocaleString()
                      : "Never"
                  }
                />

                <StatBox
                  theme={theme}
                  icon={<AlertTriangle size={20} className="text-red-500" />}
                  label="Status"
                  value={data.isActive ? "Active" : "Disabled"}
                  color={
                    data.isActive
                      ? "text-green-600"
                      : "text-red-600"
                  }
                />
              </div>

              {/* STATUS BADGES */}
              <div className="flex flex-wrap gap-3">
                {data.status === "expired" && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                    Expired
                  </span>
                )}

                {data.status === "deleted" && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                    Deleted
                  </span>
                )}

                {!data.isActive && data.disabledByRole && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
                    Disabled by {data.disabledByRole}
                  </span>
                )}
              </div>

              {/* INFO BLOCK */}
              <div className={`p-5 rounded-2xl border shadow ${cardBg} ${border}`}>
                <h3 className={`text-lg font-semibold mb-3 ${normalText}`}>
                  Additional Details
                </h3>

                <ul className={`space-y-2 text-sm ${softText}`}>
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




const StatBox = ({ icon, label, value, color, theme }) => {
  const boxBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const labelText = theme === "light" ? "text-gray-600" : "text-gray-400";
  const valueText = theme === "light" ? "text-black" : "text-white";

  return (
    <div className={`p-5 rounded-2xl border shadow ${boxBg} ${border}`}>
      <div className="flex items-center gap-3">
        <div>{icon}</div>
        <div>
          <p className={`text-xs ${labelText}`}>{label}</p>
          <p className={`font-semibold ${valueText} ${color || ""}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

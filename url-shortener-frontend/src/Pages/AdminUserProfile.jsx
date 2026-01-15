import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUserProfileQuery,
  useGetUserUrlsQuery,
} from "../Features/admin/adminApi.js";
import AdminLayout from "./AdminLayout";
import { useTheme } from "../App/themeStore";

const AdminUserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const pageBg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const cardBorder = theme === "light" ? "border-gray-300" : "border-gray-700";
  const textMuted = theme === "light" ? "text-gray-600" : "text-gray-400";
  const tableHeaderBg = theme === "light" ? "bg-gray-100" : "bg-gray-800";
  const rowHover = theme === "light" ? "hover:bg-blue-50" : "hover:bg-gray-700";

  const { data: userData, isLoading: loadingUser } =
    useGetUserProfileQuery(id, { skip: !id });

  const { data: urls = [], isLoading: loadingUrls } =
    useGetUserUrlsQuery(id, { skip: !id });

  const user = userData?.user;

  return (
    <AdminLayout>
      <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">User Profile</h2>

          <button
            onClick={() => navigate("/admin/users")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-semibold"
          >
            ← Back to Users
          </button>
        </div>

        {/* USER INFO */}
        {loadingUser ? (
          <div className={`p-6 rounded-xl border ${cardBorder} ${cardBg}`}>
            Loading user info...
          </div>
        ) : (
          <div className={`p-6 rounded-xl border ${cardBorder} ${cardBg} mb-8`}>
            <div className="flex items-center gap-6">
              <div
                className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white"
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="text-2xl font-bold">{user?.name}</h3>
                <p className={textMuted}>{user?.email}</p>

                <p className="mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 dark:bg-gray-700">
                  {user?.role?.toUpperCase()}
                </p>

                <p className={`text-sm mt-2 ${textMuted}`}>
                  Joined: {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* USER STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard title="Total URLs" value={urls.length} theme={theme} color="blue" />
          <StatCard title="Active URLs" value={urls.filter(u => u.status === "active").length} theme={theme} color="green" />
          <StatCard title="Inactive URLs" value={urls.filter(u => u.status === "inactive").length} theme={theme} color="yellow" />
          <StatCard title="Deleted / Expired" value={urls.filter(u => ["deleted", "expired"].includes(u.status)).length} theme={theme} color="red" />
        </div>

        {/* URL TABLE */}
        <h3 className="text-2xl font-semibold mb-4">URLs Created by User</h3>

        {loadingUrls ? (
          <div className={`p-5 rounded-xl border ${cardBorder} ${cardBg}`}>
            Loading URLs...
          </div>
        ) : urls.length === 0 ? (
          <div className={`p-5 rounded-xl border ${cardBorder} ${cardBg} text-center`}>
            <p className={textMuted}>No URLs created yet.</p>
          </div>
        ) : (
          <div className={`rounded-xl border ${cardBorder} ${cardBg} overflow-x-auto`}>
            <table className="w-full min-w-237.5">
              <thead className={`${tableHeaderBg}`}>
                <tr className="text-left">
                  {["Short URL", "Status", "Clicks", "Created", "Disabled At", "Disabled By", "Deleted At", "Deleted By", "Expires At"]
                    .map((h) => (
                      <th key={h} className="p-3 font-semibold">{h}</th>
                    ))
                  }
                </tr>
              </thead>

              <tbody>
                {urls.map((url) => (
                  <tr
                    key={url._id}
                    className={`border-t ${cardBorder} transition ${rowHover}`}
                  >
                    <td className="p-3 text-blue-600 break-all">
                      {window.location.origin}/{url.shortCode}
                    </td>

                    {/* STATUS */}
                    <td className="p-3 capitalize">
                      <StatusBadge status={url.status} theme={theme} />
                    </td>

                    <td className="p-3">{url.clicks}</td>

                    <td className={`p-3 text-sm ${textMuted}`}>
                      {new Date(url.createdAt).toLocaleDateString()}
                    </td>

                    <td className={`p-3 text-sm ${textMuted}`}>
                      {url.disabledAt ? new Date(url.disabledAt).toLocaleString() : "—"}
                    </td>

                    <td className={`p-3 text-sm ${textMuted}`}>
                      {url.disabledByRole || "—"}
                    </td>

                    <td className={`p-3 text-sm ${textMuted}`}>
                      {url.deletedAt ? new Date(url.deletedAt).toLocaleString() : "—"}
                    </td>

                    <td className={`p-3 text-sm ${textMuted}`}>
                      {url.deletedByRole || "—"}
                    </td>

                    <td className={`p-3 text-sm ${textMuted}`}>
                      {url.expiresAt ? new Date(url.expiresAt).toLocaleString() : "—"}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUserProfilePage;


const StatusBadge = ({ status, theme }) => {
  const bg = {
    active: theme === "light" ? "bg-green-100 text-green-700" : "bg-green-900/40 text-green-300",
    inactive: theme === "light" ? "bg-yellow-100 text-yellow-700" : "bg-yellow-900/40 text-yellow-300",
    deleted: theme === "light" ? "bg-red-100 text-red-700" : "bg-red-900/40 text-red-300",
    expired: theme === "light" ? "bg-gray-200 text-gray-700" : "bg-gray-800 text-gray-300",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bg[status]}`}>
      {status}
    </span>
  );
};


const StatCard = ({ title, value, color, theme }) => {
  const bg = {
    blue: theme === "light" ? "bg-blue-100 text-blue-700" : "bg-blue-900/40 text-blue-300",
    green: theme === "light" ? "bg-green-100 text-green-700" : "bg-green-900/40 text-green-300",
    yellow: theme === "light" ? "bg-yellow-100 text-yellow-700" : "bg-yellow-900/40 text-yellow-300",
    red: theme === "light" ? "bg-red-100 text-red-700" : "bg-red-900/40 text-red-300",
  };

  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const cardBorder = theme === "light" ? "border-gray-300" : "border-gray-700";
  const textMuted = theme === "light" ? "text-gray-600" : "text-gray-400";

  return (
    <div className={`p-5 rounded-xl border ${cardBorder} ${cardBg}`}>
      <p className={`text-sm ${textMuted}`}>{title}</p>
      <p className={`mt-2 text-3xl font-bold ${bg[color]}`}>{value}</p>
    </div>
  );
};

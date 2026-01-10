import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUserProfileQuery,
  useGetUserUrlsQuery,
} from "../Features/admin/adminApi.js";
import AdminLayout from "./AdminLayout";

const AdminUserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: userData, isLoading: loadingUser } =
    useGetUserProfileQuery(id, { skip: !id });

  const { data: urls = [], isLoading: loadingUrls } =
    useGetUserUrlsQuery(id, { skip: !id });

  const user = userData?.user;

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          User Profile
        </h2>

        <button
          onClick={() => navigate("/admin/users")}
          className="
            px-4 py-2 bg-slate-200 hover:bg-slate-300 
            dark:bg-gray-700 dark:hover:bg-gray-600
            rounded-lg text-sm font-semibold
          "
        >
          ← Back to Users
        </button>
      </div>

      {/* USER INFO */}
      {loadingUser ? (
        <div className="p-6 bg-white dark:bg-gray-800 border rounded-xl">
          Loading user info...
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-6">
            <div
              className="
                h-16 w-16 rounded-full bg-blue-600 dark:bg-blue-500 
                flex items-center justify-center text-2xl font-bold text-white
              "
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {user?.name}
              </h3>

              <p className="text-slate-600 dark:text-gray-300">
                {user?.email}
              </p>

              <p
                className="mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full 
                bg-slate-200 dark:bg-gray-700 text-slate-800 dark:text-gray-300"
              >
                {user?.role?.toUpperCase()}
              </p>

              <p className="text-sm mt-2 text-slate-500 dark:text-gray-400">
                Joined: {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* USER STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard title="Total URLs" value={urls.length} color="blue" />
        <StatCard
          title="Active URLs"
          value={urls.filter((u) => u.status === "active").length}
          color="green"
        />
        <StatCard
          title="Inactive URLs"
          value={urls.filter((u) => u.status === "inactive").length}
          color="yellow"
        />
        <StatCard
          title="Deleted / Expired"
          value={urls.filter((u) => ["deleted", "expired"].includes(u.status)).length}
          color="red"
        />
      </div>

      {/* URL TABLE */}
      <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
        URLs Created by User
      </h3>

      {loadingUrls ? (
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border">
          Loading URLs...
        </div>
      ) : urls.length === 0 ? (
        <div className="p-5 bg-white dark:bg-gray-800 text-center border rounded-xl">
          <p className="text-slate-600 dark:text-gray-300">
            No URLs created yet.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-x-auto">
          <table className="w-full min-w-250">
            <thead className="bg-slate-100 dark:bg-gray-700">
              <tr className="text-left">
                <th className="p-3 font-semibold">Short URL</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Clicks</th>
                <th className="p-3 font-semibold">Created</th>
                <th className="p-3 font-semibold">Disabled At</th>
                <th className="p-3 font-semibold">Disabled By</th>
                <th className="p-3 font-semibold">Deleted At</th>
                <th className="p-3 font-semibold">Deleted By</th>
                <th className="p-3 font-semibold">Expires At</th>
              </tr>
            </thead>

            <tbody>
              {urls.map((url) => (
                <tr
                  key={url._id}
                  className="
                    border-t dark:border-gray-700
                    hover:bg-blue-50 dark:hover:bg-gray-700/40
                  "
                >
                  <td className="p-3 text-blue-600 dark:text-blue-400 break-all">
                    {window.location.origin}/{url.shortCode}
                  </td>

                  {/* STATUS */}
                  <td className="p-3 capitalize">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold 
                        ${
                          url.status === "active"
                            ? "bg-green-100 text-green-700"
                            : url.status === "inactive"
                            ? "bg-yellow-100 text-yellow-700"
                            : url.status === "deleted"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                        }
                      `}
                    >
                      {url.status}
                    </span>
                  </td>

                  <td className="p-3">{url.clicks}</td>

                  <td className="p-3 text-sm text-slate-500 dark:text-gray-400">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </td>

                  {/* DISABLED INFO */}
                  <td className="p-3 text-sm text-slate-500 dark:text-gray-400">
                    {url.disabledAt ? new Date(url.disabledAt).toLocaleString() : "—"}
                  </td>
                  <td className="p-3 text-sm text-slate-500 dark:text-gray-400">
                    {url.disabledByRole ? `${url.disabledByRole}` : "—"}
                  </td>

                  {/* DELETED INFO */}
                  <td className="p-3 text-sm text-slate-500 dark:text-gray-400">
                    {url.deletedAt ? new Date(url.deletedAt).toLocaleString() : "—"}
                  </td>
                  <td className="p-3 text-sm text-slate-500 dark:text-gray-400">
                    {url.deletedByRole ? `${url.deletedByRole}` : "—"}
                  </td>

                  {/* EXPIRY */}
                  <td className="p-3 text-sm text-slate-500 dark:text-gray-400">
                    {url.expiresAt ? new Date(url.expiresAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUserProfilePage;


/* -------------------- STAT CARD -------------------- */
const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    green: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    yellow:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  return (
    <div className="p-5 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800">
      <p className="text-sm text-slate-500 dark:text-gray-400">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
};

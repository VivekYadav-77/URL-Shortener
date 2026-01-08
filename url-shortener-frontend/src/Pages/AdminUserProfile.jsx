import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import {
  useGetUserProfileQuery,
  useGetUserUrlsQuery,
  useDisableUrlAdminMutation,
  useExpireUrlAdminMutation,
  useDeleteUrlAdminMutation
} from "../Features/admin/adminApi";

const AdminUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Queries
  const { data: user, isLoading: userLoading } = useGetUserProfileQuery(id);
  const { data: urls = [], isLoading: urlsLoading } = useGetUserUrlsQuery(id);

  // Actions
  const [disableUrl] = useDisableUrlAdminMutation();
  const [expireUrl] = useExpireUrlAdminMutation();
  const [deleteUrl] = useDeleteUrlAdminMutation();

  const handleDisable = async (urlId) => {
    await disableUrl(urlId);
  };

  const handleExpire = async (urlId) => {
    await expireUrl(urlId);
  };

  const handleDelete = async (urlId) => {
    if (!confirm("Delete this URL permanently?")) return;
    await deleteUrl(urlId);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 mb-4 text-sm"
        >
          ← Back
        </button>

        {/* USER LOADING */}
        {userLoading && (
          <div className="bg-white p-6 rounded-xl border">Loading user...</div>
        )}

        {/* USER INFO */}
        {user && (
          <div className="bg-white border rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#1E293B]">
              {user.name || user.email}
            </h2>
            <p className="text-slate-600">{user.email}</p>

            <div className="flex gap-6 mt-4 text-sm text-slate-700">
              <span>Total URLs: <b>{urls.length}</b></span>
              <span>Active: <b>{urls.filter(x => x.status === "active").length}</b></span>
              <span>Inactive: <b>{urls.filter(x => x.status === "inactive").length}</b></span>
              <span>Expired: <b>{urls.filter(x => x.status === "expired").length}</b></span>
              <span>Deleted: <b>{urls.filter(x => x.status === "deleted").length}</b></span>
            </div>
          </div>
        )}

        {/* URLS LOADING */}
        {urlsLoading && (
          <div className="bg-white p-6 rounded-xl border">Loading URLs...</div>
        )}

        {/* URL LIST */}
        {!urlsLoading && urls.length > 0 && (
          <div className="space-y-4">
            {urls.map((url) => (
              <div
                key={url._id}
                className="bg-white border rounded-xl p-5 flex flex-col gap-3"
              >
                <div>
                  <p className="font-semibold text-[#2563EB] break-all">
                    {`${window.location.origin}/${url.shortCode}`}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {url.originalUrl}
                  </p>
                </div>

                <div className="flex gap-6 text-sm text-slate-600 flex-wrap">
                  <span>Status: <b>{url.status}</b></span>
                  <span>Clicks: <b>{url.clicks}</b></span>
                  <span>Created: {new Date(url.createdAt).toLocaleString()}</span>
                  {url.expiresAt && (
                    <span>Expires: {new Date(url.expiresAt).toLocaleString()}</span>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleDisable(url._id)}
                    className="px-3 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                  >
                    Disable
                  </button>

                  <button
                    onClick={() => handleExpire(url._id)}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Expire
                  </button>

                  <button
                    onClick={() => handleDelete(url._id)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-sm ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!urlsLoading && urls.length === 0 && (
          <div className="bg-white p-10 rounded-xl border text-center">
            No URLs found for this user.
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUserProfile;

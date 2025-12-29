import Navbar from "../components/layout/Navbar";
import { useGetAbusedUrlsQuery,useDisableUrlByAdminMutation,useGetPlatformStatsQuery,useGetAllUrlsQuery
 } from "../Features/admin/adminApi";
 const AdminDashboard = () => {
  const { data: stats } = useGetPlatformStatsQuery();
  const { data: abusedUrls, isLoading } = useGetAbusedUrlsQuery();
  const [disableUrl] = useDisableUrlByAdminMutation();
const { data: allUrls, isLoading: loadingAll } = useGetAllUrlsQuery();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>

        {/* PLATFORM STATS */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <Stat label="Users" value={stats.totalUsers} />
            <Stat label="URLs" value={stats.totalUrls} />
            <Stat label="Abused URLs" value={stats.abusedUrls} />
          </div>
        )}

        {/* ABUSED URL LIST */}
        <div className="bg-white rounded shadow">
          <h3 className="text-lg font-semibold p-4 border-b">
            Abused URLs
          </h3>

          {isLoading && <p className="p-4">Loading...</p>}

          {!isLoading && abusedUrls?.length === 0 && (
            <p className="p-4 text-gray-500">
              No abused URLs 🎉
            </p>
          )}

          {!isLoading &&
            abusedUrls?.map((url) => (
              <div
                key={url._id}
                className="p-4 flex justify-between items-center border-t"
              >
                <div>
                  <p className="font-medium">
                    {url.shortCode}
                  </p>
                  <p className="text-sm text-gray-500">
                    {url.owner?.email}
                  </p>
                  <p className="text-sm text-red-600">
                    Abuse score: {url.abuseScore}
                  </p>
                </div>

                <button
                  onClick={() => disableUrl(url._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Disable
                </button>
              </div>
            ))}
        </div>
        {/* ALL URLS */}
<div className="bg-white rounded shadow">
  <h3 className="text-lg font-semibold p-4 border-b">
    All URLs
  </h3>

  {loadingAll && <p className="p-4">Loading...</p>}

  {!loadingAll && allUrls?.length === 0 && (
    <p className="p-4 text-gray-500">
      No URLs found
    </p>
  )}

  {!loadingAll &&
    allUrls?.map((url) => (
      <div
        key={url._id}
        className="p-4 flex justify-between items-center border-t"
      >
        <div>
          <p className="font-medium">
            {url.shortCode}
          </p>
          <p className="text-sm text-gray-500">
            {url.owner?.email}
          </p>
          <p className="text-sm text-gray-400 truncate max-w-md">
            {url.originalUrl}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-sm ${
              url.isActive ? "text-green-600" : "text-red-600"
            }`}
          >
            {url.isActive ? "Active" : "Disabled"}
          </span>

          {url.isActive && (
            <button
              onClick={() => disableUrl(url._id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Disable
            </button>
          )}
        </div>
      </div>
    ))}
</div>

      </main>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default AdminDashboard;
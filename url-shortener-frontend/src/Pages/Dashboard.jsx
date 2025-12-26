import Navbar from "../components/layout/Navbar";
import { useGetMyUrlsQuery } from "../Features/urls/urlApi";
const Dashboard = () => {
    const {
    data: urls,
    isLoading,
    isError
  } = useGetMyUrlsQuery();
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            My URLs
          </h2>

          <button className="bg-black text-white px-4 py-2 rounded">
            Create New
          </button>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="bg-white rounded shadow p-6">
            <p>Loading URLs...</p>
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="bg-white rounded shadow p-6 text-red-600">
            Failed to load URLs
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && urls?.length === 0 && (
          <div className="bg-white rounded shadow p-6 text-gray-500">
            No URLs created yet
          </div>
        )}

        {/* LIST */}
        {!isLoading && urls?.length > 0 && (
          <div className="bg-white rounded shadow divide-y">
            {urls.map((url) => (
              <div
                key={url._id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {url.shortCode}
                  </p>
                  <p className="text-sm text-gray-500 truncate max-w-md">
                    {url.originalUrl}
                  </p>
                </div>

                <div className="text-sm text-gray-600">
                  {url.clicks} clicks
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

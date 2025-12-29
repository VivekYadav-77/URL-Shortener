import { useParams,useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import { useGetUrlStatsQuery } from "../Features/urls/urlApi.js";
const UrlStats=()=>{
    const {id} = useParams();
    const navigate = useNavigate()
    const {data,isLoading,isError}= useGetUrlStatsQuery(id);
    return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-3xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 mb-4"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-6">
          URL Statistics
        </h2>

        {/* LOADING */}
        {isLoading && (
          <div className="bg-white p-6 rounded shadow">
            Loading stats...
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="bg-white p-6 rounded shadow text-red-600">
            Failed to load URL stats
          </div>
        )}

        {/* DATA */}
        {data && (
          <div className="bg-white p-6 rounded shadow space-y-4">
            <div>
              <p className="text-sm text-gray-500">Clicks</p>
              <p className="text-xl font-semibold">{data.clicks}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p>{new Date(data.createdAt).toLocaleString()}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Expires At</p>
              <p>
                {data.expiresAt
                  ? new Date(data.expiresAt).toLocaleString()
                  : "Never"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p
                className={
                  data.isActive
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {data.isActive ? "Active" : "Disabled"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );

}
export default UrlStats;
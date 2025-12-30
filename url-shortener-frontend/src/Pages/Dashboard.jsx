import Navbar from "../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import {
  useGetMyUrlsQuery,
  useUpdateUrlMutation,
  useDeleteUrlMutation,
} from "../Features/urls/urlApi";
import UrlList from "./UrlList";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const {
    data: urls = [],
    isLoading,
    isError,
  } = useGetMyUrlsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const [updateUrl] = useUpdateUrlMutation();
  const [deleteUrl] = useDeleteUrlMutation();

  const handleToggle = (url) => {
    updateUrl({
      id: url._id,
      data: { isActive: !url.isActive },
    });
  };

  const handleDelete = (id) => {
    if (!confirm("Permanently delete this URL?")) return;
    deleteUrl(id);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#1E293B]">
              Admin Dashboard
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Monitor and moderate all shortened URLs
            </p>
          </div>

          <button
            onClick={() => navigate("/create")}
            className="
              inline-flex items-center justify-center
              bg-[#2563EB] text-white
              px-5 py-2.5 rounded-lg
              hover:bg-blue-700 transition
              shadow-sm
            "
          >
            + Create URL
          </button>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="bg-white border rounded-xl p-6">
            Loading URLs…
          </div>
        )}

        {/* ERROR */}
        {isError && !isLoading && (
          <div className="bg-white border rounded-xl p-6 text-red-600">
            Failed to load URLs. Please try again.
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && urls.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border">
            <p className="text-lg font-medium text-[#1E293B]">
              No URLs in the system
            </p>
            <p className="text-sm text-slate-500 mt-2">
              URLs created by users will appear here
            </p>
          </div>
        )}

        {/* LIST */}
        {!isLoading && urls.length > 0 && (
          <UrlList
            urls={urls}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

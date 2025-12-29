import Navbar from "../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { useGetMyUrlsQuery,useUpdateUrlMutation,useDeleteUrlMutation } from "../Features/urls/urlApi";
import UrlList from "./UrlList";
const Dashboard = () => {
  const navigate = useNavigate();

  const { data: urls = [], isLoading, isError } = useGetMyUrlsQuery();
  const [updateUrl] = useUpdateUrlMutation();
  const [deleteUrl] = useDeleteUrlMutation();

  const handleToggle = (url) => {
    updateUrl({
      id: url._id,
      data: { isActive: !url.isActive }
    });
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this URL?")) return;
    deleteUrl(id);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My URLs</h2>

          <button
            onClick={() => navigate("/create")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Create New
          </button>
        </div>

        {isLoading && <p>Loading URLs...</p>}
        {isError && <p className="text-red-600">Failed to load URLs</p>}
        {!isLoading && urls.length === 0 && (
          <p className="text-gray-500">No URLs created yet</p>
        )}

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

export default Dashboard;
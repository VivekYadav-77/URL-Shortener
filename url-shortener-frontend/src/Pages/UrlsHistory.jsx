import Navbar from "../components/layout/Navbar";
import { useGetHistoryUrlsQuery } from "../Features/urls/urlApi";

const History = () => {
  const { data: urls = [], isLoading, isError } =
    useGetHistoryUrlsQuery();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-[#1E293B] mb-2">
          History
        </h2>
        <p className="text-slate-500 mb-8">
          Expired and deleted links
        </p>

        {/* LOADING */}
        {isLoading && (
          <div className="bg-white p-6 rounded-xl border">
            Loading history…
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="bg-white p-6 rounded-xl border text-red-600">
            Failed to load history
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && urls.length === 0 && (
          <div className="bg-white p-10 rounded-xl border text-center">
            <p className="text-lg font-medium">
              No expired or deleted URLs
            </p>
          </div>
        )}

        {/* LIST */}
        {!isLoading && urls.length > 0 && (
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

                <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                  <span>
                    Clicks: <b>{url.clicks || 0}</b>
                  </span>

                  <span>
                    Created:{" "}
                    {new Date(url.createdAt).toLocaleString()}
                  </span>

                  {url.expiresAt && (
                    <span>
                      Expired:{" "}
                      {new Date(url.expiresAt).toLocaleString()}
                    </span>
                  )}

                  {url.deletedAt && (
                    <span>
                      Deleted:{" "}
                      {new Date(url.deletedAt).toLocaleString()}
                    </span>
                  )}
                </div>

                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        url.status === "deleted"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {url.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;

import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import { useGetHistoryUrlsQuery } from "../Features/urls/urlApi";
import UserLayout from "./UserLayout";
const History = () => {
  const { data: urls = [], isLoading, isError } =
    useGetHistoryUrlsQuery();

  // FILTER STATE
  const [activeTab, setActiveTab] = useState("all");

  // FILTER LOGIC
  const filteredUrls = urls.filter((url) => {
    if (activeTab === "all") return true;
    if (activeTab === "deleted") return url.status === "deleted";
    if (activeTab === "expired") return url.status === "expired";
    return true;
  });

  return (
    <UserLayout>
    <div className="min-h-screen bg-[#F8FAFC]">

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* HEADER */}
        <h2 className="text-3xl font-bold text-[#1E293B] mb-2">
          History
        </h2>
        <p className="text-slate-500 mb-6">
          Expired and deleted links
        </p>

        {/* FILTER TABS */}
        <div className="flex gap-3 mb-8">
          {["all", "deleted", "expired"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition
                ${
                  activeTab === tab
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

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
        {!isLoading && filteredUrls.length === 0 && (
          <div className="bg-white p-10 rounded-xl border text-center">
            <p className="text-lg font-medium text-[#1E293B]">
              No {activeTab !== "all" ? activeTab : ""} URLs found
            </p>
          </div>
        )}

        {/* LIST */}
        {!isLoading && filteredUrls.length > 0 && (
          <div className="space-y-4">
            {filteredUrls.map((url) => (
              <div
                key={url._id}
                className="bg-white border rounded-xl p-5 flex flex-col gap-3"
              >
                {/* URL INFO */}
                <div>
                  <p className="font-semibold text-[#2563EB] break-all">
                    {`${window.location.origin}/${url.shortCode}`}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {url.originalUrl}
                  </p>
                </div>

                {/* META */}
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

                {/* STATUS BADGE */}
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
    </UserLayout>
  );
};

export default History;

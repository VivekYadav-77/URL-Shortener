import Navbar from "../components/layout/Navbar";
import {useGetAdminStatsQuery} from "../Features/admin/adminApi.js"

const StatCard = ({ label, value, color }) => (
  <div className={`p-6 rounded-xl shadow-md border bg-white`}>
    <p className="text-slate-500 text-sm">{label}</p>
    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

const AdminDashboard = () => {
  const { data, isLoading } = useGetAdminStatsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard label="Total URLs" value={data.totalUrls} color="text-blue-600" />
          <StatCard label="Active URLs" value={data.activeUrls} color="text-green-600" />
          <StatCard label="Expired URLs" value={data.expiredUrls} color="text-yellow-600" />
          <StatCard label="Deleted URLs" value={data.deletedUrls} color="text-red-600" />
          <StatCard label="Total Clicks" value={data.totalClicks} color="text-indigo-600" />
          <StatCard label="URLs with Abuse Issues" value={data.abuseUrls} color="text-orange-600" />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

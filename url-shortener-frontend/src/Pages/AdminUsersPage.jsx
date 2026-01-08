import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useAdminGetUsersQuery } from "../Features/admin/adminApi.js";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useAdminGetUsersQuery();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-[#1E293B] mb-6">
          All Users
        </h2>

        {isLoading ? (
          <div className="p-6 bg-white border rounded-xl text-center">
            Loading users…
          </div>
        ) : (
          <div className="bg-white border rounded-xl overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 space-x-3">
                      <button
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        Profile
                      </button>

                      <button
                        onClick={() => navigate(`/admin/users/${user._id}/urls`)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        URLs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUsersPage;

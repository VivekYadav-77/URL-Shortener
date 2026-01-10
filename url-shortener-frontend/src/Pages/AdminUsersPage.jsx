import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "../Features/admin/adminApi";
import AdminLayout from "./AdminLayout";
import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useGetUsersQuery();

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  // Apply filters
  const filtered = useMemo(() => {
    return users
      .filter((u) =>
        u.email.toLowerCase().includes(search.toLowerCase())
      )
      .filter((u) =>
        roleFilter === "all" ? true : u.role === roleFilter
      );
  }, [search, roleFilter, users]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <AdminLayout>
      {/* TITLE */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        All Users
      </h2>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        {/* SEARCH BAR */}
        <div className="flex items-center px-4 py-2 w-full sm:w-80 
          bg-white dark:bg-gray-800 
          border rounded-lg dark:border-gray-700">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by email..."
            className="ml-2 flex-1 bg-transparent text-gray-900 dark:text-gray-200 outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* ROLE FILTER */}
        <div className="flex items-center px-4 py-2 
          bg-white dark:bg-gray-800 
          border rounded-lg dark:border-gray-700 w-fit">
          <Filter size={18} className="text-gray-500" />
          <select
            className="ml-2 bg-transparent text-gray-900 dark:text-gray-200 outline-none"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-x-auto">
        <table className="w-full min-w-187.5">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold">Email</th>
              <th className="p-4 text-left font-semibold">Role</th>
              <th className="p-4 text-left font-semibold">Joined</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center dark:text-gray-300">
                  Loading users...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500 dark:text-gray-300">
                  No users found
                </td>
              </tr>
            ) : (
              paginated.map((user) => (
                <tr
                  key={user._id}
                  className="border-t dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700/40 transition"
                >
                  <td className="p-4 text-gray-900 dark:text-gray-100 font-medium">
                    {user.name}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>

                  {/* Role Badge */}
                  <td className="p-4">
                    <span
                      className={`
                        px-3 py-1 text-xs font-bold rounded-full 
                        ${
                          user.role === "admin"
                            ? "bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200"
                            : "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                        }
                      `}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/admin/users/${user._id}`)}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-semibold
              ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;

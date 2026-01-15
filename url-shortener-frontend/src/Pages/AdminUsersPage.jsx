import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "../Features/admin/adminApi";
import AdminLayout from "./AdminLayout";
import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { useTheme } from "../App/themeStore";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useGetUsersQuery();
  const { theme } = useTheme();

  const pageBg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const cardBorder = theme === "light" ? "border-gray-300" : "border-gray-700";
  const inputBg = theme === "light" ? "bg-white" : "bg-gray-800";
  const inputText = theme === "light" ? "text-black" : "text-white";
  const muted = theme === "light" ? "text-gray-600" : "text-gray-400";
  const tableHeaderBg = theme === "light" ? "bg-gray-100" : "bg-gray-800";
  const tableRowHover = theme === "light" ? "hover:bg-blue-50" : "hover:bg-gray-700";

  
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  const filtered = useMemo(() => {
    return users
      .filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))
      .filter((u) => (roleFilter === "all" ? true : u.role === roleFilter));
  }, [search, roleFilter, users]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <AdminLayout>
      <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
        
        {/* PAGE TITLE */}
        <h2 className={`text-3xl font-bold mb-8 ${inputText}`}>
          All Users
        </h2>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          {/* SEARCH BAR */}
          <div
            className={`flex items-center px-4 py-2 w-full sm:w-80 rounded-lg border ${cardBorder} ${inputBg}`}
          >
            <Search size={18} className={muted} />
            <input
              type="text"
              placeholder="Search by email..."
              className={`ml-2 flex-1 bg-transparent outline-none ${inputText}`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* ROLE FILTER */}
          <div
            className={`flex items-center px-4 py-2 rounded-lg border ${cardBorder} w-fit ${inputBg}`}
          >
            <Filter size={18} className={muted} />
            <select
              className={`ml-2 bg-transparent outline-none ${inputText}`}
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

        {/* TABLE */}
        <div
          className={`rounded-xl border overflow-x-auto shadow-md ${cardBorder} ${cardBg}`}
        >
          <table className="w-full min-w-187.5">
            <thead className={`${tableHeaderBg} ${inputText}`}>
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
                  <td colSpan="5" className={`p-6 text-center ${muted}`}>
                    Loading users...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="5" className={`p-6 text-center ${muted}`}>
                    No users found
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr
                    key={user._id}
                    className={`border-t ${cardBorder} transition ${tableRowHover}`}
                  >
                    <td className={`p-4 font-medium ${inputText}`}>
                      {user.name}
                    </td>

                    <td className={`p-4 ${muted}`}>
                      {user.email}
                    </td>

                    {/* ROLE BADGE */}
                    <td className="p-4">
                      <span
                        className={`
                        px-3 py-1 text-xs font-bold rounded-full
                        ${user.role === "admin"
                          ? theme === "light"
                            ? "bg-purple-200 text-purple-900"
                            : "bg-purple-800 text-purple-200"
                          : theme === "light"
                            ? "bg-blue-200 text-blue-900"
                            : "bg-blue-800 text-blue-200"
                        }
                      `}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className={`p-4 text-sm ${muted}`}>
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
                ${page === i + 1
                  ? "bg-blue-600 text-white"
                  : theme === "light"
                    ? "bg-gray-200 text-gray-800"
                    : "bg-gray-700 text-gray-300"
                }
              `}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;

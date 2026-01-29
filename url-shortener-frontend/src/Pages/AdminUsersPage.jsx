import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "../Features/admin/adminApi";
import AdminLayout from "./AdminLayout";
import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  User,
  Mail,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../App/themeStore";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useGetUsersQuery();
  const { theme } = useTheme();

  const isDark = theme === "dark";
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
    page * ITEMS_PER_PAGE,
  );

  return (
    <AdminLayout>
      <div
        className={`min-h-screen p-4 md:p-8 transition-colors duration-500 ${isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"}`}
      >
        {/* HEADER SECTION */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight mb-2 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            User Management
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>
            Manage system access and monitor user activity across the platform.
          </p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div
          className={`flex flex-col md:flex-row gap-4 mb-8 p-4 rounded-2xl border backdrop-blur-md ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"}`}
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by email..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${
                isDark
                  ? "bg-black/40 border-white/10 focus:border-blue-500 text-white"
                  : "bg-gray-50 border-gray-200 focus:border-blue-400"
              }`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex gap-3">
            <div
              className={`flex items-center px-4 py-2 rounded-xl border ${
                isDark
                  ? "bg-black/40 border-white/10 text-white"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <Filter size={18} className="mr-2 text-gray-400" />
              <select
                className="bg-transparent outline-none cursor-pointer font-medium"
                style={{ colorScheme: isDark ? "dark" : "light" }}
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option
                  value="all"
                  className={isDark ? "bg-[#0A0A0A]" : "bg-white text-black"}
                >
                  All Roles
                </option>
                <option
                  value="user"
                  className={isDark ? "bg-[#0A0A0A]" : "bg-white text-black"}
                >
                  Users
                </option>
                <option
                  value="admin"
                  className={isDark ? "bg-[#0A0A0A]" : "bg-white text-black"}
                >
                  Admins
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div
          className={`rounded-3xl border overflow-hidden shadow-2xl transition-all ${isDark ? "bg-[#0A0A0A] border-white/10" : "bg-white border-gray-200"}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`${isDark ? "bg-white/5" : "bg-gray-100/50"} text-sm font-semibold uppercase tracking-wider`}
                >
                  <th className="p-5">User Details</th>
                  <th className="p-5">Role</th>
                  <th className="p-5">Joined Date</th>
                  <th className="p-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center animate-pulse">
                      Fetching users...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-500">
                      No matching users found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((user) => (
                    <tr
                      key={user._id}
                      className={`group transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-blue-50/50"}`}
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-lg ${isDark ? "bg-blue-600/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold">{user.name}</div>
                            <div
                              className={`text-xs flex items-center gap-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                            >
                              <Mail size={12} /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1 text-[10px] uppercase font-black rounded-full tracking-widest ${
                            user.role === "admin"
                              ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-5 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar size={14} />{" "}
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <button
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                            isDark
                              ? "bg-white text-black hover:bg-gray-200"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          View Profile <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${
                  page === i + 1
                    ? "bg-blue-600 text-white scale-110 shadow-lg"
                    : isDark
                      ? "bg-white/5 text-gray-400 hover:bg-white/10"
                      : "bg-white border text-gray-600 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;

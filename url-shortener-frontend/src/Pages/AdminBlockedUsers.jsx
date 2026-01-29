import React, { useState } from "react";
import {
  useGetBlockedUsersQuery,
  useUnblockUserMutation,
  useBlockUserMutation,
} from "../Features/admin/adminApi.js";
import AdminLayout from "./AdminLayout";
import { useTheme } from "../App/themeStore";
import {
  UserX,
  ShieldCheck,
  Search,
  Hammer,
  Calendar,
  MessageSquare,
  Mail,
  ChevronRight,
  AlertOctagon,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminBlockedUsersPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");

  const { data: response, isLoading, isError } = useGetBlockedUsersQuery();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

  const blockedUsers = response?.data || [];

  const filteredUsers = blockedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleUnblock = async (id, name) => {
    if (
      window.confirm(`Are you sure you want to reinstate access for ${name}?`)
    ) {
      try {
        await unblockUser(id).unwrap();
      } catch (err) {
        alert("Failed to unblock user");
      }
    }
  };

  return (
    <AdminLayout>
      <div
        className={`min-h-screen p-4 md:p-8 transition-colors duration-500 ${
          isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <AlertOctagon className="text-red-500" size={36} />
              Enforcement Lab
            </h1>
            <p
              className={`mt-2 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Review and manage accounts currently restricted by the system.
            </p>
          </div>

          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`pl-12 pr-6 py-4 rounded-2xl border-2 outline-none transition-all w-full md:w-80 ${
                isDark
                  ? "bg-white/5 border-white/10 focus:border-blue-500 text-white"
                  : "bg-white border-gray-200 focus:border-blue-500 text-gray-900"
              }`}
            />
          </div>
        </div>

        {/* STATS PREVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            className={`p-6 rounded-3xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">
              Total Restricted
            </span>
            <span className="text-3xl font-black text-red-500">
              {blockedUsers.length}
            </span>
          </div>
          <div
            className={`p-6 rounded-3xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">
              Search Results
            </span>
            <span className="text-3xl font-black">{filteredUsers.length}</span>
          </div>
        </div>

        {/* CONTENT GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse bg-white/5 rounded-[2.5rem]"
              ></div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div
            className={`p-20 text-center rounded-[3rem] border-2 border-dashed ${isDark ? "border-white/10" : "border-gray-200"}`}
          >
            <UserX
              size={48}
              className="mx-auto mb-4 text-gray-500 opacity-20"
            />
            <p className="text-gray-500 font-bold italic">
              No blocked users matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`group relative overflow-hidden p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02] ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:border-red-500/30"
                    : "bg-white border-gray-200 shadow-xl shadow-gray-200/50"
                }`}
              >
                {/* TOP ROW: AVATAR & INFO */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white ${
                      isDark ? "bg-red-500/20 text-red-500" : "bg-red-600"
                    }`}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={() => navigate(`/admin/users/${user._id}`)}
                    className={`p-3 rounded-xl transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-gray-100"}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* USER DETAILS */}
                <h3 className="text-xl font-black mb-1 truncate">
                  {user.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 truncate font-medium">
                  <Mail size={14} /> {user.email}
                </div>

                {/* BLOCK DETAILS */}
                <div
                  className={`p-4 rounded-2xl mb-8 space-y-3 ${isDark ? "bg-black/40" : "bg-gray-50"}`}
                >
                  <div className="flex items-start gap-3">
                    <Calendar size={14} className="mt-1 text-red-500" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-gray-500 block">
                        Restricted On
                      </span>
                      <span className="text-xs font-bold">
                        {new Date(user.blockedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare size={14} className="mt-1 text-red-500" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-gray-500 block">
                        Enforcement Reason
                      </span>
                      <span className="text-xs font-bold line-clamp-2">
                        {user.reason || "No reason specified"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <button
                  onClick={() => handleUnblock(user._id, user.name)}
                  disabled={isUnblocking}
                  className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
                    isDark
                      ? "bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-600 hover:text-white"
                  }`}
                >
                  <ShieldCheck size={18} />
                  {isUnblocking ? "Processing..." : "Restore Account"}
                </button>

                {/* DESIGN DECO */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
                  <Hammer size={120} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlockedUsersPage;

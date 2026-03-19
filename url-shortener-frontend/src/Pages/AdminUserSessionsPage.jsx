import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useTheme } from "../App/themeStore";
import {
  useGetSessionsQuery,
  useRevokeSessionMutation,
  useLogoutAllMutation,
} from "../Features/admin/adminApi.js";
import { Trash2, Monitor, Smartphone, ShieldAlert } from "lucide-react";

export default function UserSessionsPage() {
  const { theme } = useTheme();
  const { data, isLoading } = useGetSessionsQuery();
  const [revokeSession] = useRevokeSessionMutation();
  const [logoutAll] = useLogoutAllMutation();

  const [feedback, setFeedback] = useState(null);

  const sessions = data?.sessions || [];

  const toast = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 2200);
  };

  const pageBg =
    theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const softText = theme === "light" ? "text-gray-600" : "text-gray-400";
  const strongText = theme === "light" ? "text-black" : "text-white";

  const handleRevoke = async (tokenId) => {
    try {
      await revokeSession(tokenId).unwrap();
      toast("Session removed");
    } catch {
      toast("Failed to remove session", "error");
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAll().unwrap();
      toast("Logged out from all devices");
    } catch {
      toast("Failed", "error");
    }
  };

  const getDeviceIcon = (ua) => {
    if (!ua) return <Monitor size={18} />;
    if (ua.toLowerCase().includes("mobile"))
      return <Smartphone size={18} />;
    return <Monitor size={18} />;
  };

  return (
    <AdminLayout>
      <div className={`min-h-screen ${pageBg} p-6`}>
        {/* TOAST */}
        {feedback && (
          <div className="fixed bottom-6 right-6 z-50">
            <div
              className={`px-5 py-3 rounded-2xl shadow-2xl text-sm font-black ${
                feedback.type === "success"
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {feedback.msg}
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Active Sessions
            </h2>
            <p className={`mt-2 ${softText}`}>
              Manage devices logged into your account
            </p>
          </div>

          <button
            onClick={handleLogoutAll}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-lg"
          >
            <ShieldAlert size={18} /> Logout All
          </button>
        </div>

        {/* LIST */}
        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center font-bold text-blue-500">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center text-gray-500">
              No active sessions
            </div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.tokenId}
                className={`p-6 rounded-3xl border shadow-xl flex justify-between items-center ${cardBg} ${border}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                    {getDeviceIcon(s.userAgent)}
                  </div>

                  <div>
                    <p className={`font-bold ${strongText}`}>
                      {s.userAgent || "Unknown Device"}
                    </p>
                    <p className={`text-xs ${softText}`}>
                      IP: {s.ip || "N/A"}
                    </p>
                    <p className={`text-xs ${softText}`}>
                      {new Date(s.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRevoke(s.tokenId)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500/20"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
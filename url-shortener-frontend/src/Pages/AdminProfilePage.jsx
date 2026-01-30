import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../App/hook";
import {
  useUpdateMeMutation,
  useChangePasswordMutation,
} from "../Features/auth/authApi";
import AdminLayout from "./AdminLayout";
import { useTheme } from "../App/themeStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Terminal,
  Lock,
  User,
  Save,
  KeyRound,
  Cpu,
  Eye,
  EyeOff,
  Activity,
  Fingerprint,
} from "lucide-react";

const AdminProfile = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const user = useAppSelector((state) => state.auth.user);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  const [updateMe, { isLoading: updatingProfile }] = useUpdateMeMutation();
  const [changePassword, { isLoading: changingPassword }] =
    useChangePasswordMutation();

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: null, message: "" }), 4000);
  };

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === user.name)
      return showFeedback("warning", "Identity parameters already synced.");
    try {
      await updateMe({ name }).unwrap();
      showFeedback("success", "Root identity successfully re-synchronized.");
    } catch (err) {
      showFeedback("error", err?.data?.message || "Protocol update failed.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8)
      return showFeedback(
        "warning",
        "Security breach: Minimum 8 characters required.",
      );

    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setCurrentPassword("");
      setNewPassword("");
      showFeedback("success", "Security vault credentials updated.");
    } catch (err) {
      showFeedback(
        "error",
        err?.data?.message || "Encryption update rejected.",
      );
    }
  };

  return (
    <AdminLayout>
      <div
        className={`min-h-screen px-6 py-12 transition-colors duration-700 ${isDark ? "bg-[#020202] text-white" : "bg-slate-50 text-slate-900"}`}
      >
        {/* AMBIENT BACKGROUND DECOR */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* TOP COMMAND BAR */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-white/5 pb-10">
            <div className="flex items-center gap-8">
              <motion.div
                initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                className={`w-32 h-32 rounded-3xl flex items-center justify-center border-4 shadow-[0_0_50px_rgba(37,99,235,0.2)] relative overflow-hidden ${
                  isDark
                    ? "bg-black border-blue-500/30"
                    : "bg-white border-blue-600"
                }`}
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent" />
                <span className="text-5xl font-black text-blue-600 relative z-10">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
                <motion.div
                  animate={{ y: [0, 128, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 right-0 h-px bg-blue-400 opacity-50 shadow-[0_0_10px_#3b82f6]"
                />
              </motion.div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldAlert size={12} /> Priority: Level 1 (Root)
                  </span>
                  <span className="px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Activity size={12} /> System Active
                  </span>
                </div>
                <h1 className="text-6xl font-black tracking-tighter">
                  Hi, <span className="text-blue-600">{user.name}</span>
                </h1>
                <p
                  className={`mt-2 font-mono text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  UUID: {user?._id?.toUpperCase() || "ADMIN_SESSION_01"}
                </p>
              </div>
            </div>

            <div className="hidden lg:flex gap-4">
              {[
                { l: "CPU", v: "14%" },
                { l: "MEM", v: "2.4GB" },
                { l: "LOGS", v: "SYNCED" },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`px-6 py-3 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}
                >
                  <p className="text-[9px] font-black text-slate-500 uppercase">
                    {s.l}
                  </p>
                  <p className="text-sm font-black font-mono">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FEEDBACK SYSTEM */}
          <div className="h-16 mb-6">
            <AnimatePresence>
              {feedback.message && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-2xl ${
                    feedback.type === "success"
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                      : "bg-red-500/10 border-red-500/20 text-red-500"
                  }`}
                >
                  <Fingerprint size={20} />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    {feedback.message}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ADMINISTRATIVE PROFILE */}
            <motion.form
              whileHover={{ y: -5 }}
              onSubmit={handleProfileSubmit}
              className={`p-10 rounded-[3rem] border shadow-2xl relative overflow-hidden transition-all ${isDark ? "bg-[#080808] border-white/5 shadow-black" : "bg-white border-slate-200 shadow-slate-200/50"}`}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                  <Terminal size={24} />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase">
                  Admin Identity
                </h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 px-1">
                    Network Identity (Read-Only)
                  </label>
                  <div
                    className={`px-6 py-4 rounded-2xl border font-mono text-sm ${isDark ? "bg-black/60 border-white/5 text-slate-500" : "bg-slate-100 border-slate-200"}`}
                  >
                    {user.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 px-1">
                    Full Designation
                  </label>
                  <div className="relative group/input">
                    <User
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500"
                      size={18}
                    />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-14 pr-6 py-4 rounded-2xl border font-bold text-sm outline-none transition-all ${isDark ? "bg-black/40 border-white/10 text-white focus:border-blue-600" : "bg-slate-50 border-slate-200 focus:border-blue-600"}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-blue-600/20"
                >
                  {updatingProfile ? (
                    "SYCHRONIZING..."
                  ) : (
                    <>
                      <Save size={18} /> Deploy Identity
                    </>
                  )}
                </button>
              </div>
            </motion.form>

            {/* SECURITY PROTOCOL */}
            <motion.form
              whileHover={{ y: -5 }}
              onSubmit={handlePasswordSubmit}
              className={`p-10 rounded-[3rem] border shadow-2xl relative overflow-hidden transition-all ${isDark ? "bg-[#080808] border-white/5 shadow-black" : "bg-white border-slate-200 shadow-slate-200/50"}`}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30">
                  <Cpu size={24} />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase">
                  Security Protocol
                </h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 px-1">
                    Current Secret Key
                  </label>
                  <div className="relative">
                    <KeyRound
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500"
                      size={18}
                    />
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`w-full pl-14 pr-14 py-4 rounded-2xl border font-bold text-sm outline-none transition-all ${isDark ? "bg-black/40 border-white/10 text-white focus:border-red-600" : "bg-slate-50 border-slate-200 focus:border-red-600"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-500 transition-colors"
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 px-1">
                    New Master Key
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500"
                      size={18}
                    />
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full pl-14 pr-14 py-4 rounded-2xl border font-bold text-sm outline-none transition-all ${isDark ? "bg-black/40 border-white/10 text-white focus:border-red-600" : "bg-slate-50 border-slate-200 focus:border-red-600"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-500 transition-colors"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full bg-slate-900 dark:bg-red-600 hover:bg-black dark:hover:bg-red-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"
                >
                  {changingPassword ? (
                    "ENCRYPTING..."
                  ) : (
                    <>
                      <ShieldAlert size={18} /> Override Security
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;

import { useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../App/hook";
import {
  useUpdateMeMutation,
  useChangePasswordMutation,
} from "../Features/auth/authapi";
import { setUser } from "../Features/auth/authSlice";
import UserLayout from "./UserLayout";
import { useTheme } from "../App/themeStore";
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Mail, 
  UserCircle, 
  Save, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff
} from "lucide-react";

const Profile = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  // Profile Info State
  const [name, setName] = useState("");
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Visibility State
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [updateMe, { isLoading: updatingProfile }] = useUpdateMeMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

  const feedbackRef = useRef(null);
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  const showFeedback = (type, message, timeout = 3000) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: null, message: "" }), timeout);
  };

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === user.name) return showFeedback("warning", "Name is already up to date");
    try {
       await updateMe({ name }).unwrap();
      //dispatch(setUser(res));
      showFeedback("success", "Profile identity updated successfully");
    } catch (err) {
      showFeedback("error", err?.data?.message || "Profile update failed");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return showFeedback("warning", "Please provide both passwords");
    if (currentPassword === newPassword) return showFeedback("warning", "New password must be different");
    if (newPassword.length < 8) return showFeedback("warning", "Security requirement: 8+ characters");

    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setCurrentPassword("");
      setNewPassword("");
      setShowCurrent(false);
      setShowNew(false);
      showFeedback("success", "Security credentials updated");
    } catch (err) {
      showFeedback("error", err?.data?.message || "Password change failed");
    }
  };

  return (
    <UserLayout>
      <div className={`min-h-screen px-4 md:px-8 py-12 transition-colors duration-500 ${isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"}`}>
        <div className="max-w-4xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center border-4 shadow-2xl transition-transform duration-500 group-hover:rotate-6 ${
                isDark ? "bg-gradient-to-br from-blue-600 to-purple-700 border-white/10" : "bg-blue-600 border-white"
              }`}>
                <span className="text-5xl font-black text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-[#050505] animate-pulse"></div>
            </div>

            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-3">
                <Sparkles size={12} /> Account Inspector
              </div>
              <h1 className="text-5xl font-black tracking-tighter mb-2">
                Hi, <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{user?.name}</span>
              </h1>
              <p className={`text-lg font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Control your digital identity and security parameters.
              </p>
            </div>
          </div>

          {/* FEEDBACK BANNER */}
          <div ref={feedbackRef} className="h-20 mb-4">
            {feedback.message && (
              <div className={`flex items-center gap-3 p-5 rounded-[1.5rem] border shadow-2xl animate-in slide-in-from-top-4 duration-300 ${
                feedback.type === "success" 
                  ? "bg-green-500/10 border-green-500/30 text-green-500" 
                  : feedback.type === "warning" 
                  ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" 
                  : "bg-red-500/10 border-red-500/30 text-red-500"
              }`}>
                {feedback.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span className="font-bold tracking-tight">{feedback.message}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* IDENTITY SECTION */}
            <form onSubmit={handleProfileSubmit} className={`p-8 md:p-10 rounded-[2.5rem] border shadow-2xl ${isDark ? "bg-[#0A0A0A] border-white/10" : "bg-white border-gray-200"}`}>
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 rounded-2xl ${isDark ? "bg-blue-500/10 text-blue-500" : "bg-blue-50 text-blue-600"}`}>
                  <UserCircle size={24} />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Identity</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Mail size={12} /> Email Address
                  </label>
                  <div className={`px-5 py-4 rounded-2xl border font-bold text-sm opacity-60 ${isDark ? "bg-black/40 border-white/5 text-gray-400" : "bg-gray-100 border-gray-200"}`}>
                    {user.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <User size={12} /> Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-5 py-4 rounded-2xl border font-bold text-sm outline-none transition-all ${isDark ? "bg-black/40 border-white/10 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 focus:border-blue-500"}`}
                  />
                </div>

                <button type="submit" disabled={updatingProfile} className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-600/20">
                  {updatingProfile ? "Saving..." : <><Save size={16} /> Save Identity</>}
                </button>
              </div>
            </form>

            {/* SECURITY SECTION (WITH EYE BUTTONS) */}
            <form onSubmit={handlePasswordSubmit} className={`p-8 md:p-10 rounded-[2.5rem] border shadow-2xl ${isDark ? "bg-[#0A0A0A] border-white/10" : "bg-white border-gray-200"}`}>
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 rounded-2xl ${isDark ? "bg-red-500/10 text-red-500" : "bg-red-50 text-red-600"}`}>
                  <ShieldCheck size={24} />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Security</h2>
              </div>

              <div className="space-y-6">
                
                {/* CURRENT PASSWORD */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <KeyRound size={12} /> Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full px-5 py-4 rounded-2xl border font-bold text-sm outline-none transition-all pr-14 ${isDark ? "bg-black/40 border-white/10 text-white focus:border-red-500" : "bg-gray-50 border-gray-200 focus:border-red-500"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors ${isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-900"}`}
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* NEW PASSWORD */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Lock size={12} /> New Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="8+ characters"
                      className={`w-full px-5 py-4 rounded-2xl border font-bold text-sm outline-none transition-all pr-14 ${isDark ? "bg-black/40 border-white/10 text-white focus:border-red-500" : "bg-gray-50 border-gray-200 focus:border-red-500"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors ${isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-900"}`}
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={changingPassword} className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-red-600/20">
                  {changingPassword ? "Updating..." : <><KeyRound size={16} /> Update Security</>}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
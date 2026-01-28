import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../Features/auth/authapi";
import { useTheme } from "../App/themeStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState("");

  const [resetPassword, { isLoading, isSuccess, isError, error }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // --- FRONTEND VALIDATION ---
    if (password.length < 8) {
      return setLocalError("Security Violation: Key must be 8+ characters.");
    }
    if (password !== confirmPassword) {
      return setLocalError("Mismatch Detected: Passwords do not align.");
    }

    try {
      await resetPassword({ token, password }).unwrap();
      // Success state is handled by the UI below
    } catch (err) {
      // Error handled by RTK Query state (isError)
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 overflow-hidden relative transition-colors duration-700 ${
      isDark ? "bg-[#030303]" : "bg-slate-50"
    }`}>
      
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />

      <div className="relative w-full max-w-md">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border-2 mb-6 shadow-2xl ${
              isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-white border-slate-200 text-blue-600"
            }`}
          >
            <ShieldCheck size={32} />
          </motion.div>
          <h2 className={`text-4xl font-black tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}>
            Update <span className="text-blue-600">Secret.</span>
          </h2>
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            Credential Re-Synthesis
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`p-10 rounded-[3rem] border text-center space-y-6 ${
                isDark ? "bg-white/[0.02] border-white/10 shadow-black" : "bg-white border-slate-200"
              }`}
            >
              <div className="h-20 w-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                <CheckCircle2 size={40} />
              </div>
              <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Identity Secured</h3>
              <p className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Your security key has been hashed and updated.
              </p>
              <button 
                onClick={() => navigate("/login")}
                className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all"
              >
                Access Portal
              </button>
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleSubmit}
              className={`p-10 rounded-[3rem] border shadow-2xl space-y-7 backdrop-blur-xl transition-all ${
                isDark ? "bg-white/[0.02] border-white/10 shadow-black" : "bg-white border-slate-200 shadow-slate-200/50"
              }`}
            >
              {/* NEW PASSWORD */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex justify-between px-1">
                  <span>New Secret Key</span>
                  <span className={`${password.length >= 8 ? "text-green-500" : "text-gray-500"}`}>
                    {password.length}/8
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setLocalError(""); }}
                    className={`w-full px-6 py-4 pr-14 rounded-2xl border font-bold text-sm outline-none transition-all ${
                      isDark ? "bg-black/40 border-white/10 text-white focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                      isDark ? "text-slate-600 hover:text-white" : "text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 px-1">
                  Confirm Synthesis
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setLocalError(""); }}
                    className={`w-full px-6 py-4 pr-14 rounded-2xl border font-bold text-sm outline-none transition-all ${
                      isDark ? "bg-black/40 border-white/10 text-white focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                      isDark ? "text-slate-600 hover:text-white" : "text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* ENHANCED ERROR UI */}
              <AnimatePresence>
                {(localError || isError) && (
                  <motion.div 
                    initial={{ x: -10, opacity: 0 }} 
                    animate={{ x: [0, -5, 5, -5, 5, 0], opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase"
                  >
                    <AlertCircle size={14} /> {localError || error?.data?.message || "Synthesis Failed"}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className={`group w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                  isDark ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30" : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20"
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Deploy Key <Zap size={16} className="fill-current" /></>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
          Security Protocol Enabled • Version 2.0.4
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
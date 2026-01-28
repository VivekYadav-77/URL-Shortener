import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../Features/auth/authapi"; // Ensure this hook exists in your API slice
import { useTheme } from "../App/themeStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  ArrowLeft,
  ShieldQuestion
} from "lucide-react";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  // Hook from your RTK Query API slice
  const [forgotPassword, { isLoading, isSuccess, isError, error }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validation (Matching your Login logic)
    if (!email.includes("@") || !email.includes(".")) {
      return setLocalError("Valid identity portal required");
    }
    if (!email.endsWith("@gmail.com")) {
      return setLocalError("Only Gmail accounts are authorized");
    }

    try {
      await forgotPassword( email ).unwrap();
    } catch (err) {
      // Error handled by RTK state
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 overflow-hidden relative transition-colors duration-700 ${
      isDark ? "bg-[#020202]" : "bg-slate-50"
    }`}>
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="relative w-full max-w-md">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate("/login")}
          className={`absolute -top-12 left-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
            isDark ? "text-slate-600 hover:text-white" : "text-slate-400 hover:text-slate-900"
          }`}
        >
          <ArrowLeft size={14} /> Return to Access
        </button>

        {/* HEADER */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border-2 mb-6 shadow-2xl ${
              isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-white border-slate-200 text-blue-600"
            }`}
          >
            <ShieldQuestion size={32} />
          </motion.div>
          <h2 className={`text-4xl font-black tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}>
            Recover <span className="text-blue-600">Access.</span>
          </h2>
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            Identity Verification Request
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
              <div className="h-20 w-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                <Mail size={40} />
              </div>
              <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Link Dispatched</h3>
              <p className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                A secure synthesis link has been sent to <span className="text-blue-500 font-bold">{email}</span>.
              </p>
              <p className="text-[10px] uppercase font-black text-slate-600 tracking-tighter">
                Check your inbox (and spam) to continue.
              </p>
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleSubmit}
              className={`p-10 rounded-[3rem] border shadow-2xl space-y-7 backdrop-blur-xl transition-all ${
                isDark ? "bg-white/[0.02] border-white/10 shadow-black" : "bg-white border-slate-200 shadow-slate-200/50"
              }`}
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 px-1">
                  Identity Portal (Email)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setLocalError(""); }}
                    className={`w-full px-6 py-4 rounded-2xl border font-bold text-sm outline-none transition-all ${
                      isDark ? "bg-black/40 border-white/10 text-white focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              {/* ERROR ALERT */}
              <AnimatePresence>
                {(localError || isError) && (
                  <motion.div 
                    initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase"
                  >
                    <AlertCircle size={14} /> {localError || error?.data?.message || "Verification Failed"}
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
                  <>Send Link <Zap size={16} className="fill-current" /></>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
          Recovery Protocol v2.0 • Secure Transmission
        </p>
      </div>
    </div>
  );
};


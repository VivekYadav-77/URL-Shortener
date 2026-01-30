import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVerifyEmailQuery } from "../Features/auth/authApi";
import { useTheme } from "../App/themeStore";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Loader2, Zap, ShieldCheck } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";
import LogoIcon from "../components/ui/Logo";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, error, isLoading, isSuccess } = useVerifyEmailQuery(token, {
    skip: !token,
  });

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => navigate("/login"), 5000);
      return () => clearTimeout(timeout);
    }
  }, [isSuccess, navigate]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 overflow-hidden relative transition-colors duration-700 ${isDark ? "bg-[#030303]" : "bg-slate-50"}`}
    >
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-600/20 blur-[120px] rounded-full" />

      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-8 relative z-20 w-20 h-20 rounded-3xl flex items-center justify-center border-4 border-blue-600 shadow-2xl bg-blue-600"
        >
          <LogoIcon className="text-white w-10 h-10" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`w-full rounded-[2.5rem] p-10 border shadow-2xl text-center backdrop-blur-2xl ${
            isDark
              ? "bg-white/3 border-white/10 shadow-black"
              : "bg-white/80 border-slate-200 shadow-slate-200/50"
          }`}
        >
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <Loader2
                  className="mx-auto animate-spin text-blue-500"
                  size={48}
                />
                <h2
                  className={`text-2xl font-black tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  VALIDATING...
                </h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                  Checking Digital Signature
                </p>
              </motion.div>
            )}

            {isSuccess && (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-6"
              >
                <div className="bg-green-500/10 w-20 h-20 mx-auto rounded-full flex items-center justify-center text-green-500">
                  <ShieldCheck size={40} />
                </div>
                <div>
                  <h2
                    className={`text-2xl font-black tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    IDENTITY VERIFIED
                  </h2>
                  <p className="text-[10px] font-bold text-green-500/80 uppercase tracking-widest mt-2">
                    Redirecting to portal in 5s...
                  </p>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  Enter Now <Zap size={14} />
                </button>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-6"
              >
                <XCircle className="mx-auto text-red-500" size={50} />
                <h2
                  className={`text-2xl font-black tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  LINK EXPIRED
                </h2>
                <p className="text-xs text-red-500 font-medium">
                  This verification token has been corrupted or used.
                </p>
                <button
                  onClick={() => navigate("/register")}
                  className="text-blue-500 font-bold text-xs uppercase tracking-widest hover:underline"
                >
                  Request New Link
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;

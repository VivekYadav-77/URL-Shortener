import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../Features/auth/authapi";
import { useAppDispatch, useAppSelector } from "../App/hook";
import { setUser } from "../Features/auth/authSlice";
import { useTheme } from "../App/themeStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Mail, 
  ChevronRight, 
  Zap, 
  AlertCircle, 
  Eye, 
  EyeOff 
} from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";
import LogoIcon from "../components/ui/Logo";

const Login = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Visibility State
  const [isCompressed, setIsCompressed] = useState(false);

  const { isAuthenticated, authChecked, user } = useAppSelector((state) => state.auth);
  const [login, { isLoading, isError, error }] = useLoginMutation();

  useEffect(() => {
    if (authChecked && isAuthenticated) {
      navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
    }
  }, [authChecked, isAuthenticated, navigate, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password }).unwrap().then((res) => {
      dispatch(setUser(res.user));
      navigate(res.user.role === "admin" ? "/admin" : "/", { replace: true });
    });
  };

  if (!authChecked) return null;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 overflow-hidden relative transition-colors duration-700 ${
      isDark ? "bg-[#030303]" : "bg-slate-50"
    }`}>
      
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md flex flex-col items-center">
        
        {/* COMPRESSION ANIMATION */}
        <div className="relative h-40 w-full flex items-center justify-center mb-4">
          <AnimatePresence>
            {!isCompressed && (
              <motion.div 
                className="absolute flex items-center gap-1 whitespace-nowrap"
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: [0, 1, 1, 0], x: -200 }}
                transition={{ duration: 2.5, times: [0, 0.2, 0.8, 1], repeat: 0 }}
                onAnimationComplete={() => setIsCompressed(true)}
              >
                <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                <span className={`text-[10px] font-mono font-bold tracking-tighter ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                  https://very-long-and-complex-url-path-data-analytics...
                </span>
                <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isCompressed ? { scale: 1, rotate: 0 } : { scale: 0.5, rotate: -180 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className={`relative z-20 w-24 h-24 rounded-[2rem] flex items-center justify-center border-4 shadow-2xl transition-all ${
              isDark ? "bg-blue-600 border-white/10 shadow-blue-900/40" : "bg-blue-600 border-white shadow-blue-200"
            }`}
          >
            <LogoIcon className="text-white w-12 h-12" />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-[2rem] border-2 border-blue-400 pointer-events-none" 
            />
          </motion.div>
        </div>

        {/* HEADER */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isCompressed ? { opacity: 1, y: 0 } : {}}
        >
          <h1 className={`text-5xl font-black tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}>
            Shorten <span className="text-blue-600">Life.</span>
          </h1>
          <p className={`text-sm mt-3 font-bold uppercase tracking-[0.2em] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            Secure Access to Shortly
          </p>
        </motion.div>

        {/* LOGIN FORM */}
        <AnimatePresence>
          {isCompressed && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`w-full rounded-[3rem] p-10 border shadow-2xl space-y-7 backdrop-blur-xl ${
                isDark ? "bg-white/[0.02] border-white/10 shadow-black" : "bg-white border-slate-200 shadow-slate-200/50"
              }`}
            >
              <div className="space-y-5">
                {/* IDENTITY FIELD */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2 px-1">
                    <Mail size={14} /> Identity
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-6 py-4 rounded-2xl border font-bold text-sm outline-none transition-all ${
                      isDark ? "bg-black/40 border-white/10 text-white focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                    }`}
                  />
                </div>

                {/* SECRET KEY FIELD (PASSWORD WITH EYE) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2 px-1">
                    <Lock size={14} /> Secret Key
                  </label>
                  <div className="relative group/input">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-6 py-4 pr-14 rounded-2xl border font-bold text-sm outline-none transition-all ${
                        isDark ? "bg-black/40 border-white/10 text-white focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                        isDark ? "text-slate-600 hover:text-white" : "text-slate-400 hover:text-slate-900"
                      }`}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {isError && (
                <motion.div initial={{ x: -10 }} animate={{ x: 0 }} className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
                  <AlertCircle size={16} /> {error?.data?.message || "Invalid Access"}
                </motion.div>
              )}

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
                  <>Authorize <Zap size={16} className="fill-current" /></>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <motion.div className="mt-10" initial={{ opacity: 0 }} animate={isCompressed ? { opacity: 1 } : {}}>
          <button
            onClick={() => navigate("/register")}
            className={`text-xs font-black uppercase tracking-widest transition-all hover:tracking-[0.2em] ${
              isDark ? "text-slate-600 hover:text-blue-500" : "text-slate-400 hover:text-blue-600"
            }`}
          >
            Create New Identity →
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../Features/auth/authapi";
import { useAppSelector } from "../App/hook";
import { useTheme } from "../App/themeStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  UserPlus,
  Zap,
  Sparkles
} from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";
import LogoIcon from "../components/ui/Logo";

const Register = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSynthesized, setIsSynthesized] = useState(false);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [register, { isLoading, isSuccess, isError, error }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) navigate("/login");
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (name.length < 3) return setFormError("Username must be at least 3 characters");
    if (password.length < 8) return setFormError("Security requirement: 8+ characters");

    register({ email, password, name });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 overflow-hidden relative transition-colors duration-700 ${
      isDark ? "bg-[#030303]" : "bg-slate-50"
    }`}>
      
      {/* THEME TOGGLE */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md flex flex-col items-center">
        
        {/* SYNTHESIS ANIMATION (Data Expanding into Logo) */}
        <div className="relative h-40 w-full flex items-center justify-center mb-4">
          <AnimatePresence>
            {!isSynthesized && (
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-1 w-1 bg-blue-500 rounded-full"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ 
                      x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 150), 
                      y: (i % 3 === 0 ? 1 : -1) * (Math.random() * 100),
                      opacity: [0, 1, 0] 
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  onAnimationComplete={() => setIsSynthesized(true)}
                  className="text-blue-500"
                >
                  <UserPlus size={40} strokeWidth={1} />
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={isSynthesized ? { scale: 1, rotate: 0 } : { scale: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className={`relative z-20 w-24 h-24 rounded-[2rem] flex items-center justify-center border-4 shadow-2xl transition-all ${
              isDark ? "bg-blue-600 border-white/10 shadow-blue-900/40" : "bg-blue-600 border-white shadow-blue-200"
            }`}
          >
            <LogoIcon className="text-white w-12 h-12" />
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-[2rem] border-2 border-blue-300/50 pointer-events-none" 
            />
          </motion.div>
        </div>

        {/* HEADER */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isSynthesized ? { opacity: 1, y: 0 } : {}}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={12} /> Account Synthesis
          </div>
          <h1 className={`text-5xl font-black tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}>
            Join <span className="text-blue-600">Shortly.</span>
          </h1>
        </motion.div>

        {/* REGISTER FORM CARD */}
        <AnimatePresence>
          {isSynthesized && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`w-full rounded-[3rem] p-8 sm:p-10 border shadow-2xl space-y-6 backdrop-blur-xl ${
                isDark ? "bg-white/[0.02] border-white/10 shadow-black" : "bg-white border-slate-200 shadow-slate-200/50"
              }`}
            >
              <div className="space-y-4">
                {/* USERNAME */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2 px-1">
                    <UserIcon size={14} /> Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ShortyExplorer"
                    value={name}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full px-6 py-4 rounded-2xl border font-bold text-sm outline-none transition-all ${
                      isDark ? "bg-black/40 border-white/10 text-white focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                    }`}
                  />
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2 px-1">
                    <Mail size={14} /> Email Portal
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-6 py-4 rounded-2xl border font-bold text-sm outline-none transition-all ${
                      isDark ? "bg-black/40 border-white/10 text-white focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                    }`}
                  />
                </div>

                {/* PASSWORD + EYE TOGGLE */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2 px-1">
                    <Lock size={14} /> Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="8+ characters"
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

              {/* ERROR STATES */}
              {(formError || isError) && (
                <motion.div initial={{ x: -10 }} animate={{ x: 0 }} className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
                  <AlertCircle size={16} /> {formError || error?.data?.message || "Synthesis Failed"}
                </motion.div>
              )}

              {/* REGISTER BUTTON */}
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
                  <>Synthesize <Zap size={16} className="fill-current" /></>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* LOGIN FOOTER */}
        <motion.div className="mt-10" initial={{ opacity: 0 }} animate={isSynthesized ? { opacity: 1 } : {}}>
          <button
            onClick={() => navigate("/login")}
            className={`text-xs font-black uppercase tracking-widest transition-all hover:tracking-[0.2em] ${
              isDark ? "text-slate-600 hover:text-blue-500" : "text-slate-400 hover:text-blue-600"
            }`}
          >
            Existing Identity? Access Here →
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
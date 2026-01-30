import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../App/themeStore";
import { User, Code, Cpu, Globe, Zap, ShieldCheck, X } from "lucide-react";
import vk from '../../public/Vivek.png'
const AboutUs = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const stats = [
    { icon: <Zap size={20} />, label: "Speed", value: "99.9%" },
    { icon: <ShieldCheck size={20} />, label: "Security", value: "AES-256" },
    { icon: <Globe size={20} />, label: "Global", value: "24/7" },
  ];

  return (
    <section
      className={`min-h-screen py-20 px-6 relative overflow-hidden transition-colors duration-700 ${
        isDark ? "bg-[#030303] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* --- CROSS EXIT BUTTON --- */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate(-1)}
        className={`fixed top-8 right-8 z-100 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-colors ${
          isDark
            ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
            : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
        }`}
      >
        <X size={24} strokeWidth={3} />
      </motion.button>

      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-4"
          >
            The Genesis Protocol
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter"
          >
            Inside <span className="text-blue-600">Shortly</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* IMAGE PORTAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-[4rem] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />

            <div
              className={`relative aspect-square rounded-[3.5rem] border-2 overflow-hidden flex items-center justify-center ${
                isDark
                  ? "bg-black/40 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex flex-col items-center gap-4 text-slate-500">
                <div className="relative">
                  <User size={120} strokeWidth={1} className="opacity-20" />
                  <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                  />
                </div>
                <img
                  src={vk}
                  alt="Vivek Yadav Identity"
                  className="absolute inset-0 w-full h-full object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-700"
                />
              </div>

              <div className="absolute bottom-6 left-6 right-6 p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-blue-500 uppercase">
                      System Architect
                    </p>
                    <p className="text-sm font-black uppercase">VIVEK YADAV</p>
                  </div>
                  <Cpu size={20} className="text-slate-500" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* TEXT CONTENT */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-black tracking-tight uppercase">
                Re-Engineering Digital Shortcuts
              </h3>
              <p
                className={`text-lg leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                Shortly isn't just a URL utility. It's a high-performance
                identity portal designed to compress the distance between data
                and discovery. We believe that security shouldn't be a hurdle,
                but a foundation.
              </p>
            </motion.div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-3xl border flex flex-col items-center gap-2 ${
                    isDark
                      ? "bg-white/2 border-white/10"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="text-blue-500">{stat.icon}</div>
                  <div className="text-[9px] font-black uppercase tracking-tighter opacity-50">
                    {stat.label}
                  </div>
                  <div className="text-sm font-black">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA / SIGNATURE */}
            <button onclick="window.open('https://github.com/VivekYadav-77', '_blank', 'noopener,noreferrer')">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-6 border-t border-white/10 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <Code size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                    Developed By
                  </p>
                  <a href="https://github.com/VivekYadav-77" target="_blank">
                    Vivek Yadav
                  </a>
                </div>
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

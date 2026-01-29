import { useTheme } from "../../App/themeStore";
import { Sun, Moon, Sparkles } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="fixed right-6 bottom-6 md:right-10 md:bottom-10 z-100 group">
      {/* DECORATIVE AMBIENT GLOW */}
      <div
        className={`
        absolute inset-0 rounded-full blur-2xl opacity-40 transition-all duration-700
        ${isDark ? "bg-purple-600 scale-150" : "bg-yellow-400 scale-125"}
      `}
      />

      <button
        onClick={toggleTheme}
        className={`
          relative flex items-center justify-center
          w-14 h-14 rounded-3xl border shadow-2xl
          backdrop-blur-xl transition-all duration-500
          active:scale-90 hover:scale-110 hover:-rotate-12
          ${
            isDark
              ? "bg-[#0A0A0A]/80 border-white/10 text-purple-400 shadow-purple-900/20"
              : "bg-white/80 border-gray-200 text-yellow-600 shadow-gray-200"
          }
        `}
      >
        {/* ICON CONTAINER WITH ROTATION LOGIC */}
        <div className="relative w-6 h-6">
          <div
            className={`
            absolute inset-0 transition-all duration-500 transform
            ${isDark ? "rotate-0 opacity-100 scale-100" : "rotate-90 opacity-0 scale-0"}
          `}
          >
            <Moon size={24} fill="currentColor" fillOpacity={0.2} />
          </div>

          <div
            className={`
            absolute inset-0 transition-all duration-500 transform
            ${isDark ? "-rotate-90 opacity-0 scale-0" : "rotate-0 opacity-100 scale-100"}
          `}
          >
            <Sun size={24} fill="currentColor" fillOpacity={0.2} />
          </div>
        </div>

        {/* FLOATING SPARKLE DECORATION */}
        <div
          className={`
          absolute -top-1 -right-1 transition-opacity duration-500
          ${isDark ? "opacity-100" : "opacity-0"}
        `}
        >
          <Sparkles size={14} className="text-purple-300 animate-pulse" />
        </div>
      </button>

      {/* TOOLTIP ON HOVER */}
      <div
        className={`
        absolute bottom-full right-0 mb-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest
        opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0
        pointer-events-none whitespace-nowrap border
        ${isDark ? "bg-white text-black border-white" : "bg-black text-white border-black"}
      `}
      >
        Switch to {isDark ? "Light" : "Dark"} Mode
      </div>
    </div>
  );
};

export default ThemeToggle;

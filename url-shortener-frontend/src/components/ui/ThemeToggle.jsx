import { useTheme } from "../../App/themeStore";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const btnClass =
    theme === "light"
      ? "bg-gray-900 text-white"
      : "bg-white text-gray-900";

  return (
    <button
      onClick={toggleTheme}
      className={`
        fixed right-6 bottom-6 md:right-8 md:bottom-8
        p-3 rounded-full shadow-lg border
        hover:scale-105 transition
        ${btnClass}
      `}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};
export default ThemeToggle
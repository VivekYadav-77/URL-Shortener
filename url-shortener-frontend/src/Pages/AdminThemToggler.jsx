import { useTheme } from "../../context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        fixed right-6 bottom-6 md:right-8 md:bottom-8
        bg-gray-900 dark:bg-white
        text-white dark:text-gray-900
        p-3 rounded-full shadow-lg border
        hover:scale-105 transition
      "
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};

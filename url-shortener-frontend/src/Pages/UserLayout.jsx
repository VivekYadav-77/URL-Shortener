import { useState } from "react";
import  ThemeToggle  from "../components/ui/ThemeToggle";
import Navbar from "../components/layout/Navbar";
import { UserSidebar } from "./UserSidebar";
import { useTheme } from "../App/themeStore";

const UserLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const bg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white/80" : "bg-gray-900/60";
  const border = theme === "light" ? "border-gray-200" : "border-gray-800";
  const backdrop = theme === "light" ? "bg-black/10" : "bg-black/40";

  return (
    <div className={`flex min-h-screen transition-colors ${bg}`}>
      
      {/* NAVBAR */}
      <Navbar />

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`
          hidden md:flex flex-col
          w-64 fixed top-16 bottom-0 left-0
          ${cardBg} ${border}
          border-r backdrop-blur-xl shadow-xl p-4 z-40
        `}
      >
        <UserSidebar onNavigate={() => setIsOpen(false)} />
      </aside>

      {/* MOBILE BACKDROP */}
      {isOpen && (
        <div
          className={`md:hidden fixed inset-0 ${backdrop} backdrop-blur-sm z-40`}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`
          md:hidden fixed top-16 bottom-0 left-0 z-50
          w-64 p-4
          backdrop-blur-2xl shadow-2xl
          border-r ${border}
          ${cardBg}
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <UserSidebar onNavigate={() => setIsOpen(false)} />
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`
          flex-1 md:ml-64 p-6 mt-16
          transition-colors
          ${bg}
        `}
      >
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {children}
      </main>

      {/* FLOATING MENU BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          md:hidden fixed bottom-6 left-6
          bg-blue-600 text-white
          px-4 py-3 rounded-full shadow-lg
          hover:bg-blue-700 transition
        "
      >
        ☰
      </button>
    </div>
  );
};

export default UserLayout;

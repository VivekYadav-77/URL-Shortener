import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import { Sidebar } from "./AdminSidebar";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useTheme } from "../App/themeStore";

const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const bgPage = theme === "light" ? "bg-white" : "bg-black";
  const bgSidebar = theme === "light" ? "bg-white" : "bg-gray-900";
  const borderColor = theme === "light" ? "border-gray-300" : "border-gray-700";

  return (
    <div className={`min-h-screen ${bgPage} transition-colors`}>

      {/* TOP NAVBAR */}
      <Navbar />

      <div className="flex">

        {/* DESKTOP SIDEBAR */}
        <aside
          className={`
            hidden md:flex fixed top-16 bottom-0 left-0 w-64
            ${bgSidebar} ${borderColor} border-r
            p-4 overflow-y-auto transition-colors
          `}
        >
          <Sidebar isMobile={false} />
        </aside>

        {/* MOBILE OVERLAY */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* MOBILE SIDEBAR */}
        <aside
          className={`
            md:hidden fixed top-16 bottom-0 left-0 z-50
            w-64 p-4
            ${bgSidebar} ${borderColor} border-r
            transform transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Sidebar onNavigate={() => setIsOpen(false)} isMobile={true} />
        </aside>

        {/* MAIN CONTENT */}
        <main
          className={`
            flex-1 md:ml-64 p-6 mt-16 min-h-[calc(100vh-4rem)]
            transition-colors
          `}
        >
          {children}
        </main>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsOpen(true)}
          className="
            md:hidden fixed bottom-6 left-6 bg-blue-600 text-white
            px-4 py-3 rounded-full shadow-lg
          "
        >
          ☰
        </button>
      </div>

      {/* GLOBAL THEME TOGGLE */}
      <ThemeToggle />
    </div>
  );
};

export default AdminLayout;

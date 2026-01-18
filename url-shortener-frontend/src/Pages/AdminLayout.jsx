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
  const textColor = theme === "light" ? "text-gray-900" : "text-gray-200";
  const borderColor = theme === "light" ? "border-gray-300" : "border-gray-700";

  return (
    <div
      className={`min-h-screen ${bgPage} ${textColor} transition-colors`}
      style={{ overflowX: "hidden" }}   // ✅ FIX: No horizontal scroll ever
    >
      <Navbar />

      <div className="flex relative">

        {/* DESKTOP SIDEBAR */}
        <aside
          className={`
            hidden md:flex
            fixed top-16 bottom-0 left-0
            w-64 p-4 overflow-y-auto
            ${bgSidebar} ${borderColor} border-r
            transition-colors
            z-30
          `}
        >
          <Sidebar isMobile={false} />
        </aside>

        {/* MOBILE OVERLAY */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* MOBILE SLIDE SIDEBAR */}
        <aside
          className={`
            md:hidden
            fixed top-16 bottom-0 left-0 z-50
            w-64 p-4
            ${bgSidebar} ${borderColor} border-r shadow-xl
            transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          style={{ willChange: "transform" }}  // smooth, no layout shift
        >
          <Sidebar onNavigate={() => setIsOpen(false)} isMobile={true} />
        </aside>

        {/* MAIN CONTENT */}
        <main
          className={`
            flex-1
            md:ml-64               // Only on desktop
            p-6
            mt-16
            min-h-[calc(100vh-4rem)]
            transition-colors duration-300
            ${theme === "light"
              ? "bg-gradient-to-br from-gray-50 to-gray-100"
              : "bg-gradient-to-br from-black to-gray-900"
            }
          `}
          style={{ overflowX: "hidden" }}  // ❌ prevents inner accidental scroll
        >
          {children}
        </main>

        {/* FLOATING MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsOpen(true)}
          className="
            md:hidden
            fixed bottom-6 left-6 z-50
            bg-blue-600 dark:bg-blue-500 text-white
            px-4 py-3 rounded-full shadow-lg
            active:scale-95 transition
          "
        >
          ☰
        </button>
      </div>

      <ThemeToggle />
    </div>
  );
};

export default AdminLayout;

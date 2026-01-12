import { useState } from "react";
import { ThemeToggle } from "./AdminThemToggler";
import Navbar from "../components/layout/Navbar";
import { NavLink } from "react-router-dom";
import { UserSidebar } from "./UserSidebar";
const UserLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* DESKTOP SIDEBAR */}
      <aside
        className="
          hidden md:flex flex-col
          w-64 fixed top-16 bottom-0 left-0
          bg-white dark:bg-gray-800
          border-r dark:border-gray-700
          p-4 z-40
        "
      >
        <UserSidebar onNavigate={() => setIsOpen(false)} />
      </aside>

      {/* MOBILE BACKDROP */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <aside
        className={`
          md:hidden fixed top-16 bottom-0 left-0 z-50
          w-64 p-4
          bg-white dark:bg-gray-800 border-r dark:border-gray-700
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <UserSidebar onNavigate={()=>setIsOpen(false)} />
      </aside>

      {/* PAGE CONTENT */}
      <main
        className="
          flex-1 md:ml-64
          p-6 mt-16
          overflow-y-auto
        "
      >
        <ThemeToggle />
        {children}
      </main>

      {/* MOBILE OPEN BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          md:hidden fixed bottom-6 left-6
          bg-blue-600 text-white
          px-4 py-3 rounded-full shadow-lg
        "
      >
        ☰
      </button>
    </div>
  );
};

export default UserLayout;

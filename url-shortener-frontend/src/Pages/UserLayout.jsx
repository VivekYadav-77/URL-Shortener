import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import { ThemeToggle } from "./AdminThemToggler"; 
import { UserSidebar } from "./UserSidebar";

const UserLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Global navbar */}
      <Navbar />

      {/* Desktop Sidebar */}
      <aside
        className="
          hidden md:flex
          w-64
          fixed top-16 bottom-0 left-0
          bg-white dark:bg-gray-800
          border-r dark:border-gray-700
          p-4
        "
      >
        <UserSidebar />
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`
          md:hidden fixed top-16 bottom-0 left-0 z-50
          w-64 p-4 bg-white dark:bg-gray-800 border-r dark:border-gray-700
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <UserSidebar onNavigate={() => setIsOpen(false)} />
      </aside>

      {/* Main Content */}
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

      {/* Mobile FAB Menu Button */}
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

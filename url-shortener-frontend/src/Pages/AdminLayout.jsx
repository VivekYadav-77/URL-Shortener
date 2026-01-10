import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import { Sidebar } from "./AdminSidebar";
import { ThemeToggle } from "./AdminThemToggler";

const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* GLOBAL NAVBAR */}
      <Navbar />

      <div className="flex">

        {/* DESKTOP SIDEBAR (fixed left, full height) */}
        <aside
          className="
            hidden md:flex
            fixed top-16 bottom-0 left-0 w-64
            bg-white dark:bg-gray-800
            border-r dark:border-gray-700
            p-4 overflow-y-auto
          "
        >
          <Sidebar isMobile={false}/>
        </aside>

        {/* MOBILE SIDEBAR OVERLAY */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* MOBILE SIDEBAR DRAWER */}
        <aside
  className={`
    md:hidden fixed top-16 bottom-0 left-0 z-50
    w-64 p-4
    bg-white dark:bg-gray-800 border-r dark:border-gray-700
    transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `}
>
  <Sidebar onNavigate={() => setIsOpen(false)} isMobile={true} />
</aside>

        {/* MAIN CONTENT (scrollable) */}
        <main
          className="
            flex-1
            md:ml-64 
            p-6
            mt-16
            overflow-y-auto 
            min-h-[calc(100vh-4rem)]
          "
        >
          {children}
        </main>

        {/* MOBILE MENU BUTTON (TOP LEFT) */}
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

      {/* GLOBAL THEME TOGGLER (NOT inside main!) */}
      <ThemeToggle />
    </div>
  );
};

export default AdminLayout;

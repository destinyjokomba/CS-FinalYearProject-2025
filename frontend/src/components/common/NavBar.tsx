// src/components/common/NavBar.tsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "@/context/useAuth";

const NavBar: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const isLanding = location.pathname === "/";

  const links = [
    { to: "/survey", label: "Survey" },
    { to: "/results", label: "Results" },
    { to: "/history", label: "History" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/settings", label: "Settings" },
  ];

  const resolveLink = (to: string) => (isLoggedIn ? to : "/login");

  return (
    <nav className="w-full bg-white dark:bg-slate-900 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold dark:text-white">
          Votelytics
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.to}
              to={resolveLink(link.to)}
              className={`text-gray-700 dark:text-gray-200 hover:text-blue-500 ${
                location.pathname === link.to ? "font-semibold text-blue-500" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <button
              onClick={() => setIsLoggedIn(false)}
              className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            isLanding && (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 transition"
              >
                Login
              </Link>
            )
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-2.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl text-gray-700 dark:text-gray-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-4 space-y-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={resolveLink(link.to)}
              onClick={() => setMenuOpen(false)}
              className={`block text-gray-700 dark:text-gray-200 ${
                location.pathname === link.to ? "font-semibold text-blue-500" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setMenuOpen(false);
              }}
              className="w-full px-3 py-1.5 rounded-md bg-red-500 text-white text-sm"
            >
              Logout
            </button>
          ) : (
            isLanding && (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full px-3 py-1.5 rounded-md bg-blue-500 text-white text-sm"
              >
                Login
              </Link>
            )
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              setMenuOpen(false);
            }}
            className="w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

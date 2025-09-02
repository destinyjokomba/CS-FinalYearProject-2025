import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/common/NavBar.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import auth from "@/context/useAuth";
const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains("dark"));
    const [menuOpen, setMenuOpen] = useState(false);
    const isLoggedIn = auth.isLoggedIn();
    const user = auth.getUser();
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);
    const handleLogout = () => {
        auth.setUser(null);
        localStorage.removeItem("token");
        navigate("/login");
    };
    const isLanding = location.pathname === "/";
    const links = [
        { to: "/survey", label: "Survey" },
        { to: "/results", label: "Results" },
        { to: "/history", label: "History" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/settings", label: "Settings" },
    ];
    const resolveLink = (to) => (isLoggedIn ? to : "/login");
    return (_jsxs("nav", { className: "sticky top-0 z-50 bg-white dark:bg-slate-900 shadow", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-2 flex items-center justify-between", children: [_jsx(Link, { to: "/", className: "text-lg font-bold dark:text-white", children: "Votelytics" }), _jsxs("div", { className: "hidden md:flex items-center gap-4 text-sm", children: [links.map((link) => (_jsx(Link, { to: resolveLink(link.to), className: `text-gray-700 dark:text-gray-200 hover:text-blue-500 ${location.pathname === link.to ? "font-semibold text-blue-500" : ""}`, children: link.label }, link.to))), isLoggedIn ? (_jsxs(_Fragment, { children: [user && (_jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-300", children: ["Hi, ", user.displayName || user.username, " \uD83D\uDC4B"] })), _jsx("button", { onClick: handleLogout, className: "px-3 py-1.5 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition", children: "Logout" })] })) : (isLanding && (_jsx(Link, { to: "/login", className: "px-3 py-1.5 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 transition", children: "Login" }))), _jsx("button", { onClick: () => setDarkMode(!darkMode), className: "px-2.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm", children: darkMode ? "☀️" : "🌙" })] }), _jsx("button", { className: "md:hidden text-2xl text-gray-700 dark:text-gray-200", onClick: () => setMenuOpen(!menuOpen), children: menuOpen ? _jsx(FiX, {}) : _jsx(FiMenu, {}) })] }), menuOpen && (_jsxs("div", { className: "md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-4 space-y-4", children: [links.map((link) => (_jsx(Link, { to: resolveLink(link.to), onClick: () => setMenuOpen(false), className: `block text-gray-700 dark:text-gray-200 ${location.pathname === link.to ? "font-semibold text-blue-500" : ""}`, children: link.label }, link.to))), isLoggedIn ? (_jsxs(_Fragment, { children: [user && (_jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-300 mb-2", children: ["Hi, ", user.displayName || user.username, " \uD83D\uDC4B"] })), _jsx("button", { onClick: handleLogout, className: "w-full px-3 py-1.5 rounded-md bg-red-500 text-white text-sm", children: "Logout" })] })) : (isLanding && (_jsx(Link, { to: "/login", onClick: () => setMenuOpen(false), className: "block w-full px-3 py-1.5 rounded-md bg-blue-500 text-white text-sm", children: "Login" }))), _jsx("button", { onClick: () => {
                            setDarkMode(!darkMode);
                            setMenuOpen(false);
                        }, className: "w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm", children: darkMode ? "☀️ Light" : "🌙 Dark" })] }))] }));
};
export default NavBar;

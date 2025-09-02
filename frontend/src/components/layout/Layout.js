import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/layout/Layout.tsx
import { Outlet } from "react-router-dom";
import NavBar from "@/components/common/NavBar";
const Layout = () => {
    return (_jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx(NavBar, {}), _jsxs("main", { className: "flex-grow", children: [_jsx(Outlet, {}), " "] }), _jsxs("footer", { className: "bg-gray-100 dark:bg-slate-900 py-4 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-slate-700", children: ["\uD83D\uDD12 We never share your data. All data is securely stored | Created \u2764\uFE0F by", " ", _jsx("span", { className: "font-semibold", children: "Destiny Jokomba" })] })] }));
};
export default Layout;

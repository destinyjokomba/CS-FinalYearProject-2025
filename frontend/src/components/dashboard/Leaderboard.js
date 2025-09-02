import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaMedal, FaCertificate } from "react-icons/fa";
const mockLeaderboard = [
    { username: "Alice", surveys: 10, badges: 4 },
    { username: "Bob", surveys: 8, badges: 3 },
    { username: "Charlie", surveys: 6, badges: 2 },
    { username: "Destiny", surveys: 5, badges: 2 },
    { username: "Eve", surveys: 4, badges: 1 },
];
const medalColors = ["text-yellow-500", "text-gray-400", "text-orange-500"];
const Leaderboard = () => {
    return (_jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow p-6", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "\uD83C\uDFC6 Leaderboard" }), _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b dark:border-slate-700 text-slate-600 dark:text-slate-300", children: [_jsx("th", { className: "py-2 text-center", children: "Rank" }), _jsx("th", { className: "py-2", children: "User" }), _jsx("th", { className: "py-2", children: "Surveys" }), _jsx("th", { className: "py-2", children: "Badges" })] }) }), _jsx("tbody", { children: mockLeaderboard.map((u, idx) => (_jsxs("tr", { className: "border-b dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition", children: [_jsx("td", { className: "py-2 font-bold text-center", children: idx < 3 ? (_jsx(FaMedal, { className: `inline ${medalColors[idx]} text-lg` })) : (idx + 1) }), _jsx("td", { className: "py-2 font-medium", children: u.username }), _jsx("td", { className: "py-2", children: u.surveys }), _jsxs("td", { className: "py-2 flex items-center gap-1", children: [_jsx(FaCertificate, { className: "text-yellow-400" }), " ", u.badges] })] }, idx))) })] })] }));
};
export default Leaderboard;

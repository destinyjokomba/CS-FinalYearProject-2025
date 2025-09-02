import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getUserStats } from "@/utils/stats";
const UserStats = () => {
    const stats = getUserStats();
    return (_jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "\uD83D\uDCCA Your Stats" }), _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsxs("li", { children: ["\uD83D\uDCDD Surveys Completed: ", _jsx("span", { className: "font-bold", children: stats.surveys })] }), _jsxs("li", { children: ["\uD83D\uDCE2 Results Shared: ", _jsx("span", { className: "font-bold", children: stats.shares })] }), _jsxs("li", { children: ["\uD83D\uDD04 Party Changes: ", _jsx("span", { className: "font-bold", children: stats.partyChanges })] })] })] }));
};
export default UserStats;

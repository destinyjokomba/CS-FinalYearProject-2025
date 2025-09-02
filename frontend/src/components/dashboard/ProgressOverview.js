import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ProgressOverview = () => {
    const surveys = Number(localStorage.getItem("surveysCompleted") || 0);
    const badges = Number(localStorage.getItem("badgesUnlocked") || 0);
    const lastLogin = localStorage.getItem("lastVisit") || "Today";
    return (_jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow p-6", children: [_jsx("h3", { className: "text-lg font-bold mb-3", children: "\uD83D\uDCCA Your Progress" }), _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsxs("li", { children: ["\uD83D\uDCDD ", _jsx("span", { className: "font-medium", children: "Surveys Completed:" }), " ", _jsx("strong", { children: surveys })] }), _jsxs("li", { children: ["\uD83C\uDFC5 ", _jsx("span", { className: "font-medium", children: "Badges Unlocked:" }), " ", _jsx("strong", { children: badges })] }), _jsxs("li", { children: ["\uD83D\uDCC5 ", _jsx("span", { className: "font-medium", children: "Last Login:" }), " ", _jsx("strong", { children: lastLogin })] })] })] }));
};
export default ProgressOverview;

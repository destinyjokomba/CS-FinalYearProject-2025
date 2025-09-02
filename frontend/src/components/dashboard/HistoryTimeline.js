import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { partyDisplayMap } from "@/utils/predict_party_logic";
import { Link } from "react-router-dom";
const HistoryTimeline = ({ predictions }) => {
    if (!predictions || predictions.length === 0) {
        return (_jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow p-6 text-center", children: [_jsx("p", { className: "text-gray-500 mb-4", children: "No prediction history yet." }), _jsx(Link, { to: "/survey", className: "text-blue-600 hover:underline", children: "Take your first survey \u2192" })] }));
    }
    return (_jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow p-6", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Prediction History" }), _jsx("ul", { className: "space-y-4", children: predictions.slice(0, 5).map((item, idx) => {
                    const display = partyDisplayMap[item.party];
                    return (_jsxs("li", { className: "flex justify-between items-center border-b pb-3 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg px-2 transition", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [display?.logo && (_jsx("div", { className: "w-8 h-8 flex items-center justify-center rounded-full bg-white shadow", children: _jsx("img", { src: display.logo, alt: display.name, className: "w-6 h-6 object-contain" }) })), _jsx("span", { className: "font-semibold text-gray-900 dark:text-white", children: display?.name || item.party }), item.confidence !== undefined && (_jsxs("span", { className: "ml-2 text-xs text-gray-500", children: [item.confidence.toFixed(1), "%"] })), idx === 0 && (_jsx("span", { className: "ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full shadow", children: "Latest \uD83D\uDD25" }))] }), _jsx("span", { className: "text-sm text-gray-500", children: item.timestamp
                                    ? new Date(item.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : "-" })] }, idx));
                }) }), _jsx("div", { className: "mt-4 text-right", children: _jsx(Link, { to: "/history", className: "text-blue-600 hover:underline text-sm font-medium", children: "View full history \u2192" }) })] }));
};
export default HistoryTimeline;

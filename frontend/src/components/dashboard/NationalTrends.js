import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, } from "recharts";
// Mock data
const nationalTrendData = [
    { date: "Jul", Labour: 40, Conservative: 22, LibDem: 15, Green: 10, Reform: 18, SNP: 7, Other: 2 },
    { date: "Aug", Labour: 38, Conservative: 20, LibDem: 16, Green: 12, Reform: 28, SNP: 6, Other: 2 },
    { date: "Sep", Labour: 34, Conservative: 18, LibDem: 17, Green: 14, Reform: 37, SNP: 5, Other: 2 },
    { date: "Oct", Labour: 41, Conservative: 17, LibDem: 18, Green: 16, Reform: 39, SNP: 4, Other: 2 },
];
// Party colors
const partyColors = {
    Labour: "#E4003B",
    Conservative: "#0087DC",
    LibDem: "#FDBB30",
    Green: "#6AB023",
    Reform: "#00BFFF",
    SNP: "#FDF38E",
    Other: "#A0AEC0",
};
const CustomTooltip = (props) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
        return (_jsxs("div", { className: "bg-white dark:bg-slate-700 p-3 rounded shadow text-sm", children: [_jsx("p", { className: "font-semibold mb-1", children: label }), payload.map((entry, idx) => (_jsxs("p", { style: { color: partyColors[entry.name] || "#333" }, children: [entry.name, ": ", entry.value ?? 0, "%"] }, idx)))] }));
    }
    return null;
};
const NationalTrends = () => {
    const safeData = (nationalTrendData || []).map((row) => ({
        date: row.date || "N/A",
        Labour: row.Labour ?? 0,
        Conservative: row.Conservative ?? 0,
        LibDem: row.LibDem ?? 0,
        Green: row.Green ?? 0,
        Reform: row.Reform ?? 0,
        Other: row.Other ?? 0,
    }));
    return (_jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow p-6", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "National Trends Over Time" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: safeData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E2E8F0" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, { domain: [0, 60], tickFormatter: (val) => `${val}%` }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Legend, {}), Object.keys(partyColors).map((party) => (_jsx(Line, { type: "monotone", dataKey: party, stroke: partyColors[party], strokeWidth: 2, dot: { r: 4 }, activeDot: { r: 6 }, strokeDasharray: party === "Other" ? "5 5" : undefined }, party)))] }) })] }));
};
export default NationalTrends;

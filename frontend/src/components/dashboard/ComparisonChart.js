import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, } from "recharts";
import { partyLabels } from "@/utils/partyMap";
const partyColors = {
    lab: "#E4003B",
    con: "#0087DC",
    ld: "#FDBB30",
    green: "#6AB023",
    reform: "#00BFFF",
    snp: "#FFD500",
    other: "#A0AEC0",
};
const ComparisonChart = ({ data, highlightParty }) => {
    if (!data || !data.regionData || data.regionData.length === 0) {
        return _jsx("p", { children: "No regional data available." });
    }
    return (_jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow p-6", children: [_jsxs("h3", { className: "text-lg font-bold mb-4", children: ["Regional Comparison (", data.region, ")"] }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(BarChart, { data: data.regionData, children: [_jsx(XAxis, { dataKey: "party", tickFormatter: (p) => partyLabels[p] || p }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "share", name: "Support Share", children: data.regionData.map((row, idx) => {
                                const isHighlight = highlightParty === row.party;
                                return (_jsx(Cell, { fill: partyColors[row.party], stroke: isHighlight ? "#000" : undefined, strokeWidth: isHighlight ? 2 : 0 }, idx));
                            }) })] }) }), highlightParty && (_jsxs("p", { className: "text-xs text-gray-600 dark:text-gray-400 mt-2", children: ["Your predicted party (", _jsx("strong", { children: partyLabels[highlightParty] }), ") is highlighted above."] }))] }));
};
export default ComparisonChart;

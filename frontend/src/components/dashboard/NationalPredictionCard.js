import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, CartesianGrid, Cell, } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const chartData = [
    { party: "Labour", shortLabel: "Lab", value: 30.0, color: "#E4003B" },
    { party: "Conservatives", shortLabel: "Con", value: 17.8, color: "#0087DC" },
    { party: "Green", shortLabel: "Green", value: 8.9, color: "#6AB023" },
    { party: "Lib Dems", shortLabel: "LD", value: 14.5, color: "#FDBB30" },
    { party: "Reform UK", shortLabel: "Reform", value: 22.5, color: "#12B6CF" },
    { party: "SNP", shortLabel: "SNP", value: 2.6, color: "#FDF38E" },
    { party: "Other", shortLabel: "Other", value: 3.6, color: "#999999" },
];
const NationalPredictionCard = () => {
    const winner = chartData.reduce((a, b) => (a.value > b.value ? a : b));
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "National Prediction" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Based on real sample data (updated 18/08/2025, 19:47:06)" })] }), _jsxs(CardContent, { children: [_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: chartData, layout: "horizontal", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false }), _jsx(XAxis, { type: "category", dataKey: "shortLabel", tick: { fontSize: 12 }, interval: 0 }), _jsx(YAxis, { type: "number", domain: [0, 100], tickFormatter: (val) => `${val}%` }), _jsx(Tooltip, { formatter: (val) => `${val}%` }), _jsxs(Bar, { dataKey: "value", children: [_jsx(LabelList, { dataKey: "value", position: "top", content: ({ value }) => (value != null ? `${value}%` : "") }), chartData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`)))] })] }) }), _jsxs("p", { className: "mt-4 text-sm font-medium", children: ["\uD83C\uDFC6 Predicted Winner:", " ", _jsx("span", { style: { color: winner.color }, children: winner.party })] }), _jsxs("div", { className: "mt-4", children: [_jsxs("table", { className: "w-full text-sm border-t", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "text-left py-1", children: "Party" }), _jsx("th", { className: "text-right py-1", children: "Share" })] }) }), _jsx("tbody", { children: chartData.map((entry) => (_jsxs("tr", { className: entry.party === winner.party ? "font-semibold" : "", children: [_jsx("td", { className: "py-1", style: { color: entry.color }, children: entry.party }), _jsxs("td", { className: "text-right py-1", children: [entry.value, "%"] })] }, entry.party))) })] }), "__"] })] })] }));
};
export default NationalPredictionCard;

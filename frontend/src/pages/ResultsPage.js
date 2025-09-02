import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// src/pages/ResultsPage.tsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predictParty, partyDisplayMap } from "@/utils/predict_party_logic";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, } from "recharts";
import { incrementPartyChangeCount, } from "@/utils/stats";
const ResultsPage = () => {
    const navigate = useNavigate();
    // Load survey answers
    const [answers] = useState(() => {
        try {
            const stored = localStorage.getItem("surveyAnswers");
            return stored ? JSON.parse(stored) : {};
        }
        catch {
            return {};
        }
    });
    // Run prediction
    const { winner, probabilities } = useMemo(() => predictParty(answers), [answers]);
    const display = partyDisplayMap[winner];
    const confidence = probabilities[winner] || 0;
    const chartData = Object.entries(probabilities).map(([party, prob]) => {
        const p = party;
        return { party: p, prob, color: partyDisplayMap[p].color };
    });
    // Save prediction + track party changes
    useEffect(() => {
        if (!winner)
            return;
        const newEntry = {
            party: winner,
            confidence,
            timestamp: new Date().toISOString(),
        };
        const stored = localStorage.getItem("predictionHistory");
        const history = stored ? JSON.parse(stored) : [];
        // Detect party change
        if (history.length > 0 && history[0].party !== winner) {
            incrementPartyChangeCount();
        }
        // Save lastPrediction + history
        localStorage.setItem("lastPrediction", JSON.stringify(newEntry));
        localStorage.setItem("predictionHistory", JSON.stringify([newEntry, ...history].slice(0, 20)));
    }, [winner, confidence]);
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-6", children: [_jsxs("div", { className: "rounded-2xl shadow-lg p-8 max-w-2xl w-full text-center mb-10", style: { backgroundColor: display.color }, children: [_jsxs("h1", { className: "text-2xl md:text-3xl font-bold text-white", children: ["Predicted Party: ", display.name] }), _jsxs("p", { className: "mt-3 text-white text-lg", children: ["Based on your answers, you are most likely to support", " ", _jsx("span", { className: "font-semibold", children: display.name }), "."] }), display.description && (_jsx("p", { className: "mt-2 text-white/90 text-sm", children: display.description })), _jsxs("p", { className: "mt-3 text-white font-medium", children: ["Confidence: ", confidence.toFixed(1), "%"] }), _jsxs("div", { className: "mt-6 flex justify-center gap-4", children: [_jsx("button", { onClick: () => navigate("/survey"), className: "px-5 py-2 rounded-lg bg-white text-gray-800 shadow hover:bg-gray-200", children: "Retake Survey" }), _jsx("button", { onClick: () => navigate("/dashboard"), className: "px-5 py-2 rounded-lg bg-white text-gray-800 shadow hover:bg-gray-200", children: "View Dashboard" })] })] }), _jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 max-w-2xl w-full", children: [_jsx("h2", { className: "text-lg font-semibold text-center mb-4", children: "Probability Breakdown" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { layout: "vertical", data: chartData, children: [_jsx(XAxis, { type: "number", domain: [0, 100], tickFormatter: (v) => `${v}%` }), _jsx(YAxis, { type: "category", dataKey: "party", width: 120 }), _jsx(Tooltip, { formatter: (value) => `${value}%` }), _jsx(Bar, { dataKey: "prob", radius: [0, 4, 4, 0], children: chartData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) })] }) })] })] }));
};
export default ResultsPage;

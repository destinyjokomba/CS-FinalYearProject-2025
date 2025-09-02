import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/HistoryPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { partyDisplayMap } from "@/utils/predict_party_logic";
import { motion } from "framer-motion";
const HistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    useEffect(() => {
        const stored = localStorage.getItem("predictionHistory");
        if (stored)
            setHistory(JSON.parse(stored));
    }, []);
    const clearHistory = () => {
        localStorage.removeItem("predictionHistory");
        localStorage.removeItem("lastPrediction");
        localStorage.removeItem("lastProbabilities");
        setHistory([]);
    };
    if (history.length === 0) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-10", children: _jsxs("div", { className: "max-w-5xl mx-auto text-center py-20", children: [_jsx("img", { src: "https://cdn-icons-png.flaticon.com/512/747/747310.png", alt: "empty", className: "mx-auto mb-6 w-28 opacity-80" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-300 mb-3", children: "No predictions yet." }), _jsx("button", { onClick: () => navigate("/survey"), className: "px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition", children: "Take Your First Survey" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-10", children: _jsxs("div", { className: "max-w-5xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-extrabold dark:text-white", children: "Prediction History" }), history.length > 0 && (_jsx("button", { onClick: clearHistory, className: "px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition", children: "Clear All" }))] }), _jsx("div", { className: "space-y-6", children: history.map((item, index) => {
                        const display = partyDisplayMap[item.party];
                        return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] transition", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: "inline-block w-6 h-6 rounded-full", style: { backgroundColor: display?.color || "#6B7280" } }), _jsx("span", { className: "font-semibold text-gray-900 dark:text-white", children: display ? display.name : item.party }), _jsxs("span", { className: "text-gray-500 dark:text-gray-300 text-sm ml-2", children: [item.confidence?.toFixed(1), "%"] })] }), _jsx("span", { className: "text-gray-500 dark:text-gray-300 text-sm", children: item.timestamp
                                        ? new Date(item.timestamp).toLocaleString()
                                        : "" })] }, index));
                    }) })] }) }));
};
export default HistoryPage;

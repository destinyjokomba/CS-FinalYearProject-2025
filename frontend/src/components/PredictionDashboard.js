import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/PredictionDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { partyDisplayMap } from "../utils/predict_party_logic";
const PredictionDashboard = () => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPrediction = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            try {
                const res = await fetch("http://localhost:5001/me/prediction", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok && data.saved_prediction) {
                    setPrediction(data.saved_prediction);
                }
                else {
                    console.warn("No saved prediction found:", data);
                    setPrediction(null);
                }
            }
            catch (err) {
                console.error("❌ Error fetching prediction:", err);
                setPrediction(null);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPrediction();
    }, [navigate]);
    const handleRetakeSurvey = () => {
        localStorage.removeItem("prediction_result");
        navigate("/survey");
    };
    const handleViewHistory = () => {
        navigate("/history");
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { className: "text-gray-600 text-lg", children: "Loading your prediction..." }) }));
    }
    return (_jsxs("div", { className: "max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "\uD83D\uDCCA Your Predicted Party" }), prediction ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "p-6 rounded-xl mb-6 text-white shadow-md", style: {
                            backgroundColor: partyDisplayMap[prediction.party]?.color || "#888",
                        }, children: [_jsxs("h3", { className: "text-xl font-semibold mb-2", children: ["\uD83D\uDDF3 ", partyDisplayMap[prediction.party]?.name || prediction.party] }), prediction.confidence !== undefined && (_jsxs("p", { className: "text-sm opacity-90", children: ["Confidence:", " ", _jsxs("span", { className: "font-bold", children: [prediction.confidence.toFixed(1), "%"] }), " ", "(", prediction.confidence >= 50 ? "High" : "Low", " confidence)"] })), prediction.timestamp && (_jsxs("p", { className: "text-xs mt-2 opacity-80", children: ["Predicted on", " ", new Date(prediction.timestamp).toLocaleString()] })), prediction.runnerUp && (_jsxs("p", { className: "text-sm mt-2 italic opacity-90", children: ["\uD83E\uDD48 Runner-up:", " ", partyDisplayMap[prediction.runnerUp]?.name ||
                                        prediction.runnerUp] }))] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("button", { onClick: handleRetakeSurvey, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition", children: "Retake Survey" }), _jsx("button", { onClick: handleViewHistory, className: "px-4 py-2 bg-gray-200 dark:bg-slate-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition", children: "View Full History" })] })] })) : (
            // Empty State
            _jsxs("div", { children: [_jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-4", children: "No prediction available. Please complete the survey." }), _jsx("button", { onClick: () => navigate("/survey"), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Take Survey" })] }))] }));
};
export default PredictionDashboard;

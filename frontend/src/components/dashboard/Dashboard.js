import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PartyCard from "@/components/dashboard/PartyCard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import HistoryTimeline from "@/components/dashboard/HistoryTimeline";
const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [lastPrediction, setLastPrediction] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchDashboard = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            try {
                const res = await fetch("http://localhost:5001/me/dashboard", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    console.error("❌ Failed to load dashboard");
                    if (res.status === 401)
                        navigate("/login");
                    return;
                }
                const data = await res.json();
                setUser(data.user || null);
                setLastPrediction(data.lastPrediction || null);
                setHistory(data.history || []); // ✅ now using backend history only
            }
            catch (err) {
                console.error("❌ Dashboard fetch error:", err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [navigate]);
    const handleLogout = () => {
        ["token", "prediction_result", "confidence_score", "chosenAlignment"].forEach((k) => localStorage.removeItem(k));
        navigate("/login");
    };
    if (loading) {
        return _jsx("p", { className: "text-center mt-20", children: "Loading dashboard..." });
    }
    if (!user) {
        return (_jsx("div", { className: "text-center mt-20 text-red-500", children: "No user data found. Please log in again." }));
    }
    return (_jsxs("div", { className: "max-w-7xl mx-auto mt-16 p-6 bg-white dark:bg-slate-800 rounded-lg shadow space-y-10", children: [_jsxs("h2", { className: "text-2xl font-bold text-center dark:text-white", children: ["Welcome, ", user.displayName || user.username] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx(ProfileCard, { user: user }), _jsx(PartyCard, { partyCode: user.chosenAlignment, title: "Your Alignment" }), _jsx(PartyCard, { prediction: lastPrediction, title: "Predicted from Survey", showRunnerUp: true })] }), _jsx(HistoryTimeline, { predictions: history }), _jsxs("div", { className: "flex justify-center gap-4", children: [_jsx("button", { onClick: () => navigate("/survey"), className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition", children: "Take Survey" }), lastPrediction && (_jsx("button", { onClick: () => navigate("/results"), className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition", children: "View Results" }))] }), _jsx("div", { className: "text-center", children: _jsx("button", { onClick: handleLogout, className: "text-sm text-red-500 hover:underline", children: "Logout" }) })] }));
};
export default Dashboard;

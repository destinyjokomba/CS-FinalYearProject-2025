import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import ProfileCard from "@/components/dashboard/ProfileCard";
import PartyCard from "@/components/dashboard/PartyCard";
import HistoryTimeline from "@/components/dashboard/HistoryTimeline";
import ComparisonChart from "@/components/dashboard/ComparisonChart";
import Badges from "@/components/dashboard/Badges";
import NationalTrends from "@/components/dashboard/NationalTrends";
import Leaderboard from "@/components/dashboard/Leaderboard";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import MiniQuiz from "@/components/dashboard/MiniQuiz";
import { regionalVoteShare } from "@/utils/regionalData";
import UserStats from "@/components/dashboard/UserStats";
const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [lastPrediction, setLastPrediction] = useState(null);
    const [history, setHistory] = useState([]);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState("London");
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const res = await fetch("http://localhost:5001/me/dashboard", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data.user || null);
                        setBadges(data.badges || []);
                        // ✅ Save alignment fallback to localStorage
                        if (data.user?.chosenAlignment) {
                            localStorage.setItem("chosenAlignment", data.user.chosenAlignment);
                        }
                    }
                }
            }
            catch (err) {
                console.error("❌ Dashboard fetch error:", err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchDashboard();
        const storedPrediction = localStorage.getItem("lastPrediction");
        if (storedPrediction)
            setLastPrediction(JSON.parse(storedPrediction));
        const storedHistory = localStorage.getItem("predictionHistory");
        if (storedHistory)
            setHistory(JSON.parse(storedHistory));
        localStorage.setItem("lastVisit", new Date().toLocaleString());
    }, []);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { className: "text-gray-600 dark:text-gray-300 text-lg", children: "Loading your dashboard..." }) }));
    }
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { className: "text-red-500", children: "No user data found. Please log in again." }) }));
    }
    const formatRegionData = (region) => {
        const parties = regionalVoteShare[region];
        return {
            region,
            regionData: Object.entries(parties).map(([party, share]) => ({
                party: party,
                share,
            })),
        };
    };
    const regionData = formatRegionData(selectedRegion);
    // ✅ Use either backend alignment or fallback from localStorage
    const alignmentParty = user.chosenAlignment ||
        localStorage.getItem("chosenAlignment");
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800", children: _jsxs("div", { className: "max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx(ProfileCard, { user: user }), _jsxs("div", { className: "md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6", "data-testid": "dashboard-alignment-title", children: [_jsx(PartyCard, { partyCode: alignmentParty, title: "Your Alignment" }), _jsx(PartyCard, { prediction: lastPrediction, title: "Predicted from Survey", showRunnerUp: true })] }), _jsx(Badges, { unlockedBadges: badges }), _jsx(UserStats, {}), _jsx(ProgressOverview, {}), _jsx(Leaderboard, {}), _jsx("div", { className: "md:col-span-2", children: _jsx(HistoryTimeline, { predictions: history }) }), _jsxs("div", { className: "md:col-span-2", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Compare by Region" }), _jsx("select", { value: selectedRegion, onChange: (e) => setSelectedRegion(e.target.value), className: "border rounded-lg px-3 py-1 dark:bg-slate-800 dark:text-white", children: Object.keys(regionalVoteShare).map((r) => (_jsx("option", { value: r, children: r }, r))) })] }), _jsx(ComparisonChart, { data: regionData, highlightParty: lastPrediction?.party })] }), _jsx(MiniQuiz, {}), _jsx("div", { className: "md:col-span-3", children: _jsx(NationalTrends, {}) })] }) }));
};
export default DashboardPage;

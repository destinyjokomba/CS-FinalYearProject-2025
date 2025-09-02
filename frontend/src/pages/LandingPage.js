import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/LandingPage.tsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaPoll, FaChartLine, FaHistory, FaUserCog, FaLightbulb, FaNewspaper, } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, } from "recharts";
import auth from "@/context/useAuth";
const predictionData = [
    { party: "Lab", share: 30, color: "#E4003B" },
    { party: "Con", share: 17.8, color: "#0087DC" },
    { party: "Green", share: 8.9, color: "#6AB023" },
    { party: "LD", share: 14.5, color: "#FDBB30" },
    { party: "Reform", share: 22.5, color: "#00B2FF" },
    { party: "SNP", share: 2.6, color: "#FFF95D" },
    { party: "Other", share: 3.6, color: "#888888" },
];
const headlines = [
    "Conservatives launch new campaign on national security",
    "Labour unveils bold new housing plan",
    "Green Party gains momentum with Gen Z",
    "Lib Dems focus on education reforms",
];
const facts = [
    "The UK uses a 'First Past the Post' voting system.",
    "Turnout is historically highest among older age groups.",
    "In 2019, the Conservatives won an 80-seat majority.",
];
const InfoCard = ({ title, icon, items, gradient, }) => {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setIndex((prev) => (prev + 1) % items.length), 5000);
        return () => clearInterval(interval);
    }, [items.length]);
    return (_jsxs("div", { className: `relative ${gradient} text-white rounded-xl shadow-lg p-5 transition`, children: [_jsx("div", { className: "flex items-center justify-between mb-3", children: _jsxs("h2", { className: "font-bold flex items-center text-lg", children: [icon, " ", _jsx("span", { className: "ml-2", children: title })] }) }), _jsx("p", { className: "text-base sm:text-lg font-medium", children: items[index] })] }));
};
const NationalPredictionCard = () => (_jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6", children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "National Prediction" }), _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(BarChart, { data: predictionData, children: [_jsx(XAxis, { dataKey: "party", stroke: "currentColor" }), _jsx(YAxis, { stroke: "currentColor" }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "share", children: predictionData.map((entry, i) => (_jsx(Cell, { fill: entry.color }, i))) })] }) }), _jsxs("p", { className: "mt-2 text-sm text-gray-600 dark:text-gray-400", children: ["\uD83C\uDFC6 Predicted Winner:", " ", _jsx("span", { className: "font-bold text-red-600", children: "Labour" })] })] }));
const LandingPage = () => {
    const navigate = useNavigate();
    const isLoggedIn = auth.isLoggedIn();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const electionDate = useMemo(() => new Date("2029-05-02T07:00:00"), []);
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = electionDate.getTime() - now;
            if (distance <= 0)
                clearInterval(interval);
            else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((distance / (1000 * 60)) % 60),
                    seconds: Math.floor((distance / 1000) % 60),
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [electionDate]);
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300 flex flex-col items-center px-6 py-10", children: [_jsx("h1", { className: "text-5xl font-extrabold mb-4", children: "Welcome to Votelytics" }), _jsx("p", { className: "text-lg mb-10 text-center max-w-xl text-slate-600 dark:text-slate-300", children: "Discover your political alignment, track national trends, and see how the nation might vote." }), _jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-10 text-center w-full max-w-lg", children: [_jsx("h2", { className: "text-2xl font-semibold mb-3", children: "\uD83D\uDDF3\uFE0F Next General Election Countdown" }), _jsxs("p", { className: "text-xl font-mono text-blue-600 dark:text-blue-400", children: [timeLeft.days, "d ", timeLeft.hours, "h ", timeLeft.minutes, "m", " ", timeLeft.seconds, "s"] })] }), !isLoggedIn ? (_jsxs("div", { className: "space-x-4 mb-10", children: [_jsx("button", { onClick: () => navigate("/login"), className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition", children: "Login" }), _jsx("button", { onClick: () => navigate("/register"), className: "px-6 py-3 bg-gray-300 dark:bg-slate-700 dark:text-white hover:opacity-90 rounded-lg transition", children: "Register" })] })) : (_jsx("button", { onClick: () => navigate("/survey"), className: "px-8 py-3 mb-10 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition", children: "Take the Survey" })), isLoggedIn && (_jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10", children: [_jsxs("div", { onClick: () => navigate("/survey"), className: "cursor-pointer p-6 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition text-center", children: [_jsx(FaPoll, { className: "text-3xl mx-auto text-blue-600" }), _jsx("p", { className: "mt-2 font-semibold", children: "Survey" })] }), _jsxs("div", { onClick: () => navigate("/dashboard"), className: "cursor-pointer p-6 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition text-center", children: [_jsx(FaChartLine, { className: "text-3xl mx-auto text-green-600" }), _jsx("p", { className: "mt-2 font-semibold", children: "Dashboard" })] }), _jsxs("div", { onClick: () => navigate("/history"), className: "cursor-pointer p-6 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition text-center", children: [_jsx(FaHistory, { className: "text-3xl mx-auto text-purple-600" }), _jsx("p", { className: "mt-2 font-semibold", children: "History" })] }), _jsxs("div", { onClick: () => navigate("/settings"), className: "cursor-pointer p-6 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition text-center", children: [_jsx(FaUserCog, { className: "text-3xl mx-auto text-red-600" }), _jsx("p", { className: "mt-2 font-semibold", children: "Settings" })] })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-10", children: [_jsx(InfoCard, { title: "\uD83D\uDCF0 Political Headlines", icon: _jsx(FaNewspaper, {}), items: headlines, gradient: "bg-gradient-to-r from-blue-500 to-indigo-600" }), _jsx(InfoCard, { title: "\uD83D\uDCA1 Did You Know?", icon: _jsx(FaLightbulb, {}), items: facts, gradient: "bg-gradient-to-r from-pink-500 to-orange-500" }), _jsx(NationalPredictionCard, {})] })] }));
};
export default LandingPage;

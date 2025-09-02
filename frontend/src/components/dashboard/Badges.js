import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
// 🎯 Default local badges
const defaultBadges = [
    {
        name: "Quiz Master",
        unlocked: false,
        progress_current: 0,
        progress_target: 1,
    },
    {
        name: "Survey Completed",
        unlocked: false,
        progress_current: 0,
        progress_target: 1,
    },
    {
        name: "Alignment Set",
        unlocked: false,
        progress_current: 0,
        progress_target: 1,
    },
];
const Badges = ({ unlockedBadges = [] }) => {
    const [allBadges, setAllBadges] = useState([]);
    useEffect(() => {
        // ✅ LocalStorage unlock flags
        const quizBadgeUnlocked = localStorage.getItem("quiz_master_badge") === "true";
        const surveyBadgeUnlocked = localStorage.getItem("survey_completed") === "true";
        const alignmentBadgeUnlocked = localStorage.getItem("alignment_set") === "true";
        // ✅ Merge with defaults
        const mergedBadges = defaultBadges.map((badge) => {
            switch (badge.name) {
                case "Quiz Master":
                    return {
                        ...badge,
                        unlocked: quizBadgeUnlocked,
                        progress_current: quizBadgeUnlocked ? 1 : 0,
                    };
                case "Survey Completed":
                    return {
                        ...badge,
                        unlocked: surveyBadgeUnlocked,
                        progress_current: surveyBadgeUnlocked ? 1 : 0,
                    };
                case "Alignment Set":
                    return {
                        ...badge,
                        unlocked: alignmentBadgeUnlocked,
                        progress_current: alignmentBadgeUnlocked ? 1 : 0,
                    };
                default:
                    return badge;
            }
        });
        // ✅ Combine backend badges too
        setAllBadges([...mergedBadges, ...unlockedBadges]);
    }, [unlockedBadges]);
    if (!allBadges || allBadges.length === 0) {
        return (_jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow p-6 text-center", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "\uD83C\uDFC6 Achievements" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "No badges unlocked yet \uD83D\uDE80" })] }));
    }
    return (_jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "\uD83C\uDFC6 Achievements" }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: allBadges.map((badge, idx) => (_jsxs("div", { className: `p-4 rounded-lg shadow ${badge.unlocked
                        ? "bg-yellow-100 border-l-4 border-yellow-400"
                        : "bg-gray-100 dark:bg-slate-700 opacity-70"}`, children: [_jsx("h4", { className: "font-semibold", children: badge.name }), _jsxs("p", { className: "text-sm", children: [badge.progress_current, "/", badge.progress_target] }), badge.unlocked ? (_jsx("p", { className: "text-green-600 text-xs", children: "Unlocked \uD83C\uDF89" })) : (_jsx("p", { className: "text-gray-500 text-xs", children: "Locked \uD83D\uDD12" }))] }, idx))) })] }));
};
export default Badges;

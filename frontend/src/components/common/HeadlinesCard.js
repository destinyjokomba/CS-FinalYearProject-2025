import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const sampleHeadlines = [
    "Prime Minister faces questions over new tax reforms",
    "Polls show rising support for Green Party in urban areas",
    "Debate heats up over immigration policy in Parliament",
];
const HeadlinesCard = () => {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % sampleHeadlines.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition", children: [_jsx("h2", { className: "text-xl font-semibold text-slate-900 dark:text-white mb-3", children: "\uD83D\uDCF0 Political Headlines" }), _jsx("p", { className: "text-slate-600 dark:text-slate-300", children: sampleHeadlines[index] })] }));
};
export default HeadlinesCard;

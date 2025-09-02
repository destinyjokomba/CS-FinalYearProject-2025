import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/common/InfoCard.tsx
import { useState, useEffect } from "react";
const InfoCard = ({ title, icon, items }) => {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [items.length]);
    return (_jsxs("div", { className: "relative bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 text-black rounded-xl shadow-md p-4 max-w-md", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("h2", { className: "font-bold flex items-center text-sm sm:text-base", children: [icon, " ", _jsx("span", { className: "ml-2", children: title })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setIndex((prev) => (prev - 1 + items.length) % items.length), className: "px-2 text-xs bg-white bg-opacity-30 rounded hover:bg-opacity-50", children: "\u2190" }), _jsx("button", { onClick: () => setIndex((prev) => (prev + 1) % items.length), className: "px-2 text-xs bg-white bg-opacity-30 rounded hover:bg-opacity-50", children: "\u2192" })] })] }), _jsx("p", { className: "text-sm sm:text-base font-medium", children: items[index] })] }));
};
export default InfoCard;

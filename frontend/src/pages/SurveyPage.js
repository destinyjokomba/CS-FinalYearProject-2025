import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/SurveyPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "@/data/surveyOptions";
import { incrementSurveyCount } from "@/utils/stats";
const SurveyPage = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const currentQuestion = QUESTIONS[currentIndex];
    const handleChange = (e) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.fieldName]: e.target.value.toLowerCase(),
        }));
    };
    const handleNext = () => {
        if (currentIndex < QUESTIONS.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };
    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };
    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            // Save answers locally
            localStorage.setItem("surveyAnswers", JSON.stringify(answers));
            // Mark survey completed
            localStorage.setItem("survey_completed", "true");
            // Increment survey count
            incrementSurveyCount();
            if (token) {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(answers),
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem("prediction_result", JSON.stringify(data));
                }
                else {
                    console.warn("Prediction API error:", data.error);
                }
            }
            navigate("/results");
        }
        catch (err) {
            console.error("❌ Submit failed:", err);
            alert("Prediction failed. Please try again.");
        }
        finally {
            setSubmitting(false);
        }
    };
    const handleRetake = () => {
        setAnswers({});
        setCurrentIndex(0);
        localStorage.removeItem("surveyAnswers");
    };
    const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;
    return (_jsx("div", { className: "relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4", children: _jsxs("div", { className: "relative bg-white/10 dark:bg-slate-800/70 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl px-8 py-10 w-full max-w-xl z-10", children: [_jsx("h1", { className: "text-2xl font-bold text-center mb-2", children: "Political Alignment Survey" }), _jsx("p", { className: "text-center text-sm text-slate-300 mb-6", children: "Answer honestly to discover your political match" }), _jsx("div", { className: "w-full bg-slate-700 rounded-full h-2 overflow-hidden mb-6", children: _jsx("div", { className: "bg-gradient-to-r from-blue-500 to-purple-500 h-2 transition-all duration-500", style: { width: `${progress}%` } }) }), _jsxs("p", { className: "text-center text-xs text-slate-400 mb-6", children: [Math.round(progress), "% complete"] }), _jsx("h2", { className: "text-lg font-semibold mb-4", children: currentQuestion.text }), _jsxs("select", { id: currentQuestion.fieldName, name: currentQuestion.fieldName, className: "w-full px-4 py-3 rounded-lg bg-slate-900/70 text-white border border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition", value: answers[currentQuestion.fieldName] || "", onChange: handleChange, children: [_jsx("option", { value: "", children: "Select an option" }), currentQuestion.options?.map((opt) => (_jsx("option", { value: opt.toLowerCase(), children: opt }, opt)))] }), _jsxs("div", { className: "mt-6 flex justify-between", children: [_jsx("button", { onClick: handleBack, disabled: currentIndex === 0, className: "px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-40", children: "Back" }), currentIndex < QUESTIONS.length - 1 ? (_jsx("button", { onClick: handleNext, disabled: !answers[currentQuestion.fieldName], className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40", children: "Next" })) : (_jsx("button", { onClick: handleSubmit, disabled: submitting || !answers[currentQuestion.fieldName], className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-40", children: submitting ? "Submitting..." : "Submit" }))] }), _jsx("div", { className: "mt-4 text-center", children: _jsx("button", { onClick: handleRetake, className: "px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition", children: "Retake Survey" }) }), _jsx("p", { className: "text-xs text-slate-400 mt-6 text-center", children: "\uD83D\uDD12 Your answers are anonymous and only used for research purposes" })] }) }));
};
export default SurveyPage;

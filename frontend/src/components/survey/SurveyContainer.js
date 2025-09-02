import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "../../data/surveyOptions";
const SurveyContainer = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const currentQuestion = QUESTIONS[currentIndex];
    const handleSelect = (value) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.fieldName]: value.toLowerCase(), // normalize
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
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("http://localhost:5001/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(answers),
            });
            const data = await res.json();
            if (res.ok) {
                console.log("✅ Prediction response:", data);
                // Save locally in case ResultsPage needs fallback
                localStorage.setItem("prediction_result", JSON.stringify(data));
                navigate("/results");
            }
            else {
                alert(data.error || "Something went wrong while predicting.");
            }
        }
        catch (err) {
            console.error("❌ Submit failed:", err);
            alert("Prediction failed. Please try again.");
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4", children: _jsxs("div", { className: "bg-white dark:bg-slate-800 shadow-xl rounded-2xl px-8 py-8 w-full max-w-lg", children: [_jsx("h2", { className: "text-2xl font-bold text-slate-800 dark:text-white mb-6", children: currentQuestion.text }), _jsxs("select", { id: currentQuestion.fieldName, name: currentQuestion.fieldName, className: "w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition", value: answers[currentQuestion.fieldName] || "", onChange: (e) => handleSelect(e.target.value), children: [_jsx("option", { value: "", children: "Select an option" }), currentQuestion.options?.map((opt) => (_jsx("option", { value: opt.toLowerCase(), children: opt }, opt)))] }), _jsxs("div", { className: "mt-6 flex justify-between", children: [_jsx("button", { onClick: handleBack, disabled: currentIndex === 0, className: "px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50", children: "Back" }), currentIndex < QUESTIONS.length - 1 ? (_jsx("button", { onClick: handleNext, disabled: !answers[currentQuestion.fieldName], className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50", children: "Next" })) : (_jsx("button", { onClick: handleSubmit, disabled: submitting || !answers[currentQuestion.fieldName], className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50", children: submitting ? "Submitting..." : "Submit" }))] })] }) }));
};
export default SurveyContainer;

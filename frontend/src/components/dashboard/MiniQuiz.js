import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// src/components/dashboard/MiniQuiz.tsx
import { useState, useEffect, useCallback } from "react";
const quizzes = {
    beginner: [
        {
            question: "Which party is most associated with prioritizing climate change?",
            options: ["Labour", "Conservative", "Green"],
            answer: "Green",
        },
        {
            question: "Which party strongly supports Scottish independence?",
            options: ["SNP", "Labour", "Conservative"],
            answer: "SNP",
        },
    ],
    intermediate: [
        {
            question: "Which party’s slogan is ‘For the many, not the few’?",
            options: ["Labour", "Liberal Democrats", "Reform UK"],
            answer: "Labour",
        },
        {
            question: "Which party is often linked with free markets and lower taxes?",
            options: ["Green", "Conservative", "Labour"],
            answer: "Conservative",
        },
    ],
    advanced: [
        {
            question: "Which party is most likely to appeal to students and pro-EU voters?",
            options: ["Liberal Democrats", "Reform UK", "Conservative"],
            answer: "Liberal Democrats",
        },
        {
            question: "Which party originated as a movement to leave the EU?",
            options: ["Reform UK", "Labour", "Green"],
            answer: "Reform UK",
        },
    ],
};
const QUESTION_TIME = 10; // ⏱️ seconds per question
const MiniQuiz = () => {
    const [level, setLevel] = useState("beginner");
    const [questions, setQuestions] = useState(quizzes[level]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
    const [finished, setFinished] = useState(false);
    // ✅ Reset when level changes
    useEffect(() => {
        setQuestions(quizzes[level]);
        restartQuiz();
    }, [level]);
    // ✅ Handle moving to next question
    const handleNext = useCallback(() => {
        setFeedback(null);
        setSelected(null);
        if (current + 1 < questions.length) {
            setCurrent((prev) => prev + 1);
            setTimeLeft(QUESTION_TIME);
        }
        else {
            setFinished(true);
        }
    }, [current, questions.length]);
    // ✅ Timer effect
    useEffect(() => {
        if (finished)
            return;
        if (timeLeft === 0) {
            handleNext();
            return;
        }
        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, finished, handleNext]);
    // ✅ Handle answer submit
    const handleSubmit = () => {
        if (!selected)
            return;
        const isCorrect = selected === questions[current].answer;
        if (isCorrect)
            setScore((s) => s + 1);
        setFeedback(isCorrect ? "✅ Correct!" : "❌ Incorrect");
        setTimeout(() => handleNext(), 1500);
    };
    // ✅ Restart quiz
    const restartQuiz = () => {
        setCurrent(0);
        setScore(0);
        setTimeLeft(QUESTION_TIME);
        setFinished(false);
        setFeedback(null);
        setSelected(null);
    };
    // ✅ Award badge if score ≥ 70%
    useEffect(() => {
        if (finished && score >= Math.ceil(questions.length * 0.7)) {
            localStorage.setItem(`${level}_badge`, "true");
        }
    }, [finished, score, level, questions.length]);
    if (finished) {
        const passed = score >= Math.ceil(questions.length * 0.7);
        return (_jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow p-6 text-center", children: [_jsxs("h3", { className: "text-lg font-bold mb-4", children: [level.charAt(0).toUpperCase() + level.slice(1), " Quiz Finished \uD83C\uDF89"] }), _jsxs("p", { className: "mb-4", children: ["You scored ", score, "/", questions.length] }), passed ? (_jsxs("p", { className: "text-green-600 font-semibold mb-4", children: ["\uD83C\uDFC5 Congratulations! You unlocked the", " ", _jsxs("strong", { children: [level === "beginner" && "Beginner Badge 🥉", level === "intermediate" && "Intermediate Badge 🥈", level === "advanced" && "Advanced Badge 🥇"] })] })) : (_jsxs("p", { className: "text-red-500 mb-4", children: ["Score ", Math.ceil(questions.length * 0.7), " or higher to unlock the badge!"] })), _jsx("button", { onClick: restartQuiz, className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Try Again" })] }));
    }
    return (_jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow p-6", children: [_jsxs("div", { className: "flex justify-center space-x-2 mb-4", children: [_jsx("button", { onClick: () => setLevel("beginner"), className: `px-3 py-1 rounded ${level === "beginner" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-slate-700"}`, children: "Beginner" }), _jsx("button", { onClick: () => setLevel("intermediate"), className: `px-3 py-1 rounded ${level === "intermediate" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-slate-700"}`, children: "Intermediate" }), _jsx("button", { onClick: () => setLevel("advanced"), className: `px-3 py-1 rounded ${level === "advanced" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-slate-700"}`, children: "Advanced" })] }), _jsxs("h3", { className: "text-lg font-bold mb-4", children: ["Mini Quiz (", level, ")"] }), _jsx("p", { className: "mb-2", children: questions[current].question }), _jsxs("div", { className: "flex justify-between mb-3 text-sm text-gray-600 dark:text-gray-300", children: [_jsxs("span", { children: ["\u23F1\uFE0F ", timeLeft, "s left"] }), _jsxs("span", { children: ["Score: ", score, "/", questions.length] })] }), _jsx("div", { className: "space-y-2", children: questions[current].options.map((opt, idx) => (_jsx("button", { onClick: () => setSelected(opt), disabled: !!feedback, className: `w-full px-3 py-2 rounded-lg border transition ${selected === opt
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"}`, children: opt }, idx))) }), _jsx("button", { onClick: handleSubmit, disabled: !selected || !!feedback, className: "mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50", children: "Submit" }), feedback && _jsx("p", { className: "mt-3 font-semibold", children: feedback })] }));
};
export default MiniQuiz;

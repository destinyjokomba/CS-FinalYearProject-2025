// src/components/dashboard/MiniQuiz.tsx
import React, { useState, useEffect, useCallback } from "react";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const quizzes: Record<"beginner" | "intermediate" | "advanced", Question[]> = {
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

const MiniQuiz: React.FC = () => {
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [questions, setQuestions] = useState<Question[]>(quizzes[level]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
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
    } else {
      setFinished(true);
    }
  }, [current, questions.length]);

  // ✅ Timer effect
  useEffect(() => {
    if (finished) return;

    if (timeLeft === 0) {
      handleNext();
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, finished, handleNext]);

  // ✅ Handle answer submit
  const handleSubmit = () => {
    if (!selected) return;
    const isCorrect = selected === questions[current].answer;
    if (isCorrect) setScore((s) => s + 1);
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

    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 text-center">
        <h3 className="text-lg font-bold mb-4">
          {level.charAt(0).toUpperCase() + level.slice(1)} Quiz Finished 🎉
        </h3>
        <p className="mb-4">You scored {score}/{questions.length}</p>

        {passed ? (
          <p className="text-green-600 font-semibold mb-4">
            🏅 Congratulations! You unlocked the{" "}
            <strong>
              {level === "beginner" && "Beginner Badge 🥉"}
              {level === "intermediate" && "Intermediate Badge 🥈"}
              {level === "advanced" && "Advanced Badge 🥇"}
            </strong>
          </p>
        ) : (
          <p className="text-red-500 mb-4">
            Score {Math.ceil(questions.length * 0.7)} or higher to unlock the badge!
          </p>
        )}

        <button
          onClick={restartQuiz}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      {/* Level Selector */}
      <div className="flex justify-center space-x-2 mb-4">
        <button
          onClick={() => setLevel("beginner")}
          className={`px-3 py-1 rounded ${level === "beginner" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-slate-700"}`}
        >
          Beginner
        </button>
        <button
          onClick={() => setLevel("intermediate")}
          className={`px-3 py-1 rounded ${level === "intermediate" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-slate-700"}`}
        >
          Intermediate
        </button>
        <button
          onClick={() => setLevel("advanced")}
          className={`px-3 py-1 rounded ${level === "advanced" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-slate-700"}`}
        >
          Advanced
        </button>
      </div>

      <h3 className="text-lg font-bold mb-4">Mini Quiz ({level})</h3>
      <p className="mb-2">{questions[current].question}</p>

      {/* Timer + Score */}
      <div className="flex justify-between mb-3 text-sm text-gray-600 dark:text-gray-300">
        <span>⏱️ {timeLeft}s left</span>
        <span>Score: {score}/{questions.length}</span>
      </div>

      <div className="space-y-2">
        {questions[current].options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(opt)}
            disabled={!!feedback}
            className={`w-full px-3 py-2 rounded-lg border transition ${
              selected === opt
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selected || !!feedback}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        Submit
      </button>

      {feedback && <p className="mt-3 font-semibold">{feedback}</p>}
    </div>
  );
};

export default MiniQuiz;

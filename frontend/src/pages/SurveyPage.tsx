// src/pages/SurveyPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "@/data/surveyOptions";
import type { Question } from "@/data/surveyOptions";
import { incrementSurveyCount } from "@/utils/stats";

const SurveyPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion: Question = QUESTIONS[currentIndex];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        } else {
          console.warn("Prediction API error:", data.error);
        }
      }

      navigate("/results");
    } catch (err) {
      console.error("❌ Submit failed:", err);
      alert("Prediction failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
    localStorage.removeItem("surveyAnswers");
  };

  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
      <div className="relative bg-white/10 dark:bg-slate-800/70 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl px-8 py-10 w-full max-w-xl z-10">
        <h1 className="text-2xl font-bold text-center mb-2">
          Political Alignment Survey
        </h1>
        <p className="text-center text-sm text-slate-300 mb-6">
          Answer honestly to discover your political match
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden mb-6">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-xs text-slate-400 mb-6">
          {Math.round(progress)}% complete
        </p>

        {/* Question */}
        <h2 className="text-lg font-semibold mb-4">{currentQuestion.text}</h2>

        {/* Dropdown */}
        <select
          id={currentQuestion.fieldName}
          name={currentQuestion.fieldName}
          className="w-full px-4 py-3 rounded-lg bg-slate-900/70 text-white border border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={answers[currentQuestion.fieldName] || ""}
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          {currentQuestion.options?.map((opt) => (
            <option key={opt} value={opt.toLowerCase()}>
              {opt}
            </option>
          ))}
        </select>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-40"
          >
            Back
          </button>

          {currentIndex < QUESTIONS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.fieldName]}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !answers[currentQuestion.fieldName]}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-40"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>

        {/* Retake Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleRetake}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Retake Survey
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-6 text-center">
          🔒 Your answers are anonymous and only used for research purposes
        </p>
      </div>
    </div>
  );
};

export default SurveyPage;

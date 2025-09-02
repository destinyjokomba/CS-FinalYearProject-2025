import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS, Question } from "@/data/surveyOptions";
import { submitSurvey } from "@/services/api";

const SurveyContainer: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion: Question = QUESTIONS[currentIndex];

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.fieldName]: value.toLowerCase(),
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const data = await submitSurvey(answers);
      localStorage.setItem("prediction_result", JSON.stringify(data));
      navigate("/results");
    } catch (err) {
      console.error("❌ Submit failed:", err);
      alert("Prediction failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4">
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl px-8 py-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          {currentQuestion.text}
        </h2>

        <select
          id={currentQuestion.fieldName}
          name={currentQuestion.fieldName}
          className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={answers[currentQuestion.fieldName] || ""}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="">Select an option</option>
          {currentQuestion.options?.map((opt) => (
            <option key={opt} value={opt.toLowerCase()}>
              {opt}
            </option>
          ))}
        </select>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            Back
          </button>

          {currentIndex < QUESTIONS.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              disabled={!answers[currentQuestion.fieldName]}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !answers[currentQuestion.fieldName]}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyContainer;

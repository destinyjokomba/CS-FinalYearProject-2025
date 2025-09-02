// src/pages/HistoryPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { partyDisplayMap } from "@/utils/partyMap";
import { Party, Prediction } from "@/types/dashboard";
import { motion } from "framer-motion";

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<Prediction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("predictionHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("predictionHistory");
    localStorage.removeItem("lastPrediction");
    localStorage.removeItem("lastProbabilities");
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-10">
        <div className="max-w-5xl mx-auto text-center py-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
            alt="empty"
            className="mx-auto mb-6 w-28 opacity-80"
          />
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">
            No predictions yet.
          </p>
          <button
            onClick={() => navigate("/survey")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Take Your First Survey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold dark:text-white">
            Prediction History
          </h1>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-6">
          {history.map((item, index) => {
            const display = partyDisplayMap[item.party as Party];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] transition"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className="inline-block w-6 h-6 rounded-full"
                    style={{ backgroundColor: display?.color || "#6B7280" }}
                  />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {display ? display.name : item.party}
                  </span>
                  <span className="text-gray-500 dark:text-gray-300 text-sm ml-2">
                    {item.confidence?.toFixed(1)}%
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-300 text-sm">
                  {item.timestamp
                    ? new Date(item.timestamp).toLocaleString()
                    : ""}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;

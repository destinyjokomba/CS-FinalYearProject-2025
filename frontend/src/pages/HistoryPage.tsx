// src/pages/HistoryPage.tsx
import { useEffect, useState } from "react";
import { partyDisplayMap, Party } from "@/utils/predict_party_logic";

interface Prediction {
  winner: Party;
  timestamp: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<Prediction[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("predictionHistory");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      console.error("Failed to load prediction history");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 dark:text-white">
        Prediction History
      </h1>

      {history.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No predictions yet. Take the survey to see your history here.
        </p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {history.map((item, index) => {
            const display = partyDisplayMap[item.winner];
            return (
              <div
                key={index}
                className="rounded-lg shadow-md p-5 flex justify-between items-center"
                style={{ backgroundColor: display.color }}
              >
                <span className="text-white font-semibold text-lg">
                  {display.name}
                </span>
                <span className="text-white/90 text-sm">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

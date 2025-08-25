import { useEffect, useState } from "react";
import { partyDisplayMap, Party } from "@/utils/predict_party_logic";

interface Prediction {
  winner: Party | string;
  timestamp: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<Prediction[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("predictionHistory");
      const parsed: Prediction[] = stored ? JSON.parse(stored) : [];
      setHistory(parsed);
    } catch (err) {
      console.error("❌ Failed to load prediction history", err);
    }
  }, []);

  // Clear history handler
  const clearHistory = () => {
    localStorage.removeItem("predictionHistory");
    setHistory([]);
  };

  // Group predictions by date (yyyy-mm-dd)
  const groupedHistory = history.reduce((groups, item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
    return groups;
  }, {} as Record<string, Prediction[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
            Prediction History
          </h1>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Clear History
            </button>
          )}
        </div>

        {/* Empty State */}
        {history.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No predictions yet. Take the survey to see your history here.
          </p>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedHistory).map(([date, items]) => (
              <div key={date}>
                {/* Date header */}
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  📅 {date}
                </h2>

                <div className="space-y-3">
                  {items.map((item, index) => {
                    const display = partyDisplayMap[item.winner as Party];

                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition"
                      >
                        <div className="flex items-center space-x-3">
                          {/* Colored badge */}
                          <span
                            className="inline-block w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: display?.color || "#6B7280",
                            }}
                          />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {display ? display.name : item.winner}
                          </span>
                        </div>
                        <span className="text-gray-500 dark:text-gray-300 text-sm">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;

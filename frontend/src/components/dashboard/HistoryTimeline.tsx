import React from "react";
import { partyDisplayMap } from "@/utils/partyMap";
import { Party, Prediction } from "@/types/dashboard";
import { Link } from "react-router-dom";

interface HistoryTimelineProps {
  predictions: Prediction[];
}

const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ predictions }) => {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 text-center">
        <p className="text-gray-500 mb-4">No prediction history yet.</p>
        <Link to="/survey" className="text-blue-600 hover:underline">
          Take your first survey →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">Prediction History</h3>
      <ul className="space-y-4">
        {predictions.slice(0, 5).map((item, idx) => {
          const display = partyDisplayMap[item.party as Party];
          return (
            <li
              key={idx}
              className="flex justify-between items-center border-b pb-3 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg px-2 transition"
            >
              {/* Party + Logo */}
              <div className="flex items-center space-x-3">
                {display?.logo && (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow">
                    <img
                      src={display.logo}
                      alt={display.name}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                )}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {display?.name || item.party}
                </span>
                {item.confidence !== undefined && (
                  <span className="ml-2 text-xs text-gray-500">
                    {item.confidence.toFixed(1)}%
                  </span>
                )}
                {/* Highlight latest */}
                {idx === 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full shadow">
                    Latest 🔥
                  </span>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-sm text-gray-500">
                {item.timestamp
                  ? new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Link to full history */}
      <div className="mt-4 text-right">
        <Link
          to="/history"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          View full history →
        </Link>
      </div>
    </div>
  );
};

export default HistoryTimeline;

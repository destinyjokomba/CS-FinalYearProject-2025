// src/components/dashboard/HistoryTimeline.tsx
import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

// Prediction type
type Prediction = {
  party: string;
  confidence: number;
  date: string;
};

interface HistoryTimelineProps {
  predictions: Prediction[];
}

const partyColors: Record<string, string> = {
  labour: "bg-red-500",
  conservative: "bg-blue-500",
  libdem: "bg-yellow-400",
  green: "bg-green-500",
  reform: "bg-cyan-500",
  snp: "bg-yellow-300",
};

const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ predictions }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">Prediction History</h3>
      <div className="relative border-l border-slate-300 dark:border-slate-600 pl-6">
        {predictions.map((p, idx) => {
          const normalizedParty = p.party.trim().toLowerCase();
          const prevParty =
            idx > 0 ? predictions[idx - 1].party.trim().toLowerCase() : null;
          const switched = prevParty && prevParty !== normalizedParty;

          return (
            <div key={idx} className="mb-6 relative">
              {/* Dot with party color */}
              <span
                className={`absolute -left-3 w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                  partyColors[normalizedParty] || "bg-gray-400"
                }`}
              >
                <CheckCircle className="w-4 h-4 text-white" />
              </span>

              {/* Info */}
              <p className="text-sm text-slate-500">{p.date}</p>
              <p className="font-semibold">
                {normalizedParty} ({p.confidence}%)
              </p>

              {/* Show arrow if switched */}
              {switched && (
                <p className="text-xs text-slate-400 flex items-center mt-1">
                  <ArrowRight className="w-4 h-4 mr-1" /> Switched from {prevParty}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryTimeline;

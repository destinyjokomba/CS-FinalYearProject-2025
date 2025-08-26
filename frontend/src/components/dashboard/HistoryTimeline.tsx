import React from "react";

type HistoryPrediction = {
  party: string;
  confidence: number;
  timestamp: string;
  runnerUp?: string;
};

interface Props {
  predictions: HistoryPrediction[];
}

const HistoryTimeline: React.FC<Props> = ({ predictions }) => {
  if (!predictions || predictions.length === 0) {
    return <p className="text-gray-500">No prediction history yet.</p>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">Prediction History</h3>
      <ul className="space-y-3">
        {predictions.map((p, idx) => (
          <li key={idx} className="border-b border-gray-200 dark:border-slate-700 pb-2">
            <span className="font-semibold capitalize">{p.party}</span> ({p.confidence}%) <br />
            <span className="text-sm text-gray-500">{new Date(p.timestamp).toLocaleDateString()}</span>
            {p.runnerUp && <p className="text-xs">→ Runner-up: {p.runnerUp}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryTimeline;

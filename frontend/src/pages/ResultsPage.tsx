// src/pages/ResultsPage.tsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Party } from "@/types/dashboard";
import { predictParty, partyDisplayMap } from "@/utils/predict_party_logic";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  incrementPartyChangeCount,
} from "@/utils/stats";

interface PredictionHistoryItem {
  party: Party;
  confidence: number;
  timestamp: string;
}

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();

  // Load survey answers
  const [answers] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem("surveyAnswers");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Run prediction
  const { winner, probabilities } = useMemo(
    () => predictParty(answers),
    [answers]
  );

  const display = partyDisplayMap[winner as Party];
  const confidence = probabilities[winner as Party] || 0;

  const chartData = Object.entries(probabilities).map(([party, prob]) => {
    const p = party as Party;
    return { party: p, prob, color: partyDisplayMap[p].color };
  });

  // Save prediction + track party changes
  useEffect(() => {
    if (!winner) return;

    const newEntry: PredictionHistoryItem = {
      party: winner,
      confidence,
      timestamp: new Date().toISOString(),
    };

    const stored = localStorage.getItem("predictionHistory");
    const history: PredictionHistoryItem[] = stored ? JSON.parse(stored) : [];

    // Detect party change
    if (history.length > 0 && history[0].party !== winner) {
      incrementPartyChangeCount();
    }

    // Save lastPrediction + history
    localStorage.setItem("lastPrediction", JSON.stringify(newEntry));
    localStorage.setItem(
      "predictionHistory",
      JSON.stringify([newEntry, ...history].slice(0, 20))
    );
  }, [winner, confidence]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-6">
      
      {/* Prediction Card */}
      <div
        className="rounded-2xl shadow-lg p-8 max-w-2xl w-full text-center mb-10"
        style={{ backgroundColor: display.color }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Predicted Party: {display.name}
        </h1>
        <p className="mt-3 text-white text-lg">
          Based on your answers, you are most likely to support{" "}
          <span className="font-semibold">{display.name}</span>.
        </p>
        {display.description && (
          <p className="mt-2 text-white/90 text-sm">{display.description}</p>
        )}
        <p className="mt-3 text-white font-medium">
          Confidence: {confidence.toFixed(1)}%
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate("/survey")}
            className="px-5 py-2 rounded-lg bg-white text-gray-800 shadow hover:bg-gray-200"
          >
            Retake Survey
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 rounded-lg bg-white text-gray-800 shadow hover:bg-gray-200"
          >
            View Dashboard
          </button>
        </div>
      </div>

      {/* Probability Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 max-w-2xl w-full">
        <h2 className="text-lg font-semibold text-center mb-4">
          Probability Breakdown
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart layout="vertical" data={chartData}>
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="party" width={120} />
            <Tooltip formatter={(value: number) => `${value}%`} />
            <Bar dataKey="prob" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResultsPage;

// src/pages/ResultsPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Party, PredictionResult } from "@/types/dashboard";
import { partyDisplayMap } from "@/utils/partyMap";
import { predictParty } from "@/utils/predict_party_logic";
import { getPrediction } from "@/services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { incrementPartyChangeCount } from "@/utils/stats";
import PredictionExplanation from "@/components/results/PredictionExplanation";

interface PredictionHistoryItem {
  party: Party;
  confidence: number;
  timestamp: string;
}

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Prefer state from survey → results, fallback to localStorage/backend
  useEffect(() => {
    const state = location.state as {
      predictedParty?: string;
      answers?: Record<string, string>;
    };

    if (state?.predictedParty && state?.answers) {
      // Redirected from survey with state
      setAnswers(state.answers);

      const result = predictParty(state.answers);
      setPrediction(result);
      setLoading(false);
    } else {
      // Fallback: localStorage or backend
      const storedAnswers = localStorage.getItem("surveyAnswers");

      if (storedAnswers) {
        const parsed = JSON.parse(storedAnswers);
        setAnswers(parsed);
        const result = predictParty(parsed);
        setPrediction(result);
        setLoading(false);
      } else {
        getPrediction()
          .then((pred) => {
            if (pred) {
              setPrediction({
                winner: pred.party as Party,
                probabilities: {
                  [pred.party]: pred.confidence || 0,
                } as Record<Party, number>,
                reasons: [], // fallback if API doesn’t provide reasons
              });
            }
          })
          .catch((err) => console.error("❌ Failed to fetch prediction:", err))
          .finally(() => setLoading(false));
      }
    }
  }, [location.state]);

  // Save history + track party changes
  useEffect(() => {
    if (!prediction) return;

    const { winner, probabilities } = prediction;
    const newEntry: PredictionHistoryItem = {
      party: winner,
      confidence: probabilities[winner] || 0,
      timestamp: new Date().toISOString(),
    };

    const stored = localStorage.getItem("predictionHistory");
    const history: PredictionHistoryItem[] = stored ? JSON.parse(stored) : [];

    if (history.length > 0 && history[0].party !== winner) {
      incrementPartyChangeCount();
    }

    localStorage.setItem("lastPrediction", JSON.stringify(newEntry));
    localStorage.setItem(
      "predictionHistory",
      JSON.stringify([newEntry, ...history].slice(0, 20))
    );
  }, [prediction]);

  if (loading) {
    return <p className="text-center mt-20">Loading prediction...</p>;
  }

  if (!prediction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold">No prediction available</h2>
        <button
          onClick={() => navigate("/survey")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Take Survey
        </button>
      </div>
    );
  }

  const { winner, probabilities, reasons } = prediction;
  const display = partyDisplayMap[winner];
  const confidence = probabilities[winner] || 0;

  const chartData = Object.entries(probabilities).map(([party, prob]) => ({
    party,
    prob,
    color: partyDisplayMap[party as Party].color,
  }));

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/results?party=${winner}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Predicted Political Alignment",
          text: `I matched with ${display.name} on Votelytics!`,
          url: shareUrl,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        alert("✅ Link copied to clipboard!");
      } else {
        window.prompt("Copy this link:", shareUrl);
      }
    } catch (err) {
      console.error("❌ Share failed:", err);
      alert("Could not share results. Please copy the link manually.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-6">
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
        <p className="mt-3 text-white font-medium">
          Confidence: {confidence.toFixed(1)}% (
          {confidence >= 50 ? "High" : "Low"} confidence)
        </p>
      </div>

      {/* Probability chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 max-w-2xl w-full mb-8">
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
      )}

      {/* Explanation */}
      <PredictionExplanation
        predictedParty={winner}
        answers={answers}
        probabilities={probabilities}
        reasons={reasons}
      />

      {/* Action buttons */}
      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        <button
          onClick={() => navigate("/survey")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Retake Survey
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
        >
          Go to Dashboard
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg"
        >
          Share Results
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;

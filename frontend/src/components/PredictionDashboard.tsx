import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPrediction } from "@/services/api";
import { partyDisplayMap } from "@/utils/partyMap";
import { Prediction, Party } from "@/types/dashboard";

const PredictionDashboard: React.FC = () => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const pred = await getPrediction();
        setPrediction(pred);
      } catch (err) {
        console.error("❌ Prediction fetch error:", err);
        setPrediction(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading your prediction...</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          No prediction available. Please complete the survey.
        </p>
        <button
          onClick={() => navigate("/survey")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Take Survey
        </button>
      </div>
    );
  }

  const display = partyDisplayMap[prediction.party as Party];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-6">📊 Your Predicted Party</h2>

      <div
        className="p-6 rounded-xl mb-6 text-white shadow-md"
        style={{ backgroundColor: display?.color || "#888" }}
      >
        <h3 className="text-xl font-semibold mb-2">
          🗳 {display?.name || prediction.party}
        </h3>

        {prediction.confidence !== undefined && (
          <p className="text-sm opacity-90">
            Confidence:{" "}
            <span className="font-bold">
              {prediction.confidence.toFixed(1)}%
            </span>{" "}
            ({prediction.confidence >= 50 ? "High" : "Low"} confidence)
          </p>
        )}

        {prediction.timestamp && (
          <p className="text-xs mt-2 opacity-80">
            Predicted on {new Date(prediction.timestamp).toLocaleString()}
          </p>
        )}

        {prediction.runnerUp && (
          <p className="text-sm mt-2 italic opacity-90">
            🥈 Runner-up:{" "}
            {partyDisplayMap[prediction.runnerUp as Party]?.name ||
              prediction.runnerUp}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => {
            localStorage.removeItem("prediction_result");
            navigate("/survey");
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retake Survey
        </button>

        <button
          onClick={() => navigate("/history")}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
        >
          View Full History
        </button>
      </div>
    </div>
  );
};

export default PredictionDashboard;

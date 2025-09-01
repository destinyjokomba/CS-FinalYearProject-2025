// src/components/PredictionDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { partyDisplayMap, Party } from "../utils/predict_party_logic";
import { Prediction } from "@/types/dashboard"; // ✅ uses global Prediction type (already party: Party)

const PredictionDashboard = () => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrediction = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5001/me/prediction", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok && data.saved_prediction) {
          setPrediction(data.saved_prediction);
        } else {
          console.warn("No saved prediction found:", data);
          setPrediction(null);
        }
      } catch (err) {
        console.error("❌ Error fetching prediction:", err);
        setPrediction(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [navigate]);

  const handleRetakeSurvey = () => {
    localStorage.removeItem("prediction_result");
    navigate("/survey");
  };

  const handleViewHistory = () => {
    navigate("/history");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading your prediction...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-6">📊 Your Predicted Party</h2>

      {prediction ? (
        <>
          {/* Party Card */}
          <div
            className="p-6 rounded-xl mb-6 text-white shadow-md"
            style={{
              backgroundColor:
                partyDisplayMap[prediction.party]?.color || "#888",
            }}
          >
            <h3 className="text-xl font-semibold mb-2">
              🗳 {partyDisplayMap[prediction.party]?.name || prediction.party}
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
                Predicted on{" "}
                {new Date(prediction.timestamp).toLocaleString()}
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

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetakeSurvey}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retake Survey
            </button>
            <button
              onClick={handleViewHistory}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
            >
              View Full History
            </button>
          </div>
        </>
      ) : (
        // Empty State
        <div>
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
      )}
    </div>
  );
};

export default PredictionDashboard;

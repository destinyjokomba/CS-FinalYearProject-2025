import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { partyDisplayMap } from "../utils/predict_party_logic";

type Prediction = {
  party: string;
  confidence?: number;
  timestamp?: string;
};

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-6">📊 Your Predicted Party</h2>

      {prediction ? (
        <>
          <div
            className="p-6 rounded-lg mb-6 text-white"
            style={{
              backgroundColor: partyDisplayMap[prediction.party]?.color || "#888",
            }}
          >
            <h3 className="text-xl font-semibold mb-1">
              🗳 {partyDisplayMap[prediction.party]?.name || prediction.party}
            </h3>
            {prediction.confidence && (
              <p className="text-sm opacity-80">
                Confidence: {prediction.confidence.toFixed(1)}%
              </p>
            )}
            {prediction.timestamp && (
              <p className="text-sm mt-1 opacity-70">
                Predicted on: {new Date(prediction.timestamp).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetakeSurvey}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retake Survey
            </button>
            <button
              onClick={handleViewHistory}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              View Full History
            </button>
          </div>
        </>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            No prediction available. Please complete the survey.
          </p>
          <button
            onClick={() => navigate("/survey")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Take Survey
          </button>
        </div>
      )}
    </div>
  );
};

export default PredictionDashboard;
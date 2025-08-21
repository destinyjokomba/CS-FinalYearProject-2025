import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);

  useEffect(() => {
    setPrediction(localStorage.getItem('prediction_result'));
    setConfidence(localStorage.getItem('confidence_score'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('prediction_result');
    localStorage.removeItem('confidence_score');
    navigate('/login');
  };

  const handleTakeSurvey = () => {
    navigate('/survey');
  };

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 bg-white rounded-lg shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>

      {prediction ? (
        <div className="mb-6">
          <p className="text-lg">Last Predicted Party:</p>
          <p className="text-2xl font-bold text-blue-600">{prediction}</p>
          {confidence && <p className="text-gray-500">Confidence: {confidence}%</p>}
        </div>
      ) : (
        <p className="mb-6 text-gray-600">No prediction yet. Take the survey to get started.</p>
      )}

      <button
        onClick={handleTakeSurvey}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4"
      >
        Take Survey
      </button>

      {prediction && (
        <button
          onClick={() => navigate('/results')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Results
        </button>
      )}

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

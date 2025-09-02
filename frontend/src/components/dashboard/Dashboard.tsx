import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PartyCard from "@/components/dashboard/PartyCard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import HistoryTimeline from "@/components/dashboard/HistoryTimeline";
import { Party, Prediction, User } from "@/types/dashboard";
import { API_URL } from "@/config";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [lastPrediction, setLastPrediction] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/me/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("❌ Failed to load dashboard");
          if (res.status === 401) navigate("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user || null);
        setLastPrediction(data.lastPrediction || null);
        setHistory(data.history || []); // ✅ now using backend history only
      } catch (err) {
        console.error("❌ Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    ["token", "prediction_result", "confidence_score", "chosenAlignment"].forEach((k) =>
      localStorage.removeItem(k)
    );
    navigate("/login");
  };

  if (loading) {
    return <p className="text-center mt-20">Loading dashboard...</p>;
  }

  if (!user) {
    return (
      <div className="text-center mt-20 text-red-500">
        No user data found. Please log in again.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-16 p-6 bg-white dark:bg-slate-800 rounded-lg shadow space-y-10">
      <h2 className="text-2xl font-bold text-center dark:text-white">
        Welcome, {user.displayName || user.username}
      </h2>

      {/* Profile + Alignment + Predicted Party */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfileCard user={user} />

        <PartyCard
          partyCode={user.chosenAlignment as Party}
          title="Your Alignment"
        />

        <PartyCard
          prediction={lastPrediction}
          title="Predicted from Survey"
          showRunnerUp
        />
      </div>

      {/* Prediction History Timeline */}
      <HistoryTimeline predictions={history} />

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate("/survey")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Take Survey
        </button>

        {lastPrediction && (
          <button
            onClick={() => navigate("/results")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View Results
          </button>
        )}
      </div>

      {/* Logout */}
      <div className="text-center">
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

// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import ProfileCard from "@/components/dashboard/ProfileCard";
import PartyCard from "@/components/dashboard/PartyCard";
import HistoryTimeline from "@/components/dashboard/HistoryTimeline";
import ComparisonChart from "@/components/dashboard/ComparisonChart";
import Badges from "@/components/dashboard/Badges";
import NationalTrends from "@/components/dashboard/NationalTrends";
import Leaderboard from "@/components/dashboard/Leaderboard";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import MiniQuiz from "@/components/dashboard/MiniQuiz";
import { regionalVoteShare, Region } from "@/utils/regionalData";
import UserStats from "@/components/dashboard/UserStats";
import { API_URL } from "@/config";

import {
  User,
  Prediction,
  HistoryPrediction,
  Badge,
  Party,
} from "@/types/dashboard";

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lastPrediction, setLastPrediction] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<HistoryPrediction[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<Region>("London");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await fetch(`${API_URL}/me/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user || null);
            setBadges(data.badges || []);

            //  Save alignment fallback to localStorage
            if (data.user?.chosenAlignment) {
              localStorage.setItem("chosenAlignment", data.user.chosenAlignment);
            }
          }
        }
      } catch (err) {
        console.error("❌ Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

    const storedPrediction = localStorage.getItem("lastPrediction");
    if (storedPrediction) setLastPrediction(JSON.parse(storedPrediction));

    const storedHistory = localStorage.getItem("predictionHistory");
    if (storedHistory) setHistory(JSON.parse(storedHistory));

    localStorage.setItem("lastVisit", new Date().toLocaleString());
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">No user data found. Please log in again.</p>
      </div>
    );
  }

  const formatRegionData = (region: Region) => {
    const parties = regionalVoteShare[region];
    return {
      region,
      regionData: Object.entries(parties).map(([party, share]) => ({
        party: party as Party,
        share,
      })),
    };
  };

  const regionData = formatRegionData(selectedRegion);

  // ✅ Use either backend alignment or fallback from localStorage
  const alignmentParty =
    (user.chosenAlignment as Party) ||
    (localStorage.getItem("chosenAlignment") as Party);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfileCard user={user} />

        <div
          className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
          data-testid="dashboard-alignment-title"
        >
          <PartyCard partyCode={alignmentParty} title="Your Alignment" />
          <PartyCard prediction={lastPrediction} title="Predicted from Survey" showRunnerUp />
        </div>

        <Badges unlockedBadges={badges} />
        <UserStats />
        <ProgressOverview />
        <Leaderboard />

        <div className="md:col-span-2">
          <HistoryTimeline predictions={history} />
        </div>

        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Compare by Region</h3>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as Region)}
              className="border rounded-lg px-3 py-1 dark:bg-slate-800 dark:text-white"
            >
              {(Object.keys(regionalVoteShare) as Region[]).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <ComparisonChart
            data={regionData}
            highlightParty={lastPrediction?.party as Party}
          />
        </div>

        <MiniQuiz />

        <div className="md:col-span-3">
          <NationalTrends />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

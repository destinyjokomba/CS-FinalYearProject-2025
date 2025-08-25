import React, { useEffect, useState } from "react";
import NavBar from "@/components/common/NavBar";
import ProfileCard from "@/components/dashboard/ProfileCard";
import PartyCard from "@/components/dashboard/PartyCard";
import HistoryTimeline from "@/components/dashboard/HistoryTimeline";
import ComparisonChart from "@/components/dashboard/ComparisonChart";
import Badges from "@/components/dashboard/Badges";
import NationalTrends from "@/components/dashboard/NationalTrends";

// ─── Types ───────────────────────────────────────────────
type User = {
  id: number;
  name: string;
  profilePic: string | null;
  constituency?: string;
  streak?: number;
  profileCompletion?: number;
  chosenAlignment?: string;
};

type Prediction = {
  party: string;
  confidence: number;
  runnerUp: string;
  timestamp: string;
};

type HistoryPrediction = {
  party: string;
  confidence: number;
  date: string;
};

type RegionDatum = {
  party: string;
  share: number;
};

type ComparisonData = {
  userParty: string;
  region: string;
  regionData: RegionDatum[];
};

// ─── Dashboard Page ──────────────────────────────────────
const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lastPrediction, setLastPrediction] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<HistoryPrediction[]>([]);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/me/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLastPrediction(data.lastPrediction);
        setHistory(data.history || []);
        setComparison(data.comparison || null);
        setBadges(data.badges ? data.badges.map((b: { name: string }) => b.name) : []);
      })
      .catch((err) => console.error("❌ Dashboard fetch failed", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center text-slate-600 dark:text-slate-300">
          Loading dashboard...
        </div>
      </>
    );
  }

  if (!user || !lastPrediction) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center text-red-500">
          ❌ Failed to load dashboard data
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ProfileCard user={user} latestPrediction={lastPrediction} />
            <PartyCard prediction={lastPrediction} />
            <Badges unlockedBadges={badges} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {comparison && <ComparisonChart data={comparison} />}
            <HistoryTimeline predictions={history} />
            <NationalTrends />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

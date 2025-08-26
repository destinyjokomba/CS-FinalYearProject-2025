// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import NavBar from "@/components/common/NavBar";
import ProfileCard from "@/components/dashboard/ProfileCard";
import PartyCard from "@/components/dashboard/PartyCard";
import HistoryTimeline from "@/components/dashboard/HistoryTimeline";
import ComparisonChart from "@/components/dashboard/ComparisonChart";
import Badges from "@/components/dashboard/Badges";
import NationalTrends from "@/components/dashboard/NationalTrends";

import { Prediction, ComparisonData, Badge } from "@/types/dashboard";
import { useAuth } from "@/context/useAuth";

type HistoryPrediction = {
  party: string;
  confidence: number;
  runnerUp?: string;
  timestamp: string;
};

const DashboardPage: React.FC = () => {
  const { user, setUser } = useAuth();

  const [lastPrediction, setLastPrediction] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<HistoryPrediction[]>([]);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  fetch(`${import.meta.env.VITE_API_URL}/me/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load dashboard");
      }
      return res.json();
    })
    .then((data) => {
      if (data.user) {
        const mergedUser = { ...data.user };
        setUser(mergedUser);
        localStorage.setItem("user", JSON.stringify(mergedUser));
      }
      setLastPrediction(data.lastPrediction || null);
      setHistory(data.history || []);
      setComparison(data.comparison || null);
      setBadges(
        (data.badges || []).map((b: Partial<Badge>): Badge => ({
          name: b.name || "Unknown",
          unlocked: !!b.unlocked,
          progress_current: b.progress_current ?? 0,
          progress_target: b.progress_target ?? 0,
        }))
      );
    })
    .catch((err) => {
      if (err instanceof Error) {
        console.error("Dashboard fetch failed:", err.message);
      } else {
        console.error("Unknown error:", err);
      }
    })
    .finally(() => setLoading(false));
}, [setUser, user]);

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

  if (!user) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center text-red-500">
          ❌ Failed to load dashboard data
        </div>
      </>
    );
  }

  const activeParty = user.dashboardParty || lastPrediction?.party;

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ProfileCard user={user} latestPrediction={lastPrediction} />
            {activeParty && (
              <PartyCard
                prediction={{
                  party: activeParty,
                  confidence: lastPrediction?.confidence ?? 0,
                }}
              />
            )}
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

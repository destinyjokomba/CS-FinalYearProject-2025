// src/components/dashboard/UserStats.tsx
import React from "react";
import { getUserStats } from "@/utils/stats";

const UserStats: React.FC = () => {
  const stats = getUserStats();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">📊 Your Stats</h3>
      <ul className="space-y-2 text-sm">
        <li>📝 Surveys Completed: <span className="font-bold">{stats.surveys}</span></li>
        <li>📢 Results Shared: <span className="font-bold">{stats.shares}</span></li>
        <li>🔄 Party Changes: <span className="font-bold">{stats.partyChanges}</span></li>
      </ul>
    </div>
  );
};

export default UserStats;

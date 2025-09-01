// src/components/dashboard/Leaderboard.tsx
import React from "react";
import { FaMedal, FaCertificate } from "react-icons/fa";

type LeaderboardUser = {
  username: string;
  surveys: number;
  badges: number;
};

const mockLeaderboard: LeaderboardUser[] = [
  { username: "Alice", surveys: 10, badges: 4 },
  { username: "Bob", surveys: 8, badges: 3 },
  { username: "Charlie", surveys: 6, badges: 2 },
  { username: "Destiny", surveys: 5, badges: 2 },
  { username: "Eve", surveys: 4, badges: 1 },
];

const medalColors = ["text-yellow-500", "text-gray-400", "text-orange-500"];

const Leaderboard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">🏆 Leaderboard</h3>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <th className="py-2 text-center">Rank</th>
            <th className="py-2">User</th>
            <th className="py-2">Surveys</th>
            <th className="py-2">Badges</th>
          </tr>
        </thead>
        <tbody>
          {mockLeaderboard.map((u, idx) => (
            <tr
              key={idx}
              className="border-b dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              {/* Rank + Medal for Top 3 */}
              <td className="py-2 font-bold text-center">
                {idx < 3 ? (
                  <FaMedal className={`inline ${medalColors[idx]} text-lg`} />
                ) : (
                  idx + 1
                )}
              </td>

              {/* Username */}
              <td className="py-2 font-medium">{u.username}</td>

              {/* Surveys */}
              <td className="py-2">{u.surveys}</td>

              {/* Badges */}
              <td className="py-2 flex items-center gap-1">
                <FaCertificate className="text-yellow-400" /> {u.badges}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

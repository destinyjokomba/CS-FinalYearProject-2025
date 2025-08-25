// src/components/dashboard/Badges.tsx
import React from "react";
import { Lock, Star } from "lucide-react";

interface Badge {
  name: string;
  description: string;
  unlocked: boolean;
  progress?: { current: number; target: number };
}

interface BadgesProps {
  unlockedBadges: string[];
}

const allBadges: Badge[] = [
  { name: "Active Voter", description: "Completed 5 surveys", unlocked: false, progress: { current: 3, target: 5 } },
  { name: "Party Hopper", description: "Switched parties 3+ times", unlocked: false, progress: { current: 2, target: 3 } },
  { name: "Consistent Supporter", description: "Stuck with one party 5 times", unlocked: false, progress: { current: 1, target: 5 } },
  { name: "First Prediction", description: "Completed your first survey", unlocked: true },
  { name: "Trend Setter", description: "Aligned with an underdog party", unlocked: false },
  { name: "Streak Master", description: "Logged in 7 days in a row", unlocked: false, progress: { current: 4, target: 7 } },
];

const Badges: React.FC<BadgesProps> = ({ unlockedBadges }) => {
  // Sort unlocked first
  const sortedBadges = [...allBadges].sort((a, b) => {
    const aUnlocked = a.unlocked || unlockedBadges.includes(a.name);
    const bUnlocked = b.unlocked || unlockedBadges.includes(b.name);
    return aUnlocked === bUnlocked ? 0 : aUnlocked ? -1 : 1;
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">🏆 Your Badges</h3>
      <div className="grid grid-cols-2 gap-4">
        {sortedBadges.map((badge, idx) => {
          const isUnlocked = badge.unlocked || unlockedBadges.includes(badge.name);
          const progressPct = badge.progress
            ? Math.min((badge.progress.current / badge.progress.target) * 100, 100)
            : 0;

          return (
            <div
              key={idx}
              className={`relative flex flex-col p-4 rounded-xl transition transform hover:scale-105 ${
                isUnlocked
                  ? "bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 text-yellow-900 dark:text-yellow-100 shadow-lg"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-500"
              }`}
              title={badge.description}
            >
              <div className="flex items-center space-x-2 mb-2">
                {isUnlocked ? (
                  <Star className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
                <span className="font-semibold">{badge.name}</span>
              </div>

              <p className="text-xs opacity-75">{badge.description}</p>

              {/* Progress bar */}
              {!isUnlocked && badge.progress && (
                <div className="w-full mt-2">
                  <div className="h-2 bg-gray-300 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1">
                    {badge.progress.current}/{badge.progress.target}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Badges;

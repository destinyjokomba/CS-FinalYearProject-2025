import React from "react";

interface Badge {
  name: string;
  unlocked: boolean;
  progress_current: number;
  progress_target: number;
}

interface Props {
  unlockedBadges: Badge[];
}

const Badges: React.FC<Props> = ({ unlockedBadges }) => {
  if (!unlockedBadges || unlockedBadges.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
        <h3 className="text-lg font-bold mb-4">Badges</h3>
        <p>No badges yet. Keep engaging to unlock achievements! 🏅</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">Your Badges</h3>
      <div className="grid grid-cols-2 gap-4">
        {unlockedBadges.map((badge, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg shadow ${
              badge.unlocked ? "bg-yellow-100" : "bg-gray-100 dark:bg-slate-700"
            }`}
          >
            <h4 className="font-semibold">{badge.name}</h4>
            <p className="text-sm">
              {badge.progress_current}/{badge.progress_target}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;

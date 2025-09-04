import React, { useEffect, useState } from "react";

interface Badge {
  name: string;
  unlocked: boolean;
  progress_current: number;
  progress_target: number;
}

// 🎯 Default local badges
const defaultBadges: Badge[] = [
  {
    name: "Quiz Master",
    unlocked: false,
    progress_current: 0,
    progress_target: 1,
  },
  {
    name: "Survey Completed",
    unlocked: false,
    progress_current: 0,
    progress_target: 1,
  },
  {
    name: "Alignment Set",
    unlocked: false,
    progress_current: 0,
    progress_target: 1,
  },
];

const Badges: React.FC<{ unlockedBadges?: Badge[] }> = ({ unlockedBadges = [] }) => {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);

  useEffect(() => {
    // LocalStorage unlock flags
    const quizBadgeUnlocked = localStorage.getItem("quiz_master_badge") === "true";
    const surveyBadgeUnlocked = localStorage.getItem("survey_completed") === "true";
    const alignmentBadgeUnlocked = localStorage.getItem("alignment_set") === "true";

    // Merge with defaults
    const mergedBadges = defaultBadges.map((badge) => {
      switch (badge.name) {
        case "Quiz Master":
          return {
            ...badge,
            unlocked: quizBadgeUnlocked,
            progress_current: quizBadgeUnlocked ? 1 : 0,
          };
        case "Survey Completed":
          return {
            ...badge,
            unlocked: surveyBadgeUnlocked,
            progress_current: surveyBadgeUnlocked ? 1 : 0,
          };
        case "Alignment Set":
          return {
            ...badge,
            unlocked: alignmentBadgeUnlocked,
            progress_current: alignmentBadgeUnlocked ? 1 : 0,
          };
        default:
          return badge;
      }
    });

    // Combine backend badges too
    setAllBadges([...mergedBadges, ...unlockedBadges]);
  }, [unlockedBadges]);

  if (!allBadges || allBadges.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 text-center">
        <h3 className="text-lg font-semibold mb-4">🏆 Achievements</h3>
        <p className="text-gray-500 dark:text-gray-400">No badges unlocked yet 🚀</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">🏆 Achievements</h3>
      <div className="grid grid-cols-2 gap-4">
        {allBadges.map((badge, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg shadow ${
              badge.unlocked
                ? "bg-yellow-100 border-l-4 border-yellow-400"
                : "bg-gray-100 dark:bg-slate-700 opacity-70"
            }`}
          >
            <h4 className="font-semibold">{badge.name}</h4>
            <p className="text-sm">
              {badge.progress_current}/{badge.progress_target}
            </p>
            {badge.unlocked ? (
              <p className="text-green-600 text-xs">Unlocked 🎉</p>
            ) : (
              <p className="text-gray-500 text-xs">Locked 🔒</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;

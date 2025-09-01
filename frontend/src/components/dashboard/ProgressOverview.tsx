import React from "react";

const ProgressOverview: React.FC = () => {
  const surveys = Number(localStorage.getItem("surveysCompleted") || 0);
  const badges = Number(localStorage.getItem("badgesUnlocked") || 0);
  const lastLogin = localStorage.getItem("lastVisit") || "Today";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold mb-3">📊 Your Progress</h3>
      <ul className="space-y-2 text-sm">
        <li>
          📝 <span className="font-medium">Surveys Completed:</span>{" "}
          <strong>{surveys}</strong>
        </li>
        <li>
          🏅 <span className="font-medium">Badges Unlocked:</span>{" "}
          <strong>{badges}</strong>
        </li>
        <li>
          📅 <span className="font-medium">Last Login:</span>{" "}
          <strong>{lastLogin}</strong>
        </li>
      </ul>
    </div>
  );
};

export default ProgressOverview;

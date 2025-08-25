import React from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  name: string;
  profilePic: string | null;
  constituency?: string;
  streak?: number; // login streak
  profileCompletion?: number; // %
  chosenAlignment?: string; // from settings
};

type Prediction = {
  party: string;
  confidence: number;
};

interface ProfileCardProps {
  user: User;
  latestPrediction: Prediction;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, latestPrediction }) => {
  const navigate = useNavigate();

  // Use initials if no profile pic
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 flex flex-col space-y-4">
      {/* Top: Avatar + Name */}
      <div className="flex items-center space-x-4">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
            {initials}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-slate-500 dark:text-slate-400">
            {user.constituency || "No constituency set"}
          </p>
        </div>
      </div>

      {/* Streak counter */}
      <div className="text-sm bg-blue-50 dark:bg-slate-700 px-3 py-1 rounded-lg w-fit">
        🔥 {user.streak || 0}-day streak
      </div>

      {/* Alignment vs Prediction */}
      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3">
        <h3 className="text-sm font-semibold mb-2">Political Alignment</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500">Chosen Alignment</p>
            <p className="font-semibold">{user.chosenAlignment || "Not set"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Survey Prediction</p>
            <p className="font-semibold">
              {latestPrediction.party} ({latestPrediction.confidence}%)
            </p>
          </div>
        </div>
      </div>

      {/* Profile completion */}
      <div>
        <p className="text-xs text-slate-500 mb-1">Profile Completion</p>
        <div className="w-full bg-gray-300 dark:bg-slate-600 h-2 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{
              width: `${user.profileCompletion || 40}%`,
            }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => navigate("/survey")}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Retake Survey
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-slate-700 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;

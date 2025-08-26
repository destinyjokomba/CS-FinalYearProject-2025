import React from "react";
import { User, Prediction } from "@/types/dashboard";

interface ProfileCardProps {
  user: User;
  latestPrediction: Prediction | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, latestPrediction }) => {
  const initials = user.displayName
    ? user.displayName[0].toUpperCase()
    : user.username
    ? user.username[0].toUpperCase()
    : "U";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <div className="flex items-center space-x-4">
        {user.profilePicUrl ? (
          <img
            src={user.profilePicUrl}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
            {initials}
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold">{user.displayName || user.username}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-400">{user.constituency || "No constituency"}</p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        <p>🔥 Streak: {user.streak ?? 0}</p>
        <p>Profile Completion: {user.profileCompletion ?? 0}%</p>
        <p>Alignment: {user.dashboardParty || "Not selected"}</p>
        <p>
          Last Prediction:{" "}
          {latestPrediction
            ? `${latestPrediction.party} (${latestPrediction.confidence ?? "?"}%)`
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;

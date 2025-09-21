import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Party, Prediction } from "@/types/dashboard";
import { MapPin, Compass, Vote, Edit, RefreshCw, UserCircle } from "lucide-react";
import { partyColors, partyLabels } from "@/utils/partyMap";

interface ProfileCardProps {
  user: User;
  lastPrediction?: Prediction | null; 
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, lastPrediction }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md flex flex-col items-center space-y-5">
      <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
        Your Profile
      </h2>

      {user.profilePicUrl ? (
        <img
          src={user.profilePicUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-gray-200 dark:border-slate-700"
        />
      ) : (
        <UserCircle className="w-20 h-20 text-gray-400 dark:text-gray-500" />
      )}

      <div className="text-center">
        <h3 className="text-lg font-semibold dark:text-white">
          {user.displayName || user.username || "Anonymous User"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {user.email || "No email available"}
        </p>
      </div>

      <div className="w-full space-y-2 text-sm">
        {user.region && (
          <p className="flex items-center justify-between text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-2"><MapPin size={16} /> Region:</span>
            <span>{user.region}</span>
          </p>
        )}
        {user.chosenAlignment && (
          <p className="flex items-center justify-between text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-2"><Compass size={16} /> Alignment:</span>
            <span>{partyLabels[user.chosenAlignment as Party]}</span>
          </p>
        )}
        {lastPrediction && (
          <p className="flex items-center justify-between text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-2"><Vote size={16} /> Predicted:</span>
            <span
              className="px-2 py-1 rounded-md text-white text-xs font-medium"
              style={{
                backgroundColor: partyColors[lastPrediction.party as Party] || "#6B7280",
              }}
            >
              {lastPrediction.partyLabel || lastPrediction.party}
            </span>
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
        <button
          onClick={() => navigate("/survey")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw size={16} /> Retake Survey
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
        >
          <Edit size={16} /> Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;

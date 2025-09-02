// src/components/dashboard/PartyCard.tsx
import React from "react";
import {
  partyLabels,
  partyColors,
  partyLogos,
  partyInfo,
} from "@/utils/partyMap";
import { Prediction, Party } from "@/types/dashboard";

type PartyCardProps = {
  prediction?: Prediction | null;
  partyCode?: Party | null;
  title?: string;
  showRunnerUp?: boolean;
};

const PartyCard: React.FC<PartyCardProps> = ({
  prediction,
  partyCode,
  title,
  showRunnerUp,
}) => {
  // 🟢 Alignment Party Card (simplified)
  if (partyCode) {
    return (
      <div
        className="p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between"
        style={{ backgroundColor: partyColors[partyCode] || "#888" }}
      >
        {title && <h3 className="text-sm font-semibold">{title}</h3>}

        <div>
          <div className="flex items-center gap-3">
            <img
              src={partyLogos[partyCode]}
              alt={partyLabels[partyCode]}
              className="w-10 h-10"
            />
            <h2 className="text-xl font-bold">{partyLabels[partyCode]}</h2>
          </div>
          <p className="italic text-sm mt-2">Your chosen alignment party.</p>
        </div>

        <div className="mt-4 bg-white/20 rounded-lg p-3 text-sm">
          <p className="font-semibold text-white">About this alignment</p>
          <p className="text-white/90 mt-1">
            This reflects the party you personally selected. It may differ from
            your survey-based prediction.
          </p>
        </div>
      </div>
    );
  }

  // 🔵 Predicted Party Card
  if (prediction) {
    const confidence = prediction.confidence ?? null;
    const party = prediction.party as Party;

    return (
      <div
        className="p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between"
        style={{ backgroundColor: partyColors[party] || "#888" }}
      >
        {title && <h3 className="text-sm font-semibold">{title}</h3>}
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <img
              src={partyLogos[party]}
              alt={partyLabels[party]}
              className="w-10 h-10"
            />
            <h2 className="text-xl font-bold">
              {prediction.partyLabel || partyLabels[party]}
            </h2>
          </div>
          {confidence !== null && (
            <div className="text-right">
              <span className="font-bold">{confidence.toFixed(1)}%</span>
              <p className="text-xs">
                {confidence >= 50 ? "High confidence" : "Low confidence"}
              </p>
            </div>
          )}
        </div>

        <p className="italic text-sm mt-2">"{partyInfo[party].slogan}"</p>
        <ul className="text-sm list-disc ml-4 mt-2 space-y-1">
          {partyInfo[party].policies.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <p className="text-xs mt-2 opacity-90">
          👥 {partyInfo[party].voters}
        </p>

        {showRunnerUp && prediction.runnerUp && (
          <p className="text-sm mt-3">🥈 Runner-up: {prediction.runnerUp}</p>
        )}

        {confidence !== null && confidence < 50 && (
  <div className="bg-yellow-50 dark:bg-yellow-900/40 border-l-4 border-yellow-400 p-3 rounded text-sm mt-3">
    <p className="text-yellow-700 dark:text-yellow-200 font-semibold">
      ⚠️ Low Confidence Prediction
    </p>
    <p className="text-gray-700 dark:text-gray-300 mt-1">
      This prediction is below 50% confidence. Confidence values can appear lower 
      because our model is trained against <strong> all 7 main political parties</strong> 
      rather than just the top 2–3. This means your answers are compared across a 
      wider set of possible outcomes, which increases competition between parties. 
      While this lowers the confidence percentage, it makes the prediction more 
      <strong> balanced, realistic, and representative</strong> of the full UK political 
      landscape.
    </p>
  </div>
)}

      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-gray-200 text-gray-600 text-center">
      <p>No party information available</p>
    </div>
  );
};

export default PartyCard;

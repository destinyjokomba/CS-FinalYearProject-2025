// src/components/results/PredictionExplanation.tsx
import React from "react";
import { partyDisplayMap } from "@/utils/partyMap";
import { Party } from "@/types/dashboard";
import { QUESTIONS, Question } from "@/data/surveyOptions"; 

interface Props {
  predictedParty: string;
  answers: Record<string, string>;
}

const PredictionExplanation: React.FC<Props> = ({ predictedParty, answers }) => {
  const party = partyDisplayMap[predictedParty as Party];

  const reasons: string[] = [];
  if (answers.tax_on_wealthy === "yes") reasons.push("you support higher taxes on the wealthy");
  if (answers.support_welfare_spending === "yes") reasons.push("you favour welfare spending to support communities");
  if (answers.satisfaction_national_government === "dissatisfied") reasons.push("you are dissatisfied with the current government");
  if (answers.climate_priority === "yes") reasons.push("you prioritise climate change action");
  if (answers.immigration_policy_stance === "open") reasons.push("you support a more open stance on immigration");
  if (answers.trust_mainstream_media === "low") reasons.push("you expressed low trust in mainstream media");
  if (answers.age_bracket === "18-24" || answers.age_bracket === "25-34") reasons.push("your age group historically leans towards progressive parties");

  return (
    <div className="p-4 rounded-xl shadow-md bg-white border border-gray-200">
      <h2 className="text-xl font-semibold mb-2">
        Why you were matched with {party?.name || predictedParty}
      </h2>

      {reasons.length > 0 && (
        <ul className="list-disc list-inside text-gray-700 mb-4">
          {reasons.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <h3 className="font-medium text-gray-800 mb-2">
          How your answers were considered:
        </h3>
        <ul className="list-disc list-inside text-gray-600 text-sm">
          {QUESTIONS.map((q: Question) => (
            <li key={q.fieldName}>
              {q.text}: <span className="font-semibold">{answers[q.fieldName]}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-sm text-gray-500 italic">
        This explanation is based on your survey responses. 
        No single answer determines the outcome — the model considers your profile as a whole.
      </p>
    </div>
  );
};

export default PredictionExplanation;

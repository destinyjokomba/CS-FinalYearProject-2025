// src/components/results/PredictionExplanation.tsx
import React from "react";
import { partyDisplayMap } from "@/utils/partyMap";
import { Party } from "@/types/dashboard";
import { QUESTIONS, Question } from "@/data/surveyOptions";

interface Props {
  predictedParty: string;
  answers: Record<string, string>;
  probabilities?: Record<string, number>;
   reasons?: string[];
}

const PredictionExplanation: React.FC<Props> = ({
  predictedParty,
  answers,
  probabilities = {},
}) => {
  const party = partyDisplayMap[predictedParty as Party];
  const reasons: string[] = [];

  // 🔹 Generic answer-based reasons (from your second version)
  if (answers.tax_on_wealthy === "yes")
    reasons.push("You support higher taxes on the wealthy");
  if (answers.support_welfare_spending === "yes")
    reasons.push("You favour welfare spending to support communities");
  if (answers.satisfaction_national_government === "dissatisfied")
    reasons.push("You are dissatisfied with the current government");
  if (answers.climate_priority === "yes")
    reasons.push("You prioritise climate change action");
  if (answers.immigration_policy_stance === "open")
    reasons.push("You support a more open stance on immigration");
  if (answers.trust_mainstream_media === "low")
    reasons.push("You expressed low trust in mainstream media");
  if (
    answers.age_bracket === "18-24" ||
    answers.age_bracket === "25-34"
  )
    reasons.push("Your age group historically leans towards progressive parties");

  // 🔹 Party-specific reasons (from your first version)
  switch (predictedParty) {
    case "lab":
      if (answers.tax_on_wealthy === "yes")
        reasons.push("You support higher taxes on the wealthy, a Labour policy.");
      if (answers.support_welfare_spending === "yes")
        reasons.push("You favour strong welfare spending, a core Labour stance.");
      if (answers.satisfaction_national_government === "dissatisfied")
        reasons.push("Your dissatisfaction with the current government aligns with Labour’s opposition role.");
      break;

    case "con":
      if (answers.tax_on_wealthy === "no")
        reasons.push("You prefer lower taxation policies, often associated with Conservatives.");
      if (answers.importance_economy === "high")
        reasons.push("You prioritise economic stability and growth, a central Conservative focus.");
      if (answers.satisfaction_national_government === "satisfied")
        reasons.push("Your satisfaction with the current government leans Conservative.");
      break;

    case "ld":
      if (answers.immigration_policy_stance === "open")
        reasons.push("You support an open immigration stance, aligned with the Liberal Democrats’ values.");
      if (answers.climate_priority === "yes")
        reasons.push("You prioritised climate action, a key Liberal Democrat policy area.");
      break;

    case "green":
      if (answers.climate_priority === "yes")
        reasons.push("You prioritised climate change as a top issue, central to the Green Party’s platform.");
      if (answers.support_welfare_spending === "yes")
        reasons.push("You favour welfare spending, consistent with Green’s progressive policies.");
      if (answers.tax_on_wealthy === "yes")
        reasons.push("You support redistributive taxation, strongly emphasised by the Greens.");
      break;

    case "reform":
      if (answers.tax_on_wealthy === "no")
        reasons.push("You prefer lower taxation, a Reform UK priority.");
      if (answers.immigration_policy_stance === "strict")
        reasons.push("You favour stricter immigration policies, central to Reform UK.");
      if (answers.trust_mainstream_media === "low")
        reasons.push("You expressed low trust in mainstream media, often shared by Reform UK supporters.");
      break;

    case "snp":
      if (answers.support_welfare_spending === "yes")
        reasons.push("You favour strong welfare spending, aligned with SNP’s priorities.");
      if (answers.tax_on_wealthy === "yes")
        reasons.push("You support redistributive taxation, consistent with SNP policies.");
      if (answers.constituency_leaning === "scotland")
        reasons.push("Your location/constituency context aligns you with SNP.");
      break;

    default:
      reasons.push("Your responses reflect a mix of views across multiple parties.");
  }

  // 🔹 Confidence & comparisons
  const confidence = probabilities[predictedParty] || 0;
  const sorted = Object.entries(probabilities)
    .sort((a, b) => b[1] - a[1])
    .filter(([p]) => p !== predictedParty);
  const runnerUp = sorted.length > 0 ? sorted[0] : null;

  return (
    <div className="p-6 rounded-xl shadow-md bg-white border border-gray-200 text-left">
      <h2 className="text-xl font-semibold mb-3">
        Why you were matched with {party?.name || predictedParty}
      </h2>

      {/* Reasons */}
      {reasons.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700 mb-4">
          {reasons.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700 mb-4">
          Your answers share traits with {party?.name} policies.
        </p>
      )}

      {/* Confidence */}
      <p className="mb-3 text-gray-700">
        Confidence: <strong>{confidence.toFixed(1)}%</strong>{" "}
        ({confidence >= 50 ? "High" : "Low"} confidence)
      </p>

      {/* Runner-up party */}
      {runnerUp && (
        <p className="mb-4 text-gray-700">
          You also showed alignment with{" "}
          <strong>{partyDisplayMap[runnerUp[0] as Party]?.name}</strong> (
          {runnerUp[1].toFixed(1)}%), but the stronger weight of your answers
          tilted you towards {party?.name}.
        </p>
      )}

      {/* Transparency */}
      <div className="mt-4">
        <h3 className="font-medium text-gray-800 mb-2">
          How your answers were considered:
        </h3>
        <ul className="list-disc list-inside text-gray-600 text-sm">
          {QUESTIONS.map((q: Question) => (
            <li key={q.fieldName}>
              {q.text}:{" "}
              <span className="font-semibold">{answers[q.fieldName]}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-sm text-gray-500 italic">
        This explanation is based on your survey responses. No single answer
        determines the outcome — the model considers your profile as a whole.
      </p>
    </div>
  );
};

export default PredictionExplanation;

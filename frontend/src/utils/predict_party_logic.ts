// src/utils/predict_party_logic.ts

import type { Party, PredictionResult } from "@/types/dashboard";

export const partyDisplayMap: Record<Party, { name: string; color: string }> = {
  lab: { name: "Labour", color: "#DC2626" },
  con: { name: "Conservative", color: "#2563EB" },
  ld: { name: "Liberal Democrats", color: "#f38f0dff" },
  green: { name: "Green", color: "#109a42ff" },
  reform: { name: "Reform UK", color: "#09b9bcff" },
  snp: { name: "SNP", color: "#ebc012ff" },
  other: { name: "Other", color: "#9CA3AF" },
};

export function predictParty(answers: Record<string, string>): PredictionResult {
  // initialise scores for all parties
  const scores: Record<Party, number> = {
    lab: 0,
    con: 0,
    ld: 0,
    green: 0,
    reform: 0,
    snp: 0,
    other: 0,
  };

  // example scoring logic (expand as needed)
  if (answers.age_bracket === "18–24") {
    scores.lab += 2;
    scores.green += 2;
    scores.snp += 1;
  }
  if (answers.age_bracket === "65+") {
    scores.con += 2;
    scores.reform += 2;
  }

  if (answers.support_welfare_spending === "yes") {
    scores.lab += 2;
    scores.green += 1;
    scores.snp += 1;
  } else {
    scores.con += 1;
    scores.reform += 2;
  }

  if (answers.tax_on_wealthy === "yes") {
    scores.lab += 2;
    scores.green += 1;
  } else {
    scores.con += 1;
    scores.reform += 1;
  }

  // determine winner
  const maxScore = Math.max(...Object.values(scores));
  const topParties = Object.entries(scores).filter(
    ([, score]) => score === maxScore
  );

  let winner: Party;
  if (topParties.length === 1) {
    winner = topParties[0][0] as Party;
  } else {
    // tie → random pick
    const randomIndex = Math.floor(Math.random() * topParties.length);
    winner = topParties[randomIndex][0] as Party;
  }

  // normalised probabilities
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const probabilities = Object.fromEntries(
    Object.entries(scores).map(([party, score]) => [
      party,
      parseFloat(((score / total) * 100).toFixed(2)),
    ])
  ) as Record<Party, number>;

  return { winner, probabilities };
}

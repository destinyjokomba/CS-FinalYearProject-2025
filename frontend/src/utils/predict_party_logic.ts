import { Party, PredictionResult } from "@/types/dashboard";
import { partyLogic } from "@/utils/party_logic";

// Base scores
const baseScores: Record<Party, number> = {
  lab: 0,
  con: 0,
  reform: 0,
  ld: 0,
  green: 0,
  snp: 0,
  other: 0,
};

// ───────────────────────────────
// Main predictor (reads from partyLogic)
// ───────────────────────────────
export function predictParty(answers: Record<string, string>): PredictionResult {
  const scores: Record<Party, number> = { ...baseScores };

  for (const [party, conditions] of Object.entries(partyLogic) as [Party, Record<string, Record<string, number>>][]) {
    for (const [field, weightedAnswers] of Object.entries(conditions)) {
      const answer = answers[field];
      if (answer && weightedAnswers[answer] !== undefined) {
        scores[party] += weightedAnswers[answer];
      }
    }
  }

  // Pick winner
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = sorted[0][1];
  const topParties = sorted.filter(([, score]) => score === topScore);

  let winner: Party;
  if (topParties.length === 1) {
    winner = topParties[0][0] as Party;
  } else {
    // Random tie-break for fairness
    const randomIndex = Math.floor(Math.random() * topParties.length);
    winner = topParties[randomIndex][0] as Party;
  }

  // Normalised probabilities (winner ~100%)
  const maxScore = Math.max(...Object.values(scores), 1);
  const probabilities = Object.fromEntries(
    Object.entries(scores).map(([party, score]) => [
      party,
      parseFloat(((score / maxScore) * 100).toFixed(2)),
    ])
  ) as Record<Party, number>;

  return { winner, probabilities };
}

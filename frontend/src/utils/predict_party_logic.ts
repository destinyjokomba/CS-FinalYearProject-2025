import { Party, PredictionResult } from "@/types/dashboard";

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
// Party-specific scoring functions
// ───────────────────────────────

// Labour
function applyLabour(answers: Record<string, string>, score: number): number {
  if (["Renting", "Council housing", "Living with family"].includes(answers.housing_status)) score += 3;
  if (answers.support_welfare_spending === "Yes") score += 3;
  if (answers.tax_on_wealthy === "Yes") score += 3;
  if (["Dissatisfied", "Very dissatisfied"].includes(answers.satisfaction_national_government)) score += 2;
  if (["Low", "Neutral"].includes(answers.trust_mainstream_media)) score += 2;
  if (["Low", "Neutral"].includes(answers.trust_public_institutions)) score += 2;
  return score;
}

// Conservative
function applyConservative(answers: Record<string, string>, score: number): number {
  if (["Bachelor’s degree", "Master’s degree", "PhD or higher"].includes(answers.education_level)) score += 3;
  if (["£60,000–£80,000", "£80,000–£100,000", "Over £100,000"].includes(answers.household_income)) score += 3;
  if (["Restrictive", "Very restrictive"].includes(answers.immigration_policy_stance)) score += 3;
  if (["Dissatisfied", "Very dissatisfied"].includes(answers.satisfaction_national_government)) score += 2; // unhappy right now
  if (answers.importance_economy === "Not important") score += 2;
  if (answers.importance_social_issues === "Not important") score += 2;
  return score;
}

// Liberal Democrats
function applyLibDem(answers: Record<string, string>, score: number): number {
  if (["Bachelor’s degree", "Master’s degree", "PhD or higher"].includes(answers.education_level)) score += 3;
  if (answers.household_income === "£40,000–£60,000") score += 2;
  if (["35–44", "45–54"].includes(answers.age_bracket)) score += 2;
  if (answers.satisfaction_national_government === "Neutral") score += 1;
  if (answers.importance_economy === "Somewhat important") score += 2;
  if (answers.importance_social_issues === "Somewhat important") score += 2;
  if (answers.concern_political_corruption === "Somewhat concerned") score += 2;
  return score;
}

// Green
function applyGreen(answers: Record<string, string>, score: number): number {
  if (["18–24", "25–34"].includes(answers.age_bracket)) score += 3;
  if (["Renting", "Living with family"].includes(answers.housing_status)) score += 2;
  if (["Working class", "Lower-middle class"].includes(answers.socioeconomic_class)) score += 2;
  if (answers.satisfaction_national_government === "Very dissatisfied") score += 2;
  if (answers.importance_economy === "Very important") score += 2;
  if (answers.importance_social_issues === "Very important") score += 2;
  if (answers.concern_political_corruption === "Very concerned") score += 2;
  return score;
}

// Reform UK
function applyReform(answers: Record<string, string>, score: number): number {
  if (["No qualification", "GCSE or equivalent"].includes(answers.education_level)) score += 3;
  if (["Under £20,000", "£20,000–£40,000"].includes(answers.household_income)) score += 2;
  if (answers.socioeconomic_class === "Working class") score += 2;
  if (answers.satisfaction_national_government === "Very dissatisfied") score += 2;
  if (answers.importance_economy === "Important") score += 2;
  if (answers.importance_social_issues === "Not important") score += 2;
  if (answers.support_welfare_spending === "No") score += 2;
  if (["High", "Very high"].includes(answers.trust_mainstream_media)) score += 2;
  if (answers.concern_political_corruption === "Very concerned") score += 2;
  if (["High", "Very high"].includes(answers.trust_public_institutions)) score += 2;
  if (["Restrictive", "Very restrictive"].includes(answers.immigration_policy_stance)) score += 4;
  return score;
}

// SNP
function applySNP(answers: Record<string, string>, score: number): number {
  if (answers.region_boost === "Scotland" || answers.constituency_leaning === "snp") score += 5;
  if (answers.support_welfare_spending === "Yes") score += 2;
  if (answers.climate_priority === "Yes") score += 2;
  if (answers.immigration_policy_stance === "More open") score += 1;
  return score;
}

// Other
function applyOther(answers: Record<string, string>, score: number): number {
  if (answers.constituency_leaning === "other") score += 3;
  return score;
}

// ───────────────────────────────
// Main predictor
// ───────────────────────────────
export function predictParty(answers: Record<string, string>): PredictionResult {
  const scores: Record<Party, number> = { ...baseScores };

  scores.lab = applyLabour(answers, scores.lab);
  scores.con = applyConservative(answers, scores.con);
  scores.reform = applyReform(answers, scores.reform);
  scores.ld = applyLibDem(answers, scores.ld);
  scores.green = applyGreen(answers, scores.green);
  scores.snp = applySNP(answers, scores.snp);
  scores.other = applyOther(answers, scores.other);

  // Pick winner
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = sorted[0][1];
  const topParties = sorted.filter(([, score]) => score === topScore);

  let winner: Party;
  if (topParties.length === 1) {
    winner = topParties[0][0] as Party;
  } else {
    const randomIndex = Math.floor(Math.random() * topParties.length);
    winner = topParties[randomIndex][0] as Party;
  }

  // Relative probabilities (winner ≈ 100%)
  const maxScore = Math.max(...Object.values(scores), 1);
  const probabilities = Object.fromEntries(
    Object.entries(scores).map(([party, score]) => [
      party,
      parseFloat(((score / maxScore) * 100).toFixed(2)),
    ])
  ) as Record<Party, number>;

  return { winner, probabilities };
}

import { Party, PredictionResult } from "@/types/dashboard";

// Long names → short codes
export const partyCodeMap: Record<string, Party> = {
  "Labour": "lab",
  "Conservative": "con",
  "Liberal Democrats": "ld",
  "Green": "green",
  "Reform": "reform",
  "Reform UK": "reform", 
  "SNP": "snp",
  "Other": "other",
};

// Party display info
export const partyDisplayMap: Record<
  Party,
  {
    name: string;
    color: string;
    description: string;
    logo: string;
    slogan: string;
    demographics: string;
  }
> = {
  lab: {
    name: "Labour",
    color: "#E4003B",
    description: "Centre-left, focused on social equality and welfare spending.",
    logo: "/logos/labour.png",
    slogan: "For the many, not the few",
    demographics: "Younger voters, renters, working-class, public sector workers.",
  },
  con: {
    name: "Conservative",
    color: "#0087DC",
    description: "Centre-right, focused on free markets and traditional values.",
    logo: "/logos/conservative.svg.png",
    slogan: "Strong leadership, secure future",
    demographics: "Older voters, homeowners, higher-income earners, rural areas.",
  },
  reform: {
    name: "Reform UK",
    color: "#12B6CF",
    description: "Right-wing, anti-establishment and focused on immigration reform.",
    logo: "/logos/reform.svg.png",
    slogan: "Let’s take back control",
    demographics: "Disaffected Conservative voters, anti-EU, older men, working-class.",
  },
  ld: {
    name: "Liberal Democrats",
    color: "#FAA61A",
    description: "Centrist, liberal policies, pro-Europe and civil liberties.",
    logo: "/logos/libdem.png",
    slogan: "Demand better",
    demographics: "Educated professionals, pro-EU, suburban and southern England voters.",
  },
  green: {
    name: "Green",
    color: "#6AB023",
    description: "Environmentalist, progressive on social and climate issues.",
    logo: "/logos/green.svg.png",
    slogan: "People. Planet. Politics.",
    demographics: "Students, urban professionals, climate activists, progressive younger voters.",
  },
  snp: {
    name: "SNP",
    color: "#FDF38E",
    description: "Scottish nationalist, centre-left, pro-independence.",
    logo: "/logos/snp.svg.png",
    slogan: "Stronger for Scotland",
    demographics: "Scottish voters, pro-independence, younger progressive voters.",
  },
  other: {
    name: "Other",
    color: "#888888",
    description: "Smaller regional or independent parties.",
    logo: "/logos/other.png",
    slogan: "Local voices matter",
    demographics: "Niche or regional communities, independents.",
  },
};

// ⚖️ Balanced starting scores (no bias)
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

// Reform UK
function applyReform(answers: Record<string, string>, score: number): number {
  if (answers.household_income === "under £20,000") score += 3;
  if (answers.education_level === "no qualification") score += 3;
  if (answers.tax_on_wealthy === "no") score += 4;
  if (["restrictive", "very restrictive"].includes(answers.immigration_policy_stance)) score += 6;
  if (answers.concern_political_corruption === "very concerned") score += 3;
  return score;
}

// Green
function applyGreen(answers: Record<string, string>, score: number): number {
  if (answers.climate_priority === "yes") score += 8;
  if (answers.importance_social_issues === "very important") score += 4;
  if (answers.housing_status === "renter") score += 2;
  if (answers.immigration_policy_stance === "more open") score += 3;
  return score;
}

// Labour
function applyLabour(answers: Record<string, string>, score: number): number {
  if (answers.household_income === "£20,000–£40,000") score += 3;
  if (answers.housing_status === "council housing" || answers.housing_status === "renter") score += 3;
  if (answers.support_welfare_spending === "yes") score += 4;
  if (answers.tax_on_wealthy === "yes") score += 4;
  if (answers.immigration_policy_stance === "more open") score += 3;
  return score;
}

// Conservative
function applyConservative(answers: Record<string, string>, score: number): number {
  if (answers.household_income === "£60,000-£80,000" || answers.household_income === "£80,000 +") score += 4;
  if (answers.housing_status === "homeowner") score += 3;
  if (answers.tax_on_wealthy === "no") score += 3;
  if (answers.immigration_policy_stance === "restrictive") score += 4;
  return score;
}

// Lib Dem
function applyLibDem(answers: Record<string, string>, score: number): number {
  if (["bachelors degree","masters degree","phd or higher"].includes(answers.education_level)) score += 3;
  if (answers.household_income === "£40,000–£60,000") score += 2;
  if (answers.immigration_policy_stance === "more open") score += 2;
  return score;
}

// SNP
function applySNP(answers: Record<string, string>, score: number): number {
  if (answers.region_boost === "Scotland" || answers.constituency_leaning === "snp") score += 8;
  if (answers.climate_priority === "yes") score += 2;
  if (answers.immigration_policy_stance === "more open") score += 2;
  return score;
}

// Other
function applyOther(answers: Record<string, string>, score: number): number {
  if (answers.constituency_leaning === "other") score += 4;
  if (answers.region_boost === "Wales") score += 4; // Plaid Cymru example
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
    // 🎲 Random tie-break instead of hard bias
    const randomIndex = Math.floor(Math.random() * topParties.length);
    winner = topParties[randomIndex][0] as Party;
  }

  // Normalised probabilities
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const probabilities = Object.fromEntries(
    Object.entries(scores).map(([party, score]) => [
      party,
      parseFloat(((score / total) * 100).toFixed(2)),
    ])
  ) as Record<Party, number>;

  return { winner, probabilities };
}

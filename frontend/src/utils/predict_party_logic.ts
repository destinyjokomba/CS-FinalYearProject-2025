// src/utils/predict_party_logic.ts
import type { Party, PredictionResult } from "@/types/dashboard";

// Party → Display Name & Color (used in charts/UI)
export const partyDisplayMap: Record<Party, { name: string; color: string }> = {
  lab: { name: "Labour", color: "#DC2626" },
  con: { name: "Conservative", color: "#2563EB" },
  ld: { name: "Liberal Democrats", color: "#f38f0dff" },
  green: { name: "Green", color: "#109a42ff" },
  reform: { name: "Reform UK", color: "#09b9bcff" },
  snp: { name: "SNP", color: "#ebc012ff" },
  other: { name: "Other", color: "#9CA3AF" },
};

// Base scores (prevents zero-weight parties)
const baseScores: Record<Party, number> = {
  lab: 1, con: 1, ld: 1, green: 1, reform: 1, snp: 1, other: 1,
};

// Main prediction function
export function predictParty(answers: Record<string, string>): PredictionResult {
  const scores: Record<Party, number> = { ...baseScores };

  // ───────────────────────────────
  // AGE BRACKET
  // ───────────────────────────────
  if (["18–24", "25–34"].includes(answers.age_bracket)) {
    scores.lab += 2; scores.green += 2; scores.snp += 1;
  }
  if (["35–44"].includes(answers.age_bracket)) {
    scores.lab += 1; scores.ld += 2; scores.con += 1;
  }
  if (["45–54"].includes(answers.age_bracket)) {
    scores.con += 2; scores.ld += 1; scores.reform += 1;
  }
  if (["55–64"].includes(answers.age_bracket)) {
    scores.con += 2; scores.reform += 2;
  }
  if (answers.age_bracket === "65+") {
    scores.con += 3; scores.reform += 2;
  }

  // ───────────────────────────────
  // EDUCATION
  // ───────────────────────────────
  if (answers.education_level === "bachelors degree") {
    scores.lab += 2; scores.green += 1;
  }
  if (["masters degree","phd or higher"].includes(answers.education_level)) {
    scores.con += 2; scores.ld += 2; scores.green += 1;
  }
  if (["no qualification","gcse or equivalent","a-level or equivalent"].includes(answers.education_level)) {
    scores.reform += 2; scores.con += 1;
  }

  // ───────────────────────────────
  // HOUSEHOLD INCOME
  // ───────────────────────────────
  if (answers.household_income === "under £20,000") {
    scores.lab += 2; scores.green += 1; scores.reform += 1;
  }
  if (answers.household_income === "£20,000–£40,000") {
    scores.lab += 2; scores.snp += 1;
  }
  if (["£40,000–£60,000"].includes(answers.household_income)) {
    scores.ld += 2; scores.green += 1;
  }
  if (["£60,000-£80,000","£80,000 +"].includes(answers.household_income)) {
    scores.con += 3;
  }

  // ───────────────────────────────
  // SOCIOECONOMIC CLASS
  // ───────────────────────────────
  if (answers.socioeconomic_class === "working class") {
    scores.lab += 2; scores.reform += 1;
  }
  if (answers.socioeconomic_class === "lower middle class") {
    scores.green += 2; scores.ld += 1;
  }
  if (answers.socioeconomic_class === "middle class") {
    scores.ld += 2;
  }
  if (answers.socioeconomic_class === "upper middle class") {
    scores.con += 2;
  }

  // ───────────────────────────────
  // HOUSING STATUS
  // ───────────────────────────────
  if (answers.housing_status === "homeowner") {
    scores.con += 2;
  }
  if (answers.housing_status === "renter") {
    scores.lab += 2; scores.green += 1;
  }
  if (answers.housing_status === "living with family") {
    scores.lab += 1; scores.reform += 1;
  }
  if (answers.housing_status === "council housing") {
    scores.lab += 2; scores.reform += 1;
  }

  // ───────────────────────────────
  // CONSTITUENCY LEANING
  // ───────────────────────────────
  if (answers.constituency_leaning === "labour") scores.lab += 3;
  if (answers.constituency_leaning === "conservative") scores.con += 3;
  if (answers.constituency_leaning === "liberal democrat") scores.ld += 3;
  if (answers.constituency_leaning === "green") scores.green += 3;
  if (answers.constituency_leaning === "snp") scores.snp += 3;
  if (answers.constituency_leaning === "reform") scores.reform += 3;
  if (answers.constituency_leaning === "other") scores.other += 2;

  // ───────────────────────────────
  // VOTING HABITS
  // ───────────────────────────────
  if (answers.vote_national === "yes") {
    scores.lab += 1; scores.con += 1; scores.ld += 1; scores.snp += 1;
  } else {
    scores.reform += 2; scores.other += 1;
  }
  if (answers.vote_local === "yes") {
    scores.ld += 1; scores.lab += 1; scores.con += 1;
  } else {
    scores.reform += 1;
  }

  // ───────────────────────────────
  // GOV SATISFACTION
  // ───────────────────────────────
  if (answers.satisfaction_national_government === "very dissatisfied") {
    scores.lab += 2; scores.green += 2; scores.reform += 2; scores.snp += 1;
  }
  if (answers.satisfaction_national_government === "dissatisfied") {
    scores.ld += 1; scores.lab += 1;
  }
  if (answers.satisfaction_national_government === "satisfied") {
    scores.con += 2;
  }
  if (answers.satisfaction_national_government === "very satisfied") {
    scores.con += 3;
  }

  // ───────────────────────────────
  // ECONOMY & SOCIAL ISSUES
  // ───────────────────────────────
  if (answers.importance_economy === "very important") {
    scores.lab += 1; scores.con += 1; scores.reform += 1;
  }
  if (answers.importance_social_issues === "very important") {
    scores.lab += 2; scores.green += 2;
  }
  if (answers.importance_social_issues === "not important") {
    scores.reform += 2; scores.con += 1;
  }

  // ───────────────────────────────
  // WELFARE & TAX
  // ───────────────────────────────
  if (answers.support_welfare_spending === "yes") {
    scores.lab += 3; scores.green += 2; scores.snp += 1;
  } else {
    scores.con += 2; scores.reform += 2;
  }
  if (answers.tax_on_wealthy === "yes") {
    scores.lab += 2; scores.green += 1; scores.ld += 1;
  } else {
    scores.con += 2; scores.reform += 2;
  }

  // ───────────────────────────────
  // MEDIA & CORRUPTION
  // ───────────────────────────────
  if (answers.trust_mainstream_media === "very high") scores.con += 2;
  if (answers.trust_mainstream_media === "high") scores.ld += 1;
  if (answers.trust_mainstream_media === "low") scores.lab += 1; scores.green += 1;
  if (answers.trust_mainstream_media === "very low") scores.reform += 2; scores.green += 1;

  if (answers.concern_political_corruption === "very concerned") {
    scores.green += 2; scores.lab += 1; scores.reform += 2;
  }
  if (answers.concern_political_corruption === "somewhat concerned") {
    scores.ld += 1;
  }
  if (answers.concern_political_corruption === "not concerned") {
    scores.con += 2;
  }

  // ───────────────────────────────
  // CLIMATE & IMMIGRATION
  // ───────────────────────────────
  if (answers.climate_priority === "yes") {
    scores.green += 3; scores.lab += 1; scores.snp += 1; scores.ld += 1;
  } else {
    scores.reform += 2; scores.con += 1;
  }

  if (answers.immigration_policy_stance === "more open") {
    scores.lab += 2; scores.green += 2; scores.ld += 1; scores.snp += 1;
  }
  if (answers.immigration_policy_stance === "unbothered") {
    scores.ld += 2;
  }
  if (answers.immigration_policy_stance === "restrictive") {
    scores.con += 2; scores.reform += 2;
  }
  if (answers.immigration_policy_stance === "very restrictive") {
    scores.reform += 3; scores.con += 2;
  }

  // ───────────────────────────────
  // TRUST IN INSTITUTIONS
  // ───────────────────────────────
  if (answers.trust_public_institutions === "very high") scores.con += 2;
  if (answers.trust_public_institutions === "high") scores.ld += 1;
  if (answers.trust_public_institutions === "medium") scores.ld += 1;
  if (answers.trust_public_institutions === "low") scores.lab += 1; scores.green += 1;
  if (answers.trust_public_institutions === "very low") scores.reform += 2;

  // ───────────────────────────────
  // REGION BOOSTS
  // ───────────────────────────────
  if (answers.region_boost === "Scotland") scores.snp += 4;
  if (answers.region_boost === "Wales") scores.lab += 2; scores.other += 1;
  if (answers.region_boost === "North of England") scores.lab += 2; scores.reform += 1;
  if (answers.region_boost === "Midlands") scores.reform += 2; scores.con += 1;
  if (answers.region_boost === "London") scores.ld += 2; scores.lab += 1;
  if (answers.region_boost === "South of England") scores.con += 3; scores.reform += 1;

  // ───────────────────────────────
  // WINNER + PROBABILITIES
  // ───────────────────────────────
  const maxScore = Math.max(...Object.values(scores));
  const topParties = Object.entries(scores).filter(([, s]) => s === maxScore);
  const winner = topParties[Math.floor(Math.random() * topParties.length)][0] as Party;

  // Calculate probabilities
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const probabilities = Object.fromEntries(
    Object.entries(scores).map(([p, s]) => [
      p,
      parseFloat(((s / total) * 100).toFixed(1)),
    ])
  ) as Record<Party, number>;

  // ───────────────────────────────
  // PARTY-SPECIFIC REASONS
  // ───────────────────────────────
  const reasons: string[] = [];

  switch (winner) {
    case "lab":
      if (answers.tax_on_wealthy === "yes")
        reasons.push("You support higher taxes on the wealthy, a key Labour stance.");
      if (answers.support_welfare_spending === "yes")
        reasons.push("You favour welfare spending to support communities.");
      if (answers.satisfaction_national_government?.includes("dissatisfied"))
        reasons.push("Your dissatisfaction with the current government aligns with Labour’s opposition.");
      break;

    case "con":
      if (answers.tax_on_wealthy === "no")
        reasons.push("You prefer lower taxation policies, a Conservative priority.");
      if (answers.importance_economy === "very important")
        reasons.push("You prioritise economic stability and growth, central to Conservative policies.");
      if (answers.satisfaction_national_government?.includes("satisfied"))
        reasons.push("Your satisfaction with the current government leans Conservative.");
      break;

    case "ld":
      if (answers.immigration_policy_stance === "more open")
        reasons.push("You support an open immigration stance, aligned with Liberal Democrat values.");
      if (answers.climate_priority === "yes")
        reasons.push("You prioritised climate action, a key Liberal Democrat policy area.");
      break;

    case "green":
      if (answers.climate_priority === "yes")
        reasons.push("You prioritised climate change action, central to the Green Party.");
      if (answers.support_welfare_spending === "yes")
        reasons.push("You favour welfare spending, consistent with Green’s progressive policies.");
      if (answers.tax_on_wealthy === "yes")
        reasons.push("You support redistributive taxation, strongly emphasised by the Greens.");
      break;

    case "reform":
      if (answers.tax_on_wealthy === "no")
        reasons.push("You prefer lower taxation, a Reform UK priority.");
      if (answers.immigration_policy_stance?.includes("restrictive"))
        reasons.push("You favour stricter immigration policies, central to Reform UK.");
      if (["very low", "low"].includes(answers.trust_mainstream_media))
        reasons.push("You expressed low trust in mainstream media, often shared by Reform UK supporters.");
      break;

    case "snp":
      if (answers.support_welfare_spending === "yes")
        reasons.push("You favour welfare spending, aligned with SNP’s policies.");
      if (answers.tax_on_wealthy === "yes")
        reasons.push("You support redistributive taxation, consistent with SNP.");
      if (answers.region_boost === "Scotland")
        reasons.push("Your region boosts SNP alignment.");
      break;

    default:
      reasons.push("Your responses show a mix of positions across multiple parties.");
  }

  return { winner, probabilities, reasons };
}

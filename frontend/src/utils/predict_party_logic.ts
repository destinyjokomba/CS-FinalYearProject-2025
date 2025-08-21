export type Party =
  | "Labour"
  | "Conservative"
  | "Reform"
  | "Liberal Democrats"
  | "Green"
  | "SNP"
  | "Other";

export interface PredictionResult {
  winner: Party;
  probabilities: Record<Party, number>;
}

export const partyDisplayMap: Record<
  Party,
  { name: string; color: string; description: string }
> = {
  Labour: {
    name: "Labour",
    color: "#E4003B",
    description: "Centre-left, focused on social equality and welfare spending.",
  },
  Conservative: {
    name: "Conservative",
    color: "#0087DC",
    description: "Centre-right, focused on free markets and traditional values.",
  },
  Reform: {
    name: "Reform UK",
    color: "#12B6CF",
    description: "Right-wing, anti-establishment and focused on immigration reform.",
  },
  "Liberal Democrats": {
    name: "Liberal Democrats",
    color: "#FAA61A",
    description: "Centrist, liberal policies, pro-Europe and civil liberties.",
  },
  Green: {
    name: "Green",
    color: "#6AB023",
    description: "Environmentalist, progressive on social and climate issues.",
  },
  SNP: {
    name: "SNP",
    color: "#FDF38E",
    description: "Scottish nationalist, centre-left, pro-independence.",
  },
  Other: {
    name: "Other",
    color: "#888888",
    description: "Smaller regional or independent parties.",
  },
};
export function predictParty(answers: Record<string, string>): PredictionResult {
  // Baseline (weighted by UK electorate share)
  const scores: Record<Party, number> = {
    Labour: 35,
    Conservative: 30,
    Reform: 15,
    "Liberal Democrats": 8,
    Green: 6,
    SNP: 4,
    Other: 2,
  };

  // ─── LOGIC RULES ────────────────────────────

  // 1. Age
  switch (answers["age_bracket"]) {
    case "18-24":
      scores["Labour"] += 6; scores["Green"] += 3;
      break;
    case "25-34":
      scores["Labour"] += 4; scores["Liberal Democrats"] += 2;
      break;
    case "55+":
      scores["Conservative"] += 6; scores["Reform"] += 3;
      break;
  }

  // 2. Education
  if (answers["education_level"] === "bachelors degree") {
    scores["Liberal Democrats"] += 3; scores["Green"] += 2;
  }
  if (answers["education_level"] === "no qualification") {
    scores["Reform"] += 4;
  }

  // 3. Income
  if (answers["household_income"] === "£20,000–£40,000") {
    scores["Labour"] += 4;
  }
  if (answers["household_income"] === "£80,000 +") {
    scores["Conservative"] += 6;
  }

  // 4. Socioeconomic class
  if (answers["socioeconomic_class"] === "working class") {
    scores["Labour"] += 5;
  }
  if (answers["socioeconomic_class"] === "upper class") {
    scores["Conservative"] += 5;
  }

  // 5. Housing
  if (answers["housing_status"] === "rented") {
    scores["Labour"] += 4;
  }
  if (answers["housing_status"] === "homeowner") {
    scores["Conservative"] += 4;
  }

  // 6. Constituency leaning
  if (answers["constituency_leaning"] === "Labour safe seat") scores["Labour"] += 3;
  if (answers["constituency_leaning"] === "Conservative safe seat") scores["Conservative"] += 3;
  if (answers["constituency_leaning"] === "Scotland") scores["SNP"] += 5;

  // 7. Past vote - National
  if (answers["vote_national"] === "Labour") scores["Labour"] += 8;
  if (answers["vote_national"] === "Conservative") scores["Conservative"] += 8;
  if (answers["vote_national"] === "Lib Dem") scores["Liberal Democrats"] += 6;
  if (answers["vote_national"] === "Green") scores["Green"] += 6;
  if (answers["vote_national"] === "Reform") scores["Reform"] += 6;

  // 8. Past vote - Local
  if (answers["vote_local"] === "Labour") scores["Labour"] += 3;
  if (answers["vote_local"] === "Conservative") scores["Conservative"] += 3;

  // 9. Gov satisfaction
  if (answers["satisfaction_national_government"] === "Dissatisfied") {
    scores["Labour"] += 4; scores["Reform"] += 4;
  }

  // 10. Economy importance
  if (answers["importance_economy"] === "High") {
    scores["Conservative"] += 3; scores["Labour"] += 3;
  }

  // 11. Social issues importance
  if (answers["importance_social_issues"] === "High") {
    scores["Labour"] += 2; scores["Green"] += 2;
  }

  // 12. Welfare
  if (answers["support_welfare_spending"] === "Yes") scores["Labour"] += 4;
  else scores["Conservative"] += 3;

  // 13. Tax stance
  if (answers["tax_on_wealthy"] === "Increase") scores["Labour"] += 4;
  if (answers["tax_on_wealthy"] === "Reduce") scores["Conservative"] += 4;

  // 14. Media trust
  if (answers["trust_mainstream_media"] === "No") scores["Reform"] += 5;
  else scores["Conservative"] += 3;

  // 15. Corruption concern
  if (answers["concern_political_corruption"] === "High") {
    scores["Reform"] += 3; scores["Labour"] += 2;
  }

  // 16. Climate
  if (answers["climate_priority"] === "Yes") {
    scores["Green"] += 6; scores["Labour"] += 2;
  }

  // 17. Immigration
  if (answers["immigration_policy_stance"] === "More open") {
    scores["Labour"] += 3; scores["Green"] += 2; scores["Liberal Democrats"] += 2;
  }
  if (answers["immigration_policy_stance"] === "More strict") {
    scores["Reform"] += 6; scores["Conservative"] += 3;
  }

  // 18. Trust in institutions
  if (answers["trust_public_institutions"] === "Low") {
    scores["Reform"] += 4;
  } else {
    scores["Conservative"] += 2; scores["Labour"] += 2;
  }

  // ─── Winner Selection ──────────────────────
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = sorted[0][1];
  const topParties = sorted.filter(([, score]) => score === topScore);

  let winner: Party;
  if (topParties.length === 1) {
    winner = topParties[0][0] as Party;
  } else {
    const order: Party[] = [
      "Labour",
      "Reform",
      "Conservative",
      "Liberal Democrats",
      "Green",
      "SNP",
      "Other",
    ];
    winner = order.find((p) =>
      topParties.some(([tp]) => tp === p)
    ) as Party;
  }

  // ─── Percentages ──────────────────────────
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const probabilities = Object.fromEntries(
    Object.entries(scores).map(([party, score]) => [
      party,
      Math.round((score / total) * 100),
    ])
  ) as Record<Party, number>;

  return { winner, probabilities };
}

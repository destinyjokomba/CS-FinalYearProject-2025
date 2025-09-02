// src/utils/partyLogic.ts

export type Party =
  | "lab"
  | "con"
  | "ld"
  | "green"
  | "reform"
  | "snp"
  | "other";

// Each party maps survey fields → { answer → weight }
export const partyLogic: Record<Party, Record<string, Record<string, number>>> = {
  lab: {
    support_welfare_spending: { "Yes": 5 },
    tax_on_wealthy: { "Yes": 4 },
    housing_status: {
      "Renting": 3,
      "Council housing": 3,
    },
    satisfaction_national_government: {
      "Dissatisfied": 2,
      "Very dissatisfied": 2,
    },
  },

  con: {
    household_income: {
      "£60,000–£80,000": 5,
      "£80,000–£100,000": 5,
      "Over £100,000": 5,
    },
    housing_status: { "Own outright": 3, "Mortgage": 3 },
    immigration_policy_stance: {
      "Restrictive": 4,
      "Very restrictive": 4,
    },
    trust_public_institutions: { "High": 2, "Very high": 2 },
  },

  ld: {
    education_level: {
      "Bachelor’s degree": 5,
      "Master’s degree": 5,
      "PhD or higher": 5,
    },
    household_income: { "£40,000–£60,000": 3 },
    satisfaction_national_government: { "Neutral": 3 },
    concern_political_corruption: { "Somewhat concerned": 2 },
  },

  green: {
    climate_priority: { "Yes": 6 },
    age_bracket: { "18–24": 3, "25–34": 3 },
    housing_status: { "Renting": 2, "Living with family": 2 },
    satisfaction_national_government: { "Very dissatisfied": 2 },
  },

  reform: {
    immigration_policy_stance: {
      "Restrictive": 6,
      "Very restrictive": 6,
    },
    education_level: {
      "No qualification": 3,
      "GCSE or equivalent": 3,
    },
    household_income: { "Under £20,000": 3, "£20,000–£40,000": 3 },
    satisfaction_national_government: { "Very dissatisfied": 2 },
  },

  snp: {
    region_boost: { "Scotland": 6 },
    constituency_leaning: { "snp": 6 },
    support_welfare_spending: { "Yes": 3 },
    climate_priority: { "Yes": 2 },
    satisfaction_national_government: {
      "Dissatisfied": 2,
      "Very dissatisfied": 2,
    },
  },

  other: {
    constituency_leaning: {
      "Independent": 6,
      "Local Party": 6,
      "Other": 6,
    },
    region_boost: { "Wales": 3, "Northern Ireland": 3 },
  },
};

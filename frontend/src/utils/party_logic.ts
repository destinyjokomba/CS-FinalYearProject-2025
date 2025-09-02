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
    housing_status: {
      "Renting": 3,
      "Council housing": 3,
      "Living with family": 3,
    },
    support_welfare_spending: { "Yes": 3 },
    tax_on_wealthy: { "Yes": 3 },
    satisfaction_national_government: {
      "Dissatisfied": 2,
      "Very dissatisfied": 2,
    },
    trust_mainstream_media: {
      "Low": 2,
      "Neutral": 2,
    },
    trust_public_institutions: {
      "Low": 2,
      "Neutral": 2,
    },
    immigration_policy_stance: { "More open": 2 },
  },

  con: {
    education_level: {
      "Bachelor’s degree": 3,
      "Master’s degree": 3,
      "PhD or higher": 3,
    },
    household_income: {
      "£60,000–£80,000": 3,
      "£80,000–£100,000": 3,
      "Over £100,000": 3,
    },
    immigration_policy_stance: {
      "Restrictive": 3,
      "Very restrictive": 3,
    },
    satisfaction_national_government: {
      "Dissatisfied": 2,
      "Very dissatisfied": 2, // currently unhappy with gov
    },
    importance_economy: { "Not important": 2 },
    importance_social_issues: { "Not important": 2 },
  },

  ld: {
    education_level: {
      "Bachelor’s degree": 3,
      "Master’s degree": 3,
      "PhD or higher": 3,
    },
    household_income: { "£40,000–£60,000": 2 },
    age_bracket: {
      "35–44": 2,
      "45–54": 2,
    },
    satisfaction_national_government: { "Neutral": 1 },
    importance_economy: { "Somewhat important": 2 },
    importance_social_issues: { "Somewhat important": 2 },
    concern_political_corruption: { "Somewhat concerned": 2 },
  },

  green: {
    age_bracket: {
      "18–24": 3,
      "25–34": 3,
    },
    housing_status: {
      "Renting": 2,
      "Living with family": 2,
    },
    socioeconomic_class: {
      "Working class": 2,
      "Lower-middle class": 2,
    },
    satisfaction_national_government: { "Very dissatisfied": 2 },
    importance_economy: { "Very important": 2 },
    importance_social_issues: { "Very important": 2 },
    concern_political_corruption: { "Very concerned": 2 },
  },

  reform: {
    education_level: {
      "No qualification": 3,
      "GCSE or equivalent": 3,
    },
    household_income: {
      "Under £20,000": 2,
      "£20,000–£40,000": 2,
    },
    socioeconomic_class: { "Working class": 2 },
    satisfaction_national_government: { "Very dissatisfied": 2 },
    importance_economy: { "Important": 2 },
    importance_social_issues: { "Not important": 2 },
    support_welfare_spending: { "No": 2 },
    trust_mainstream_media: {
      "High": 2,
      "Very high": 2,
    },
    concern_political_corruption: { "Very concerned": 2 },
    trust_public_institutions: {
      "High": 2,
      "Very high": 2,
    },
    immigration_policy_stance: {
      "Restrictive": 4,
      "Very restrictive": 4,
    },
  },

  snp: {
    region_boost: { "Scotland": 5 },
    constituency_leaning: { "snp": 5 },
    support_welfare_spending: { "Yes": 2 },
    climate_priority: { "Yes": 2 },
    immigration_policy_stance: { "More open": 1 },
  },

  other: {
    constituency_leaning: {
      "Independent": 3,
      "Local Party": 3,
      "Other": 3,
    },
  },
};

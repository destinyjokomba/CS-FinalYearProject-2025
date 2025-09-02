// src/utils/partyLogic.ts

export type Party =
  | "Labour"
  | "Conservative"
  | "Liberal Democrats"
  | "Green"
  | "Reform"
  | "SNP"
  | "Other";

export const partyLogic: Record<
  Party,
  Record<string, Record<string, number>>
> = {
  Labour: {
    support_welfare_spending: { Yes: 5 },
    tax_on_wealthy: { Yes: 5 },
    housing_status: { Renting: 3, "Council housing": 3, "Living with family": 3 },
    socioeconomic_class: { "Working class": 3, "Lower-middle class": 2 },
    satisfaction_national_government: {
      Dissatisfied: 2,
      "Very dissatisfied": 3,
    },
    immigration_policy_stance: { "More open": 2 },
    trust_mainstream_media: { Low: 2, Neutral: 1 },
    trust_public_institutions: { Low: 2, Neutral: 1 },
  },

  Conservative: {
    household_income: {
      "£60,000–£80,000": 5,
      "£80,000–£100,000": 5,
      "Over £100,000": 5,
    },
    housing_status: { "Own outright": 4, Mortgage: 4 },
    immigration_policy_stance: { Restrictive: 4, "Very restrictive": 5 },
    trust_public_institutions: { High: 3, "Very high": 4 },
    trust_mainstream_media: { High: 2, "Very high": 3 },
    age_bracket: { "55–64": 2, "65+": 3 },
    satisfaction_national_government: { Satisfied: 2, "Very satisfied": 3 },
    support_welfare_spending: { No: 3 },
    tax_on_wealthy: { No: 3 },
  },

  "Liberal Democrats": {
    education_level: {
      "Bachelor’s degree": 3,
      "Master’s degree": 4,
      "PhD or higher": 5,
    },
    household_income: { "£40,000–£60,000": 3, "£60,000–£80,000": 2 },
    age_bracket: { "35–44": 2, "45–54": 2 },
    satisfaction_national_government: { Neutral: 2, Dissatisfied: 1 },
    concern_political_corruption: { "Somewhat concerned": 2 },
    immigration_policy_stance: { "More open": 2, Unbothered: 1 },
    trust_mainstream_media: { Neutral: 2, Medium: 2 },
    trust_public_institutions: { Neutral: 2, Some: 1 },
    climate_priority: { Yes: 2 },
  },

  Green: {
    climate_priority: { Yes: 6 },
    age_bracket: { "18–24": 3, "25–34": 3 },
    housing_status: { Renting: 2, "Living with family": 2 },
    satisfaction_national_government: { "Very dissatisfied": 2 },
    concern_political_corruption: { "Very concerned": 2 },
    importance_social_issues: { "Very important": 3 },
    socioeconomic_class: { "Working class": 2, "Lower-middle class": 2 },
    trust_mainstream_media: { Low: 2, None: 2 },
    trust_public_institutions: { Low: 2, "Very low": 3 },
  },

  Reform: {
    immigration_policy_stance: { Restrictive: 5, "Very restrictive": 6 },
    education_level: { "No qualification": 3, "GCSE or equivalent": 2 },
    household_income: { "Under £20,000": 2, "£20,000–£40,000": 2 },
    socioeconomic_class: { "Working class": 3 },
    satisfaction_national_government: { "Very dissatisfied": 3 },
    support_welfare_spending: { No: 3 },
    tax_on_wealthy: { No: 3 },
    trust_mainstream_media: { None: 2, Low: 2 },
    trust_public_institutions: { None: 2, Low: 2 },
    concern_political_corruption: { "Very concerned": 2 },
  },

  SNP: {
    region_boost: { Scotland: 6 },
    constituency_leaning: { SNP: 6 },
    support_welfare_spending: { Yes: 3 },
    climate_priority: { Yes: 2 },
    satisfaction_national_government: {
      Dissatisfied: 2,
      "Very dissatisfied": 2,
    },
    immigration_policy_stance: { "More open": 2 },
    trust_mainstream_media: { Neutral: 1, Low: 1 },
    trust_public_institutions: { Neutral: 1, Low: 1 },
  },

  Other: {
    constituency_leaning: { Independent: 6, "Local Party": 6, Other: 6 },
    region_boost: { Wales: 3, "Northern Ireland": 3 },
  },
};

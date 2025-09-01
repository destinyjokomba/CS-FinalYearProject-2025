// src/utils/badges.ts
export const checkBadges = (): string[] => {
  const surveys = parseInt(localStorage.getItem("survey_count") || "0", 10);
  const shares = parseInt(localStorage.getItem("share_count") || "0", 10);

  const badges: string[] = [];

  if (surveys >= 1) badges.push("First Survey 🎉");
  if (surveys >= 5) badges.push("Survey Streak 🔥");
  if (shares >= 1) badges.push("Shared Result 📢");

  return badges;
};

// src/utils/stats.ts
export const incrementStat = (key) => {
    const current = parseInt(localStorage.getItem(key) || "0", 10);
    localStorage.setItem(key, (current + 1).toString());
};
export const getStat = (key) => {
    return parseInt(localStorage.getItem(key) || "0", 10);
};
// Specific trackers
export const incrementSurveyCount = () => incrementStat("survey_count");
export const incrementShareCount = () => incrementStat("share_count");
export const incrementPartyChangeCount = () => incrementStat("party_change_count");
export const getUserStats = () => ({
    surveys: getStat("survey_count"),
    shares: getStat("share_count"),
    partyChanges: getStat("party_change_count"),
});

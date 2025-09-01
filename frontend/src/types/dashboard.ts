// src/types/dashboard.ts

// ✅ single source of truth
export type Party =
  | "lab"     // Labour
  | "con"     // Conservative
  | "ld"      // Liberal Democrats
  | "green"   // Green
  | "reform"  // Reform UK
  | "snp"     // SNP
  | "other";  // Other

export interface PredictionResult {
  winner: Party;
  probabilities: Record<Party, number>;
}

export interface Prediction {
  party: Party;
  runnerUp?: Party;
  confidence?: number;
  timestamp?: string;
  partyLabel?: string;
}

export interface HistoryPrediction {
  party: Party;
  runnerUp?: Party;
  confidence?: number;
  timestamp: string;
  partyLabel?: string;
}

export interface RegionDatum {
  party: Party;
  share: number;
}

export interface ComparisonData {
  region: string;
  regionData: RegionDatum[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  displayName?: string;       
  constituency?: string;     
  chosenAlignment?: string;   
  dashboardParty?: string;    
  profilePicUrl?: string;    
}


export interface Badge {
  name: string;
  unlocked: boolean;
  progress_current: number;
  progress_target: number;
}

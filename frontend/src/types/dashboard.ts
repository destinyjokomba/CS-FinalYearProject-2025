// src/types/dashboard.ts

// Match what ComparisonChart expects
export interface RegionDatum {
  party: string;
  share: number; 
}

export interface ComparisonData {
  region: string;
  regionData: RegionDatum[];
}

export interface User {
  id?: number;
  username?: string;
  email?: string;               
  constituency?: string;        
  profilePicUrl?: string | null;
  displayName?: string;
  dashboardParty?: string;
  streak?: number;
  profileCompletion?: number;
  chosenAlignment?: string;
}

export interface Prediction {
  party: string;
  confidence?: number; 
}

export interface Badge {
  name: string;
  unlocked: boolean;
  progress_current: number;
  progress_target: number;
}

// src/context/AuthContext.ts
import { createContext } from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

// Context only (no provider, no hook here)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

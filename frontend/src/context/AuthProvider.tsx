// src/context/AuthProvider.tsx
import React, { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const stored = localStorage.getItem("isLoggedIn");
    return stored === "true";
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", String(isLoggedIn));
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

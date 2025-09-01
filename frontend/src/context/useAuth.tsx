// src/context/useAuth.ts
import type { User } from "@/types/dashboard";

const getUser = (): User | null => {
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as User) : null;
};

const setUser = (user: User | null) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
};

const isLoggedIn = (): boolean => {
  return Boolean(localStorage.getItem("token"));
};

const setToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const logout = () => {
  // Remove only sensitive auth info
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  //  Keep chosenAlignment, lastPrediction, predictionHistory safe
  window.location.href = "/login";
};


const auth = {
  getUser,
  setUser,
  isLoggedIn,
  setToken,
  getToken,
  logout,
};

export default auth;

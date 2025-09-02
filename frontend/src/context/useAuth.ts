// src/context/useAuth.ts
import type { User } from "@/types/dashboard";
import { loginUser, registerUser } from "@/services/api";

// ─── User Helpers ─────────────────────────────────────────────
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

// ─── Auth Actions ─────────────────────────────────────────────
const login = async (username: string, password: string) => {
  const data = await loginUser(username, password);
  if (data.token) setToken(data.token);
  if (data.user) setUser(data.user);
  return data;
};

const register = async (form: {
  first_name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
}) => {
  const data = await registerUser(form);
  if (data.user) setUser(data.user);
  return data;
};

const logout = () => {
  // Remove only sensitive auth info
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Keep prediction history + alignment safe
  window.location.href = "/login";
};

// ─── Export ───────────────────────────────────────────────────
const auth = {
  getUser,
  setUser,
  isLoggedIn,
  setToken,
  getToken,
  login,
  register,
  logout,
};

export default auth;

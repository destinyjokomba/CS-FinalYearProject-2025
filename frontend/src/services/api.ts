// src/services/api.ts
import axios from "axios";

// Always use env variable, fallback to localhost in dev
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Auto-attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth APIs ---
export const loginUser = async (username: string, password: string) => {
  const res = await api.post("/auth/login", { username, password });
  return res.data; // { token, user }
};

export const registerUser = async (form: {
  first_name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", form);
  return res.data; // { message, user? }
};

// --- Dashboard API ---
export const getDashboard = async () => {
  const res = await api.get("/me/dashboard");
  return res.data; // { user, badges, ... }
};

// --- Prediction APIs ---
export const getPrediction = async () => {
  const res = await api.get("/me/prediction");
  return res.data.saved_prediction || null;
};

export const submitSurvey = async (answers: Record<string, string>) => {
  const res = await api.post("/predict", answers);
  return res.data; // { party, confidence, ... }
};

// Export default api instance
export default api;

// src/services/api.ts
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// --- Auth APIs ---
export const loginUser = (username: string, password: string) => {
  return axios.post(`${API_URL}/auth/login`, { username, password });
};

export const registerUser = (form: {
  first_name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
}) => {
  return axios.post(`${API_URL}/auth/register`, form);
};

// --- Example protected API ---
export const getDashboard = () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/me/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Provide both named + default exports
export default {
  loginUser,
  registerUser,
  getDashboard,
};

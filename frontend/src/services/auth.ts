// src/services/auth.ts
import api from "./api";
import { RegisterPayload, LoginPayload } from "@/types/auth";

// Register user
export const registerUser = async (form: RegisterPayload) => {
  return api.post("/auth/register", form);
};

// Login user
export const loginUser = async (form: LoginPayload) => {
  const res = await api.post("/auth/login", form);
  const token = res.data.token; // ✅ backend sends "token"

  if (token) {
    localStorage.setItem("token", token);
  }

  return res;
};

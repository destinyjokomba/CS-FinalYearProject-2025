import api from "./api";

// Register user
export const registerUser = async (form: {
  first_name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
}) => {
  return api.post("/auth/register", form);
};

// Login user
export const loginUser = async (form: { username: string; password: string }) => {
  const res = await api.post("/auth/login", form);
  const token = res.data.token; 
  if (token) {
    localStorage.setItem("token", token);
  }

  return res;
};

import api from "./api";

// Register user
export const registerUser = async (form: {
  first_name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
}) => {
  return api.post("/register", form);
};

// Login user
export const loginUser = async (form: { username: string; password: string }) => {
  const res = await api.post("/login", form);
  const token = res.data.access_token;

  if (token) {
    localStorage.setItem("token", token); // store token
  }

  return res;
};

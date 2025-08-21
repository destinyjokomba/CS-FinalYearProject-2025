import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";
import NavBar from "../components/common/NavBar";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(form);
      navigate("/login");
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              name="surname"
              value={form.surname}
              onChange={handleChange}
              placeholder="Surname"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;

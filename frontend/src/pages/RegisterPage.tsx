import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "@/context/useAuth";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      setError("❌ You must agree to the Terms & Conditions before registering.");
      return;
    }

    try {
      await auth.register(form);
      navigate("/login");
    } catch {
      setError("❌ Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" className="w-full px-4 py-2 border rounded-lg" required />
          <input type="text" name="surname" value={form.surname} onChange={handleChange} placeholder="Surname" className="w-full px-4 py-2 border rounded-lg" required />
          <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" className="w-full px-4 py-2 border rounded-lg" required />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-2 border rounded-lg" required />

          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full px-4 py-2 border rounded-lg pr-12" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-sm text-gray-500 hover:text-gray-700">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex items-center text-sm">
            <input type="checkbox" id="terms" checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} className="mr-2" />
            <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
              I agree to the{" "}
              <button type="button" className="text-blue-600 hover:underline" onClick={() => setShowTerms(true)}>
                Terms & Conditions
              </button>
            </label>
          </div>

          <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Register
          </button>
        </form>
      </div>

      {/* Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">📜 Terms & Conditions</h2>
            <p className="mb-3">By using this platform, you agree to the following terms:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 text-sm">
              <li>You are responsible for keeping your account secure.</li>
              <li>You must not attempt to hack, exploit, or misuse the platform.</li>
              <li>Your personal data is protected under GDPR and will not be sold to third parties.</li>
              <li>Predictions are for informational purposes only and are not guarantees.</li>
              <li>We reserve the right to suspend accounts violating these terms.</li>
            </ul>

            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setShowTerms(false)} className="px-4 py-2 bg-gray-300 dark:bg-slate-700 rounded-lg">
                Close
              </button>
              <button
                onClick={() => {
                  setAgreeTerms(true);
                  setShowTerms(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;

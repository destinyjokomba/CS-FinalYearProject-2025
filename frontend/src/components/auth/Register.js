import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// frontend/src/pages/Register.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/api";
const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        first_name: "",
        surname: "",
        email: "",
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    // ─── Redirect if already logged in ───────────────
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token)
            navigate("/dashboard");
    }, [navigate]);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await registerUser({
                first_name: form.first_name,
                surname: form.surname,
                email: form.email,
                username: form.username,
                password: form.password,
            });
            navigate("/login");
        }
        catch {
            setError("Registration failed. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("main", { className: "min-h-screen flex items-center justify-center px-6 py-12 bg-slate-50 dark:bg-slate-900", children: _jsxs("div", { className: "w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg", children: [_jsx("h2", { className: "text-3xl font-extrabold mb-6 text-center text-slate-800 dark:text-white", children: "Create Account" }), error && _jsx("p", { className: "text-red-500 text-sm mb-4 text-center", children: error }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", name: "first_name", value: form.first_name, onChange: handleChange, placeholder: "First Name", className: "w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white", required: true }), _jsx("input", { type: "text", name: "surname", value: form.surname, onChange: handleChange, placeholder: "Surname", className: "w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white", required: true }), _jsx("input", { type: "email", name: "email", value: form.email, onChange: handleChange, placeholder: "Email", className: "w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white", required: true }), _jsx("input", { type: "text", name: "username", value: form.username, onChange: handleChange, placeholder: "Username", className: "w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white", required: true }), _jsx("input", { type: "password", name: "password", value: form.password, onChange: handleChange, placeholder: "Password", className: "w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white", required: true }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-60", children: loading ? "Registering..." : "Register" })] }), _jsxs("p", { className: "mt-6 text-center text-sm text-slate-600 dark:text-slate-300", children: ["Already have an account?", " ", _jsx(Link, { to: "/login", className: "text-blue-600 hover:underline", children: "Sign in" })] })] }) }));
};
export default RegisterPage;

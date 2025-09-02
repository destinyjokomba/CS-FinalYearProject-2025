import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// frontend/src/pages/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/api";
const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
            const res = await loginUser(form.username.trim(), form.password);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/dashboard");
        }
        catch {
            setError("Invalid username or password");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("main", { className: "min-h-screen flex items-center justify-center px-6 py-12 bg-slate-50 dark:bg-slate-900", children: _jsxs("div", { className: "w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg", children: [_jsx("h2", { className: "text-3xl font-extrabold mb-6 text-center text-slate-800 dark:text-white", children: "Sign In" }), error && _jsx("p", { className: "text-red-500 text-sm mb-4 text-center", children: error }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "username", className: "block text-sm font-semibold mb-1 dark:text-slate-200", children: "Username or Email" }), _jsx("input", { id: "username", name: "username", type: "text", value: form.username, onChange: handleChange, className: "w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white", placeholder: "Enter your username or email", autoComplete: "username", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-semibold mb-1 dark:text-slate-200", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "password", name: "password", type: showPassword ? "text" : "password", value: form.password, onChange: handleChange, className: "w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white", placeholder: "Enter your password", autoComplete: "current-password", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300", children: showPassword ? "Hide" : "Show" })] })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-60", children: loading ? "Signing In..." : "Sign In" })] }), _jsxs("p", { className: "mt-6 text-center text-sm text-slate-600 dark:text-slate-300", children: ["Don\u2019t have an account?", " ", _jsx(Link, { to: "/register", className: "text-blue-600 hover:underline", children: "Register" })] })] }) }));
};
export default LoginPage;

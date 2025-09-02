import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/RegisterPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/services/api";
const RegisterPage = () => {
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
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreeTerms) {
            setError("❌ You must agree to the Terms & Conditions before registering.");
            return;
        }
        try {
            await registerUser(form);
            navigate("/login");
        }
        catch {
            setError("❌ Registration failed. Please try again.");
        }
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800", children: [_jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 max-w-md w-full", children: [_jsx("h1", { className: "text-2xl font-bold mb-6 text-center", children: "Register" }), error && _jsx("p", { className: "text-red-500 text-sm mb-4", children: error }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", name: "first_name", value: form.first_name, onChange: handleChange, placeholder: "First Name", className: "w-full px-4 py-2 border rounded-lg", required: true }), _jsx("input", { type: "text", name: "surname", value: form.surname, onChange: handleChange, placeholder: "Surname", className: "w-full px-4 py-2 border rounded-lg", required: true }), _jsx("input", { type: "text", name: "username", value: form.username, onChange: handleChange, placeholder: "Username", className: "w-full px-4 py-2 border rounded-lg", required: true }), _jsx("input", { type: "email", name: "email", value: form.email, onChange: handleChange, placeholder: "Email", className: "w-full px-4 py-2 border rounded-lg", required: true }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? "text" : "password", name: "password", value: form.password, onChange: handleChange, placeholder: "Password", className: "w-full px-4 py-2 border rounded-lg pr-12", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-2 text-sm text-gray-500 hover:text-gray-700", children: showPassword ? "Hide" : "Show" })] }), _jsxs("div", { className: "flex items-center text-sm", children: [_jsx("input", { type: "checkbox", id: "terms", checked: agreeTerms, onChange: () => setAgreeTerms(!agreeTerms), className: "mr-2" }), _jsxs("label", { htmlFor: "terms", className: "text-gray-700 dark:text-gray-300", children: ["I agree to the", " ", _jsx("button", { type: "button", className: "text-blue-600 hover:underline", onClick: () => setShowTerms(true), children: "Terms & Conditions" })] })] }), _jsx("button", { type: "submit", className: "w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700", children: "Register" })] })] }), showTerms && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50", children: _jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "\uD83D\uDCDC Terms & Conditions" }), _jsx("p", { className: "mb-3", children: "By using this platform, you agree to the following terms:" }), _jsxs("ul", { className: "list-disc list-inside ml-4 space-y-2 text-sm", children: [_jsx("li", { children: "You are responsible for keeping your account secure." }), _jsx("li", { children: "You must not attempt to hack, exploit, or misuse the platform." }), _jsx("li", { children: "Your personal data is protected under GDPR and will not be sold to third parties." }), _jsx("li", { children: "Predictions are for informational purposes only and are not guarantees." }), _jsx("li", { children: "We reserve the right to suspend accounts violating these terms." })] }), _jsxs("div", { className: "mt-6 flex justify-end space-x-3", children: [_jsx("button", { onClick: () => setShowTerms(false), className: "px-4 py-2 bg-gray-300 dark:bg-slate-700 rounded-lg", children: "Close" }), _jsx("button", { onClick: () => {
                                        setAgreeTerms(true);
                                        setShowTerms(false);
                                    }, className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700", children: "I Agree" })] })] }) }))] }));
};
export default RegisterPage;

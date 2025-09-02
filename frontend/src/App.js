import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// App.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import LandingPage from "@/pages/LandingPage";
import SurveyPage from "@/pages/SurveyPage";
import ResultsPage from "@/pages/ResultsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/Dashboard";
import HistoryPage from "@/pages/HistoryPage";
import SettingsPage from "@/pages/SettingsPage";
import SecurityPage from "./pages/SecurityPage";
import PrivateRoute from "@/components/PrivateRoute";
function App() {
    return (_jsx(Routes, { children: _jsxs(Route, { element: _jsx(Layout, {}), children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/survey", element: _jsx(PrivateRoute, { children: _jsx(SurveyPage, {}) }) }), _jsx(Route, { path: "/results", element: _jsx(PrivateRoute, { children: _jsx(ResultsPage, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(PrivateRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/history", element: _jsx(PrivateRoute, { children: _jsx(HistoryPage, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(PrivateRoute, { children: _jsx(SettingsPage, {}) }) }), _jsx(Route, { path: "/security", element: _jsx(PrivateRoute, { children: _jsx(SecurityPage, {}) }) })] }) }));
}
export default App;

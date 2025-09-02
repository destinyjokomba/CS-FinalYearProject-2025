import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);
    return isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login", replace: true });
};
export default PrivateRoute;

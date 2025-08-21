import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token);

  console.log("🔐 Token:", token); // ✅ Shows token in console
  console.log("🔐 Authenticated:", isAuthenticated); // (Optional)

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth(); // ✅ use global auth state

  console.log("🔐 Authenticated:", isLoggedIn);

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

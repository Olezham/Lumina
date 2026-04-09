import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    authChecked: state.authChecked,
  }));

  if (!authChecked) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

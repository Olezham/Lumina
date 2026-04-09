import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const GuestRoute = ({ children }) => {
  const authChecked = useAuthStore((s) => s.authChecked);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!authChecked) return null;

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
};

export default GuestRoute;

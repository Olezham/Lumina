import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const AuthBootstrap = ({ children }) => {
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return children;
};

export default AuthBootstrap;

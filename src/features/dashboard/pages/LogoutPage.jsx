import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "@/features/auth/hooks/useAuth";

const LogoutPage = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        navigate("/login", {
          replace: true,
        });
      }
    };

    handleLogout();
  }, [logout, navigate]);

  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <span className="loading loading-spinner loading-lg" />
    </div>
  );
};

export default LogoutPage;

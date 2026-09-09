import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useAuth from "@/features/auth/hooks/useAuth";

const LogoutPage = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const handleLogout = async () => {
      try {
        await logout();

        if (!isMounted) {
          return;
        }

        toast.success("Başarıyla çıkış yapıldı.");
      } catch (error) {
        console.error("Logout error:", error);

        if (!isMounted) {
          return;
        }

        toast.error("Çıkış yapılırken bir hata oluştu.");
      } finally {
        if (isMounted) {
          navigate("/login", {
            replace: true,
          });
        }
      }
    };

    handleLogout();

    return () => {
      isMounted = false;
    };
  }, [logout, navigate]);

  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <span className="loading loading-spinner loading-lg" />
    </div>
  );
};

export default LogoutPage;

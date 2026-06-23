import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../Services/api.service";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await authService.checkAuth();

        if (res.data.authenticated) {
          setAuth(true);
        }
      } catch (err) {
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return auth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
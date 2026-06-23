import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../Services/api.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext checkAuth using:", import.meta.env.VITE_API_URL);
    authService.checkAuth()
      .then((res) => {
        if (res.data.authenticated) setUser(res.data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login  = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

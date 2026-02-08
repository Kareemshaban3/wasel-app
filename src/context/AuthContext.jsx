import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (token) setUser({ token, role, name });
    setAuthLoading(false);
  }, []);

  const signIn = async ({ email, password }) => {
    try {
      const { data } = await api.login({ email, password });

      const token = data.token;
      const role = data.user?.role;
      const name = data.user?.name;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role || "");
      localStorage.setItem("name", name || "");

      setUser({ token, role, name });
      return data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const signUp = async ({ name, email, password, password_confirmation, phone }) => {
    if (password !== password_confirmation) {
      throw new Error("Passwords do not match");
    }

    try {
      const { data } = await api.register({
        name,
        email,
        password,
        password_confirmation,
        phone,
      });

      return data;
    } catch (err) {
      console.error("Register failed:", err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await api.logout().catch(() => {});
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

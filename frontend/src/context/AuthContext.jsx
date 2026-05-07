import React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("portfolio_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("portfolio_user");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem("portfolio_user");
      return null;
    }
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("portfolio_token", data.token);
    localStorage.setItem("portfolio_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("portfolio_token");
    localStorage.removeItem("portfolio_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, isAuthenticated: Boolean(token), login, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

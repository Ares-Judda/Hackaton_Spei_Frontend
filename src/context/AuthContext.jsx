import React, { createContext, useState, useContext, useEffect } from "react";
import {
  login as apiLogin,
  register as apiRegister,
} from "../services/authService";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const setTokenAndHeader = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiLogin(email, password);

      const newToken = response.data.token;
      setTokenAndHeader(newToken);

      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      console.error("Error en login:", error.response?.data || error.message);
      throw error.response?.data || new Error("Error de autenticación");
    }
  };

  const logout = () => {
    setTokenAndHeader(null);
    setUser(null);
  };

  const register = async (registrationData) => {
    setLoading(true);
    try {
      const response = await apiRegister(registrationData);
      const newToken = response.data.token;
      setTokenAndHeader(newToken);
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      console.error(
        "Error en registro:",
        error.response?.data || error.message
      );
      throw error.response?.data || new Error("Error en el registro");
    }
  };

  const value = {
    token,
    user,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

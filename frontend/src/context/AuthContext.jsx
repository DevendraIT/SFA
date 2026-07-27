import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/auth.service";
import { STORAGE_KEYS } from "../config/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authService.getProfile();

      // AuthController.getMe uses handleSuccess(response.data.data = user object)
      // response = { success, message, data: { id, email, firstName, ... } }
      const profileData = response.data || response;
      if (profileData && profileData.id) {
        setUser(profileData);
      }
    } catch (error) {
      console.error(error);

      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
  const response = await authService.login(credentials);

  // AuthController.login uses handleSuccess() which wraps data in ApiResponse
  // response = { success, message, data: { user, tokens: { accessToken } } }
  const loginData = response.data || response;
  const user = loginData.user || response.user;
  const accessToken = loginData.tokens?.accessToken || response.tokens?.accessToken;

  if (accessToken) {
    localStorage.setItem(
      STORAGE_KEYS.ACCESS_TOKEN,
      accessToken
    );
  }

  if (user) {
    setUser(user);
  }

  return response;
};

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {}

    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
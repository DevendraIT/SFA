import { createContext, useContext, useState, useEffect, useCallback } from "react";
import storage from "../services/storage.js";
import { getRoleDashboard } from "../utils/helpers.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const refresh = () => setUser(storage.getCurrentUser());
    return storage.subscribe(refresh);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    const result = storage.login(email, password);
    setLoading(false);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    storage.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback((data) => {
    if (!user) return null;
    const updated = storage.updateProfile(user.id, data);
    if (updated) {
      const { password: _, ...safe } = updated;
      setUser(safe);
    }
    return updated;
  }, [user]);

  const changePassword = useCallback(
    (current, newPass) => storage.changePassword(user?.id, current, newPass),
    [user]
  );

  const dashboardPath = user ? getRoleDashboard(user.role) : "/login";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateProfile, changePassword, dashboardPath, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;

import { useCallback, useEffect, useState } from "react";
import dashboardService from "../services/dashboard.service";

export default function useManagerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardService.getTeamDashboard();

      setDashboard(response.data || response);
    } catch (err) {
      console.error("Manager Dashboard Error:", err);
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    dashboard,
    loading,
    error,
    refresh: loadDashboard,
  };
}


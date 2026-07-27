import { useEffect, useState } from "react";
import dashboardService from "../services/dashboard.service";

export default function useDashboard() {
  const [dashboard, setDashboard] = useState({
    myLeads: {},
    myVisits: {},
    myTargets: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response =
        await dashboardService.getUserDashboard();

        console.log("Dashboard API Response:", response);

      setDashboard(
        response.data ?? {
          myLeads: {},
          myVisits: {},
          myTargets: [],
        }
      );
    } catch (err) {
      console.error(err);

      setDashboard({
        myLeads: {},
        myVisits: {},
        myTargets: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    dashboard,
    loading,
    refresh: loadDashboard,
  };
}
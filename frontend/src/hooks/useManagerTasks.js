import { useCallback, useEffect, useState } from "react";
import fieldForceApi from "../api/fieldForce.api";

export default function useManagerTasks(options = {}) {
  const { assignedToId, status } = options;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (assignedToId) params.assignedToId = assignedToId;
      if (status) params.status = status;
      params.take = 100;

      const response = await fieldForceApi.listTasks(params);
      const resp = response.data;
      // Handle swapped params: successResponse(res, dataObj, messageStr) => resp.message = dataObj
      const data = resp?.message?.tasks || resp?.data?.tasks || resp?.tasks || [];
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Manager Tasks Error:", err);
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, [assignedToId, status]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    error,
    refresh: loadTasks,
  };
}


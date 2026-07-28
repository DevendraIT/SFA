import { useCallback, useEffect, useState } from "react";
import fieldForceApi from "../api/fieldForce.api";
import { useAuth } from "../context/AuthContext";

export default function useManagerTasks(options = {}) {
  const { user } = useAuth();
  const { assignedToId, status } = options;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { take: 100 };
      // Managers see tasks assigned BY them (passed via assignedById)
      if (user?.id) {
        params.assignedById = user.id;
      }
      // Optional filter by specific assignee
      if (assignedToId) params.assignedToId = assignedToId;
      if (status) params.status = status;

      const response = await fieldForceApi.listTasks(params);
      const resp = response.data;
      // successResponse(res, dataObj, messageStr) => ApiResponse.success(message=dataObj, data=messageStr)
      // => { success: true, message: { tasks, total }, data: 'Tasks retrieved.' }
      // So the actual data is at resp.message.tasks
      const data = resp?.message?.tasks || resp?.data?.tasks || resp?.tasks || [];
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Manager Tasks Error:", err);
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, [assignedToId, status, user?.id]);

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


import { useCallback, useEffect, useState } from "react";
import fieldForceApi from "../api/fieldForce.api";

export default function useExecutiveData(executiveId) {
  const [visits, setVisits] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    if (!executiveId) return;
    try {
      setLoading(true);
      setError(null);

      const [visitsRes, attendanceRes, tasksRes] = await Promise.all([
        fieldForceApi.listVisits({ userId: executiveId, take: 50 }),
        fieldForceApi.listAttendance({ userId: executiveId, take: 30 }),
        fieldForceApi.listTasks({ assignedToId: executiveId, take: 50 }),
      ]);

      setVisits(visitsRes.data?.data?.visits || visitsRes.data?.visits || []);
      setAttendance(attendanceRes.data?.data?.attendance || attendanceRes.data?.attendance || []);
      setTasks(tasksRes.data?.data?.tasks || tasksRes.data?.tasks || []);
    } catch (err) {
      console.error("Executive Data Error:", err);
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, [executiveId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const visitSummary = {
    total: visits.length,
    completed: visits.filter((v) => v.status === "COMPLETED").length,
    planned: visits.filter((v) => v.status === "PLANNED").length,
    inProgress: visits.filter((v) => v.status === "IN_PROGRESS").length,
    cancelled: visits.filter((v) => v.status === "CANCELLED").length,
  };

  const taskSummary = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    cancelled: tasks.filter((t) => t.status === "CANCELLED").length,
    completionRate:
      tasks.length > 0
        ? Math.round(
            (tasks.filter((t) => t.status === "COMPLETED").length /
              tasks.length) *
              100
          )
        : 0,
  };

  const attendanceSummary = {
    present: attendance.filter((a) => a.status === "PRESENT").length,
    absent: attendance.filter((a) => a.status === "ABSENT").length,
    leave: attendance.filter((a) => a.status === "LEAVE").length,
    total: attendance.length,
  };

  return {
    visits,
    attendance,
    tasks,
    loading,
    error,
    refresh: loadAll,
    visitSummary,
    taskSummary,
    attendanceSummary,
  };
}


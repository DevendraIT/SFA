import { useCallback, useEffect, useState, useMemo } from "react";
import fieldForceApi from "../api/fieldForce.api";
import dayjs from "dayjs";

function safeArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    if (Array.isArray(value.visits)) return value.visits;
    if (Array.isArray(value.tasks)) return value.tasks;
    if (Array.isArray(value.expenses)) return value.expenses;
    if (Array.isArray(value.dars)) return value.dars;
    if (Array.isArray(value.plans)) return value.plans;
    if (Array.isArray(value.events)) return value.events;
    if (Array.isArray(value.attendance)) return value.attendance;
  }
  return [];
}

function safeExtract(res) {
  if (!res?.value) return null;
  const { data } = res.value;
  if (!data) return null;
  return data.data ?? data;
}

export default function useFieldForce(userId) {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [todayVisits, setTodayVisits] = useState([]);
  const [visits, setVisits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [dars, setDars] = useState([]);
  const [beatPlans, setBeatPlans] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [visitsSummary, setVisitsSummary] = useState(null);
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = dayjs().endOf("month").format("YYYY-MM-DD");

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const results = await Promise.allSettled([
        fieldForceApi.getTodayAttendance().catch(() => ({ data: null })),
        fieldForceApi.listAttendance({ startDate: startOfMonth, endDate: endOfMonth, take: 50 }).catch(() => ({ data: { attendance: [] } })),
        fieldForceApi.listVisits({ take: 50 }).catch(() => ({ data: { visits: [] } })),
        fieldForceApi.listTasks({ assignedToId: userId, take: 50 }).catch(() => ({ data: { tasks: [] } })),
        fieldForceApi.listExpenses({ take: 50 }).catch(() => ({ data: { expenses: [] } })),
        fieldForceApi.listDars({ take: 50 }).catch(() => ({ data: { dars: [] } })),
        fieldForceApi.listBeatPlans({ take: 50 }).catch(() => ({ data: { plans: [] } })),
        fieldForceApi.listCalendarEvents({ startDate: startOfMonth, endDate: endOfMonth, take: 50 }).catch(() => ({ data: { events: [] } })),
        fieldForceApi.getAttendanceSummary({ startDate: startOfMonth, endDate: endOfMonth }).catch(() => ({ data: null })),
        fieldForceApi.getAnalyticsVisits({ startDate: startOfMonth, endDate: endOfMonth }).catch(() => ({ data: null })),
        fieldForceApi.getAnalyticsExpenses({ startDate: startOfMonth, endDate: endOfMonth }).catch(() => ({ data: null })),
      ]);

      // Today attendance
      const att = safeExtract(results[0]);
      setTodayAttendance(att ?? null);

      // Attendance history
      const attHist = safeExtract(results[1]);
      setAttendanceHistory(safeArray(attHist));

      // Visits
      const visitsData = safeExtract(results[2]);
      const visitsArr = safeArray(visitsData);
      setVisits(visitsArr);
      const todayStr = dayjs().format("YYYY-MM-DD");
      setTodayVisits(visitsArr.filter((v) => v?.scheduledAt && dayjs(v.scheduledAt).format("YYYY-MM-DD") === todayStr));

      // Tasks
      setTasks(safeArray(safeExtract(results[3])));

      // Expenses
      setExpenses(safeArray(safeExtract(results[4])));

      // DARs
      setDars(safeArray(safeExtract(results[5])));

      // Beat Plans
      setBeatPlans(safeArray(safeExtract(results[6])));

      // Calendar Events
      setCalendarEvents(safeArray(safeExtract(results[7])));

      // Summaries
      setAttendanceSummary(safeExtract(results[8]) ?? null);
      setVisitsSummary(safeExtract(results[9]) ?? null);
      setExpenseSummary(safeExtract(results[10]) ?? null);

    } catch (err) {
      console.error("Field Force Data Error:", err);
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, [userId, startOfMonth, endOfMonth]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const visitSummary = useMemo(() => {
    const v = Array.isArray(visits) ? visits : [];
    return {
      total: v.length,
      completed: v.filter((x) => x?.status === "COMPLETED").length,
      planned: v.filter((x) => x?.status === "PLANNED").length,
      inProgress: v.filter((x) => x?.status === "IN_PROGRESS").length,
      cancelled: v.filter((x) => x?.status === "CANCELLED").length,
    };
  }, [visits]);

  const taskSummary = useMemo(() => {
    const t = Array.isArray(tasks) ? tasks : [];
    const total = t.length;
    const completed = t.filter((x) => x?.status === "COMPLETED").length;
    return {
      total,
      pending: t.filter((x) => x?.status === "PENDING").length,
      inProgress: t.filter((x) => x?.status === "IN_PROGRESS").length,
      completed,
      cancelled: t.filter((x) => x?.status === "CANCELLED").length,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [tasks]);

  const expenseSummaryData = useMemo(() => {
    const e = Array.isArray(expenses) ? expenses : [];
    return {
      total: e.length,
      pending: e.filter((x) => x?.status === "PENDING").length,
      approved: e.filter((x) => x?.status === "APPROVED").length,
      rejected: e.filter((x) => x?.status === "REJECTED").length,
      totalAmount: e.reduce((sum, x) => sum + (x?.amount || 0), 0),
    };
  }, [expenses]);

  const darSummary = useMemo(() => {
    const d = Array.isArray(dars) ? dars : [];
    return {
      total: d.length,
      draft: d.filter((x) => x?.status === "DRAFT").length,
      submitted: d.filter((x) => x?.status === "SUBMITTED").length,
      approved: d.filter((x) => x?.status === "APPROVED").length,
    };
  }, [dars]);

  return {
    todayAttendance,
    attendanceHistory,
    todayVisits,
    visits,
    tasks,
    expenses,
    dars,
    beatPlans,
    calendarEvents,
    loading,
    error,
    refresh: loadAll,
    visitSummary,
    taskSummary,
    expenseSummary: expenseSummaryData,
    darSummary,
    attendanceSummary,
    visitsSummary,
    expenseAnalytics: expenseSummary,
  };
}


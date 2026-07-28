import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Dashboard from "../pages/dashboard/Dashboard";

import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";

import CompanyList from "../pages/organization/company/CompanyList";
import BranchList from "../pages/organization/branch/BranchList";
import DepartmentList from "../pages/organization/department/DepartmentList";
import TeamList from "../pages/organization/team/TeamList";
import UserList from "../pages/organization/user/UserList";

import TeamManagement from "../pages/team/TeamManagement";
import ExecutiveDetail from "../pages/team/ExecutiveDetail";
import AssignedTasks from "../pages/team/AssignedTasks";
import ExecutivePerformance from "../pages/team/ExecutivePerformance";
import TaskDetail from "../pages/team/TaskDetail";

// Field Force Pages
import FieldForceDashboard from "../pages/field-force/FieldForceDashboard";
import AttendancePage from "../pages/field-force/AttendancePage";
import BeatPlanningPage from "../pages/field-force/BeatPlanningPage";
import RouteOptimizationPage from "../pages/field-force/RouteOptimizationPage";
import TasksPage from "../pages/field-force/TasksPage";
import VisitsPage from "../pages/field-force/VisitsPage";
import PhotoUploadPage from "../pages/field-force/PhotoUploadPage";
import MeetingNotesPage from "../pages/field-force/MeetingNotesPage";
import ExpensesPage from "../pages/field-force/ExpensesPage";
import CalendarPage from "../pages/field-force/CalendarPage";
import ActivitiesPage from "../pages/field-force/ActivitiesPage";
import DARPage from "../pages/field-force/DARPage";
import ProfilePage from "../pages/field-force/ProfilePage";
import TaskExecutionPage from "../pages/field-force/TaskExecutionPage";

import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";

function SalesManagerRestrictedRoute({ children }) {
  const { user } = useAuth();
  const isSalesManager = useMemo(() => {
    if (!user) return false;
    const roleNames = Array.isArray(user.roles)
      ? user.roles.map((r) => (typeof r === "string" ? r : r.role?.name || r.name))
      : [user.role?.name || ""];
    return roleNames.some((r) => r && r.toLowerCase().includes("sales manager"));
  }, [user]);

  if (isSalesManager) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function SalesExecutiveRestrictedRoute({ children }) {

  const { user } = useAuth();
  const isSalesExecutive = useMemo(() => {
    if (!user) return false;
    const roleNames = Array.isArray(user.roles)
      ? user.roles.map((r) => (typeof r === "string" ? r : r.role?.name || r.name))
      : [user.role?.name || ""];
    return roleNames.some(
      (r) => r && (r.toLowerCase().includes("sales executive") || r.toLowerCase().includes("sales person"))
    );
  }, [user]);

  if (isSalesExecutive) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function SuperAdminRestrictedRoute({ children }) {

  const { user } = useAuth();
  const isSuperAdmin = useMemo(() => {
    if (!user) return false;
    const roleNames = Array.isArray(user.roles)
      ? user.roles.map((r) => (typeof r === "string" ? r : r.role?.name || r.name))
      : [user.role?.name || ""];
    return roleNames.some((r) => r && r.toLowerCase().includes("super admin"));
  }, [user]);

  if (isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard" element={<Dashboard />} />

  <Route
    path="/organization/company"
    element={
      <SalesManagerRestrictedRoute>
        <SalesExecutiveRestrictedRoute>
          <CompanyList />
        </SalesExecutiveRestrictedRoute>
      </SalesManagerRestrictedRoute>
    }
  />

  <Route
    path="/organization/branch"
    element={
      <SalesManagerRestrictedRoute>
        <SalesExecutiveRestrictedRoute>
          <BranchList />
        </SalesExecutiveRestrictedRoute>
      </SalesManagerRestrictedRoute>
    }
  />

  <Route
    path="/organization/department"
    element={
      <SalesManagerRestrictedRoute>
        <SalesExecutiveRestrictedRoute>
          <DepartmentList />
        </SalesExecutiveRestrictedRoute>
      </SalesManagerRestrictedRoute>
    }
  />


  <Route
    path="/organization/teams"
    element={
      <SalesExecutiveRestrictedRoute>
        <TeamList />
      </SalesExecutiveRestrictedRoute>
    }
  />

  <Route
    path="/organization/users"
    element={
      <SalesExecutiveRestrictedRoute>
        <UserList />
      </SalesExecutiveRestrictedRoute>
    }
  />

  <Route
    path="/team/manage"
    element={
      <SalesExecutiveRestrictedRoute>
        <TeamManagement />
      </SalesExecutiveRestrictedRoute>
    }
  />

  <Route
    path="/team/members/:id"
    element={
      <SalesExecutiveRestrictedRoute>
        <ExecutiveDetail />
      </SalesExecutiveRestrictedRoute>
    }
  />

  <Route
    path="/team/assigned-tasks"
    element={
      <SalesExecutiveRestrictedRoute>
        <AssignedTasks />
      </SalesExecutiveRestrictedRoute>
    }
  />

  <Route
    path="/team/tasks/:id"
    element={
      <SalesExecutiveRestrictedRoute>
        <TaskDetail />
      </SalesExecutiveRestrictedRoute>
    }
  />

  <Route
    path="/team/performance"
    element={
      <SalesExecutiveRestrictedRoute>
        <ExecutivePerformance />
      </SalesExecutiveRestrictedRoute>
    }
  />


  {/* ===== FIELD FORCE AUTOMATION ROUTES ===== */}
  <Route path="/field-force" element={<Navigate to="/field-force/dashboard" replace />} />
  <Route path="/field-force/dashboard" element={<FieldForceDashboard />} />

  <Route path="/field-force/attendance" element={<SuperAdminRestrictedRoute><AttendancePage /></SuperAdminRestrictedRoute>} />
  <Route path="/field-force/beat-plans" element={<SuperAdminRestrictedRoute><BeatPlanningPage /></SuperAdminRestrictedRoute>} />
  <Route path="/field-force/route" element={<SuperAdminRestrictedRoute><RouteOptimizationPage /></SuperAdminRestrictedRoute>} />
  <Route path="/field-force/tasks" element={<SuperAdminRestrictedRoute><TasksPage /></SuperAdminRestrictedRoute>} />
  <Route path="/field-force/tasks/:id/execute" element={<SuperAdminRestrictedRoute><TaskExecutionPage /></SuperAdminRestrictedRoute>} />
  <Route path="/field-force/visits" element={<VisitsPage />} />
  <Route path="/field-force/photo-upload" element={<SuperAdminRestrictedRoute><PhotoUploadPage /></SuperAdminRestrictedRoute>} />
  <Route path="/field-force/meeting-notes" element={<SuperAdminRestrictedRoute><MeetingNotesPage /></SuperAdminRestrictedRoute>} />
  <Route path="/field-force/expenses" element={<SuperAdminRestrictedRoute><ExpensesPage /></SuperAdminRestrictedRoute>} />
  <Route path="/field-force/calendar" element={<SuperAdminRestrictedRoute><CalendarPage /></SuperAdminRestrictedRoute>} />
  <Route path="/field-force/activities" element={<ActivitiesPage />} />
  <Route path="/field-force/dar" element={<DARPage />} />
  <Route path="/field-force/profile" element={<SuperAdminRestrictedRoute><ProfilePage /></SuperAdminRestrictedRoute>} />

</Route>

    </Routes>
  );
}


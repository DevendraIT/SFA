import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/auth/login.jsx";
import ForgotPassword from "./pages/auth/forgotpassword.jsx";
import ResetPassword from "./pages/auth/resetpassword.jsx";
import ChangePassword from "./pages/auth/changepassword.jsx";
import Profile from "./pages/auth/profile.jsx";
import SessionManagement from "./pages/auth/sessionmanagement.jsx";
import AdminDashboard from "./pages/dashboard/Admin.jsx";
import HeadSalesDashboard from "./pages/dashboard/Headsales.jsx";
import SalesManagerDashboard from "./pages/dashboard/Salesmanager.jsx";
import SalesPersonDashboard from "./pages/dashboard/SalesPerson.jsx";
import User from "./pages/admin/users.jsx";
import AdminLayout from "./layouts/adminLayout.jsx";
import AILeads from "./pages/admin/AILeads.jsx";
import Analytics from "./pages/admin/Analytics.jsx";
import FieldForce from "./pages/admin/FieldForce.jsx";
import Orders from "./pages/admin/order.jsx";
import Organization from "./pages/admin/organisation.jsx";
import Reports from "./pages/admin/Reports.jsx";
import Settings from "./pages/admin/Settings.jsx";
import Targets from "./pages/admin/Targets.jsx";
import { GrDashboard } from "react-icons/gr";
import HeadSalesLayout from "./layouts/headsalesLayout.jsx";
import Territories from "./pages/headsales/territories.jsx";
import TeamManagement from "./pages/headsales/teammanagement.jsx";
import HOSAnalytics from "./pages/headsales/analytical.jsx";
import HOSTargets from "./pages/headsales/target.jsx";
import HOSOrders from "./pages/headsales/order.jsx";
import HOSCustomers from "./pages/headsales/customers.jsx";
import HOSReports from "./pages/headsales/reports.jsx";
import HOSAiInsights from "./pages/headsales/aiinsights.jsx";
import HOSMeetings from "./pages/headsales/meeting.jsx";
import HOSSettings from "./pages/headsales/settings.jsx";
import SMOrders from "./pages/salesmanager/orders.jsx";
import SMCustomers from "./pages/salesmanager/customers.jsx";
import SMLeads from "./pages/salesmanager/leads.jsx";
import SMVisits from "./pages/salesmanager/visits.jsx";
import SalesManagerLayout from "./layouts/salesmanagerLayout.jsx";
import SMTargets from "./pages/salesmanager/target.jsx";
import SMTeams from "./pages/salesmanager/team.jsx";
import SMAnalytics from "./pages/salesmanager/analytical.jsx";
import SMTerritory from "./pages/salesmanager/territory.jsx";
import SMAttendance from "./pages/salesmanager/attendance.jsx";
import SMReports from "./pages/salesmanager/reports.jsx";
import SalesPersonLayout from "./layouts/salespersonLayout.jsx";
import SPCustomers from "./pages/salesperson/customer.jsx";
import SPLeads from "./pages/salesperson/lead.jsx";
import SPOrders from "./pages/salesperson/order.jsx";
import SPPerformance from "./pages/salesperson/performance.jsx";
import SPProducts from "./pages/salesperson/product.jsx";
import SPVisits from "./pages/salesperson/visits.jsx";
import SPSettings from "./pages/salesperson/setting.jsx";
import RevenuePage from "./pages/headsales/Revenue.jsx";
import Modal from "./components/ui/Modal.jsx";
import { showSuccess, ToastProvider } from "./context/ToastContext.jsx";

export default function App() {
  const popupTimerRef = useRef(null);
  const [actionModal, setActionModal] = useState({
    open: false,
    title: "Action executed",
    message: "The selected action was executed successfully.",
  });

  const closeActionModal = () => {
    if (popupTimerRef.current) {
      window.clearTimeout(popupTimerRef.current);
    }
    setActionModal((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const handleGlobalButtonClick = (event) => {
      const button = event.target.closest("button");
      if (!button || button.disabled) return;
      if (button.dataset.skipGlobalAction === "true") return;
      if (button.closest("[data-skip-global-action='true']")) return;

      const isLoginAction =
        button.closest("form")?.className?.includes("login") ||
        button.textContent?.toLowerCase().includes("login") ||
        button.getAttribute("aria-label")?.toLowerCase().includes("login") ||
        window.location.pathname === "/login";

      if (isLoginAction) return;

      const label =
        button.getAttribute("aria-label") ||
        button.getAttribute("title") ||
        button.textContent?.trim().replace(/\s+/g, " ") ||
        "Button";

      const lowerLabel = label.toLowerCase();
      const shouldShowFeedback =
        lowerLabel.includes("edit") ||
        lowerLabel.includes("delete") ||
        lowerLabel.includes("create") ||
        lowerLabel.includes("add") ||
        lowerLabel.includes("save") ||
        lowerLabel.includes("submit") ||
        lowerLabel.includes("remove") ||
        lowerLabel.includes("update");

      if (!shouldShowFeedback) return;

      window.setTimeout(() => {
        setActionModal({
          open: true,
          title: "Action executed",
          message: `The "${label}" action was executed successfully.`,
        });
        showSuccess("Action executed successfully");

        if (popupTimerRef.current) {
          window.clearTimeout(popupTimerRef.current);
        }
        popupTimerRef.current = window.setTimeout(() => {
          setActionModal((prev) => ({ ...prev, open: false }));
        }, 2000);
      }, 0);
    };

    document.addEventListener("click", handleGlobalButtonClick);

    return () => {
      if (popupTimerRef.current) {
        window.clearTimeout(popupTimerRef.current);
      }
      document.removeEventListener("click", handleGlobalButtonClick);
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sessions" element={<SessionManagement />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/Dashboard" element={<AdminDashboard />} />
          <Route path="/admin/Users" element={<User />} />
          <Route path="/admin/AILeads" element={<AILeads />} />
          <Route path="/admin/Analytics" element={<Analytics />} />
          <Route path="/admin/FieldForce" element={<FieldForce />} />
          <Route path="/admin/Orders" element={<Orders />} />
          <Route path="/admin/Organization" element={<Organization />} />
          <Route path="/admin/Reports" element={<Reports />} />
          <Route path="/admin/Settings" element={<Settings />} />
          <Route path="/admin/Targets" element={<Targets />} />
        </Route>
        <Route path="/headsales" element={<HeadSalesLayout />}>
          <Route path="/headsales/Dashboard" element={<HeadSalesDashboard />} />
          <Route path="/headsales/territory" element={<Territories />} />
          <Route
            path="/headsales/team-performance"
            element={<TeamManagement />}
          />
          <Route path="/headsales/sales-analytics" element={<HOSAnalytics />} />
          <Route path="/headsales/orders" element={<HOSOrders />} />
          <Route path="/headsales/revenue" element={<RevenuePage />} />
          <Route path="/headsales/customers" element={<HOSCustomers />} />
          <Route path="/headsales/Targets" element={<HOSTargets />} />
          <Route path="/headsales/Reports" element={<HOSReports />} />
          <Route path="/headsales/ai-insights" element={<HOSAiInsights />} />
          <Route path="/headsales/meetings" element={<HOSMeetings />} />
          <Route path="/headsales/settings" element={<HOSSettings />} />
        </Route>
        <Route path="/salesmanager" element={<SalesManagerLayout />}>
          <Route
            path="/salesmanager/dashboard"
            element={<SalesManagerDashboard />}
          />
          <Route path="/salesmanager/customers" element={<SMCustomers />} />
          <Route path="/salesmanager/visits" element={<SMVisits />} />
          <Route path="/salesmanager/leads" element={<SMLeads />} />
          <Route path="/salesmanager/orders" element={<SMOrders />} />
          <Route path="/salesmanager/targets" element={<SMTargets />} />
          <Route path="/salesmanager/team" element={<SMTeams />} />
          <Route path="/salesmanager/reports" element={<SMReports />} />
          <Route path="/salesmanager/attendance" element={<SMAttendance />} />
          <Route path="/salesmanager/territory" element={<SMTerritory />} />
          <Route path="/salesmanager/analytics" element={<SMAnalytics />} />
        </Route>

        <Route path="/salesperson" element={<SalesPersonLayout />}>
          <Route
            path="/salesperson/dashboard"
            element={<SalesPersonDashboard />}
          />
          <Route path="/salesperson/customers" element={<SPCustomers />} />
          <Route path="/salesperson/leads" element={<SPLeads />} />
          <Route path="/salesperson/orders" element={<SPOrders />} />
          <Route path="/salesperson/performances" element={<SPPerformance />} />
          <Route path="/salesperson/products" element={<SPProducts />} />
          <Route path="/salesperson/visits" element={<SPVisits />} />
          <Route path="/salesperson/settings" element={<SPSettings />} />
        </Route>
      </Routes>

      <Modal
        open={actionModal.open}
        onClose={closeActionModal}
        title={actionModal.title}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {actionModal.message}
          </p>
          <div className="flex justify-end">
            <button
              onClick={closeActionModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>

      <ToastProvider />
    </>
  );
}

import WelcomeBanner from "../../components/salesperson/WelcomeBanner.jsx";
import KPIGrid from "../../components/salesperson/KPIGrid.jsx";
import KPIWidget from "../../components/salesperson/KPIWidget.jsx";
import QuickActions from "../../components/salesperson/QuickActions.jsx";
import SalesAnalytics from "../../components/salesperson/SalesAnalytics.jsx";
import TargetProgress from "../../components/salesperson/TargetProgress.jsx";
import RecentOrders from "../../components/salesperson/RecentOrders.jsx";
import AssignedLeads from "../../components/salesperson/AssignedLeads.jsx";
import TodayVisits from "../../components/salesperson/TodayVisits.jsx";
import NotificationsPanel from "../../components/salesperson/NotificationsPanel.jsx";


export default function SalesPersonDashboard() {
  return (
    <div className="space-y-6">
      <WelcomeBanner />

      <KPIGrid />

      <QuickActions />

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SalesAnalytics />
        </div>

        <TargetProgress />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <TodayVisits />

        <AssignedLeads />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <RecentOrders />

        <NotificationsPanel />
      </div>
    </div>
  );
}
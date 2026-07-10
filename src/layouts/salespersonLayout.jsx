import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import { roleNavConfig } from "../config/navigation.js";

const config = roleNavConfig.salesperson;

export default function SalesPersonLayout() {
  return (
    <DashboardLayout
      navItems={config.items}
      roleLabel={config.roleLabel}
      settingsPath={config.settingsPath}
      showMobileBottomNav
      mobileBottomNavMaxItems={5}
    />
  );
}

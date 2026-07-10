import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import { roleNavConfig } from "../config/navigation.js";

const config = roleNavConfig.salesmanager;

export default function SalesManagerLayout() {
  return (
    <DashboardLayout
      navItems={config.items}
      roleLabel={config.roleLabel}
      settingsPath={config.settingsPath}
    />
  );
}

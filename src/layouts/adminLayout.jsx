import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import { roleNavConfig } from "../config/navigation.js";

const config = roleNavConfig.admin;

export default function AdminLayout() {
  return (
    <DashboardLayout
      navItems={config.items}
      roleLabel={config.roleLabel}
      settingsPath={config.settingsPath}
    />
  );
}

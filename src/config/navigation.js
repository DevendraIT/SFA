import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  BarChart3,
  FileText,
  ScrollText,
  Settings,
  Brain,
  TrendingUp,
  IndianRupee,
  Target,
  Sparkles,
  MapPinned,
  UserPlus,
  ShoppingCart,
  ShoppingBag,
  Clock,
  GitCompare,
  Calendar,
} from "lucide-react";

export const ROLE_DISPLAY = {
  SUPER_ADMIN: "Admin",
  ADMIN: "Admin",
  HEAD_SALES: "Head of Sales",
  SALES_MANAGER: "Sales Manager",
  SALES_PERSON: "Sales Person",
};

export const adminNavItems = [
  { to: "/admin/Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/Organization", label: "Organization", icon: Building2 },
  { to: "/admin/Users", label: "Users", icon: Users },
  { to: "/admin/Targets", label: "Targets", icon: Shield },
  { to: "/admin/Analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/Reports", label: "Reports", icon: FileText },
  { to: "/admin/FieldForce", label: "Field Force", icon: ScrollText },
  { to: "/admin/AILeads", label: "AI Leads", icon: Brain },
  { to: "/admin/Orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/Settings", label: "Settings", icon: Settings },
];

export const headSalesNavItems = [
  { to: "/headsales/Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/headsales/sales-analytics", label: "Sales Analytics", icon: TrendingUp },
  { to: "/headsales/team-performance", label: "Team Performance", icon: Users },
  { to: "/headsales/revenue", label: "Revenue", icon: IndianRupee },
  { to: "/headsales/Targets", label: "Targets", icon: Target },
  { to: "/headsales/Reports", label: "Reports", icon: FileText },
  { to: "/headsales/territory", label: "Territory", icon: MapPinned },
  { to: "/headsales/orders", label: "Orders", icon: ShoppingCart },
  { to: "/headsales/customers", label: "Customers", icon: Users },
  { to: "/headsales/ai-insights", label: "AI Insights", icon: Sparkles },
  { to: "/headsales/meetings", label: "Meetings", icon: Calendar },
  { to: "/headsales/settings", label: "Settings", icon: Settings },
];

export const salesManagerNavItems = [
  { to: "/salesmanager/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/salesmanager/customers", label: "Customers", icon: Users },
  { to: "/salesmanager/visits", label: "Visits", icon: MapPinned },
  { to: "/salesmanager/leads", label: "Leads", icon: UserPlus },
  { to: "/salesmanager/orders", label: "Orders", icon: ShoppingCart },
  { to: "/salesmanager/targets", label: "Targets", icon: Target },
  { to: "/salesmanager/team", label: "Team", icon: Users },
  { to: "/salesmanager/attendance", label: "Attendance", icon: Clock },
  { to: "/salesmanager/territory", label: "Territory", icon: MapPinned },
  { to: "/salesmanager/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/salesmanager/reports", label: "Reports", icon: FileText },
];

export const salesPersonNavItems = [
  { to: "/salesperson/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/salesperson/customers", label: "Customers", icon: Users },
  { to: "/salesperson/visits", label: "Visits", icon: MapPinned },
  { to: "/salesperson/leads", label: "Leads", icon: UserPlus },
  { to: "/salesperson/orders", label: "Orders", icon: ShoppingBag },
  { to: "/salesperson/performances", label: "Performance", icon: BarChart3 },
  { to: "/salesperson/products", label: "Products", icon: ShoppingBag },
  { to: "/salesperson/settings", label: "Settings", icon: Settings },
];

export const roleNavConfig = {
  admin: { items: adminNavItems, roleLabel: "Admin", settingsPath: "/admin/Settings" },
  headsales: { items: headSalesNavItems, roleLabel: "Head of Sales", settingsPath: "/headsales/settings" },
  salesmanager: { items: salesManagerNavItems, roleLabel: "Sales Manager", settingsPath: "/salesmanager/dashboard" },
  salesperson: { items: salesPersonNavItems, roleLabel: "Sales Person", settingsPath: "/salesperson/settings" },
};

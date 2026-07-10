import { seedDatabase } from "./seedData.js";
import { generateId } from "../utils/helpers.js";

const DB_KEY = "sfa_database";
const SESSION_KEY = "sfa_session";

const COLLECTIONS = [
  "organizations",
  "users",
  "roles",
  "categories",
  "products",
  "dealers",
  "customers",
  "leads",
  "orders",
  "attendance",
  "expenses",
  "visits",
  "routes",
  "tasks",
  "targets",
  "approvals",
  "reports",
  "auditLogs",
  "notifications",
  "aiInsights",
];

const listeners = new Set();

const notify = () => {
  listeners.forEach((fn) => fn());
};

const getDatabase = () => {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* reset on corrupt data */
  }
  const seeded = seedDatabase();
  localStorage.setItem(DB_KEY, JSON.stringify(seeded));
  return seeded;
};

const saveDatabase = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  notify();
};

const initDatabase = () => {
  getDatabase();
};

// Generic CRUD factory
const createCollectionService = (collectionName) => ({
  getAll: () => {
    const db = getDatabase();
    return db[collectionName] || [];
  },

  getById: (id) => {
    const items = createCollectionService(collectionName).getAll();
    return items.find((item) => item.id === id) || null;
  },

  create: (data) => {
    const db = getDatabase();
    const item = {
      ...data,
      id: data.id || generateId(),
      createdAt: data.createdAt || new Date().toISOString(),
    };
    db[collectionName] = [...(db[collectionName] || []), item];
    saveDatabase(db);
    storage.addAuditLog("Create", collectionName, `${collectionName} record created`);
    return item;
  },

  update: (id, data) => {
    const db = getDatabase();
    const items = db[collectionName] || [];
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const updated = { ...items[index], ...data, id, updatedAt: new Date().toISOString() };
    items[index] = updated;
    db[collectionName] = items;
    saveDatabase(db);
    storage.addAuditLog("Update", collectionName, `${collectionName} record updated`);
    return updated;
  },

  delete: (id) => {
    const db = getDatabase();
    db[collectionName] = (db[collectionName] || []).filter((item) => item.id !== id);
    saveDatabase(db);
    storage.addAuditLog("Delete", collectionName, `${collectionName} record deleted`);
    return true;
  },

  bulkDelete: (ids) => {
    const db = getDatabase();
    db[collectionName] = (db[collectionName] || []).filter(
      (item) => !ids.includes(item.id)
    );
    saveDatabase(db);
    storage.addAuditLog("Bulk Delete", collectionName, `${ids.length} records deleted`);
    return true;
  },

  bulkCreate: (items) => {
    const db = getDatabase();
    const newItems = items.map((data) => ({
      ...data,
      id: data.id || generateId(),
      createdAt: data.createdAt || new Date().toISOString(),
    }));
    db[collectionName] = [...(db[collectionName] || []), ...newItems];
    saveDatabase(db);
    return newItems;
  },

  query: (predicate) => {
    return createCollectionService(collectionName).getAll().filter(predicate);
  },
});

const storage = {
  init: initDatabase,

  subscribe: (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  reset: () => {
    localStorage.removeItem(DB_KEY);
    getDatabase();
    notify();
  },

  // Collection services
  organizations: createCollectionService("organizations"),
  users: createCollectionService("users"),
  roles: createCollectionService("roles"),
  categories: createCollectionService("categories"),
  products: createCollectionService("products"),
  dealers: createCollectionService("dealers"),
  customers: createCollectionService("customers"),
  leads: createCollectionService("leads"),
  orders: createCollectionService("orders"),
  attendance: createCollectionService("attendance"),
  expenses: createCollectionService("expenses"),
  visits: createCollectionService("visits"),
  routes: createCollectionService("routes"),
  tasks: createCollectionService("tasks"),
  targets: createCollectionService("targets"),
  approvals: createCollectionService("approvals"),
  reports: createCollectionService("reports"),
  auditLogs: createCollectionService("auditLogs"),
  notifications: createCollectionService("notifications"),
  aiInsights: createCollectionService("aiInsights"),

  // Settings
  getSettings: () => {
    const db = getDatabase();
    return db.settings || {};
  },

  updateSettings: (settings) => {
    const db = getDatabase();
    db.settings = { ...db.settings, ...settings };
    saveDatabase(db);
    return db.settings;
  },

  getUserPreferences: (userId) => {
    const db = getDatabase();
    return db.userPreferences?.[userId] || {};
  },

  updateUserPreferences: (userId, prefs) => {
    const db = getDatabase();
    if (!db.userPreferences) db.userPreferences = {};
    db.userPreferences[userId] = { ...db.userPreferences[userId], ...prefs };
    saveDatabase(db);
    return db.userPreferences[userId];
  },

  // Auth
  login: (email, password) => {
    const users = storage.users.getAll();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { success: false, error: "Invalid email or password" };

    const { password: _, ...safeUser } = user;
    const session = {
      token: generateId(),
      user: safeUser,
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    storage.addAuditLog("Login", "Auth", `${user.name} logged in`);
    return { success: true, user: safeUser, token: session.token };
  },

  logout: () => {
    const session = storage.getSession();
    if (session?.user) {
      storage.addAuditLog("Logout", "Auth", `${session.user.name} logged out`);
    }
    localStorage.removeItem(SESSION_KEY);
    notify();
  },

  getSession: () => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getCurrentUser: () => storage.getSession()?.user || null,

  isAuthenticated: () => !!storage.getSession()?.token,

  updateProfile: (userId, data) => {
    const updated = storage.users.update(userId, data);
    if (updated) {
      const session = storage.getSession();
      if (session?.user?.id === userId) {
        const { password: _, ...safeUser } = updated;
        session.user = safeUser;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
    }
    return updated;
  },

  changePassword: (userId, currentPassword, newPassword) => {
    const user = storage.users.getById(userId);
    if (!user) return { success: false, error: "User not found" };
    if (user.password !== currentPassword) {
      return { success: false, error: "Current password is incorrect" };
    }
    storage.users.update(userId, { password: newPassword });
    return { success: true };
  },

  forgotPassword: (email) => {
    const user = storage.users.getAll().find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!user) return { success: false, error: "No account found with this email" };
    const token = generateId();
    const db = getDatabase();
    db.resetTokens = [
      ...(db.resetTokens || []),
      { token, email, expiresAt: Date.now() + 3600000 },
    ];
    saveDatabase(db);
    return { success: true, token };
  },

  resetPassword: (token, newPassword) => {
    const db = getDatabase();
    const resetEntry = (db.resetTokens || []).find(
      (t) => t.token === token && t.expiresAt > Date.now()
    );
    if (!resetEntry) return { success: false, error: "Invalid or expired reset token" };
    const user = storage.users.getAll().find(
      (u) => u.email.toLowerCase() === resetEntry.email.toLowerCase()
    );
    if (!user) return { success: false, error: "User not found" };
    storage.users.update(user.id, { password: newPassword });
    db.resetTokens = db.resetTokens.filter((t) => t.token !== token);
    saveDatabase(db);
    return { success: true };
  },

  addAuditLog: (action, module, details) => {
    const user = storage.getCurrentUser();
    storage.auditLogs.create({
      action,
      user: user?.name || "System",
      module,
      details,
      ip: "127.0.0.1",
    });
  },

  addNotification: (userId, title, message, type = "info") => {
    return storage.notifications.create({
      userId,
      title,
      message,
      type,
      read: false,
    });
  },

  markNotificationRead: (id) => {
    return storage.notifications.update(id, { read: true });
  },

  // Dashboard analytics
  getDashboardStats: () => {
    const orders = storage.orders.getAll();
    const leads = storage.leads.getAll();
    const users = storage.users.getAll();
    const customers = storage.customers.getAll();
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    const openLeads = leads.filter((l) => l.status === "Open").length;
    const activeUsers = users.filter((u) => u.status === "Active").length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalLeads: leads.length,
      openLeads,
      totalCustomers: customers.length,
      activeUsers,
      totalUsers: users.length,
    };
  },

  getRevenueByMonth: () => {
    const orders = storage.orders.getAll();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((month, i) => ({
      month,
      revenue: orders
        .filter((o) => new Date(o.orderDate || o.createdAt).getMonth() === i)
        .reduce((sum, o) => sum + (Number(o.amount) || 0), 0),
      orders: orders.filter(
        (o) => new Date(o.orderDate || o.createdAt).getMonth() === i
      ).length,
    }));
  },

  getLeadsByStage: () => {
    const leads = storage.leads.getAll();
    const stages = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
    return stages.map((stage) => ({
      name: stage,
      value: leads.filter((l) => l.stage === stage).length,
    })).filter((s) => s.value > 0);
  },

  getTeamPerformance: () => {
    const users = storage.users.getAll().filter((u) => u.role === "SALES_PERSON");
    const orders = storage.orders.getAll();
    const targets = storage.targets.getAll();
    return users.map((user) => {
      const userOrders = orders.filter((o) => o.assignedTo === user.name);
      const revenue = userOrders.reduce((s, o) => s + (Number(o.amount) || 0), 0);
      const target = targets.find((t) => t.userId === user.id);
      return {
        name: user.name,
        revenue,
        orders: userOrders.length,
        target: target?.target || 0,
        achieved: target?.achieved || revenue,
      };
    });
  },

  getCollectionNames: () => COLLECTIONS,
};

initDatabase();

export default storage;

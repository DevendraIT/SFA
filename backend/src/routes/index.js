import express from "express";
import swaggerUi from "swagger-ui-express";
import config from "../config/env.js";
import swaggerSpec from "../config/swagger.js";
import healthRouter from "./health.routes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    name: "SFA (Sales Force Automation) API",
    version: config.API_VERSION,
    status: "healthy",
    docs: `/api/${config.API_VERSION}/docs`,
  });
});

if (config.SWAGGER_ENABLED) {
  router.use("/docs", swaggerUi.serve);
  router.get("/docs", swaggerUi.setup(swaggerSpec));
}

router.use("/health", healthRouter);

// Auth
import authRouter from "../modules/auth/index.js";
router.use("/auth", authRouter);

// Organization Setup
import organizationRouter from "../modules/organization/index.js";
router.use("/organization", organizationRouter);

// Teams
import teamRouter from "../modules/team/index.js";
router.use("/teams", teamRouter);

// Roles
import roleRouter from "../modules/roles/index.js";
router.use("/roles", roleRouter);

// Users
import usersRouter from "../modules/users/index.js";
router.use("/users", usersRouter);

// Lead Management (Phase 3 & 4)
import leadManagementRouter from "../modules/lead-management/index.js";
router.use("/leads", leadManagementRouter);

// CRM Integration
import crmIntegrationRouter from "../modules/crm-integration/index.js";
router.use("/crm", crmIntegrationRouter);

// Sales Orders
import salesOrderRouter from "../modules/sales-order/index.js";
router.use("/orders", salesOrderRouter);

// Permissions
import permissionRouter from "../modules/permissions/index.js";
router.use("/permissions", permissionRouter);

export default router;

import express from "express";
import swaggerUi from "swagger-ui-express";
import config from "../config/env.js";
import swaggerSpec from "../config/swagger.js";
import healthRouter from "./health.routes.js";

const router = express.Router();

// Root API path info
router.get("/", (req, res) => {
  res.json({
    name: "SFA (Sales Force Automation) API",
    version: config.API_VERSION,
    status: "healthy",
    docs: `/api/${config.API_VERSION}/docs`,
  });
});

// Mount Swagger Documentation
if (config.SWAGGER_ENABLED) {
  router.use("/docs", swaggerUi.serve);
  router.get("/docs", swaggerUi.setup(swaggerSpec));
}

// Mount Health Check Route
router.use("/health", healthRouter);

// Core Modules Routes
import authRouter from "../modules/auth/index.js";
router.use("/auth", authRouter);

export default router;

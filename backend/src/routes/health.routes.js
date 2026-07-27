import express from "express";
import os from "os";
import { prisma } from "../config/database.js";
import { ApiResponse } from "../shared/response.js";
import { logger } from "../utils/index.js";

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get API server and database health status
 *     description: Returns runtime metrics, system resource utilization, and database connectivity.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System is operational
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       503:
 *         description: System is degraded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get("/", async (req, res) => {
  const healthInfo = {
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      freeMem: os.freemem(),
      totalMem: os.totalmem(),
    },
    database: {
      status: "UNKNOWN",
    },
  };

  try {
    // Quick Postgres check via raw SQL query execution
    await prisma.$queryRaw`SELECT 1`;
    healthInfo.database.status = "UP";
    
    return res.status(200).json(
      ApiResponse.success("System is fully operational", healthInfo)
    );
  } catch (error) {
    logger.error("Health check failed (Database check error):", error);
    
    healthInfo.status = "DEGRADED";
    healthInfo.database.status = "DOWN";
    healthInfo.database.error = error.message;

    return res.status(503).json(
      ApiResponse.error("System is in a degraded state", healthInfo)
    );
  }
});

export default router;

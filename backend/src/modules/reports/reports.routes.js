import express from "express";
import { ReportsRepository } from "./reports.repository.js";
import { ReportsService } from "./reports.service.js";
import { ReportsController } from "./reports.controller.js";

const router = express.Router();

const reportsRepository = new ReportsRepository();
const reportsService = new ReportsService(reportsRepository);
const reportsController = new ReportsController(reportsService);

export default router;
export { reportsController, reportsService, reportsRepository };

import express from "express";
import { SettingsRepository } from "./settings.repository.js";
import { SettingsService } from "./settings.service.js";
import { SettingsController } from "./settings.controller.js";

const router = express.Router();

const settingsRepository = new SettingsRepository();
const settingsService = new SettingsService(settingsRepository);
const settingsController = new SettingsController(settingsService);

export default router;
export { settingsController, settingsService, settingsRepository };

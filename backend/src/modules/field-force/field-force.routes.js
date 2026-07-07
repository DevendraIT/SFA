import express from "express";
import { FieldForceRepository } from "./field-force.repository.js";
import { FieldForceService } from "./field-force.service.js";
import { FieldForceController } from "./field-force.controller.js";

const router = express.Router();

const fieldForceRepository = new FieldForceRepository();
const fieldForceService = new FieldForceService(fieldForceRepository);
const fieldForceController = new FieldForceController(fieldForceService);

export default router;
export { fieldForceController, fieldForceService, fieldForceRepository };

import express from "express";
import {
  createHealthCenter,
  getAllHealthCenters,
  getHealthCenterById,
  updateHealthCenter,
  deleteHealthCenter,
} from "../controllers/Healthcenter_Controller.js";

import { protect } from "../middlewares/protect.js";

const router = express.Router();

// Routes
router.post("/", protect, createHealthCenter); // Create a new health center
router.get("/", protect, getAllHealthCenters); // Get all health centers
router.get("/:id", protect, getHealthCenterById); // Get a health center by ID
router.put("/:id", protect, updateHealthCenter); // Update a health center
router.delete("/:id", protect, deleteHealthCenter); // Delete a health center

export default router;

const express = require("express");
const router = express.Router();
const {
  createBaby,
  getAllBabies,
  getBabyById,
  updateBaby,
  deleteBaby,
} = require("../controllers/babiesController");
import { protect } from '../middlewares/protect.js';
// Create a new Baby record
router.post("/",protect, createBaby);

// Get all Baby records
router.get("/",protect, getAllBabies);

// Get a specific Baby record by ID
router.get("/:id",protect, getBabyById);

// Update a Baby record
router.put("/:id",protect, updateBaby);

// Delete a Baby record
router.delete("/:id",protect, deleteBaby);

module.exports = router;

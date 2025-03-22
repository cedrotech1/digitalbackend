const express = require("express");
const router = express.Router();
const {
  createBornWithBabies,
  getAllBorns,
  getBornById,
  updateBorn,
  deleteBorn,
} = require("../controllers/bornsController");
import { protect } from '../middlewares/protect.js';
// Create Born record with Babies
router.post("/", protect,createBornWithBabies);

// Get all Born records
router.get("/",protect, getAllBorns);

// Get a specific Born record by ID
router.get("/:id", protect,getBornById);

// Update a Born record
router.put("/:id", protect,updateBorn);

// Delete a Born record
router.delete("/:id", protect,deleteBorn);

module.exports = router;

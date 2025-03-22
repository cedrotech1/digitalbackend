const express = require("express");
const router = express.Router();
const {
  createBaby,
  getAllBabies,
  getBabyById,
  updateBaby,
  deleteBaby,
} = require("../controllers/babiesController");

// Create a new Baby record
router.post("/", createBaby);

// Get all Baby records
router.get("/", getAllBabies);

// Get a specific Baby record by ID
router.get("/:id", getBabyById);

// Update a Baby record
router.put("/:id", updateBaby);

// Delete a Baby record
router.delete("/:id", deleteBaby);

module.exports = router;

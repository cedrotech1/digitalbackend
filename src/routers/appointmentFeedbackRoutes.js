const express = require("express");

import {
    createFeedback,
    getFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
  } from '../controllers/appointmentFeedbackController';
  import { protect } from '../middlewares/protect.js';
  const router = express.Router();
  
router.post("/",protect, createFeedback);
router.get("/",protect, getFeedbacks);
router.get("/:id",protect, getFeedbackById);
router.put("/:id",protect,updateFeedback);
router.delete("/:id",protect, deleteFeedback);

export default router

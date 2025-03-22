const express = require("express");

import {
    createFeedback,
    getFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
  } from '../controllers/appointmentFeedbackController';

  const router = express.Router();
  
router.post("/", createFeedback);
router.get("/", getFeedbacks);
router.get("/:id", getFeedbackById);
router.put("/:id",updateFeedback);
router.delete("/:id", deleteFeedback);

export default router

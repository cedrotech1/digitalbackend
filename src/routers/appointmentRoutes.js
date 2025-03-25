import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} from "../controllers/appointmentController.js";

const router = express.Router();
import { protect } from '../middlewares/protect.js';
router.post("/", protect,createAppointment);
router.get("/", protect,getAllAppointments);
router.get("/:id", protect,getAppointmentById);
router.put("/:id", protect,updateAppointment);
router.delete("/:id",protect, deleteAppointment);

export default router;

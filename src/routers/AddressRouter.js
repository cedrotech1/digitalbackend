import express from "express";
import {
  getAddressHierarchy,addressController,getFilteredAddressData 

} from "../controllers/addressController.js";


import { protect } from "../middlewares/protect.js";

const router = express.Router();

// router.delete("/delete/:id",protect, deleteOneCategoryController);
// router.post("/add/",protect, addCategoryController);
router.get("/filter",getFilteredAddressData);
router.get("/",getAddressHierarchy);
router.post("/address",protect, addressController);


export default router;

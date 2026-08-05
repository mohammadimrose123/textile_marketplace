const express = require("express");
const router = express.Router();
const {
  saveBuyerProfile,
  saveSupplierProfile,
  getDashboardData,
  getAllSuppliers,
} = require("../controllers/profileController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/suppliers", getAllSuppliers);
router.post("/buyer", protect, authorize("Buyer"), saveBuyerProfile);
router.post("/supplier", protect, authorize("Supplier"), saveSupplierProfile);
router.get("/dashboard", protect, getDashboardData);

module.exports = router;


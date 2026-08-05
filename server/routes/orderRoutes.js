const express = require("express");
const router = express.Router();
const {
  createOrder,
  getBuyerOrders,
  getSupplierOrders,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("Buyer"), createOrder);
router.get("/buyer", protect, authorize("Buyer"), getBuyerOrders);
router.get("/supplier", protect, authorize("Supplier"), getSupplierOrders);

module.exports = router;

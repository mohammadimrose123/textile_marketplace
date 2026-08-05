const express = require("express");
const router = express.Router();
const { getCart, addToCart, clearCart } = require("../controllers/cartController");

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/", clearCart);

module.exports = router;

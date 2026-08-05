const Order = require("../models/Order");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Buyer)
const createOrder = async (req, res) => {
  try {
    const { supplier, products, shippingAddress, totalAmount } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const order = new Order({
      buyer: req.user._id,
      supplier,
      products,
      shippingAddress,
      totalAmount,
      status: "Pending",
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
};

// @desc    Get logged in buyer orders
// @route   GET /api/orders/buyer
// @access  Private (Buyer)
const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate("supplier", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// @desc    Get logged in supplier orders
// @route   GET /api/orders/supplier
// @access  Private (Supplier)
const getSupplierOrders = async (req, res) => {
  try {
    const orders = await Order.find({ supplier: req.user._id }).populate("buyer", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch supplier orders" });
  }
};

module.exports = {
  createOrder,
  getBuyerOrders,
  getSupplierOrders,
};

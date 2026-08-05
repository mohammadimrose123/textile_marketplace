const Cart = require("../models/Cart");
const Product = require("../models/Product");
const memoryStore = require("../services/memoryStore");
const { getIsConnected } = require("../config/db");

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private (or Session)
const getCart = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    if (!userId) {
      return res.json({ items: [] });
    }

    if (getIsConnected()) {
      let cart = await Cart.findOne({ buyer: userId }).populate("items.product");
      if (!cart) {
        cart = await Cart.create({ buyer: userId, items: [] });
      }
      return res.json(cart);
    } else {
      return res.json({ buyer: userId, items: [] });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private (or Public Session)
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, color = "Default" } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : "guest_user";

    if (getIsConnected() && req.user) {
      let cart = await Cart.findOne({ buyer: userId });
      if (!cart) {
        cart = new Cart({ buyer: userId, items: [] });
      }

      const existingIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId && item.color === color
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ product: productId, quantity: Number(quantity), color });
      }

      await cart.save();
      const updatedCart = await Cart.findById(cart._id).populate("items.product");
      return res.status(201).json(updatedCart);
    } else {
      let product = memoryStore.products.find((p) => p._id === productId);
      if (!product) {
        product = { _id: productId, title: "Selected Fabric", price: 20, category: "Cotton" };
      }
      return res.status(201).json({
        buyer: userId,
        items: [{ product, quantity: Number(quantity), color }],
      });
    }
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    if (getIsConnected() && userId) {
      await Cart.findOneAndUpdate({ buyer: userId }, { items: [] });
    }
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

module.exports = {
  getCart,
  addToCart,
  clearCart,
};

const BuyerProfile = require("../models/BuyerProfile");
const SupplierProfile = require("../models/SupplierProfile");
const Product = require("../models/Product");
const Order = require("../models/Order");
const memoryStore = require("../services/memoryStore");
const { getIsConnected } = require("../config/db");

// @desc    Update/Save Buyer Profile (Onboarding)
// @route   POST /api/profiles/buyer
// @access  Private (Buyer)
const saveBuyerProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getIsConnected()) {
      let profile = await BuyerProfile.findOne({ user: userId });
      if (!profile) {
        profile = new BuyerProfile({ user: userId });
      }
      Object.assign(profile, req.body);
      const updatedProfile = await profile.save();
      return res.json(updatedProfile);
    } else {
      const updatedProfile = memoryStore.saveBuyerProfile({ user: userId, ...req.body });
      return res.json(updatedProfile);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update buyer profile" });
  }
};

// @desc    Update/Save Supplier Profile (Onboarding)
// @route   POST /api/profiles/supplier
// @access  Private (Supplier)
const saveSupplierProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getIsConnected()) {
      let profile = await SupplierProfile.findOne({ user: userId });
      if (!profile) {
        profile = new SupplierProfile({ user: userId });
      }
      Object.assign(profile, req.body);
      const updatedProfile = await profile.save();
      return res.json(updatedProfile);
    } else {
      const updatedProfile = memoryStore.saveSupplierProfile({ user: userId, ...req.body });
      return res.json(updatedProfile);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update supplier profile" });
  }
};

// @desc    Get dashboard metrics for Buyer or Supplier
// @route   GET /api/profiles/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const role = req.user.role;

    if (getIsConnected()) {
      if (role === "Buyer") {
        const profile = await BuyerProfile.findOne({ user: userId });
        const orders = await Order.find({ buyer: userId }).populate("supplier", "name email");
        const recommendations = await Product.find().limit(6);

        return res.json({
          profile: profile || {},
          orders,
          wishlist: [
            { _id: "w1", title: "Organic Bamboo Silk", price: 28, category: "Silk" },
            { _id: "w2", title: "Recycled Polyester Weave", price: 14, category: "Synthetic" }
          ],
          recommendations,
        });
      } else {
        const profile = await SupplierProfile.findOne({ user: userId });
        const products = await Product.find({ supplier: userId });
        const orders = await Order.find({ supplier: userId }).populate("buyer", "name email");

        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const totalInventory = products.reduce((sum, item) => sum + (item.stock || 0), 0);

        return res.json({
          profile: profile || {},
          metrics: {
            revenue: totalRevenue,
            ordersCount: orders.length,
            productsCount: products.length,
            inventoryCount: totalInventory,
          },
          orders,
          products,
        });
      }
    } else {
      // Memory Store Mode
      if (role === "Buyer") {
        const profile = memoryStore.getBuyerProfile(userId);
        return res.json({
          profile,
          orders: memoryStore.orders.filter((o) => o.buyer === userId),
          wishlist: [
            { _id: "w1", title: "Organic Bamboo Silk", price: 28, category: "Silk" },
            { _id: "w2", title: "Recycled Polyester Weave", price: 14, category: "Synthetic" }
          ],
          recommendations: memoryStore.products,
        });
      } else {
        const profile = memoryStore.getSupplierProfile(userId);
        const products = memoryStore.products;
        const orders = memoryStore.orders;
        return res.json({
          profile,
          metrics: {
            revenue: 42500,
            ordersCount: orders.length,
            productsCount: products.length,
            inventoryCount: 14200,
          },
          orders,
          products,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch dashboard data" });
  }
};

// @desc    Get all public supplier listings
// @route   GET /api/profiles/suppliers
// @access  Public
const getAllSuppliers = async (req, res) => {
  try {
    if (getIsConnected()) {
      const suppliers = await SupplierProfile.find().populate("user", "name email");
      return res.json(suppliers);
    } else {
      return res.json([
        {
          _id: "s1",
          businessName: "Apex Eco-Textiles Co.",
          businessType: "Mill & Weaving Manufacturer",
          address: "Industrial Fabric Park, Zone 4",
          phone: "+1 800-FABRICS",
          categories: ["Cotton", "Silk", "Eco Blend"],
          fabrics: ["Bamboo Cotton", "Tencel Silk"],
          moq: 200,
          user: { name: "Atlas Supplier", email: "supplier@fabricflow.ai" },
        },
        {
          _id: "s2",
          businessName: "Vanguard Silk Mills",
          businessType: "Pure Silk Producer & Converter",
          address: "Silk Industrial Belt, Sector 12",
          phone: "+1 888-[#SILKS]",
          categories: ["Silk", "Satin"],
          fabrics: ["Mulberry Silk", "Raw Silk"],
          moq: 100,
          user: { name: "Vanguard Mills", email: "info@vanguardsilk.com" },
        },
      ]);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch suppliers" });
  }
};

module.exports = {
  saveBuyerProfile,
  saveSupplierProfile,
  getDashboardData,
  getAllSuppliers,
};


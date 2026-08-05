const Product = require("../models/Product");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("supplier", "name email");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("supplier", "name email");
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product details" });
  }
};

// @desc    Create a product (Supplier)
// @route   POST /api/products
// @access  Private (Supplier)
const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, colors, specifications } = req.body;

    const product = new Product({
      title,
      description,
      price,
      stock,
      supplier: req.user._id,
      category,
      colors: colors || ["Natural", "Navy"],
      specifications: specifications || { gsm: 200, weave: "Plain" },
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create product" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
};

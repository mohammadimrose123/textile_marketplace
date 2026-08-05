const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock count is required"],
      default: 0,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: ["Natural", "White", "Navy"],
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        gsm: 180,
        weave: "Plain Weave",
        composition: "100% Organic Cotton",
        width: "58 inches",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);

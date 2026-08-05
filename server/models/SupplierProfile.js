const mongoose = require("mongoose");

const supplierProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      default: "Textile Mill & Manufacturer",
    },
    address: {
      type: String,
      default: "123 Industrial Textile Hub, City",
    },
    phone: {
      type: String,
      default: "+1 800-FABRICS",
    },
    categories: {
      type: [String],
      default: ["Eco-Cotton", "Silk", "Linen", "Wool"],
    },
    fabrics: {
      type: [String],
      default: ["Egyptian Cotton", "Raw Silk", "Bamboo Linen"],
    },
    moq: {
      type: Number,
      default: 250,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupplierProfile", supplierProfileSchema);

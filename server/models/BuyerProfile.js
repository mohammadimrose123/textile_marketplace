const mongoose = require("mongoose");

const buyerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessType: {
      type: String,
      default: "Wholesale Apparel",
    },
    industry: {
      type: String,
      default: "Fashion & Retail",
    },
    preferredCategories: {
      type: [String],
      default: ["Cotton", "Silk", "Denim"],
    },
    preferredFabric: {
      type: [String],
      default: ["Organic Cotton", "Mulberry Silk"],
    },
    budget: {
      type: Number,
      default: 5000,
    },
    moq: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BuyerProfile", buyerProfileSchema);

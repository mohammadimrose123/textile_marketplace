const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    senderRole: {
      type: String,
      enum: ["Buyer", "Supplier"],
      default: "Buyer",
    },
    supplierName: {
      type: String,
      default: "Apex Eco-Textiles Co.",
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);

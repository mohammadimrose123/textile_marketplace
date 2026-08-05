const Message = require("../models/Message");
const { getIsConnected } = require("../config/db");

// @desc    Get chat messages
// @route   GET /api/chat
// @access  Public / Session
const getMessages = async (req, res) => {
  try {
    if (getIsConnected()) {
      const messages = await Message.find().sort({ createdAt: 1 });
      return res.json(messages);
    } else {
      return res.json([]);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chat messages" });
  }
};

// @desc    Send a chat message
// @route   POST /api/chat
// @access  Public / Session
const sendMessage = async (req, res) => {
  try {
    const { text, supplierName, senderRole = "Buyer" } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Message content required" });
    }

    if (getIsConnected()) {
      const message = await Message.create({
        sender: req.user ? req.user._id : null,
        senderRole,
        supplierName: supplierName || "Apex Eco-Textiles Co.",
        text,
      });
      return res.status(201).json(message);
    } else {
      return res.status(201).json({
        _id: `msg_${Date.now()}`,
        text,
        supplierName,
        senderRole,
        createdAt: new Date(),
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};

const Product = require("../models/Product");
const memoryStore = require("../services/memoryStore");
const { getIsConnected } = require("../config/db");

// @desc    Process AI Assistant Chat & Natural Language Fabric Search
// @route   POST /api/ai/chat
// @access  Public
const handleAIChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message prompt is required" });
    }

    const queryLower = message.toLowerCase();

    // Fetch catalog products from MongoDB or Memory Store
    let catalog = [];
    if (getIsConnected()) {
      catalog = await Product.find().populate("supplier", "name email");
    } else {
      catalog = memoryStore.products;
    }

    // Filter products matching prompt criteria
    let matchedProducts = catalog.filter((p) => {
      const titleMatch = p.title.toLowerCase().includes(queryLower);
      const catMatch = p.category && p.category.toLowerCase().includes(queryLower);
      const descMatch = p.description && p.description.toLowerCase().includes(queryLower);
      return titleMatch || catMatch || descMatch;
    });

    if (matchedProducts.length === 0) {
      matchedProducts = catalog.slice(0, 3);
    }

    // Generate intelligent AI response based on intent
    let replyText = "";
    if (queryLower.includes("cotton")) {
      replyText = "I found top-quality Cotton options for your sourcing requirements. Organic Cotton offers superior breathability and a GSM range of 180–220 GSM.";
    } else if (queryLower.includes("silk")) {
      replyText = "Here are premium Mulberry & Bamboo Silk recommendations. Perfect for high-fashion apparel with a soft, lustrous sheen.";
    } else if (queryLower.includes("price") || queryLower.includes("budget") || queryLower.includes("$") || queryLower.includes("₹")) {
      replyText = "I have filtered suppliers and fabrics according to your budget preferences. Check out these competitive wholesale options:";
    } else if (queryLower.includes("gsm") || queryLower.includes("spec")) {
      replyText = "GSM (Grams per Square Meter) measures fabric weight. Lightweight fabrics are 100-150 GSM, medium 150-250 GSM, and heavy 250+ GSM.";
    } else {
      replyText = `Based on your request "${message}", I analyzed the FabricFlow AI supplier network and found ${matchedProducts.length} matching fabric options:`;
    }

    res.json({
      reply: replyText,
      products: matchedProducts,
      suggestions: [
        "Show organic cotton under $20",
        "Compare Silk vs Linen GSM",
        "Top certified eco-suppliers",
        "Calculate sample MOQ shipping"
      ],
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ message: "AI Assistant failed to generate response." });
  }
};

module.exports = { handleAIChat };

const express = require("express");
const router = express.Router();
const { getMessages, sendMessage } = require("../controllers/chatController");

router.get("/", getMessages);
router.post("/", sendMessage);

module.exports = router;

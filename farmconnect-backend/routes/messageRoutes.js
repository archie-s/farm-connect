const express = require("express");
const messageController = require("../controllers/messageController");
const { authenticate } = require("../middleware/auth");
const { validateSendMessage } = require("../middleware/validators");

const router = express.Router();

// Get user messages
router.get("/", authenticate, messageController.getMessages);

// Send message
router.post("/", authenticate, validateSendMessage, messageController.sendMessage);

// Mark message as read
router.patch("/:messageId/read", authenticate, messageController.markAsRead);

module.exports = router;

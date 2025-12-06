const { validationResult } = require("express-validator");
const createError = require("http-errors");
const messageService = require("../services/messageService");
const asyncHandler = require("../utils/asyncHandler");

const getMessages = asyncHandler(async (req, res) => {
  const { conversationWith, orderId } = req.query;
  const messages = await messageService.getMessages(req.user.id, { conversationWith, orderId });

  res.status(200).json({
    success: true,
    data: { messages },
  });
});

const sendMessage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(422, "Validation failed", { errors: errors.array() });
  }

  const message = await messageService.sendMessage(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: { message },
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  await messageService.markAsRead(messageId, req.user.id);

  res.status(200).json({
    success: true,
    message: "Message marked as read",
  });
});

module.exports = {
  getMessages,
  sendMessage,
  markAsRead,
};

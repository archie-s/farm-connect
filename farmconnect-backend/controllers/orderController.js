const { validationResult } = require("express-validator");
const createError = require("http-errors");
const orderService = require("../services/orderService");
const asyncHandler = require("../utils/asyncHandler");

const getUserOrders = asyncHandler(async (req, res) => {
  const { status, role } = req.query;
  const orders = await orderService.getUserOrders(req.user.id, req.user.role, { status, role });

  res.status(200).json({
    success: true,
    data: { orders },
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.getOrderById(orderId, req.user.id);

  res.status(200).json({
    success: true,
    data: { order },
  });
});

const createOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(422, "Validation failed", { errors: errors.array() });
  }

  const order = await orderService.createOrder(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: { order },
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(422, "Validation failed", { errors: errors.array() });
  }

  const { orderId } = req.params;
  const { status } = req.body;
  
  const order = await orderService.updateOrderStatus(orderId, req.user.id, status);

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: { order },
  });
});

module.exports = {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
};

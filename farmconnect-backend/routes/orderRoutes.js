const express = require("express");
const orderController = require("../controllers/orderController");
const { authenticate, authorize } = require("../middleware/auth");
const { validateCreateOrder, validateUpdateOrderStatus } = require("../middleware/validators");

const router = express.Router();

// Get user orders (buyer or seller)
router.get("/", authenticate, orderController.getUserOrders);

// Get order by ID
router.get("/:orderId", authenticate, orderController.getOrderById);

// Create new order (buyers only)
router.post("/", authenticate, authorize("BUYER"), validateCreateOrder, orderController.createOrder);

// Update order status (seller only)
router.patch("/:orderId/status", authenticate, validateUpdateOrderStatus, orderController.updateOrderStatus);

module.exports = router;

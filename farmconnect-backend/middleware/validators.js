const { body } = require("express-validator");

const validateRegistration = [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("phoneNumber").isMobilePhone("any").withMessage("Please enter a valid phone number"),
  body("role").isIn(["FARMER", "BUYER", "MFI", "EXTENSION_OFFICER", "ADMIN"])
    .withMessage("Invalid user role"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateProfileUpdate = [
  body("firstName").optional().notEmpty().withMessage("First name cannot be empty"),
  body("lastName").optional().notEmpty().withMessage("Last name cannot be empty"),
  body("phoneNumber").optional().isMobilePhone("any").withMessage("Please enter a valid phone number"),
  body("location").optional().notEmpty().withMessage("Location cannot be empty"),
  body("profileImageUrl").optional().isURL().withMessage("Please enter a valid image URL"),
];

const validateCreateListing = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("pricePerUnit").isFloat({ min: 0 }).withMessage("Price per unit must be a positive number"),
  body("unitType").notEmpty().withMessage("Unit type is required"),
  body("quantityAvailable").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("location").notEmpty().withMessage("Location is required"),
  body("harvestDate").optional().isISO8601().withMessage("Please enter a valid harvest date"),
  body("expiryDate").optional().isISO8601().withMessage("Please enter a valid expiry date"),
];

const validateUpdateListing = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("description").optional().notEmpty().withMessage("Description cannot be empty"),
  body("pricePerUnit").optional().isFloat({ min: 0 }).withMessage("Price per unit must be a positive number"),
  body("quantityAvailable").optional().isInt({ min: 0 }).withMessage("Quantity must be non-negative"),
  body("status").optional().isIn(["DRAFT", "ACTIVE", "SOLD", "EXPIRED"]).withMessage("Invalid status"),
  body("harvestDate").optional().isISO8601().withMessage("Please enter a valid harvest date"),
  body("expiryDate").optional().isISO8601().withMessage("Please enter a valid expiry date"),
];

const validateCreateOrder = [
  body("listingId").notEmpty().withMessage("Listing ID is required"),
  body("quantityOrdered").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("deliveryAddress").notEmpty().withMessage("Delivery address is required"),
  body("requestedDeliveryDate").optional().isISO8601().withMessage("Please enter a valid delivery date"),
];

const validateUpdateOrderStatus = [
  body("status").isIn(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"])
    .withMessage("Invalid order status"),
];

const validateSendMessage = [
  body("receiverId").notEmpty().withMessage("Receiver ID is required"),
  body("content").notEmpty().withMessage("Message content is required"),
  body("orderId").optional().notEmpty().withMessage("Order ID cannot be empty if provided"),
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateCreateListing,
  validateUpdateListing,
  validateCreateOrder,
  validateUpdateOrderStatus,
  validateSendMessage,
};


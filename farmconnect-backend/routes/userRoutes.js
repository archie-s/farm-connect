const express = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const { validateProfileUpdate } = require("../middleware/validators");

const router = express.Router();

// Get current user profile
router.get("/profile", authenticate, userController.getProfile);

// Update current user profile
router.put("/profile", authenticate, validateProfileUpdate, userController.updateProfile);

// Get user by ID (public profile)
router.get("/:userId", userController.getUserById);

module.exports = router;

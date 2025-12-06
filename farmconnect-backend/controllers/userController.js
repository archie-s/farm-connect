const { validationResult } = require("express-validator");
const createError = require("http-errors");
const userService = require("../services/userService");
const asyncHandler = require("../utils/asyncHandler");

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user.id);
  
  res.status(200).json({
    success: true,
    data: { user },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(422, "Validation failed", { errors: errors.array() });
  }

  const updatedUser = await userService.updateUserProfile(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: { user: updatedUser },
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await userService.getPublicUserProfile(userId);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getUserById,
};

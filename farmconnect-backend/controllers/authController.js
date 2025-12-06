const { validationResult } = require("express-validator");
const createError = require("http-errors");
const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(422, "Validation failed", { errors: errors.array() });
  }

  const { email, password, firstName, lastName, phoneNumber, role, location } = req.body;

  const { user, accessToken, refreshToken } = await authService.registerUser({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role,
    location,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { user, accessToken, refreshToken },
  });
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(422, "Validation failed", { errors: errors.array() });
  }

  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user, accessToken, refreshToken },
  });
});

module.exports = {
  register,
  login,
};


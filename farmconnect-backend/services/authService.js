const bcrypt = require("bcrypt");
const createError = require("http-errors");
const prisma = require("../config/prisma");
const { generateTokens } = require("../utils/jwt");

const registerUser = async (userData) => {
  const { email, password, role } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw createError(409, "User with this email already exists");
  }

  // Hash password
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      role: role || "FARMER", // Default role
    },
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens({ userId: user.id, role: user.role });

  // Omit password from the returned user object
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
};

const loginUser = async (email, password) => {
  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw createError(401, "Invalid email or password");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, "Invalid email or password");
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens({ userId: user.id, role: user.role });

  // Omit password from the returned user object
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
};

module.exports = {
  registerUser,
  loginUser,
};


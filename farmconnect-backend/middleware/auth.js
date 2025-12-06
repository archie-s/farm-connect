const createError = require("http-errors");
const { verifyToken } = require("../utils/jwt");
const prisma = require("../config/prisma");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Access token required");
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      throw createError(401, "Invalid or expired token");
    }

    // Fetch user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw createError(401, "User not found or inactive");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError(403, "Insufficient permissions"));
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};

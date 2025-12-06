const createError = require("http-errors");
const prisma = require("../config/prisma");

const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      role: true,
      profileImageUrl: true,
      location: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw createError(404, "User not found");
  }

  return user;
};

const updateUserProfile = async (userId, updateData) => {
  const { firstName, lastName, phoneNumber, location, profileImageUrl } = updateData;

  // Check if phone number is already taken by another user
  if (phoneNumber) {
    const existingUser = await prisma.user.findFirst({
      where: {
        phoneNumber,
        id: { not: userId },
      },
    });

    if (existingUser) {
      throw createError(409, "Phone number is already in use");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phoneNumber && { phoneNumber }),
      ...(location && { location }),
      ...(profileImageUrl && { profileImageUrl }),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      role: true,
      profileImageUrl: true,
      location: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const getPublicUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
      profileImageUrl: true,
      location: true,
      isVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw createError(404, "User not found");
  }

  return user;
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getPublicUserProfile,
};

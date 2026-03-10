const createError = require("http-errors");
const prisma = require("../config/prisma");

const getListings = async (filters) => {
  const { page, limit, category, location, minPrice, maxPrice, search } = filters;
  
  const skip = (page - 1) * limit;
  
  // Build where clause
  const pricePerUnit = {};
  if (typeof minPrice === "number" && !Number.isNaN(minPrice)) {
    pricePerUnit.gte = minPrice;
  }
  if (typeof maxPrice === "number" && !Number.isNaN(maxPrice)) {
    pricePerUnit.lte = maxPrice;
  }

  const where = {
    status: "ACTIVE", // Only show active listings
    ...(category && { category: { contains: category, mode: "insensitive" } }),
    ...(location && { location: { contains: location, mode: "insensitive" } }),
    ...(Object.keys(pricePerUnit).length > 0 && { pricePerUnit }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [listings, total] = await Promise.all([
    prisma.productListing.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        farmer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            location: true,
            isVerified: true,
          },
        },
      },
    }),
    prisma.productListing.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    listings,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

const getListingById = async (listingId) => {
  const listing = await prisma.productListing.findUnique({
    where: { id: listingId },
    include: {
      farmer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          location: true,
          isVerified: true,
        },
      },
    },
  });

  if (!listing) {
    throw createError(404, "Listing not found");
  }

  return listing;
};

const createListing = async (farmerId, listingData) => {
  const {
    title,
    description,
    category,
    pricePerUnit,
    unitType,
    quantityAvailable,
    location,
    images,
    harvestDate,
    expiryDate,
    qualityCertifications,
  } = listingData;

  const listing = await prisma.productListing.create({
    data: {
      title,
      description,
      category,
      pricePerUnit,
      unitType,
      quantityAvailable,
      location,
      images,
      harvestDate: harvestDate ? new Date(harvestDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      qualityCertifications,
      farmerId,
    },
    include: {
      farmer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          location: true,
          isVerified: true,
        },
      },
    },
  });

  return listing;
};

const updateListing = async (listingId, userId, updateData) => {
  // Check if listing exists and user owns it
  const existingListing = await prisma.productListing.findUnique({
    where: { id: listingId },
  });

  if (!existingListing) {
    throw createError(404, "Listing not found");
  }

  if (existingListing.farmerId !== userId) {
    throw createError(403, "You can only update your own listings");
  }

  const {
    title,
    description,
    pricePerUnit,
    quantityAvailable,
    status,
    images,
    harvestDate,
    expiryDate,
    qualityCertifications,
  } = updateData;

  const listing = await prisma.productListing.update({
    where: { id: listingId },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(pricePerUnit && { pricePerUnit }),
      ...(quantityAvailable !== undefined && { quantityAvailable }),
      ...(status && { status }),
      ...(images && { images }),
      ...(harvestDate && { harvestDate: new Date(harvestDate) }),
      ...(expiryDate && { expiryDate: new Date(expiryDate) }),
      ...(qualityCertifications && { qualityCertifications }),
    },
    include: {
      farmer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          location: true,
          isVerified: true,
        },
      },
    },
  });

  return listing;
};

const deleteListing = async (listingId, userId) => {
  // Check if listing exists and user owns it
  const existingListing = await prisma.productListing.findUnique({
    where: { id: listingId },
  });

  if (!existingListing) {
    throw createError(404, "Listing not found");
  }

  if (existingListing.farmerId !== userId) {
    throw createError(403, "You can only delete your own listings");
  }

  await prisma.productListing.delete({
    where: { id: listingId },
  });
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
};

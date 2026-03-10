const { validationResult } = require("express-validator");
const createError = require("http-errors");
const listingService = require("../services/listingService");
const asyncHandler = require("../utils/asyncHandler");

const getListings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, location, minPrice, maxPrice, search } = req.query;
  const parsedMinPrice = minPrice !== undefined ? Number(minPrice) : undefined;
  const parsedMaxPrice = maxPrice !== undefined ? Number(maxPrice) : undefined;
  
  const filters = {
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 100), // Max 100 items per page
    category,
    location,
    minPrice: Number.isNaN(parsedMinPrice) ? undefined : parsedMinPrice,
    maxPrice: Number.isNaN(parsedMaxPrice) ? undefined : parsedMaxPrice,
    search,
  };

  const result = await listingService.getListings(filters);

  res.status(200).json({
    success: true,
    data: result,
  });
});

const getListingById = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  const listing = await listingService.getListingById(listingId);

  res.status(200).json({
    success: true,
    data: { listing },
  });
});

const createListing = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(422, "Validation failed", { errors: errors.array() });
  }

  const listing = await listingService.createListing(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Listing created successfully",
    data: { listing },
  });
});

const updateListing = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(422, "Validation failed", { errors: errors.array() });
  }

  const { listingId } = req.params;
  const listing = await listingService.updateListing(listingId, req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: "Listing updated successfully",
    data: { listing },
  });
});

const deleteListing = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  await listingService.deleteListing(listingId, req.user.id);

  res.status(200).json({
    success: true,
    message: "Listing deleted successfully",
  });
});

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
};

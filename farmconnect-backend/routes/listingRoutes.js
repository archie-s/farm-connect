const express = require("express");
const listingController = require("../controllers/listingController");
const { authenticate, authorize } = require("../middleware/auth");
const { validateCreateListing, validateUpdateListing } = require("../middleware/validators");

const router = express.Router();

// Get all listings (public)
router.get("/", listingController.getListings);

// Get listing by ID (public)
router.get("/:listingId", listingController.getListingById);

// Create new listing (farmers only)
router.post("/", authenticate, authorize("FARMER"), validateCreateListing, listingController.createListing);

// Update listing (owner only)
router.put("/:listingId", authenticate, validateUpdateListing, listingController.updateListing);

// Delete listing (owner only)
router.delete("/:listingId", authenticate, listingController.deleteListing);

module.exports = router;

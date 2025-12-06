const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const listingRoutes = require("./listingRoutes");
const orderRoutes = require("./orderRoutes");
const messageRoutes = require("./messageRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/listings", listingRoutes);
router.use("/orders", orderRoutes);
router.use("/messages", messageRoutes);

module.exports = router;
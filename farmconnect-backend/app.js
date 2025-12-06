const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const createError = require("http-errors");
const apiRouter = require("./routes");

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/v1", apiRouter);

// Health Check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: require("./package.json").version,
  });
});

// Error Handling
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message,
    errors: err.errors || [],
  });
});

module.exports = app;
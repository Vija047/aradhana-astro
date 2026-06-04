import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.js";
import { logger } from "./utils/logger.js";

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

// Simple request logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Mount chat routers under /api
app.use("/api", chatRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Fallback 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Resource not found" });
});

// Global production-grade error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Global error handler caught: ${err.message}`, err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error"
    }
  });
});

export default app;

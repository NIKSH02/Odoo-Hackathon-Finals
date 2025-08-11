import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import ApiError from "./utils/ApiError.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import venueRoutes from "./routes/venue.js";
import courtRoutes from "./routes/court.js";
import bookingRoutes from "./routes/booking.js";
import reviewRoutes from "./routes/review.js";
import dashboardRoutes from "./routes/dashboard.js";
import searchRoutes from "./routes/search.js";
import cookieParser from "cookie-parser";
import path from "path";

// Load environment variables
dotenv.config();
// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174", // add any other frontend URLs you use
    ],
    credentials: true, // if you use cookies/sessions
  })
);

app.use(cookieParser());

// Helper: Log static file serving for debug
console.log("Serving static files from:", path.resolve("uploads"));
app.use("/uploads", express.static("uploads"));

// Add debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/search", searchRoutes);

// 404 Route Not Found handler
app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err); // Add this line for debugging
  const statusCode = err.statusCode || 500;
  res
    .status(statusCode)
    .json(
      new ApiError(
        statusCode,
        err.message || "Internal Server Error",
        err.errors || []
      )
    );
});
// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

export default app;

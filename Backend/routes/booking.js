import express from "express";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  updatePaymentStatus,
  getVenueBookings,
  getBookingAnalytics,
  markBookingCompleted,
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  requirePlayer,
  requireFacilityOwner,
  requireAnyRole,
  requireBookingAccess,
  requireOwnership,
} from "../middlewares/roleMiddleware.js";
import Venue from "../models/venue.js";

const router = express.Router();

// ================================
// PLAYER ONLY ROUTES
// ================================
// Create new booking (players only)
router.post("/", protect, requirePlayer, createBooking);

// Get user's own bookings (players only)
router.get("/my-bookings", protect, requirePlayer, getUserBookings);

// Cancel own booking (players only)
router.patch("/:bookingId/cancel", protect, requirePlayer, cancelBooking);

// Update payment status (players only)
router.patch(
  "/:bookingId/payment",
  protect,
  requirePlayer,
  updatePaymentStatus
);

// ================================
// BOTH PLAYER & FACILITY OWNER ROUTES
// ================================
// Get booking details (booker or venue owner can access)
router.get(
  "/:bookingId",
  protect,
  requireAnyRole,
  requireBookingAccess,
  getBookingById
);

// Mark booking as completed (booker or venue owner can mark)
router.patch(
  "/:bookingId/complete",
  protect,
  requireAnyRole,
  requireBookingAccess,
  markBookingCompleted
);

// ================================
// FACILITY OWNER ONLY ROUTES
// ================================
// Get all bookings for a venue (facility owners only)
router.get(
  "/venue/:venueId",
  protect,
  requireFacilityOwner,
  requireOwnership(Venue),
  getVenueBookings
);

// Get booking analytics for a venue (facility owners only)
router.get(
  "/venue/:venueId/analytics",
  protect,
  requireFacilityOwner,
  requireOwnership(Venue),
  getBookingAnalytics
);

export default router;

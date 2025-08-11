import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Middleware to check if user has required role(s)
export const requireRole = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Required role: ${roles.join(" or ")}`
      );
    }

    next();
  });
};

// Specific role middlewares for cleaner route definitions
export const requirePlayer = requireRole("player");
export const requireFacilityOwner = requireRole("facility_owner");
export const requireAnyRole = requireRole("player", "facility_owner");

// Middleware to check resource ownership (for facility owners)
export const requireOwnership = (resourceModel, ownerField = "owner") => {
  return asyncHandler(async (req, res, next) => {
    const resourceId =
      req.params.venueId || req.params.courtId || req.params.id;

    if (!resourceId) {
      throw new ApiError(400, "Resource ID is required");
    }

    const resource = await resourceModel.findById(resourceId);

    if (!resource) {
      throw new ApiError(404, "Resource not found");
    }

    // Check if user owns the resource
    if (resource[ownerField].toString() !== req.user.id) {
      throw new ApiError(403, "You can only access your own resources");
    }

    // Attach resource to request for further use
    req.resource = resource;
    next();
  });
};

// Middleware to check if user can access booking (owner or booker)
export const requireBookingAccess = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;

  const Booking = (await import("../models/booking.js")).default;
  const Venue = (await import("../models/venue.js")).default;

  const booking = await Booking.findById(bookingId).populate("venue");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Check if user is the booker or venue owner
  const isBooker = booking.user.toString() === req.user.id;
  const isVenueOwner = booking.venue.owner.toString() === req.user.id;

  if (!isBooker && !isVenueOwner) {
    throw new ApiError(403, "Access denied");
  }

  req.booking = booking;
  next();
});

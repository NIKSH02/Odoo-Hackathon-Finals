import Court from "../models/court.js";
import Venue from "../models/venue.js";
import Booking from "../models/booking.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get courts by venue
const getCourtsByVenue = asyncHandler(async (req, res) => {
  const { venueId } = req.params;
  const { sportType, isActive = true } = req.query;

  const filter = { venue: venueId };

  if (sportType) {
    filter.sportType = sportType;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const courts = await Court.find(filter)
    .populate("venue", "name address operatingHours")
    .sort({ name: 1 })
    .select("-__v");

  res
    .status(200)
    .json(new ApiResponse(200, courts, "Courts fetched successfully"));
});

// Get court by ID
const getCourtById = asyncHandler(async (req, res) => {
  const { courtId } = req.params;

  const court = await Court.findById(courtId)
    .populate("venue", "name address operatingHours owner")
    .select("-__v");

  if (!court) {
    throw new ApiError(404, "Court not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, court, "Court details fetched successfully"));
});

// Create new court (Facility Owner only)
const createCourt = asyncHandler(async (req, res) => {
  const {
    name,
    venue,
    sportType,
    pricePerHour,
    capacity,
    dimensions,
    features,
    equipment,
    operatingHours,
  } = req.body;

  // Check if user is facility owner
  if (req.user.role !== "facility_owner") {
    throw new ApiError(403, "Only facility owners can create courts");
  }

  // Check if venue exists and belongs to the user
  const venueDoc = await Venue.findById(venue);
  if (!venueDoc) {
    throw new ApiError(404, "Venue not found");
  }

  if (venueDoc.owner.toString() !== req.user.id) {
    throw new ApiError(403, "You can only create courts for your own venues");
  }

  // Check if sport type is supported by the venue
  if (!venueDoc.sportsSupported.includes(sportType)) {
    throw new ApiError(400, "This sport type is not supported by the venue");
  }

  const court = new Court({
    name,
    venue,
    sportType,
    pricePerHour,
    capacity,
    dimensions,
    features: features || [],
    equipment: equipment || [],
    operatingHours,
  });

  await court.save();

  // Update venue's starting price if this court has lower price
  if (pricePerHour < venueDoc.startingPrice) {
    await Venue.findByIdAndUpdate(venue, { startingPrice: pricePerHour });
  }

  await court.populate("venue", "name address");

  res
    .status(201)
    .json(new ApiResponse(201, court, "Court created successfully"));
});

// Update court (Owner only)
const updateCourt = asyncHandler(async (req, res) => {
  const { courtId } = req.params;
  const updateData = req.body;

  const court = await Court.findById(courtId).populate("venue");

  if (!court) {
    throw new ApiError(404, "Court not found");
  }

  // Check if user is the venue owner
  if (court.venue.owner.toString() !== req.user.id) {
    throw new ApiError(403, "You can only update courts in your own venues");
  }

  // If sport type is being changed, check if it's supported by venue
  if (
    updateData.sportType &&
    !court.venue.sportsSupported.includes(updateData.sportType)
  ) {
    throw new ApiError(400, "This sport type is not supported by the venue");
  }

  const updatedCourt = await Court.findByIdAndUpdate(courtId, updateData, {
    new: true,
    runValidators: true,
  }).populate("venue", "name address");

  // Update venue's starting price if needed
  if (updateData.pricePerHour) {
    const allCourts = await Court.find({
      venue: court.venue._id,
      isActive: true,
    });
    const minPrice = Math.min(...allCourts.map((c) => c.pricePerHour));
    await Venue.findByIdAndUpdate(court.venue._id, { startingPrice: minPrice });
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedCourt, "Court updated successfully"));
});

// Delete court (Owner only)
const deleteCourt = asyncHandler(async (req, res) => {
  const { courtId } = req.params;

  const court = await Court.findById(courtId).populate("venue");

  if (!court) {
    throw new ApiError(404, "Court not found");
  }

  if (court.venue.owner.toString() !== req.user.id) {
    throw new ApiError(403, "You can only delete courts in your own venues");
  }

  // Check for future bookings
  const futureBookings = await Booking.countDocuments({
    court: courtId,
    bookingDate: { $gte: new Date() },
    status: { $in: ["pending", "confirmed"] },
  });

  if (futureBookings > 0) {
    throw new ApiError(400, "Cannot delete court with future bookings");
  }

  await Court.findByIdAndDelete(courtId);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Court deleted successfully"));
});

// Get courts by owner
const getOwnerCourts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, venueId, sportType, isActive } = req.query;

  if (req.user.role !== "facility_owner") {
    throw new ApiError(403, "Only facility owners can access this endpoint");
  }

  const skip = (page - 1) * limit;

  // First get venues owned by the user
  const ownedVenues = await Venue.find({ owner: req.user.id }).select("_id");
  const venueIds = ownedVenues.map((v) => v._id);

  const filter = { venue: { $in: venueIds } };

  if (venueId) {
    filter.venue = venueId;
  }

  if (sportType) {
    filter.sportType = sportType;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const courts = await Court.find(filter)
    .populate("venue", "name address")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .select("-__v");

  const total = await Court.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        courts,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          totalCourts: total,
        },
      },
      "Owner courts fetched successfully"
    )
  );
});

// Toggle court active status
const toggleCourtStatus = asyncHandler(async (req, res) => {
  const { courtId } = req.params;

  const court = await Court.findById(courtId).populate("venue");

  if (!court) {
    throw new ApiError(404, "Court not found");
  }

  if (court.venue.owner.toString() !== req.user.id) {
    throw new ApiError(403, "You can only modify courts in your own venues");
  }

  court.isActive = !court.isActive;
  await court.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        court,
        `Court ${court.isActive ? "activated" : "deactivated"} successfully`
      )
    );
});

// Add blocked slot for maintenance
const addBlockedSlot = asyncHandler(async (req, res) => {
  const { courtId } = req.params;
  const { date, startTime, endTime, reason, type } = req.body;

  const court = await Court.findById(courtId).populate("venue");

  if (!court) {
    throw new ApiError(404, "Court not found");
  }

  if (court.venue.owner.toString() !== req.user.id) {
    throw new ApiError(403, "You can only block slots for your own courts");
  }

  // Check for existing bookings in this time slot
  const existingBookings = await Booking.countDocuments({
    court: courtId,
    bookingDate: new Date(date),
    status: { $in: ["pending", "confirmed"] },
    $or: [
      {
        "timeSlot.startTime": { $lt: endTime },
        "timeSlot.endTime": { $gt: startTime },
      },
    ],
  });

  if (existingBookings > 0) {
    throw new ApiError(400, "Cannot block slot with existing bookings");
  }

  court.blockedSlots.push({
    date: new Date(date),
    startTime,
    endTime,
    reason,
    type: type || "maintenance",
  });

  await court.save();

  res
    .status(200)
    .json(new ApiResponse(200, court, "Slot blocked successfully"));
});

// Remove blocked slot
const removeBlockedSlot = asyncHandler(async (req, res) => {
  const { courtId, slotId } = req.params;

  const court = await Court.findById(courtId).populate("venue");

  if (!court) {
    throw new ApiError(404, "Court not found");
  }

  if (court.venue.owner.toString() !== req.user.id) {
    throw new ApiError(403, "You can only modify your own courts");
  }

  court.blockedSlots.id(slotId).remove();
  await court.save();

  res
    .status(200)
    .json(new ApiResponse(200, court, "Blocked slot removed successfully"));
});

// Check court availability for a specific date and time
const checkCourtAvailability = asyncHandler(async (req, res) => {
  const { courtId } = req.params;
  const { date, startTime, endTime } = req.query;

  if (!date || !startTime || !endTime) {
    throw new ApiError(400, "Date, start time, and end time are required");
  }

  const court = await Court.findById(courtId);
  if (!court) {
    throw new ApiError(404, "Court not found");
  }

  const bookingDate = new Date(date);
  const dayOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ][bookingDate.getDay()];

  // Check if court is available on this day
  if (!court.operatingHours[dayOfWeek].isAvailable) {
    return res.status(200).json(
      new ApiResponse(200, {
        available: false,
        reason: "Court is not available on this day",
      })
    );
  }

  // Check operating hours
  const courtStart = court.operatingHours[dayOfWeek].start;
  const courtEnd = court.operatingHours[dayOfWeek].end;

  if (startTime < courtStart || endTime > courtEnd) {
    return res.status(200).json(
      new ApiResponse(200, {
        available: false,
        reason: `Court operates from ${courtStart} to ${courtEnd}`,
      })
    );
  }

  // Check for blocked slots
  const blockedSlot = court.blockedSlots.find(
    (slot) =>
      slot.date.toDateString() === bookingDate.toDateString() &&
      ((startTime >= slot.startTime && startTime < slot.endTime) ||
        (endTime > slot.startTime && endTime <= slot.endTime) ||
        (startTime <= slot.startTime && endTime >= slot.endTime))
  );

  if (blockedSlot) {
    return res.status(200).json(
      new ApiResponse(200, {
        available: false,
        reason: `Court is blocked for ${blockedSlot.reason}`,
      })
    );
  }

  // Check for existing bookings
  const existingBooking = await Booking.findOne({
    court: courtId,
    bookingDate,
    status: { $in: ["pending", "confirmed"] },
    $or: [
      {
        "timeSlot.startTime": { $lt: endTime },
        "timeSlot.endTime": { $gt: startTime },
      },
    ],
  });

  if (existingBooking) {
    return res.status(200).json(
      new ApiResponse(200, {
        available: false,
        reason: "Court is already booked for this time slot",
      })
    );
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        available: true,
        pricePerHour: court.pricePerHour,
      },
      "Court is available"
    )
  );
});

export {
  getCourtsByVenue,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
  getOwnerCourts,
  toggleCourtStatus,
  addBlockedSlot,
  removeBlockedSlot,
  checkCourtAvailability,
};

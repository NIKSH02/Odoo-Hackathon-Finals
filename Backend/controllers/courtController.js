import Court from "../models/court.js";
import Venue from "../models/venue.js";
import Booking from "../models/booking.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

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
    customName,
  } = req.body;

  console.log("Creating court with data:", req.body); // Debug log

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

  // Get the next court number for this sport type
  const lastCourt = await Court.findOne({
    venue,
    sportType,
  }).sort({ courtNumber: -1 });

  const courtNumber = lastCourt ? lastCourt.courtNumber + 1 : 1;
  const courtName =
    customName ||
    name ||
    `${
      sportType.charAt(0).toUpperCase() + sportType.slice(1)
    } Court ${courtNumber}`;

  const court = new Court({
    name: courtName,
    courtNumber,
    venue,
    sportType,
    pricePerHour,
    capacity,
    dimensions: dimensions || { length: 0, width: 0, unit: "meters" },
    features: features || [],
    equipment: equipment || [],
    operatingHours: operatingHours || {
      monday: { start: "06:00", end: "22:00", isAvailable: true },
      tuesday: { start: "06:00", end: "22:00", isAvailable: true },
      wednesday: { start: "06:00", end: "22:00", isAvailable: true },
      thursday: { start: "06:00", end: "22:00", isAvailable: true },
      friday: { start: "06:00", end: "22:00", isAvailable: true },
      saturday: { start: "06:00", end: "22:00", isAvailable: true },
      sunday: { start: "06:00", end: "22:00", isAvailable: true },
    },
  });

  await court.save();

  // Update venue's starting price if this court has lower price
  if (pricePerHour < venueDoc.startingPrice) {
    await Venue.findByIdAndUpdate(venue, { startingPrice: pricePerHour });
  }

  await court.populate("venue", "name address");

  console.log("Court created successfully:", court._id); // Debug log

  res
    .status(201)
    .json(new ApiResponse(201, court, "Court created successfully"));
});

// Create multiple courts for a sport type (Facility Owner only)
const createBulkCourts = asyncHandler(async (req, res) => {
  const {
    venue,
    sportType,
    count,
    pricePerHour,
    capacity,
    dimensions,
    features,
    equipment,
    operatingHours,
  } = req.body;

  // Validation
  if (!count || count < 1 || count > 20) {
    throw new ApiError(400, "Count must be between 1 and 20");
  }

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

  // Get the highest court number for this sport type in this venue
  const lastCourt = await Court.findOne({
    venue,
    sportType,
  }).sort({ courtNumber: -1 });

  const startingNumber = lastCourt ? lastCourt.courtNumber + 1 : 1;

  // Create courts in bulk
  const courtsToCreate = [];
  for (let i = 0; i < count; i++) {
    const courtNumber = startingNumber + i;
    courtsToCreate.push({
      name: `${
        sportType.charAt(0).toUpperCase() + sportType.slice(1)
      } Court ${courtNumber}`,
      courtNumber,
      venue,
      sportType,
      pricePerHour,
      capacity,
      dimensions,
      features: features || [],
      equipment: equipment || [],
      operatingHours,
    });
  }

  const createdCourts = await Court.insertMany(courtsToCreate);

  // Update venue's starting price if this court has lower price
  if (pricePerHour < venueDoc.startingPrice) {
    await Venue.findByIdAndUpdate(venue, { startingPrice: pricePerHour });
  }

  // Populate venue details for response
  await Court.populate(createdCourts, {
    path: "venue",
    select: "name address",
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        courts: createdCourts,
        count: createdCourts.length,
        sportType,
        startingCourtNumber: startingNumber,
      },
      `${createdCourts.length} ${sportType} courts created successfully`
    )
  );
});

// Get court availability by sport type with real-time booking status
const getCourtAvailabilityBySport = asyncHandler(async (req, res) => {
  const { venueId } = req.params;
  const { sportType, date, startTime, endTime } = req.query;

  if (!sportType || !date || !startTime || !endTime) {
    throw new ApiError(
      400,
      "Sport type, date, start time, and end time are required"
    );
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

  // Get all courts of the specified sport type, sorted by court number
  const allCourts = await Court.find({
    venue: venueId,
    sportType,
    isActive: true,
  }).sort({ courtNumber: 1 });

  if (allCourts.length === 0) {
    throw new ApiError(404, `No ${sportType} courts found at this venue`);
  }

  // Check availability for each court
  const courtStatus = [];

  for (const court of allCourts) {
    let status = "available";
    let bookedBy = null;
    let bookingDetails = null;
    let reason = null;

    // Check operating hours
    const courtHours = court.operatingHours[dayOfWeek];
    if (
      !courtHours.isAvailable ||
      startTime < courtHours.start ||
      endTime > courtHours.end
    ) {
      status = "unavailable";
      reason = `Court operates from ${courtHours.start} to ${courtHours.end}`;
    } else {
      // Check for blocked slots
      const blockedSlot = court.blockedSlots.find(
        (slot) =>
          slot.date.toDateString() === bookingDate.toDateString() &&
          ((startTime >= slot.startTime && startTime < slot.endTime) ||
            (endTime > slot.startTime && endTime <= slot.endTime) ||
            (startTime <= slot.startTime && endTime >= slot.endTime))
      );

      if (blockedSlot) {
        status = "blocked";
        reason = `Blocked for ${blockedSlot.reason}`;
      } else {
        // Check for existing bookings
        const existingBooking = await Booking.findOne({
          court: court._id,
          bookingDate,
          status: { $in: ["pending", "confirmed"] },
          $or: [
            {
              "timeSlot.startTime": { $lt: endTime },
              "timeSlot.endTime": { $gt: startTime },
            },
          ],
        }).populate("user", "fullName profilePicture");

        if (existingBooking) {
          status = "booked";
          bookedBy = existingBooking.user;
          bookingDetails = {
            bookingId: existingBooking._id,
            timeSlot: existingBooking.timeSlot,
            bookingDate: existingBooking.bookingDate,
            totalAmount: existingBooking.totalAmount,
            status: existingBooking.status,
          };
        }
      }
    }

    courtStatus.push({
      court: {
        _id: court._id,
        name: court.name,
        courtNumber: court.courtNumber,
        pricePerHour: court.pricePerHour,
        capacity: court.capacity,
        features: court.features,
        equipment: court.equipment,
      },
      status, // "available", "booked", "blocked", "unavailable"
      bookedBy,
      bookingDetails,
      reason,
    });
  }

  // Count different statuses
  const statusCounts = {
    total: courtStatus.length,
    available: courtStatus.filter((c) => c.status === "available").length,
    booked: courtStatus.filter((c) => c.status === "booked").length,
    blocked: courtStatus.filter((c) => c.status === "blocked").length,
    unavailable: courtStatus.filter((c) => c.status === "unavailable").length,
  };

  res.status(200).json(
    new ApiResponse(
      200,
      {
        sportType,
        venue: venueId,
        requestedDateTime: {
          date,
          startTime,
          endTime,
        },
        statusCounts,
        courts: courtStatus,
      },
      `Found ${statusCounts.total} ${sportType} courts (${statusCounts.available} available, ${statusCounts.booked} booked)`
    )
  );
});

// Update court (Owner only)
const updateCourt = asyncHandler(async (req, res) => {
  const { courtId } = req.params;
  const updateData = req.body;

  console.log("Updating court:", courtId, "with data:", updateData); // Debug log

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

  console.log("Court updated successfully:", updatedCourt._id); // Debug log

  res
    .status(200)
    .json(new ApiResponse(200, updatedCourt, "Court updated successfully"));
});

// Delete court (Owner only)
const deleteCourt = asyncHandler(async (req, res) => {
  const { courtId } = req.params;

  console.log("Deleting court:", courtId); // Debug log

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

  console.log("Court deleted successfully:", courtId); // Debug log

  res
    .status(200)
    .json(new ApiResponse(200, null, "Court deleted successfully"));
});

// Get courts by owner
const getOwnerCourts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, venueId, sportType, isActive } = req.query;

  // Validate user and role
  if (!req.user || !req.user.id) {
    throw new ApiError(401, "User not authenticated");
  }

  if (req.user.role !== "facility_owner") {
    throw new ApiError(403, "Only facility owners can access this endpoint");
  }

  console.log("Getting courts for owner:", req.user.id); // Debug log

  const skip = (page - 1) * limit;

  try {
    // First get venues owned by the user
    const ownedVenues = await Venue.find({ owner: req.user.id }).select("_id");
    const venueIds = ownedVenues.map((v) => v._id);

    console.log("Owned venues:", venueIds); // Debug log

    if (venueIds.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No venues found for this owner"));
    }

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

    console.log("Court filter:", filter); // Debug log

    const courts = await Court.find(filter)
      .populate("venue", "name address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("-__v");

    console.log("Found courts:", courts.length); // Debug log

    const total = await Court.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(
        200,
        courts, // Return courts directly instead of nested object
        "Owner courts fetched successfully"
      )
    );
  } catch (error) {
    console.error("Error in getOwnerCourts:", error);
    throw new ApiError(500, "Failed to fetch owner courts");
  }
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

// Get all sports with court counts for a venue
const getSportsWithCourtCounts = asyncHandler(async (req, res) => {
  const { venueId } = req.params;

  const venue = await Venue.findById(venueId);
  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }

  const sportCounts = await Court.aggregate([
    {
      $match: {
        venue: new mongoose.Types.ObjectId(venueId),
        isActive: true,
      },
    },
    {
      $group: {
        _id: "$sportType",
        totalCourts: { $sum: 1 },
        averagePrice: { $avg: "$pricePerHour" },
        minPrice: { $min: "$pricePerHour" },
        maxPrice: { $max: "$pricePerHour" },
        courtNumbers: { $push: "$courtNumber" },
        courts: {
          $push: {
            _id: "$_id",
            name: "$name",
            courtNumber: "$courtNumber",
            pricePerHour: "$pricePerHour",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        venue: {
          _id: venue._id,
          name: venue.name,
          sportsSupported: venue.sportsSupported,
        },
        sports: sportCounts,
      },
      "Sports and court counts fetched successfully"
    )
  );
});

// Book a specific court
const bookCourt = asyncHandler(async (req, res) => {
  const { courtId } = req.params;
  const { date, startTime, endTime, paymentMethod = "cash" } = req.body;

  if (!date || !startTime || !endTime) {
    throw new ApiError(400, "Date, start time, and end time are required");
  }

  // Check if court exists and is available
  const court = await Court.findById(courtId).populate("venue");
  if (!court) {
    throw new ApiError(404, "Court not found");
  }

  const bookingDate = new Date(date);

  // Check if the time slot is available
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
    throw new ApiError(400, "Court is already booked for this time slot");
  }

  // Calculate duration and total amount
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const durationHours = (end - start) / (1000 * 60 * 60);
  const totalAmount = durationHours * court.pricePerHour;

  // Create booking
  const booking = new Booking({
    user: req.user.id,
    venue: court.venue._id,
    court: courtId,
    bookingDate,
    timeSlot: {
      startTime,
      endTime,
    },
    duration: durationHours,
    pricePerHour: court.pricePerHour,
    totalAmount,
    paymentMethod,
    status: "pending", // Will be confirmed after payment
  });

  await booking.save();
  await booking.populate("court venue user", "name fullName");

  res
    .status(201)
    .json(new ApiResponse(201, booking, "Court booked successfully"));
});

export {
  getCourtsByVenue,
  getCourtById,
  createCourt,
  createBulkCourts,
  updateCourt,
  deleteCourt,
  getOwnerCourts,
  toggleCourtStatus,
  addBlockedSlot,
  removeBlockedSlot,
  checkCourtAvailability,
  getCourtAvailabilityBySport,
  getSportsWithCourtCounts,
  bookCourt,
};

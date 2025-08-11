import express from "express";
import {
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
} from "../controllers/courtController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/venue/:venueId", getCourtsByVenue);
router.get("/:courtId", getCourtById);
router.get("/:courtId/availability", checkCourtAvailability);

// Protected routes (require authentication)
// Facility Owner routes
router.post("/", protect, createCourt);
router.put("/:courtId", protect, updateCourt);
router.delete("/:courtId", protect, deleteCourt);
router.get("/owner/my-courts", protect, getOwnerCourts);
router.patch("/:courtId/toggle-status", protect, toggleCourtStatus);

// Blocked slots management
router.post("/:courtId/blocked-slots", protect, addBlockedSlot);
router.delete("/:courtId/blocked-slots/:slotId", protect, removeBlockedSlot);

export default router;

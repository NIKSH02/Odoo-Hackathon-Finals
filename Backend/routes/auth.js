import express from "express";
import {
  signup,
  signin,
  sendOtp,
  loginWithOtp,
  refreshToken,
  logout,
  verifyOtp,
  googleAuth,
} from "../controllers/authController.js";
import upload from "../middlewares/uploadMiddleware.js";
import handleUploadError from "../middlewares/uploadErrorHandler.js";

const router = express.Router();

// Verify OTP (only needs email and otp)
router.post("/verify-otp", verifyOtp);
// Signup (register) - with optional profile picture upload
router.post(
  "/signup",
  upload.single("profilePicture"),
  handleUploadError,
  signup
);
// Signin (login with password)
router.post("/signin", signin);
// Send OTP for login/signup
router.post("/send-otp", sendOtp);
// Login with OTP
router.post("/login-otp", loginWithOtp);
// Google OAuth
router.post("/google-auth", googleAuth);
// Refresh JWT token
router.post("/refresh-token", refreshToken);
// Logout (signout)
router.post("/logout", logout);

export default router;

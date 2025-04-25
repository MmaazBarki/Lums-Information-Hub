import express from "express"
import { login, logout, signup, updateProfile, updatePassword, checkAuth, verifySignupOTP, resendSignupOTP, requestVerificationEmail, completeUserVerification } from "../controllers/auth.controllers.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

// Signup and verification
router.post("/signup", signup)
router.post("/verify-signup-otp", verifySignupOTP)
router.post("/resend-signup-otp", resendSignupOTP)

// Complete verification for users who didn't verify during signup
router.post("/request-verification", requestVerificationEmail)
router.post("/complete-verification", completeUserVerification)

// Standard auth routes
router.post("/login", login)
router.post("/logout", logout)

// Protected routes
router.put("/update-profile", protectRoute, updateProfile)
router.put("/update-password", protectRoute, updatePassword)
router.get("/check", protectRoute, checkAuth)

export default router;
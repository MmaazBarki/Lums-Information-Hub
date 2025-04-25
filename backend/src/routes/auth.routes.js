import express from "express"
import { login, logout, signup, updateProfile, updatePassword, checkAuth, verifySignupOTP, resendSignupOTP, requestVerificationEmail, completeUserVerification } from "../controllers/auth.controllers.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/verify-signup-otp", verifySignupOTP)
router.post("/resend-signup-otp", resendSignupOTP)

router.post("/request-verification", requestVerificationEmail)
router.post("/complete-verification", completeUserVerification)

router.post("/login", login)
router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateProfile)
router.put("/update-password", protectRoute, updatePassword)
router.get("/check", protectRoute, checkAuth)

export default router;
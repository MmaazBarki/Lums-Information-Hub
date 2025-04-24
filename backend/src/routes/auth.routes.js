import express from "express"
import { login, logout, signup, updateProfile, updatePassword, checkAuth } from "../controllers/auth.controllers.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import UserOTPVerification from "../models/userOtpVerification.models.js";


const router = express.Router()

// const UserOTPVerification = require("./../models/userOTPVerification");
// const UserOTPVerification = require("../models/userOtpVerification.models");

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateProfile)

router.put("/update-password", protectRoute, updatePassword)

router.get("/check", protectRoute, checkAuth)

export default router;
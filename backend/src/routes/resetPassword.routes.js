import express from "express";
import { sendResetOTP, } from "../controllers/resetPassword.controllers.js";
import { sendPasswordResetOTP, verifyPasswordResetOTP } from "../controllers/otp.controllers.js";

const router = express.Router();

router.post("/send-otp", sendResetOTP);
router.post("/request-password-reset", sendPasswordResetOTP);
router.post("/verify-password-reset", verifyPasswordResetOTP);


export default router;

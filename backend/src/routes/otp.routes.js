import express from "express";
import {
  sendPasswordResetOTP,
  verifyPasswordResetOTP
} from "../controllers/otp.controllers.js";

const router = express.Router();

router.post("/request-password-reset", sendPasswordResetOTP);
router.post("/verify-password-reset", verifyPasswordResetOTP);

export default router;

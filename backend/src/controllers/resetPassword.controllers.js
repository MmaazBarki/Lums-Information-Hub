import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import UserOTPVerification from "../models/userOTPVerification.models.js"; // Corrected casing
// import sendOTPVerificationEmail from "../lib/sendOTPVerification.js"; // use your email sender
import { sendOTPVerificationEmail } from "../lib/sendOTPVerification.js";


export const sendResetOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        await UserOTPVerification.deleteMany({ userID: user._id });

        await sendOTPVerificationEmail({ _id: user._id, email: user.email }, res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


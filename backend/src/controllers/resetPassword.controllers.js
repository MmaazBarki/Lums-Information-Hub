import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import UserOTPVerification from "../models/userOtpVerification.models.js";
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

// export const resetPasswordWithOTP = async (req, res) => {
//     try {
//         const { userId, otp, newPassword } = req.body;

//         if (!userId || !otp || !newPassword) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const otpRecord = await UserOTPVerification.findOne({ userID: userId });
//         if (!otpRecord) {
//             return res.status(400).json({ message: "Invalid or expired OTP" });
//         }

//         if (otpRecord.expiredAt < Date.now()) {
//             await UserOTPVerification.deleteMany({ userID: userId });
//             return res.status(400).json({ message: "OTP has expired" });
//         }

//         const isMatch = await bcrypt.compare(otp, otpRecord.otp);
//         if (!isMatch) return res.status(400).json({ message: "Incorrect OTP" });

//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         await User.findByIdAndUpdate(userId, { password: hashedPassword });
//         await UserOTPVerification.deleteMany({ userID: userId });

//         res.json({ message: "Password has been reset successfully" });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

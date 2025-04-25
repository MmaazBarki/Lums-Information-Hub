import bcrypt from "bcryptjs";
import UserOTPVerification from "../models/userOtpVerification.models.js";
import transporter from "./email.js"; // Import the shared transporter

export const sendOTPVerificationEmail = async ({ _id, email }, res, pendingUser) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        console.log("Generated OTP:", otp); // Helpful for debugging

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Email Verification OTP",
            html: `<p>Enter <b>${otp}</b> in the app to verify your email. This code <b>expires in 1 hour</b>.</p>`,
        };

        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        // Remove any existing OTP for this email
        await UserOTPVerification.deleteMany({ email: email });

        const newOTPVerification = new UserOTPVerification({
            email: email,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiredAt: Date.now() + 3600000, // 1 hour later
        });

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            status: "PENDING",
            message: "Verification OTP email sent",
            data: {
                userId: _id,
                email,
                pendingUser: pendingUser,
            },
        });
    } catch (error) {
        console.error("OTP Email Error:", error);
        res.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
};

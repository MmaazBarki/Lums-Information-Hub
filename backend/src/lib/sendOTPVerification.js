import bcrypt from "bcryptjs";
import transporter from "./email.js";
import UserOTPVerification from "../models/userOTPVerification.models.js";

export const sendOTPVerificationEmail = async ({ _id, email }, res, pendingUser) => {
    try {

        const otp_timeout = 3600000; //set to an hour for now but may be changed
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        // console.log("Generated OTP:", otp); // keeping this in for debugging, have done email spoofing too many times

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Email Verification OTP",
            html: `<p>Enter <b>${otp}</b> in the app to verify your email. This code <b>expires in 1 hour</b>.</p>`,
        };

        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        await UserOTPVerification.deleteMany({ email: email }); //remove older OTPs for the same user

        const newOTPVerification = new UserOTPVerification({
            email: email,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiredAt: Date.now() + otp_timeout,
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

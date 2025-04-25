import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import UserOTPVerification from "../models/userOtpVerification.models.js";

export const sendOTPVerificationEmail = async ({ _id, email }, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        // Transporter setup (use your Gmail credentials)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS,
            },
        });
        // const transporter = nodemailer.createTransport({
        //     host: "smtp.gmail.com",
        //     port: 465,
        //     secure: true, // true for 465
        //     auth: {
        //       user: process.env.AUTH_EMAIL,
        //       pass: process.env.AUTH_PASS,
        //     },
        //   });
          

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Email Verification OTP",
            html: `<p>Enter <b>${otp}</b> in the app to verify your email. This code <b>expires in 1 hour</b>.</p>`,
        };

        // Hash OTP
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        // Save OTP in database
        const newOTPVerification = new UserOTPVerification({
            userID: _id,
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
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
};

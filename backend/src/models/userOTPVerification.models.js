import mongoose from "mongoose";



const UserOTPVerification = new mongoose.Schema({
    email: String,
    otp: String,
    createdAt: Date,
    expiredAt: Date
});

const userOTPVerification = mongoose.model(
    "UserOTPVerification",
    UserOTPVerification
);

export default userOTPVerification;

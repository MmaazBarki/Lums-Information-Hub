import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserOTPVerification = new Schema({
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

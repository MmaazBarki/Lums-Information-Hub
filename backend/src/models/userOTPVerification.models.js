import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserOTPVerificationSchema = new Schema({
    userID: String,
    otp: String,
    createdAt: Date,
    expiredAt: Date
});

const UserOTPVerification = mongoose.model(
    "UserOTPVerification",
    UserOTPVerificationSchema
);

export default UserOTPVerification;

import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import UserOTPVerification from "../models/userOTPVerification.models.js";
import transporter from "../lib/email.js";

export const sendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    console.log(otp)
    const hashedOtp = await bcrypt.hash(otp, 10);
    const newOTP = new UserOTPVerification({
      email,////////to mail
      otp: hashedOtp,
      createdAt: Date.now(),
      expiredAt: Date.now() + 3600000,
    });

    await newOTP.save();

    await transporter.sendMail({
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `<p>Enter <b>${otp}</b> to reset your password. It expires in <b>1 hour</b>.</p>`,
    });

    res.json({ status: "Pending", message: "OTP sent to email", data: { userId: user._id, email, } });
  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error.message });
  }
};


export const verifyPasswordResetOTP = async (req, res) => {
  try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
          return res.status(400).json({ message: "All fields are required" });
      }

      const otpRecord = await UserOTPVerification.findOne({ email }).sort({ createdAt: -1 });
      console.log("Fetched OTP record:", otpRecord);
      if (!otpRecord) {
          return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      if (otpRecord.expiredAt < Date.now()) {
          await UserOTPVerification.deleteMany({ email });
          return res.status(400).json({ message: "OTP has expired" });
      }

      const isMatch = await bcrypt.compare(otp, otpRecord.otp);
      if (!isMatch) return res.status(400).json({ message: "Incorrect OTP" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate({ email }, { password: hashedPassword });
      await UserOTPVerification.deleteMany({ email });

      res.json({ message: "Password has been reset successfully" });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};
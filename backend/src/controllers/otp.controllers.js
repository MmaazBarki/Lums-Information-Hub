import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import UserOTPVerification from "../models/userOTPVerification.models.js";
import transporter from "../lib/email.js";

export const sendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    console.log("Generated password reset OTP:", otp); 
    
    const hashedOtp = await bcrypt.hash(otp, 10);

    await UserOTPVerification.deleteMany({ email });
    
    const newOTP = new UserOTPVerification({
      email,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiredAt: Date.now() + 3600000,
    });

    await newOTP.save();

    try {
      await transporter.sendMail({
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Reset your password",
        html: `<p>Enter <b>${otp}</b> to reset your password. It expires in <b>1 hour</b>.</p>`,
      });
      
      res.json({ 
        status: "PENDING", 
        message: "OTP sent to email", 
        data: { userId: user._id, email } 
      });
      
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      await UserOTPVerification.deleteOne({ _id: newOTP._id });
      throw new Error(`Failed to send email: ${emailError.message}`);
    }
    
  } catch (error) {
    console.error("Password reset OTP error:", error);
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
    console.log("Checking OTP record for:", email);
    
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP. Please request a new one." });
    }

    if (otpRecord.expiredAt < Date.now()) {
      await UserOTPVerification.deleteMany({ email });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect OTP. Please try again." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findOneAndUpdate(
      { email }, 
      { password: hashedPassword },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    await UserOTPVerification.deleteMany({ email });

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Password reset verification error:", err);
    res.status(500).json({ message: err.message });
  }
};
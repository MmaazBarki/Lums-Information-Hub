import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.models.js"
import { sendOTPVerificationEmail } from "../lib/sendOTPVerification.js";
import  bcrypt from "bcryptjs"
import UserOTPVerification from "../models/userOTPVerification.models.js"; 

export const signup = async (req, res) => {
    const { role, email, password, profile_data } = req.body;

    try {
        if (!role || !email || !password) {
            return res.status(400).json({ message: "All Fields are Required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must contain at least one capital letter and one special character" 
            });
        }

        const validRoles = ["student", "alumni", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        let finalProfileData = undefined;
        if (role === "student" || role === "alumni") {
            if (!profile_data || typeof profile_data !== "object") {
                return res.status(400).json({ message: "Profile data is required for students and alumni" });
            }
            finalProfileData = profile_data;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const pendingUser = {
            role,
            email,
            password: hashedPassword,
            profile_data: finalProfileData,
            verified: false,
        };

        await UserOTPVerification.deleteMany({ email });
        
        await sendOTPVerificationEmail({ _id: null, email }, res, pendingUser);
        
        return;

    } catch (error) {
        console.error("Error in signup Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifySignupOTP = async (req, res) => {
    try {
        const { email, otp, userData } = req.body;
        
        if (!email || !otp || !userData) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const otpRecord = await UserOTPVerification.findOne({ email }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP. Please signup again." });
        }
        
        if (otpRecord.expiredAt < Date.now()) {
            await UserOTPVerification.deleteMany({ email });
            return res.status(400).json({ message: "OTP has expired. Please signup again." });
        }
        
        const isMatch = await bcrypt.compare(otp, otpRecord.otp);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect OTP. Please try again." });
        }

        const { role, password, profile_data } = userData;

        const newUser = new User({
            role,
            email,
            password, 
            profile_data: profile_data,
            verified: true,
        });
        
        await newUser.save();
        
        await UserOTPVerification.deleteMany({ email });
        
        generateToken(newUser._id, res);
        
        res.status(201).json({
            _id: newUser._id,
            role: newUser.role,
            email: newUser.email,
            profile_data: newUser.profile_data || null,
            verified: newUser.verified,
        });
        
    } catch (error) {
        console.error("Error in verifySignupOTP controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const resendSignupOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        await UserOTPVerification.deleteMany({ email });
        
        await sendOTPVerificationEmail({ _id: null, email }, res);
        
    } catch (error) {
        console.error("Error in resendSignupOTP controller:", error.message);
        res.status(500).json({ message: "Failed to resend OTP" });
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body
    try{
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Email not found"})
        }
        
        if (!user.verified) {
            return res.status(403).json({
                message: "Email not verified. Please complete signup verification.",
                needsVerification: true,
                email: user.email
            });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Password"})
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            role: user.role,
            email: user.email,
            profile_data: user.profile_data || null,
        })

    }catch(error){
        console.log("Error in login Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge : 0});
        res.status(200).json({ message: "Logged out Successfully" });

    }catch(error){
        console.log("Error in logout Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { role, name, batch, department, alternate_email, bio, profilePic  } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updated_user_info = { ...user.toObject() };

        if (role) {
            updated_user_info.role = role;
        }

        if (name) {
            if (!updated_user_info.profile_data) {
                updated_user_info.profile_data = {};
            }
            updated_user_info.profile_data.name = name;
        }

        if (batch) {
            if (!updated_user_info.profile_data) {
                updated_user_info.profile_data = {};
            }
            updated_user_info.profile_data.batch = batch;
        }

        if (department) {
            if (!updated_user_info.profile_data) {
                updated_user_info.profile_data = {};
            }
            updated_user_info.profile_data.department = department;
        }

        if (alternate_email) {
            if (!updated_user_info.profile_data) {
                updated_user_info.profile_data = {};
            }
            updated_user_info.profile_data.alternate_email = alternate_email;
        }

        if(bio)
        {
            if (!updated_user_info.profile_data) {
                updated_user_info.profile_data = {};
            }
            updated_user_info.profile_data.bio = bio;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updated_user_info, { new: true });

        res.status(200).json(updatedUser);

        if (profilePic) {
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            updates.profilePic = uploadResponse.secure_url;
        }

        
    } catch (error) {
        console.log("Error when updating profile: ", error);
        res.status(500).json({message: "Internal server error" });
    }
};

export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    try {
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const newPasswordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
        if (!newPasswordRegex.test(newPassword)) {
            return res.status(400).json({ 
                message: "New Password must contain at least one capital letter and one special character" 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
        
    } catch (error) {
        console.log("Error in updatePassword controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
        
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json( {message: "Internal Server Error"});
    }
};

export const requestVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (user.verified) {
            return res.status(400).json({ message: "Email is already verified" });
        }
        
        await UserOTPVerification.deleteMany({ email });
        
        await sendOTPVerificationEmail({ _id: user._id, email }, res);
        
    } catch (error) {
        console.error("Error in requestVerificationEmail controller:", error.message);
        res.status(500).json({ message: "Failed to send verification email" });
    }
};

export const completeUserVerification = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (user.verified) {
            return res.status(400).json({ message: "Email is already verified" });
        }
        
        const otpRecord = await UserOTPVerification.findOne({ email }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP. Please request a new verification code." });
        }

        if (otpRecord.expiredAt < Date.now()) {
            await UserOTPVerification.deleteMany({ email });
            return res.status(400).json({ message: "OTP has expired. Please request a new verification code." });
        }
        
        const isMatch = await bcrypt.compare(otp, otpRecord.otp);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect OTP. Please try again." });
        }

        user.verified = true;
        await user.save();
        
        await UserOTPVerification.deleteMany({ email });
        
        generateToken(user._id, res);
        
        res.status(200).json({
            _id: user._id,
            role: user.role,
            email: user.email,
            profile_data: user.profile_data || null,
            verified: user.verified,
            message: "Email verification completed successfully"
        });
        
    } catch (error) {
        console.error("Error in completeUserVerification controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
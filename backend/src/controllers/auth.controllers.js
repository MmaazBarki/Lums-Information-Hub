import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.models.js"
import  bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const { role, email, password, profile_data } = req.body;

    try {
        if (!role || !email || !password) {
            return res.status(400).json({ message: "All Fields are Required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/; // At least one capital letter and one special character
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must contain at least one capital letter and one special character" 
            });
        }

        // Validate role
        const validRoles = ["student", "alumni", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // Ensure profile_data is only present for students & alumni
        let finalProfileData = undefined;
        if (role === "student" || role === "alumni") {
            if (!profile_data || typeof profile_data !== "object") {
                return res.status(400).json({ message: "Profile data is required for students and alumni" });
            }
            finalProfileData = profile_data;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            role,
            email,
            password: hashedPassword,
            profile_data: finalProfileData,
        });

        await newUser.save();

        // Generate Token
        generateToken(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            role: newUser.role,
            email: newUser.email,
            profile_data: newUser.profile_data || null, // Return null if not applicable
        });

    } catch (error) {
        console.error("Error in signup Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
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

        // find the user and store all fields in database entry in local variable
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

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(userId, updated_user_info, { new: true });

        res.status(200).json(updatedUser);


        // profile picture feature implementation will be in the future
        if (profilePic) {
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            updates.profilePic = uploadResponse.secure_url;
        }


        // Implementation for CV upload will be in the future
        // if (CV) {
        //     const uploadResponse = await cloudinary.uploader.upload(CV);
        //     // updates.CV = uploadResponse.secure_url; // Store the secure URL of the uploaded CV image
        // }
        
    } catch (error) {
        console.log("Error when updating profile: ", error);
        res.status(500).json({message: "Internal server error" });
    }
};

export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    try {
        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const newPasswordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/; // At least one capital letter and one special character
        if (!newPasswordRegex.test(newPassword)) {
            return res.status(400).json({ 
                message: "New Password must contain at least one capital letter and one special character" 
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in the database
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
}
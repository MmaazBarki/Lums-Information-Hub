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
            return res.status(400).json({message: "Invalid Credentials"})
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Credentials"})
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
import { Student } from '../models/student.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from '../lib/utils.js';

const saltRounds = 10;

// --------------------
// SIGNUP
// --------------------
export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if user already exists
        const existingUser = await Student.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new Student({
            email,
            password_hash: hashedPassword
        });
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                message: 'User created successfully',
                email: newUser.email,
            });
        }
        else {
            return res.status(400).json({ error: 'Invalid User' });
        }

        // return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// --------------------
// LOGIN
// --------------------
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await Student.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // // Create JWT
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'SECRET_KEY', {
        //     expiresIn: '1h'
        // });

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            // fullName: user.fullName,
            email: user.email,
            // profilePic: user.profilePic,
        });

        // return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.log("Error in login controller", error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// --------------------
// LOGOUT
// --------------------
export const logout = async (req, res) => {
    // // If you're managing tokens entirely on the client or storing them in cookies,
    // // you could simply ask the client to discard the token or clear the cookie.
    // // For a simple response:
    // return res.status(200).json({ message: 'Logged out successfully (client should discard token)' });
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
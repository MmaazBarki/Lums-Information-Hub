import AcademicResource from "../models/academicResource.model.js";
import cloudinary from "../lib/cloudinary.js"; // Import Cloudinary utility
import streamifier from 'streamifier'; // To convert buffer to stream for Cloudinary
import path from 'path'; // Import path module

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, originalFilename) => { // Pass originalFilename
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto", // Automatically detect resource type
                // Use original filename for public_id, keep extension
                public_id: path.parse(originalFilename).name,
                use_filename: true,
                unique_filename: false // Try not to append random characters if possible
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};


export const uploadResource = async (req, res) => {
    const {
        course_code,
        topic,
        description,
      } = req.body;
    const uploader_id = req.user._id; // Auth middleware adds this
    const uploader_name = req.user.profile_data.name || "mock_name"; // Mock name for now, replace with actual data from user profile

    // Check if file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }

    if (!course_code || !topic || !description) {
        return res.status(400).json({ message: "Course code, topic, and description are required." });
    }
    console.log("Uploader ID:", uploader_id);
    console.log("Uploader Name:", uploader_name);
    console.log("Uploaded File Info:", req.file); // Log file info from multer

    try {
        // Upload file buffer to Cloudinary, passing original filename
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        console.log("Cloudinary Upload Result:", cloudinaryResult);

        if (!cloudinaryResult || !cloudinaryResult.secure_url) {
            throw new Error("Cloudinary upload failed");
        }

        // Extract file extension
        const fileExtension = path.extname(req.file.originalname).slice(1) || cloudinaryResult.format;

        const newResource = new AcademicResource({
            uploader_id,
            uploader_name,
            course_code,
            topic,
            original_filename: req.file.originalname, // Store original filename
            file_url: cloudinaryResult.secure_url, // Use Cloudinary URL
            file_type: fileExtension, // Store only the extension
            file_size: cloudinaryResult.bytes, // Use Cloudinary size in bytes
            role: req.user.role, // Assuming role is part of the user object
            description,
            downloads: 0 // Default downloads to 0
        });

        await newResource.save();
        res.status(201).json({ message: "Resource uploaded", resource: newResource });
    } catch (error) {
        console.error("Upload Error:", error.message);
        // Provide more specific error if Cloudinary upload failed
        if (error.message.includes("Cloudinary")) {
             res.status(500).json({ message: "File upload to storage failed." });
        } else {
             res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

export const getResourcesByCourse = async (req, res) => {
    const { course_code } = req.params;

    try {
        const resources = await AcademicResource.find({ course_code })
            .populate("uploader_id", "email role");// can have error here
        res.status(200).json(resources);
    } catch (error) {
        console.error("Fetch Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

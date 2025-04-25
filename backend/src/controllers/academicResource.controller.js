import AcademicResource from "../models/academicResource.model.js";
import cloudinary from "../lib/cloudinary.js"; 
import streamifier from 'streamifier'; 
import path from 'path'; 


const uploadToCloudinary = (buffer, originalFilename) => { 
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto", 
                public_id: path.parse(originalFilename).name,
                use_filename: true,
                unique_filename: false 
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
    const uploader_id = req.user._id; 
    const uploader_name = req.user.profile_data.name || "mock_name"; 

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }

    if (!course_code || !topic || !description) {
        return res.status(400).json({ message: "Course code, topic, and description are required." });
    }

    try {
  
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);

        if (!cloudinaryResult || !cloudinaryResult.secure_url) {
            throw new Error("Cloudinary upload failed");
        }

        const fileExtension = path.extname(req.file.originalname).slice(1) || cloudinaryResult.format;

        const newResource = new AcademicResource({
            uploader_id,
            uploader_name,
            course_code,
            topic,
            original_filename: req.file.originalname,
            file_url: cloudinaryResult.secure_url, 
            file_type: fileExtension, 
            file_size: cloudinaryResult.bytes,
            role: req.user.role, 
            description,
            downloads: 0 
        });

        await newResource.save();
        res.status(201).json({ message: "Resource uploaded", resource: newResource });
    } catch (error) {
        console.error("Upload Error:", error.message);
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
            .populate("uploader_id", "email role");
        res.status(200).json(resources);
    } catch (error) {
        console.error("Fetch Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addOrUpdateRating = async (req, res) => {
    const { resourceId } = req.params;
    const { rating } = req.body;
    const userId = req.user._id; 

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Invalid rating value. Must be between 1 and 5." });
    }

    try {
        const resource = await AcademicResource.findById(resourceId);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found." });
        }

        const existingRatingIndex = resource.ratings.findIndex(r => r.userId.equals(userId));

        if (existingRatingIndex > -1) {
            resource.ratings[existingRatingIndex].rating = rating;
        } else {
            resource.ratings.push({ userId, rating });
        }

        await resource.save();

        res.status(200).json({ 
            message: "Rating submitted successfully.", 
            averageRating: resource.averageRating, 
            numberOfRatings: resource.numberOfRatings 
        });

    } catch (error) {
        console.error("Rating Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const incrementDownloadCount = async (req, res) => {
    const { resourceId } = req.params;

    try {
        const resource = await AcademicResource.findByIdAndUpdate(
            resourceId,
            { $inc: { downloads: 1 } }, 
            { new: true } 
        );

        if (!resource) {
            return res.status(404).json({ message: "Resource not found." });
        }

        res.status(200).json({ 
            message: "Download count updated.", 
            downloads: resource.downloads 
        });

    } catch (error) {
        console.error("Download Count Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getAllResources = async (req, res) => {
    try {
        const resources = await AcademicResource.find({})
            .populate("uploader_id", "email role");
        res.status(200).json(resources);
    } catch (error) {
        console.error("Fetch Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

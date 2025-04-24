import {v2 as cloudinary} from "cloudinary";

// Export a function to configure Cloudinary
export const configureCloudinary = () => {
    console.log("Attempting to configure Cloudinary...");
    console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "Loaded" : "MISSING");
    console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "Loaded" : "MISSING");
    console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "MISSING");

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("Cloudinary configured.");
};


export default cloudinary; // Export the cloudinary instance for use elsewhere

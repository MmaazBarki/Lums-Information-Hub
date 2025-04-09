import AcademicResource from "../models/academicResource.model.js";

export const uploadResource = async (req, res) => {
    const {
        course_code,
        topic,
        file_url,
        file_type,
        file_size,
        description,
        downloads
      } = req.body;
    const uploader_id = req.user._id; // Auth middleware adds this
    const uploader_name = req.user.profile_data.name || "mock_name"; // Mock name for now, replace with actual data from user profile

    if (!course_code || !topic || !file_url || !file_type || !file_size || !description) {
        return res.status(400).json({ message: "All fields are required." });
    }
    console.log("Uploader ID:", uploader_id);
    console.log("Uploader Name:", uploader_name);
    try {
        const newResource = new AcademicResource({
            uploader_id,
            uploader_name,
            course_code,
            topic,
            file_url,
            file_type,
            file_size,
            description,
            downloads
        });

        await newResource.save();
        res.status(201).json({ message: "Resource uploaded", resource: newResource });
    } catch (error) {
        console.error("Upload Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
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

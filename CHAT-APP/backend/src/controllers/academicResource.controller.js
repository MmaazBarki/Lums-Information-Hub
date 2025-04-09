import AcademicResource from "../models/academicResource.model.js";

export const uploadResource = async (req, res) => {
    const { course_code, topic, file_url } = req.body;
    const uploader_id = req.user._id; // Auth middleware adds this

    if (!course_code || !topic || !file_url) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newResource = new AcademicResource({
            uploader_id,
            course_code,
            topic,
            file_url,
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
            .populate("uploader_id", "email role");
        res.status(200).json(resources);
    } catch (error) {
        console.error("Fetch Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

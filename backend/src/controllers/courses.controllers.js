import Course from "../models/course.model.js";
import AcademicResource from "../models/academicResource.model.js"; // Import AcademicResource model

export const getAllCourses = async (req, res) => {
    try {
        // Use aggregation pipeline to count resources for each course
        const coursesWithResourceCount = await Course.aggregate([
            {
                $lookup: {
                    from: "academicresources", // The name of the AcademicResource collection in MongoDB (usually lowercase plural)
                    localField: "course_code", // Field from the courses collection
                    foreignField: "course_code", // Field from the academicresources collection
                    as: "resources" // Name of the new array field to add
                }
            },
            {
                $addFields: {
                    resourceCount: { $size: "$resources" } // Add a field with the count of resources
                }
            },
            {
                $project: {
                    resources: 0 // Optionally remove the resources array from the final output
                }
            }
        ]);

        res.status(200).json(coursesWithResourceCount);
    } catch (error) {
        console.error("Fetch Courses Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createCourse = async (req, res) => {
    const { course_code, course_name, description, department, credits } = req.body;
    const creator_id = req.user._id; // Auth middleware adds this

    const creator_name = req.user.profile_data.name || "mock_name"; // Mock name for now, replace with actual data from user profile
    
    if (!course_code || !course_name || !description || !department || !credits) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newCourse = new Course({
            course_code,
            course_name,
            description,
            department,
            credits
        });

        await newCourse.save();
        res.status(201).json({ course: newCourse });
    }
    catch (error) {
        console.error("Course Creation Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

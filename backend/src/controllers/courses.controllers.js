import Course from "../models/course.model.js";

export const getAllCourses = async (req, res) => {
    try {
        const coursesWithResourceCount = await Course.aggregate([
            {
                $lookup: {
                    from: "academicresources", 
                    localField: "course_code", 
                    foreignField: "course_code", 
                    as: "resources"
                }
            },
            {
                $addFields: {
                    resourceCount: { $size: "$resources" } 
                }
            },
            {
                $project: {
                    resources: 0 
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
    const creator_id = req.user._id; 

    const creator_name = req.user.profile_data.name; 
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

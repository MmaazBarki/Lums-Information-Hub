import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
}, { _id: false }); // Don't create a separate _id for each rating entry

const academicResource = new mongoose.Schema({
    uploader_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Will be either student or alumni
        required: true,
    },
    uploader_name: {
        type: String,
        required: true,
    },
    course_code: {
        type: String,
        required: true,
        ref: "Course", // Reference by course_code, not ObjectId
    },
    topic: {
        type: String,
        required: true,
    },
    original_filename: {
        type: String,
        required: true,
    },
    file_url: {
        type: String,
        required: true,
    },
    file_type: {
        type: String,
        required: true,
        default: "pdf"
    },
    file_size: {
        type: Number, // Changed to Number to store bytes
        required: true,
    },
    downloads: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: true,
    },
    ratings: [ratingSchema], // Array to store individual ratings
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    numberOfRatings: {
        type: Number,
        default: 0,
    },
    uploaded_at: {
        type: Date,
        default: Date.now,
    },
});

// Method to calculate and update average rating
academicResource.methods.calculateAverageRating = function() {
    if (this.ratings.length === 0) {
        this.averageRating = 0;
        this.numberOfRatings = 0;
    } else {
        const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        this.averageRating = totalRating / this.ratings.length;
        this.numberOfRatings = this.ratings.length;
    }
    // Round to one decimal place if needed
    this.averageRating = Math.round(this.averageRating * 10) / 10;
};

// Middleware to recalculate average rating before saving
academicResource.pre('save', function(next) {
    // Only recalculate if ratings array is modified
    if (this.isModified('ratings')) {
        this.calculateAverageRating();
    }
    next();
});


const AcademicResource = mongoose.model("AcademicResource", academicResource);
export default AcademicResource;

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false 
        },
        type: {
            type: String,
            enum: ["post", "message"],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'onModel',
            required: true
        },
        onModel: {
            type: String,
            enum: ["Post", "Message"],
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
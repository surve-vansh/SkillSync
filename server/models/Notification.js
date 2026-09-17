const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        // Maps to typeConfig keys in Notifications.jsx:
        // "Requests" | "Accepted" | "System" | "Messages" | "Sessions" | "Achievements"
        type: {
            type: String,
            enum: ["Requests", "Accepted", "System", "Messages", "Sessions", "Achievements"],
            default: "System",
        },

        // Role context — which role dashboard should display this notification.
        // null / missing = legacy (show in all contexts for backward compat)
        targetRole: {
            type: String,
            enum: ["student", "mentor", "admin", null],
            default: null,
        },

        // Optional navigation target shown as a button
        link: {
            type: String,
            default: "",
        },

        // Optional button label
        button: {
            type: String,
            default: "View",
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Notification", notificationSchema);

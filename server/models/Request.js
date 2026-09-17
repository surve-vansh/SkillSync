const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        message: {
            type: String,
            default: "",
            maxlength: 1000,
        },

        // skill the student wants to learn from the mentor
        skill: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "completed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Request", requestSchema);

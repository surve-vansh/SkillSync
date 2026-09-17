const mongoose = require("mongoose");

const mentorApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skills: [String],

    experience: String,

    qualification: String,

    bio: String,
    

    teachingMode: String,

    language: String,

    portfolio: String,

    linkedin: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "MentorApplication",
  mentorApplicationSchema
);
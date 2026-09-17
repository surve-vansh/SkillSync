const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        // User Role
        role: {
            type: String,
            enum: ["student", "mentor", "admin"],
            default: "student",
        },
        mentorApplicationStatus: {
            type: String,
            enum: ["none", "pending", "approved", "rejected"],
            default: "none",
        },

        isMentor: {
            type: Boolean,
            default: false,
        },
        canTeach: {
            type: Boolean,
            default: false,
        },
        // Register Form
        // primarySkill: {
        //     type: String,
        //     default: "",
        // },

        // Profile
        profilePicture: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
            maxlength: 500,
        },

        location: {
            type: String,
            default: "",
        },

        availability: {
            type: String,
            enum: ["weekdays", "weekends", "both", "flexible"],
            default: "flexible",
        },

        experienceLevel: {
            type: String,
            enum: ["beginner", "intermediate", "advanced", "expert"],
            default: "beginner",
        },

        // Skills
        skills_offered: {
            type: [String],
            default: [],
        },

        skills_wanted: {
            type: [String],
            default: [],
        },

        // Social Links
        socialLinks: {
            linkedin: {
                type: String,
                default: "",
            },
            github: {
                type: String,
                default: "",
            },
            portfolio: {
                type: String,
                default: "",
            },
            twitter: {
                type: String,
                default: "",
            },
        },

        // Statistics
        skillCoins: {
            type: Number,
            default: 100,
        },

        streakCount: {
            type: Number,
            default: 0,
        },

        badges: {
            type: [String],
            default: [],
        },

        rating: {
            type: Number,
            default: 0,
        },

        totalRatings: {
            type: Number,
            default: 0,
        },

        completionPercentage: {
            type: Number,
            default: 0,
        },

        membership: {
            type: String,
            enum: ["free", "premium"],
            default: "free",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        lastActive: {
            type: Date,
            default: Date.now,
        },

        // Forgot Password
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true,
    }
);

// =======================
// Hash Password
// =======================
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    console.log("Pre Save Running");

    this.password = await bcrypt.hash(this.password, 12);
});

// =======================
// Compare Password
// =======================
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// =======================
// Profile Completion
// =======================
userSchema.methods.calculateCompletion = function () {
    let score = 0;

    // Basic Information
    if (this.name) score += 10;
    if (this.bio) score += 15;
    if (this.location) score += 10;

    // Skills
    if (this.skills_offered?.length > 0) score += 15;
    if (this.skills_wanted?.length > 0) score += 10;

    // Experience & Availability
    if (this.experienceLevel) score += 10;
    if (this.availability) score += 5;

    // Profile Photo
    if (this.profilePicture) score += 15;

    // Social Links
    if (
        this.socialLinks &&
        (
            this.socialLinks.linkedin ||
            this.socialLinks.github ||
            this.socialLinks.portfolio ||
            this.socialLinks.twitter
        )
    ) {
        score += 10;
    }

    this.completionPercentage = score;

    return score;
};

module.exports = mongoose.model("User", userSchema);
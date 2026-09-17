const User = require("../models/user");
const Skill = require("../models/skill");
const MentorApplication = require("../models/MentorApplication");
const { createNotification } = require("./notificationController");

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalSkills = await Skill.countDocuments();

        const activeSkills = await Skill.countDocuments({
            isActive: true,
        });
        const totalStudents = await User.countDocuments({
            role: "student",
        });

        const totalMentors = await User.countDocuments({
            role: "mentor",
        });

        const totalAdmins = await User.countDocuments({
            role: "admin",
        });
        const popularSkills = await Skill.find()
            .sort({ createdAt: -1 })
            .limit(5);
        const recentUsers = await User.find({
            role: { $ne: "admin" }
        })
            .select("name email role isActive createdAt")
            .sort({ createdAt: -1 })
            .limit(5);
        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalSkills,
                activeSkills,
                totalStudents,
                totalMentors,
                totalAdmins,
                recentUsersCount: recentUsers.length,
                popularSkills,
            },
            recentUsers,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Dashboard error",
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({
            role: { $ne: "admin" }
        }).select("-password");

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error fetching users"
        });
    }
};

const deleteUser = async (req, res) => {
    console.log("DELETE HIT");
    console.log(req.params.id);
    try {
        const { id } = req.params;

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Delete failed"
        });
    }
};
const getMembershipStats = async (req, res) => {
    try {
        const totalMembers = await User.countDocuments({
            role: { $ne: "admin" }
        });

        const premiumMembers = await User.countDocuments({
            membership: "premium",
            role: { $ne: "admin" }
        });

        const freeMembers = await User.countDocuments({
            membership: "free",
            role: { $ne: "admin" }
        });

        res.status(200).json({
            success: true,
            totalMembers,
            premiumMembers,
            freeMembers
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error fetching membership stats"
        });
    }
};



const getReportsStats = async (req, res) => {
    try {
        const Session     = require("../models/Session");
        const Test        = require("../models/Test");
        const TestAttempt = require("../models/TestAttempt");
        const Review      = require("../models/Review");
        const Request     = require("../models/Request");
        const Transaction = require("../models/Transaction");

        // ── Period filter ──────────────────────────────────────────────
        const period = req.query.period || "allTime";
        const now = new Date();
        let dateFrom = null;
        let dateTo   = null;

        switch (period) {
            case "thisMonth":
                dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "lastMonth":
                dateFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                dateTo   = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "last3Months":
                dateFrom = new Date(now);
                dateFrom.setMonth(dateFrom.getMonth() - 3);
                break;
            case "thisYear":
                dateFrom = new Date(now.getFullYear(), 0, 1);
                break;
            default: // allTime
                dateFrom = null;
        }

        const dateFilter = dateFrom
            ? (dateTo ? { createdAt: { $gte: dateFrom, $lt: dateTo } } : { createdAt: { $gte: dateFrom } })
            : {};

        // ── Users ──────────────────────────────────────────────────────
        const totalUsers      = await User.countDocuments(dateFilter);
        const totalStudents   = await User.countDocuments({ ...dateFilter, role: "student" });
        const totalMentors    = await User.countDocuments({ ...dateFilter, isMentor: true });
        const approvedMentors = await User.countDocuments({ ...dateFilter, isMentor: true, mentorApplicationStatus: "approved" });
        const totalSkills     = await Skill.countDocuments();

        // ── Requests ──────────────────────────────────────────────────
        const totalRequests    = await Request.countDocuments(dateFilter);
        const pendingRequests  = await Request.countDocuments({ ...dateFilter, status: "pending" });
        const acceptedRequests = await Request.countDocuments({ ...dateFilter, status: "accepted" });
        const rejectedRequests = await Request.countDocuments({ ...dateFilter, status: "rejected" });

        // ── Sessions ──────────────────────────────────────────────────
        const totalSessions     = await Session.countDocuments(dateFilter);
        const completedSessions = await Session.countDocuments({ ...dateFilter, status: "completed" });
        const upcomingSessions  = await Session.countDocuments({ ...dateFilter, status: "upcoming" });
        const ongoingSessions   = await Session.countDocuments({ ...dateFilter, status: "ongoing" });
        const cancelledSessions = await Session.countDocuments({ ...dateFilter, status: "cancelled" });

        // ── Tests ─────────────────────────────────────────────────────
        const totalTests    = await Test.countDocuments();
        const totalAttempts = await TestAttempt.countDocuments(dateFilter);

        // ── Reviews ───────────────────────────────────────────────────
        const totalReviews = await Review.countDocuments(dateFilter);
        const ratingAgg    = await Review.aggregate([
            { $match: dateFilter },
            { $group: { _id: null, avg: { $avg: "$rating" } } },
        ]);
        const avgRating = ratingAgg.length > 0
            ? parseFloat(ratingAgg[0].avg.toFixed(1))
            : 0;

        // ── Transactions ──────────────────────────────────────────────
        const totalTransactions = await Transaction.countDocuments(dateFilter);

        // ── Top Skills (from Request.skill field) ─────────────────────
        const topSkills = await Request.aggregate([
            { $match: { skill: { $exists: true, $ne: null, $ne: "" } } },
            { $group: { _id: "$skill", count: { $sum: 1 } } },
            { $sort:  { count: -1 } },
            { $limit: 5 },
            { $project: { name: "$_id", value: "$count", _id: 0 } },
        ]);

        // ── Recent Users ──────────────────────────────────────────────
        const recentUsers = await User.find({ role: { $ne: "admin" } })
            .select("name email role isMentor createdAt")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            period,
            stats: {
                totalUsers,
                totalStudents,
                totalMentors,
                approvedMentors,
                totalSkills,
                totalRequests,
                pendingRequests,
                acceptedRequests,
                rejectedRequests,
                totalSessions,
                completedSessions,
                upcomingSessions,
                ongoingSessions,
                cancelledSessions,
                totalTests,
                totalAttempts,
                totalReviews,
                avgRating,
                totalTransactions,
            },
            topSkills,
            recentUsers,
        });

    } catch (error) {
        console.error("Reports stats error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching reports stats",
        });
    }
};


const getMentorApplications = async (req, res) => {
  try {
    const applications = await MentorApplication.find()
      .populate("user", "name email role profilePicture");

    const filtered = applications.filter(
      app => app.user?.role !== "admin"
    );

    res.status(200).json({
      success: true,
      applications: filtered,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const approveMentorApplication = async (req, res) => {
    try {
        const application = await MentorApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        application.status = "approved";
        await application.save();

        // IMPORTANT: Do NOT change user.role here.
        // Keep original role (may be "student") so dual-role users
        // still see the choose popup on login.
        // Copy application.skills into user.skills_offered so Browse Skills works.
        await User.findByIdAndUpdate(application.user, {
            isMentor: true,
            mentorApplicationStatus: "approved",
            canTeach: true,
            $addToSet: { skills_offered: { $each: application.skills || [] } },
        });

        // Notify the applicant
        await createNotification({
            userId:     application.user,
            title:      "🎉 Mentor Application Approved!",
            message:    "Congratulations! Your mentor application has been approved. You can now access the mentor dashboard.",
            type:       "Accepted",
            targetRole: "student",
            link:       "/mentor",
            button:     "Go to Dashboard",
        });

        res.json({
            success: true,
            message: "Mentor approved successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const approveMentor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the mentor application to get skills
    const application = await MentorApplication.findOne({ user: user._id });
    const appSkills = application?.skills || [];

    // IMPORTANT: Do NOT force role="mentor".
    // Keep original role (may be "student") so dual-role users
    // still see the Choose Account Type popup on login.
    user.isMentor = true;
    user.canTeach = true;
    user.mentorApplicationStatus = "approved";

    // Copy skills from application into user.skills_offered
    if (appSkills.length > 0) {
        const existing = new Set(user.skills_offered.map(s => s.toLowerCase()));
        for (const s of appSkills) {
            if (!existing.has(s.toLowerCase())) {
                user.skills_offered.push(s);
            }
        }
    }

    await user.save();

    // Update application status too
    if (application) {
      application.status = "approved";
      await application.save();
    }

    // Notify the applicant
    await createNotification({
        userId:     user._id,
        title:      "🎉 Mentor Application Approved!",
        message:    "Congratulations! Your mentor application has been approved. You can now access the mentor dashboard.",
        type:       "Accepted",
        targetRole: "student",
        link:       "/mentor",
        button:     "Go to Dashboard",
    });

    res.status(200).json({
      success: true,
      message: "Mentor approved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const rejectMentor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.isMentor = false;
    user.canTeach = false;
    user.mentorApplicationStatus = "rejected";
    await user.save();

    await MentorApplication.findOneAndUpdate(
      { user: user._id },
      { status: "rejected" }
    );

    // Notify the applicant
    await createNotification({
        userId:     user._id,
        title:      "Mentor Application Update",
        message:    "Unfortunately, your mentor application was not approved at this time. You may apply again after improving your profile.",
        type:       "System",
        targetRole: "student",
        link:       "/become-mentor",
        button:     "View Details",
    });

    res.status(200).json({
      success: true,
      message: "Mentor rejected",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const revokeMentor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.isMentor = false;
    user.canTeach = false;
    user.mentorApplicationStatus = "pending";

    await user.save();

    await MentorApplication.findOneAndUpdate(
      { user: user._id },
      { status: "pending" }
    );

    // Notify the user
    await createNotification({
        userId:     user._id,
        title:      "Mentor Status Revoked",
        message:    "Your mentor status has been revoked by the admin. Your account has been returned to student status.",
        type:       "System",
        targetRole: "student",
        link:       "/become-mentor",
        button:     "Re-apply",
    });

    res.status(200).json({
      success: true,
      message: "Mentor revoked successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const Request = require("../models/Request");

/* ── GET all mentorship requests (admin monitoring) ── */
const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find()
            .populate("student", "name email profilePicture")
            .populate("mentor",  "name email profilePicture")
            .sort({ createdAt: -1 });

        res.json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ── DELETE a request (admin action) ── */
const deleteRequest = async (req, res) => {
    try {
        await Request.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Request deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDashboardStats, getAllUsers, deleteUser, getMembershipStats, getReportsStats,
    approveMentorApplication, approveMentor, rejectMentor, getMentorApplications, revokeMentor,
    getAllRequests, deleteRequest,
}
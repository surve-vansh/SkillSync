const Request  = require("../models/Request");
const User     = require("../models/user");
const { createNotification } = require("./notificationController");

/* ============================================================
   POST /api/requests
   Student sends a mentorship request to a mentor
   Body: { mentorId, message, skill? }
   ============================================================ */
const sendRequest = async (req, res) => {
    try {
        const { mentorId, message, skill } = req.body;
        const student = req.user;

        if (!mentorId) {
            return res.status(400).json({ success: false, message: "Mentor ID is required" });
        }

        // Verify the target is an approved mentor
        const mentor = await User.findOne({
            _id: mentorId,
            isMentor: true,
            mentorApplicationStatus: "approved",
        });

        if (!mentor) {
            return res.status(404).json({ success: false, message: "Mentor not found or not approved" });
        }

        // Prevent duplicate pending requests to same mentor
        const existing = await Request.findOne({
            student: student._id,
            mentor: mentorId,
            status: "pending",
        });

        if (existing) {
            return res.status(400).json({ success: false, message: "You already have a pending request to this mentor" });
        }

        const request = await Request.create({
            student: student._id,
            mentor:  mentorId,
            message: message || "",
            skill:   skill   || "",
        });

        // ── Notify the MENTOR about the new request ──
        await createNotification({
            userId:     mentor._id,
            title:      "New Mentorship Request",
            message:    `${student.name} sent you a mentorship request${skill ? ` for ${skill}` : ""}.`,
            type:       "Requests",
            targetRole: "mentor",
            link:       "/mentor/requests",
            button:     "View Request",
        });

        const populated = await request.populate("mentor", "name email profilePicture");

        res.status(201).json({ success: true, message: "Request sent successfully", request: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ============================================================
   GET /api/requests/mine
   Student sees all their sent requests with mentor info + status
   ============================================================ */
const getStudentRequests = async (req, res) => {
    try {
        const requests = await Request.find({ student: req.user._id })
            .populate("mentor", "name email profilePicture skills_offered")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { sendRequest, getStudentRequests };

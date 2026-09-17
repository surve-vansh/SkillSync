const express = require("express");
const router  = express.Router();

const { protect, softProtect } = require("../middleware/authMiddleware");

const {
    applyMentor,
    getApprovedMentors,
    getMentorProfile,
    getMentorRequests,
    acceptRequest,
    rejectRequest,
    getMyStudents,
} = require("../controllers/mentorController");

// ── Authenticated mentor routes MUST come before /:id wildcard ──
router.post("/apply",              protect, applyMentor);
router.get("/requests/list",       protect, getMentorRequests);
router.get("/students",            protect, getMyStudents);
router.put("/requests/:id/accept", protect, acceptRequest);
router.put("/requests/:id/reject", protect, rejectRequest);

// ── Public routes — softProtect optionally sets req.user for self-exclusion ──
router.get("/",    softProtect, getApprovedMentors);
router.get("/:id", softProtect, getMentorProfile);

module.exports = router;
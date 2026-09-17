const express = require("express");
const router = express.Router();

const {
  getDashboardStats, getAllUsers, deleteUser, getMembershipStats, getReportsStats, getPendingMentors,
  approveMentorApplication, approveMentor, rejectMentor, getMentorApplications, revokeMentor,
  getAllRequests, deleteRequest,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { getAdminReviews, deleteReview } = require("../controllers/reviewController");

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/membership", getMembershipStats);
router.get("/reports", getReportsStats);
router.get("/mentor-applications", protect, authorizeRoles("admin"), getMentorApplications);
router.put("/mentor-applications/:id/approve", protect, authorizeRoles("admin"), approveMentorApplication);
router.put("/mentors/:id/approve", approveMentor);
router.put("/mentors/:id/reject", rejectMentor);
router.put("/mentors/:id/revoke", revokeMentor);

// Skill requests monitoring
router.get("/requests", protect, authorizeRoles("admin"), getAllRequests);
router.delete("/requests/:id", protect, authorizeRoles("admin"), deleteRequest);

router.get("/reviews", protect, authorizeRoles("admin"), getAdminReviews);
router.delete("/reviews/:id", protect, authorizeRoles("admin"), deleteReview);

module.exports = router;
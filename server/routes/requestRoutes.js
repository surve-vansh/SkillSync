const express = require("express");
const router  = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { sendRequest, getStudentRequests } = require("../controllers/requestController");

// POST /api/requests              → student sends a request
// GET  /api/student/requests      → student gets their own requests
router.post("/", protect, sendRequest);
router.get("/mine", protect, getStudentRequests);

module.exports = router;

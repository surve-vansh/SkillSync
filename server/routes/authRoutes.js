const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getProfile, updateProfile, logoutUser, forgotPassword } = require("../controllers/authController");

const {protect} = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware")


router.post("/register", registerUser);
router.post("/login",    loginUser);
router.post("/logout",   logoutUser);
router.post("/forgot-password", forgotPassword);
router.get("/profile",  protect, getProfile);
router.put("/profile",  protect, upload.single("profilePicture"), updateProfile);

module.exports = router;

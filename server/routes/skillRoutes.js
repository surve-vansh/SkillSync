const express = require("express");

const {
  getSkillsWithMentorCount,
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");

const router = express.Router();

// Get all skills with mentor count (used by BrowseSkills)
router.get("/", getSkillsWithMentorCount);

// Get single skill
router.get("/:id", getSkillById);

// Create skill
router.post("/", createSkill);

// Update skill
router.put("/:id", updateSkill);

// Delete skill
router.delete("/:id", (req, res, next) => {
  console.log("DELETE ROUTE HIT");
  next();
}, deleteSkill);

module.exports = router;
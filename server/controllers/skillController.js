const Skill = require("../models/skill");
const User  = require("../models/user");
const MentorApplication = require("../models/MentorApplication");

/* ─── shared skill normalizer (used by Browse Skills AND Find Mentors) ───
   Strips punctuation, spaces, dots, hyphens and lowercases.
   "React.js" → "reactjs", "Node JS" → "nodejs", "vue 3" → "vue3"
   ─────────────────────────────────────────────────────────────────────── */
const normSkill = (s) => (s || "").toLowerCase().replace(/[\s.\-\/\\]+/g, "");

/* ─── Returns true if two skill strings are considered the same ────────── */
const skillsMatch = (a, b) => {
    const na = normSkill(a);
    const nb = normSkill(b);
    if (!na || !nb) return false;
    // Exact normalized match
    if (na === nb) return true;
    // One is a prefix of the other (e.g. "node" matches "nodejs")
    if (na.startsWith(nb) || nb.startsWith(na)) return true;
    // One contains the other (e.g. "python3" contains "python")
    if (na.includes(nb) || nb.includes(na)) return true;
    return false;
};

/* ─── Build a Map<mentorId, Set<lowercasedSkill>> from approved mentors ── */
const buildMentorSkillMap = async () => {
    const approvedMentors = await User.find({
        isMentor:               true,
        mentorApplicationStatus: "approved",
    }).select("_id skills_offered");

    const mentorIds   = approvedMentors.map(m => m._id);
    const applications = await MentorApplication.find({
        user:   { $in: mentorIds },
        status: { $in: ["approved", "pending"] },  // include pending so skills show up even before approval
    }).select("user skills");

    // userId → raw skill name Set
    const map = {};
    for (const m of approvedMentors) {
        const uid = m._id.toString();
        map[uid] = new Set((m.skills_offered || []).map(s => s.toLowerCase()));
    }
    for (const app of applications) {
        const uid = app.user.toString();
        if (!map[uid]) map[uid] = new Set();
        for (const s of (app.skills || [])) map[uid].add(s.toLowerCase());
    }
    return map;
};

/* ─── Count how many DISTINCT mentors match a given skill name ──────────── */
const countMentorsForSkill = (skillName, mentorSkillMap) => {
    let count = 0;
    for (const skillSet of Object.values(mentorSkillMap)) {
        for (const mentorSkill of skillSet) {
            if (skillsMatch(skillName, mentorSkill)) {
                count++;
                break; // count each mentor only once per skill
            }
        }
    }
    return count;
};

// GET all skills — with real mentor count per skill (only approved mentors)
// Also surfaces virtual skill entries from mentor profiles not in Skills collection
const getSkillsWithMentorCount = async (req, res) => {
    try {
        const skills        = await Skill.find({ isActive: true }).sort({ createdAt: -1 });
        const mentorSkillMap = await buildMentorSkillMap();

        // ── Enrich Skills collection entries ──
        const enriched = skills.map(skill => ({
            ...skill.toObject(),
            mentors:   countMentorsForSkill(skill.name, mentorSkillMap),
            isVirtual: false,
        }));

        // ── Generate virtual entries from mentor skills not covered by Skills collection ──
        // Collect all unique raw skill names across all mentors
        const allMentorSkills = new Map(); // normName → { displayName, uids }
        for (const [uid, skillSet] of Object.entries(mentorSkillMap)) {
            for (const raw of skillSet) {
                const norm = normSkill(raw);
                if (!norm) continue;
                // Is this skill already covered by a Skills-collection entry?
                const coveredByCollection = skills.some(s => skillsMatch(s.name, raw));
                if (coveredByCollection) continue;

                if (!allMentorSkills.has(norm)) {
                    // Capitalize first letter for display
                    const display = raw.charAt(0).toUpperCase() + raw.slice(1);
                    allMentorSkills.set(norm, { displayName: display, uids: new Set() });
                }
                allMentorSkills.get(norm).uids.add(uid);
            }
        }

        const virtual = Array.from(allMentorSkills.values())
            .filter(v => v.uids.size > 0)  // only include if at least 1 mentor has it
            .map((v, i) => ({
                _id:       `virtual_${i}`,
                name:      v.displayName,
                category:  "Other",
                mentors:   v.uids.size,
                isActive:  true,
                isVirtual: true,
            }));

        const all = [...enriched, ...virtual].sort((a, b) => b.mentors - a.mentors);

        res.status(200).json({
            success: true,
            count:   all.length,
            skills:  all,
        });
    } catch (error) {
        console.error("Get Skills Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch skills" });
    }
};

// GET all skills (original — kept for backward compat)
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    console.error("Get Skills Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
};

// GET single skill
const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill || !skill.isActive) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      skill,
    });
  } catch (error) {
    console.error("Get Skill Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch skill",
    });
  }
};

// CREATE skill
const createSkill = async (req, res) => {
  try {
    const { name, category, description, level, icon } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Skill name and category are required",
      });
    }

    const existingSkill = await Skill.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill already exists",
      });
    }

    const skill = await Skill.create({
      name,
      category,
      description,
      level,
      icon,
      createdBy: req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    console.error("Create Skill Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create skill",
    });
  }
};

// UPDATE skill
const updateSkill = async (req, res) => {
  try {
     console.log("PARAM ID:", req.params.id);
    console.log("BODY:", req.body);

    const { name, category, description, level, icon } = req.body;

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    skill.name = name ?? skill.name;
    skill.category = category ?? skill.category;
    skill.description = description ?? skill.description;
    skill.level = level ?? skill.level;
    skill.icon = icon ?? skill.icon;

    await skill.save();

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    console.error("Update Skill Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update skill",
    });
  }
};

// delete
const deleteSkill = async (req, res) => {
     
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete skill",
    });
  }
};

module.exports = {
  getSkillsWithMentorCount,
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
/**
 * migrateSkills.js
 *
 * One-time migration: copies skills from MentorApplication.skills → User.skills_offered
 * for every approved mentor whose skills_offered array is still empty.
 *
 * Run automatically on server start (idempotent — safe to run every time).
 */

const User              = require("../models/user");
const MentorApplication = require("../models/MentorApplication");

module.exports = async function migrateSkills() {
    try {
        // Find all approved mentors whose skills_offered is still empty
        const mentors = await User.find({
            isMentor: true,
            mentorApplicationStatus: "approved",
            $or: [
                { skills_offered: { $exists: false } },
                { skills_offered: { $size: 0 } },
            ],
        }).select("_id skills_offered");

        if (mentors.length === 0) {
            console.log("[migrateSkills] No mentors need skills migration.");
            return;
        }

        console.log(`[migrateSkills] Migrating skills for ${mentors.length} approved mentor(s)...`);

        let updated = 0;
        for (const mentor of mentors) {
            const app = await MentorApplication.findOne({
                user:   mentor._id,
                status: "approved",
            });

            if (!app || !app.skills || app.skills.length === 0) continue;

            // Deduplicate (case-insensitive) against existing
            const existing = new Set((mentor.skills_offered || []).map(s => s.toLowerCase()));
            const toAdd    = app.skills.filter(s => !existing.has(s.toLowerCase()));

            if (toAdd.length > 0) {
                await User.findByIdAndUpdate(mentor._id, {
                    $addToSet: { skills_offered: { $each: toAdd } },
                });
                updated++;
                console.log(`[migrateSkills]   → ${mentor._id} skills added: ${toAdd.join(", ")}`);
            }
        }

        console.log(`[migrateSkills] Done — updated ${updated} mentor(s).`);
    } catch (err) {
        console.error("[migrateSkills] Error:", err.message);
    }
};

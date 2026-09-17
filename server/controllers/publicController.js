const User    = require("../models/user");
const Skill   = require("../models/skill");
const Session = require("../models/Session");
const Review  = require("../models/Review");

const getPublicStats = async (req, res) => {
  try {
    const verifiedStudents    = await User.countDocuments({ role: { $ne: "admin" } });
    const skillsAvailable     = await Skill.countDocuments();
    const successfulExchanges = await Session.countDocuments({ status: "completed" });

    let averageRating = null;
    const reviewCount = await Review.countDocuments();
    if (reviewCount > 0) {
      const agg = await Review.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]);
      averageRating = agg[0] ? agg[0].avg : null;
    }

    res.json({
      success: true,
      verifiedStudents,
      skillsAvailable,
      successfulExchanges,
      averageRating: averageRating !== null ? Math.round(averageRating * 10) / 10 : null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPublicStats };

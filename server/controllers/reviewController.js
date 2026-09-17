const Review = require('../models/Review');
const User = require('../models/user');
const earnCoins = require('../utils/earnCoins');
const { createNotification } = require('./notificationController');

const createReview = async (req, res) => {
  try {
    const student = req.user._id;
    const { mentorId, sessionId, skill, rating, comment } = req.body;

    const existing = await Review.findOne({ student, mentor: mentorId, session: sessionId });
    if (existing) return res.status(400).json({ success: false, message: 'Review already submitted for this session' });

    const review = await Review.create({
      student,
      mentor: mentorId,
      session: sessionId,
      skill,
      rating,
      comment
    });

    const mentorReviews = await Review.find({ mentor: mentorId });
    const totalRatings = mentorReviews.length;
    const avgRating = mentorReviews.reduce((acc, r) => acc + r.rating, 0) / totalRatings;

    await User.findByIdAndUpdate(mentorId, {
      rating: avgRating,
      totalRatings
    });

    await earnCoins(mentorId, 10, 'review', 'Received a review');

    // Notify the mentor about the new review
    await createNotification({
      userId:     mentorId,
      title:      `⭐ New ${rating}-Star Review`,
      message:    `${req.user.name} left you a ${rating}-star review${skill ? ` for ${skill}` : ''}: "${comment?.slice(0, 60)}${comment?.length > 60 ? '...' : ''}"`,
      type:       'Achievements',
      targetRole: 'mentor',
      link:       '/mentor/reviews',
      button:     'View Review',
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMentorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ mentor: req.params.mentorId })
      .populate('student', 'name profilePicture')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('student', 'name email')
      .populate('mentor', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    const mentorId = review.mentor;
    await Review.findByIdAndDelete(req.params.id);

    const mentorReviews = await Review.find({ mentor: mentorId });
    const totalRatings = mentorReviews.length;
    const avgRating = totalRatings > 0 ? mentorReviews.reduce((acc, r) => acc + r.rating, 0) / totalRatings : 0;

    await User.findByIdAndUpdate(mentorId, {
      rating: avgRating,
      totalRatings
    });

    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createReview, getMentorReviews, getAdminReviews, deleteReview };

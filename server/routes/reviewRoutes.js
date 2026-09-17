const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/reviewController');

router.post('/', protect, ctrl.createReview);
router.get('/mentor/:mentorId', protect, ctrl.getMentorReviews);

module.exports = router;

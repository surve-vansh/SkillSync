const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/testController');

router.get('/mine', protect, ctrl.getMentorTests);
router.get('/stats', protect, ctrl.getStudentStats);
router.get('/', protect, ctrl.getActiveTests);
router.post('/', protect, ctrl.createTest);
router.get('/:id', protect, ctrl.getTestById);
router.post('/:id/attempt', protect, ctrl.submitAttempt);
router.get('/:id/attempts', protect, ctrl.getTestAttempts);

module.exports = router;

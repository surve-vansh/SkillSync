const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/sessionController');

router.post('/', protect, ctrl.createSession);
router.get('/mine', protect, ctrl.getStudentSessions);
router.get('/mentor', protect, ctrl.getMentorSessions);
router.get('/stats', protect, ctrl.getSessionStats);
router.put('/:id/status', protect, ctrl.updateSessionStatus);
router.put('/:id/meeting-link', protect, ctrl.updateMeetingLink);

module.exports = router;

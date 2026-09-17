const Session = require('../models/Session');
const Conversation = require('../models/Conversation');
const { createNotification } = require('./notificationController');

const createSession = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { studentId, skill, title, description, scheduledDate, startTime, duration, meetingLink } = req.body;
    
    let conv = await Conversation.findOne({ student: studentId, mentor: mentorId });
    let conversationId = conv ? conv._id : null;

    const session = await Session.create({
      student: studentId,
      mentor: mentorId,
      conversation: conversationId,
      skill,
      title,
      description,
      scheduledDate,
      startTime,
      duration,
      meetingLink
    });

    await createNotification({
      userId:     studentId,
      title:      "New Session Scheduled 📅",
      message:    `Your mentor scheduled a session: "${title}"`,
      type:       "Sessions",
      targetRole: "student",
      link:       "/sessions",
      button:     "View Session",
    });

    res.status(201).json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getStudentSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ student: req.user._id })
      .populate('mentor', 'name profilePicture email')
      .sort({ createdAt: -1 });
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMentorSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ mentor: req.user._id })
      .populate('student', 'name profilePicture email')
      .sort({ createdAt: -1 });
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, mentor: req.user._id },
      { status },
      { new: true }
    );
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateMeetingLink = async (req, res) => {
  try {
    const { meetingLink } = req.body;
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, mentor: req.user._id },
      { meetingLink },
      { new: true }
    );
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSessionStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const isMentor = req.user.isMentor;
    const filter = isMentor ? { mentor: userId } : { student: userId };
    
    const sessions = await Session.find(filter);
    const stats = {
      total: sessions.length,
      upcoming: sessions.filter(s => s.status === 'upcoming').length,
      ongoing: sessions.filter(s => s.status === 'ongoing').length,
      completed: sessions.filter(s => s.status === 'completed').length,
      cancelled: sessions.filter(s => s.status === 'cancelled').length,
    };
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createSession,
  getStudentSessions,
  getMentorSessions,
  updateSessionStatus,
  updateMeetingLink,
  getSessionStats
};

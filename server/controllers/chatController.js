const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const ensureConversation = async (studentId, mentorId, requestId) => {
  let conv = await Conversation.findOne({ student: studentId, mentor: mentorId });
  if (!conv) {
    conv = await Conversation.create({ student: studentId, mentor: mentorId, request: requestId });
  }
  return conv;
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.query; // "student" | "mentor" | undefined

    let filter;
    if (role === 'student') {
      // Only conversations where this user IS the student
      filter = { student: userId };
    } else if (role === 'mentor') {
      // Only conversations where this user IS the mentor
      filter = { mentor: userId };
    } else {
      // Fallback (no role param): return all — backward compat
      filter = { $or: [{ student: userId }, { mentor: userId }] };
    }

    const convs = await Conversation.find(filter)
      .populate('student', 'name profilePicture email')
      .populate('mentor',  'name profilePicture email')
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, conversations: convs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });
    if (conv.student.toString() !== userId && conv.mentor.toString() !== userId)
      return res.status(403).json({ success: false, message: 'Access denied' });
    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { text, type = 'text' } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ success: false, message: 'Message text required' });
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });
    if (conv.student.toString() !== userId && conv.mentor.toString() !== userId)
      return res.status(403).json({ success: false, message: 'Access denied' });
    const msg = await Message.create({ conversation: conv._id, sender: userId, text: text.trim(), type });
    // Update conv
    conv.lastMessage = text.trim().substring(0, 60);
    conv.lastMessageAt = new Date();
    // Increment unread for OTHER participant
    if (conv.student.toString() === userId) conv.mentorUnread += 1;
    else conv.studentUnread += 1;
    await conv.save();
    const populated = await msg.populate('sender', 'name profilePicture');
    res.status(201).json({ success: true, message: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const markRead = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });
    if (conv.student.toString() === userId) conv.studentUnread = 0;
    else conv.mentorUnread = 0;
    await conv.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage, markRead, ensureConversation };

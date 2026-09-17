const mongoose = require('mongoose');
const conversationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date },
  studentUnread: { type: Number, default: 0 },
  mentorUnread:  { type: Number, default: 0 },
}, { timestamps: true });
conversationSchema.index({ student: 1, mentor: 1 }, { unique: true });
module.exports = mongoose.model('Conversation', conversationSchema);

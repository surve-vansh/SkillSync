const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
  student:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  skill:        { type: String, default: '' },
  title:        { type: String, required: true },
  description:  { type: String, default: '' },
  scheduledDate:{ type: String, default: '' },
  startTime:    { type: String, default: '' },
  duration:     { type: String, default: '60 min' },
  meetingLink:  { type: String, default: '' },
  status:       { type: String, enum: ['upcoming','ongoing','completed','cancelled'], default: 'upcoming' },
}, { timestamps: true });
module.exports = mongoose.model('Session', sessionSchema);

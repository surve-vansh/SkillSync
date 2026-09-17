const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ['text','meeting_link','resource','system'], default: 'text' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Message', messageSchema);

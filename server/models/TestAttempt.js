const mongoose = require('mongoose');
const attemptSchema = new mongoose.Schema({
  student:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test:       { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  answers:    [{ type: Number }],
  score:      { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  passed:     { type: Boolean, default: false },
  coinsEarned:{ type: Number, default: 0 },
  completedAt:{ type: Date, default: Date.now },
}, { timestamps: true });
module.exports = mongoose.model('TestAttempt', attemptSchema);

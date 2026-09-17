const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  skill:   { type: String, default: '' },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '', maxlength: 1000 },
}, { timestamps: true });
reviewSchema.index({ student: 1, mentor: 1, session: 1 }, { unique: true });
module.exports = mongoose.model('Review', reviewSchema);

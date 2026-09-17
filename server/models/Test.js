const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  question:     { type: String, required: true },
  options:      [{ type: String }],
  correctIndex: { type: Number, required: true },
  explanation:  { type: String, default: '' },
});
const testSchema = new mongoose.Schema({
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:        { type: String, required: true },
  description:  { type: String, default: '' },
  skill:        { type: String, required: true },
  difficulty:   { type: String, enum: ['Beginner','Intermediate','Advanced'], default: 'Beginner' },
  questions:    [questionSchema],
  duration:     { type: Number, default: 10 },
  coinReward:   { type: Number, default: 20 },
  passingScore: { type: Number, default: 60 },
  status:       { type: String, enum: ['active','inactive'], default: 'active' },
  totalAttempts:{ type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('Test', testSchema);

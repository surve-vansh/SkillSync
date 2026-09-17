const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:      { type: Number, required: true },
  type:        { type: String, enum: ['welcome','session','test','review','milestone','spend','other'], default: 'other' },
  description: { type: String, default: '' },
  reference:   { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('Transaction', transactionSchema);

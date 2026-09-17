const Transaction = require('../models/Transaction');
const earnCoins = require('../utils/earnCoins');

const getBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check if welcome transaction needed
    const txCount = await Transaction.countDocuments({ user: userId });
    if (txCount === 0 && req.user.skillCoins === 100) {
      const welcomeExists = await Transaction.findOne({ user: userId, type: 'welcome' });
      if (!welcomeExists) {
        await Transaction.create({ user: userId, amount: 100, type: 'welcome', description: 'Welcome bonus' });
      }
    }
    
    res.json({ success: true, skillCoins: req.user.skillCoins });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const spendCoins = async (req, res) => {
  try {
    const { amount, description } = req.body;
    if (req.user.skillCoins < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }
    const user = await earnCoins(req.user._id, -amount, 'spend', description);
    res.json({ success: true, skillCoins: user.skillCoins });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getBalance, getTransactions, spendCoins, earnCoins };

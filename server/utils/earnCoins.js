const User = require('../models/user');
const Transaction = require('../models/Transaction');

const earnCoins = async (userId, amount, type, description, reference = '') => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { skillCoins: amount } },
    { new: true }
  );
  await Transaction.create({ user: userId, amount, type, description, reference });
  return user;
};

module.exports = earnCoins;

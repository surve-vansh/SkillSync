const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getBalance, getTransactions, spendCoins } = require('../controllers/walletController');

router.get('/balance', protect, getBalance);
router.get('/transactions', protect, getTransactions);
router.put('/spend', protect, spendCoins);

module.exports = router;

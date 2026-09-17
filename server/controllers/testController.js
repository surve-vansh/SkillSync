const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');
const earnCoins = require('../utils/earnCoins');

const createTest = async (req, res) => {
  try {
    const { title, description, skill, difficulty, questions, duration, coinReward, passingScore } = req.body;
    const test = await Test.create({
      createdBy: req.user._id,
      title, description, skill, difficulty, questions, duration, coinReward, passingScore
    });
    res.status(201).json({ success: true, test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getActiveTests = async (req, res) => {
  try {
    const tests = await Test.find({ status: 'active' }).populate('createdBy', 'name');
    
    // Remove correctIndex from questions for students
    const safeTests = tests.map(t => {
      const tObj = t.toObject();
      if (tObj.questions) {
        tObj.questions = tObj.questions.map(q => {
          delete q.correctIndex;
          return q;
        });
      }
      return tObj;
    });

    res.json({ success: true, tests: safeTests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMentorTests = async (req, res) => {
  try {
    const tests = await Test.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, tests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    
    const tObj = test.toObject();
    if (tObj.questions) {
      tObj.questions = tObj.questions.map(q => {
        delete q.correctIndex;
        return q;
      });
    }
    res.json({ success: true, test: tObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const submitAttempt = async (req, res) => {
  try {
    const studentId = req.user._id;
    const testId = req.params.id;
    const { answers } = req.body;

    const prevPassed = await TestAttempt.findOne({ student: studentId, test: testId, passed: true });
    if (prevPassed) return res.status(400).json({ success: false, message: 'Already passed this test' });

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });

    let correct = 0;
    let total = test.questions.length;
    let results = [];

    test.questions.forEach((q, i) => {
      const isCorrect = answers[i] === q.correctIndex;
      if (isCorrect) correct++;
      results.push({ correct: isCorrect });
    });

    const percentage = (correct / total) * 100;
    const passed = percentage >= test.passingScore;
    const coinsEarned = passed ? test.coinReward : 0;

    if (passed) {
      await earnCoins(studentId, test.coinReward, 'test', `Passed test: ${test.title}`, testId.toString());
    }

    test.totalAttempts += 1;
    await test.save();

    const attempt = await TestAttempt.create({
      student: studentId,
      test: testId,
      answers,
      score: correct,
      percentage,
      passed,
      coinsEarned
    });

    res.json({ success: true, score: correct, percentage, passed, coinsEarned, correct, total, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getTestAttempts = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ test: req.params.id })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, attempts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getStudentStats = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ student: req.user._id });
    const taken = attempts.length;
    const passed = attempts.filter(a => a.passed).length;
    const coinsEarned = attempts.reduce((acc, a) => acc + a.coinsEarned, 0);
    const avgScore = taken > 0 ? (attempts.reduce((acc, a) => acc + a.percentage, 0) / taken) : 0;

    res.json({ success: true, stats: { taken, passed, avgScore, coinsEarned } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createTest,
  getActiveTests,
  getMentorTests,
  getTestById,
  submitAttempt,
  getTestAttempts,
  getStudentStats
};

/**
 * Quiz Controller
 * Handles interactive learning quiz
 */

const fs = require('fs');
const path = require('path');
const User = require('../models/User.json-model');

const quizQuestionsPath = path.join(__dirname, '../data/quiz-questions.json');

/**
 * @desc    Get all quiz questions
 * @route   GET /api/quiz/questions
 * @access  Public
 */
exports.getQuestions = (req, res) => {
  try {
    const questions = JSON.parse(fs.readFileSync(quizQuestionsPath, 'utf8'));

    // Remove correct answers from public response
    const publicQuestions = questions.map(q => ({
      id: q.id,
      card: q.card,
      cardNumber: q.cardNumber,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty
    }));

    res.status(200).json({
      success: true,
      data: {
        questions: publicQuestions,
        total: questions.length
      }
    });

  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'QUESTIONS_FETCH_FAILED',
        message: 'Failed to load quiz questions'
      }
    });
  }
};

/**
 * @desc    Submit quiz answer and update progress
 * @route   POST /api/quiz/submit
 * @access  Private
 */
exports.submitAnswer = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { questionId, answerIndex } = req.body;

    if (!questionId || answerIndex === undefined) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_DATA',
          message: 'Question ID and answer index required'
        }
      });
    }

    // Load questions
    const questions = JSON.parse(fs.readFileSync(quizQuestionsPath, 'utf8'));
    const question = questions.find(q => q.id === questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'QUESTION_NOT_FOUND',
          message: 'Question not found'
        }
      });
    }

    // Check answer
    const isCorrect = answerIndex === question.correctAnswer;

    // Get user and update progress
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Initialize quiz progress if not exists
    if (!user.quizProgress) {
      user.quizProgress = {
        completed: [],
        correct: [],
        incorrect: [],
        startedAt: new Date().toISOString()
      };
    }

    // Update progress
    if (!user.quizProgress.completed.includes(questionId)) {
      user.quizProgress.completed.push(questionId);

      if (isCorrect) {
        user.quizProgress.correct.push(questionId);
      } else {
        user.quizProgress.incorrect.push(questionId);
      }

      user.quizProgress.lastAttemptAt = new Date().toISOString();

      // Check if quiz completed
      if (user.quizProgress.completed.length === questions.length) {
        user.quizProgress.completedAt = new Date().toISOString();

        // Award achievement
        if (!user.achievements) user.achievements = [];
        if (!user.achievements.find(a => a.id === 'tarot-scholar')) {
          user.achievements.push({
            id: 'tarot-scholar',
            name: 'Таро Учёный',
            description: 'Завершили обучающий квиз',
            icon: '🎓',
            unlockedAt: new Date().toISOString()
          });
        }
      }

      await user.save();
    }

    // Calculate score
    const totalQuestions = questions.length;
    const correctAnswers = user.quizProgress.correct.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    res.status(200).json({
      success: true,
      data: {
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        progress: {
          completed: user.quizProgress.completed.length,
          total: totalQuestions,
          score,
          isCompleted: user.quizProgress.completed.length === totalQuestions
        }
      }
    });

  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SUBMIT_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Get user quiz progress
 * @route   GET /api/quiz/progress
 * @access  Private
 */
exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    const questions = JSON.parse(fs.readFileSync(quizQuestionsPath, 'utf8'));
    const totalQuestions = questions.length;

    const progress = user.quizProgress || {
      completed: [],
      correct: [],
      incorrect: []
    };

    const score = progress.correct.length > 0
      ? Math.round((progress.correct.length / totalQuestions) * 100)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        progress: {
          completed: progress.completed || [],
          correct: progress.correct || [],
          incorrect: progress.incorrect || [],
          total: totalQuestions,
          score,
          isCompleted: progress.completed?.length === totalQuestions,
          startedAt: progress.startedAt,
          completedAt: progress.completedAt
        }
      }
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROGRESS_FETCH_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Reset quiz progress
 * @route   POST /api/quiz/reset
 * @access  Private
 */
exports.resetProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    user.quizProgress = {
      completed: [],
      correct: [],
      incorrect: [],
      startedAt: new Date().toISOString()
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Quiz progress reset successfully'
    });

  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'RESET_FAILED',
        message: error.message
      }
    });
  }
};

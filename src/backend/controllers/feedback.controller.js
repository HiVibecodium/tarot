/**
 * Feedback Controller
 * Handles user feedback submissions
 */

const fs = require('fs');
const path = require('path');

// In serverless (Vercel), use /tmp or skip file storage
const IS_SERVERLESS = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;

// Feedback storage directory - use /tmp in serverless, local data dir otherwise
const FEEDBACK_DIR = IS_SERVERLESS
  ? '/tmp/feedback'
  : path.join(__dirname, '..', '..', '..', 'data', 'feedback');

// Ensure feedback directory exists (only if not serverless or /tmp is writable)
try {
  if (!fs.existsSync(FEEDBACK_DIR)) {
    fs.mkdirSync(FEEDBACK_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Could not create feedback directory:', err.message);
}

/**
 * Submit feedback
 * POST /api/feedback
 */
exports.submitFeedback = async (req, res) => {
  try {
    const { type, message, email, url, userAgent, timestamp } = req.body;

    // Validate input
    if (!type || !message) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Type and message are required'
        }
      });
    }

    // Validate type
    const validTypes = ['bug', 'suggestion', 'compliment'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid feedback type'
        }
      });
    }

    // Create feedback object
    const feedback = {
      id: Date.now().toString(),
      type,
      message: message.trim().substring(0, 1000), // Limit to 1000 chars
      email: email || null,
      url: url || null,
      userAgent: userAgent || null,
      userId: req.user?.userId || null,
      timestamp: timestamp || new Date().toISOString(),
      status: 'new'
    };

    // Save to file (append to JSON array)
    const feedbackFile = path.join(FEEDBACK_DIR, 'feedback.json');
    let feedbackList = [];

    if (fs.existsSync(feedbackFile)) {
      const data = fs.readFileSync(feedbackFile, 'utf8');
      try {
        feedbackList = JSON.parse(data);
      } catch (e) {
        // If JSON is corrupted, start fresh
        feedbackList = [];
      }
    }

    feedbackList.push(feedback);

    // Save back to file
    fs.writeFileSync(feedbackFile, JSON.stringify(feedbackList, null, 2), 'utf8');

    // Also save individual file for easy reading
    const individualFile = path.join(FEEDBACK_DIR, `feedback-${feedback.id}.json`);
    fs.writeFileSync(individualFile, JSON.stringify(feedback, null, 2), 'utf8');

    // Log feedback submission
    console.log(`📬 New feedback received: ${type} - ${message.substring(0, 50)}...`);

    res.json({
      success: true,
      data: {
        message: 'Feedback submitted successfully',
        feedbackId: feedback.id
      }
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to submit feedback'
      }
    });
  }
};

/**
 * Get all feedback (admin only)
 * GET /api/feedback
 */
exports.getFeedback = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized'
        }
      });
    }

    const feedbackFile = path.join(FEEDBACK_DIR, 'feedback.json');

    if (!fs.existsSync(feedbackFile)) {
      return res.json({
        success: true,
        data: {
          feedback: []
        }
      });
    }

    const data = fs.readFileSync(feedbackFile, 'utf8');
    const feedbackList = JSON.parse(data);

    // Sort by timestamp (newest first)
    feedbackList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      data: {
        feedback: feedbackList,
        total: feedbackList.length
      }
    });

  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to retrieve feedback'
      }
    });
  }
};

/**
 * Update feedback status (admin only)
 * PATCH /api/feedback/:id
 */
exports.updateFeedbackStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized'
        }
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'in-progress', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid status'
        }
      });
    }

    const feedbackFile = path.join(FEEDBACK_DIR, 'feedback.json');

    if (!fs.existsSync(feedbackFile)) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Feedback not found'
        }
      });
    }

    const data = fs.readFileSync(feedbackFile, 'utf8');
    const feedbackList = JSON.parse(data);

    const feedbackIndex = feedbackList.findIndex(f => f.id === id);

    if (feedbackIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Feedback not found'
        }
      });
    }

    feedbackList[feedbackIndex].status = status;
    feedbackList[feedbackIndex].updatedAt = new Date().toISOString();

    fs.writeFileSync(feedbackFile, JSON.stringify(feedbackList, null, 2), 'utf8');

    res.json({
      success: true,
      data: {
        feedback: feedbackList[feedbackIndex]
      }
    });

  } catch (error) {
    console.error('Update feedback status error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update feedback status'
      }
    });
  }
};

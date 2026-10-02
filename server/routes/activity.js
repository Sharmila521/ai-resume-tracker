
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const {
  createActivity,
  getActivities,
  deleteActivity,
} = require('../controllers/activityController');


// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================
const authenticate = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    const token = authorization.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();

  } catch (error) {
    console.error(
      '❌ Activity authentication error:',
      error.message
    );

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};


// ==========================================
// ACTIVITY ROUTES
// ==========================================

// Create activity
router.post(
  '/',
  authenticate,
  createActivity
);

// Get logged-in user's activities
router.get(
  '/',
  authenticate,
  getActivities
);

// Delete activity
router.delete(
  '/:id',
  authenticate,
  deleteActivity
);


module.exports = router;


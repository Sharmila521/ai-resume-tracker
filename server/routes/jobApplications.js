const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/jobApplicationController');


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
      '❌ Job application authentication error:',
      error.message
    );

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};


// ==========================================
// JOB APPLICATION ROUTES
// ==========================================

// Add application
router.post(
  '/',
  authenticate,
  createApplication
);

// Get all applications
router.get(
  '/',
  authenticate,
  getApplications
);

// Get one application
router.get(
  '/:id',
  authenticate,
  getApplication
);

// Update application
router.put(
  '/:id',
  authenticate,
  updateApplication
);

// Delete application
router.delete(
  '/:id',
  authenticate,
  deleteApplication
);


module.exports = router;
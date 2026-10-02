const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const {
  analyzeResume
} = require('../controllers/geminiController');


// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

const authenticate = (req, res, next) => {

  try {

    const authorization =
      req.headers.authorization;


    // ------------------------------------------
    // CHECK AUTHORIZATION HEADER
    // ------------------------------------------

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {

      return res.status(401).json({

        success: false,

        message:
          'No authentication token provided'

      });

    }


    // ------------------------------------------
    // GET TOKEN
    // ------------------------------------------

    const token =
      authorization.split(' ')[1];


    // ------------------------------------------
    // VERIFY TOKEN
    // ------------------------------------------

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // ------------------------------------------
    // SAVE USER ID
    // ------------------------------------------

    req.userId =
      decoded.userId;


    next();


  } catch (error) {

    console.error(
      '❌ Gemini authentication error:',
      error.message
    );


    return res.status(401).json({

      success: false,

      message:
        'Invalid or expired token'

    });

  }

};


// ==========================================
// ANALYZE RESUME
// ==========================================

router.post(
  '/analyze',
  authenticate,
  analyzeResume
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;
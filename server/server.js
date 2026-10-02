
// ==========================================
// AI RESUME TRACKER - SERVER
// ==========================================

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();

// ==========================================
// PORT
// ==========================================

const PORT = process.env.PORT || 5000;

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = /^http:\/\/localhost:\d+$/;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin
      // Example: Postman
      if (!origin) {
        return callback(null, true);
      }

      // Allow any localhost port
      if (allowedOrigins.test(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error('Not allowed by CORS')
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ]
  })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

// ==========================================
// FILE UPLOAD
// ==========================================

app.use(
  fileUpload({
    useTempFiles: false,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  })
);

// ==========================================
// MONGODB CONNECTION
// ==========================================

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/ai-resume-tracker';

console.log(
  '=========================================='
);

console.log(
  '🔌 CONNECTING TO MONGODB...'
);

console.log(
  '=========================================='
);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(
      '✅ MongoDB connected successfully'
    );

    console.log(
      'Database:',
      mongoose.connection.name
    );
  })
  .catch((error) => {
    console.error(
      '❌ MongoDB connection failed'
    );

    console.error(
      error.message
    );
  });

// ==========================================
// MODELS
// ==========================================

const User = require('./models/User');

const Resume = require('./models/Resume');

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

const authenticate = (
  req,
  res,
  next
) => {
  try {
    const authorization =
      req.headers.authorization;

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

    const token =
      authorization.split(' ')[1];

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.userId =
      decoded.userId;

    next();

  } catch (error) {
    console.error(
      'Authentication error:',
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
// AUTH ROUTES
// ==========================================

const authRoutes =
  require('./routes/auth');

app.use(
  '/api/auth',
  authRoutes
);

// ==========================================
// RESUME ROUTES
// ==========================================

const resumeRoutes =
  require('./routes/resume');

app.use(
  '/api/resumes',
  resumeRoutes
);

// ==========================================
// JOB APPLICATION ROUTES
// ==========================================

const jobApplicationRoutes =
  require('./routes/jobApplications');

app.use(
  '/api/job-applications',
  jobApplicationRoutes
);

// ==========================================
// ACTIVITY ROUTES
// ==========================================

const activityRoutes =
  require('./routes/activity');

app.use(
  '/api/activity',
  activityRoutes
);

// ==========================================
// GEMINI ROUTES
// ==========================================

const geminiRoutes =
  require('./routes/gemini');

app.use(
  '/api/gemini',
  geminiRoutes
);

// ==========================================
// DASHBOARD ROUTES
// ==========================================

const dashboardRoutes =
  require('./routes/dashboard');

app.use(
  '/api/dashboard',
  authenticate,
  dashboardRoutes
);

// ==========================================
// TEST ROUTE
// ==========================================

app.get(
  '/',
  (req, res) => {
    res.json({
      success: true,
      message:
        'AI Resume Tracker Backend is running'
    });
  }
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get(
  '/api/health',
  (req, res) => {
    res.json({
      success: true,
      message:
        'Server is healthy',

      database:
        mongoose.connection.readyState === 1
          ? 'connected'
          : 'disconnected'
    });
  }
);

// ==========================================
// GET USER PROFILE
// ==========================================

app.get(
  '/api/user/profile',
  authenticate,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.userId
        ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            'User not found'
        });
      }

      res.json({
        success: true,
        user
      });

    } catch (error) {
      console.error(
        '❌ Profile error:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          'Failed to get profile'
      });
    }
  }
);

// ==========================================
// UPDATE USER PROFILE
// ==========================================

app.put(
  '/api/user/profile',
  authenticate,
  async (req, res) => {
    try {
      const {
        fullName,
        email,
        avatar
      } = req.body;

      const user =
        await User.findById(
          req.userId
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            'User not found'
        });
      }

      // ------------------------------------------
      // UPDATE NAME
      // ------------------------------------------

      if (fullName) {
        user.fullName =
          fullName.trim();
      }

      // ------------------------------------------
      // UPDATE EMAIL
      // ------------------------------------------

      if (email) {
        user.email =
          email
            .toLowerCase()
            .trim();
      }

      // ------------------------------------------
      // UPDATE AVATAR
      // ------------------------------------------

      if (avatar) {
        user.avatar =
          avatar;
      }

      await user.save();

      res.json({
        success: true,
        message:
          'Profile updated successfully',

        user: {
          id: user._id,
          fullName:
            user.fullName,
          email:
            user.email,
          avatar:
            user.avatar
        }
      });

    } catch (error) {
      console.error(
        '❌ Profile update error:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          'Failed to update profile'
      });
    }
  }
);

// ==========================================
// 404 ROUTE
// ==========================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        `Route not found: ${req.method} ${req.originalUrl}`
    });
  }
);

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      '=========================================='
    );

    console.error(
      '❌ SERVER ERROR'
    );

    console.error(
      error
    );

    console.error(
      '=========================================='
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        'Internal server error'
    });
  }
);

// ==========================================
// START SERVER
// ==========================================

app.listen(
  PORT,
  () => {
    console.log('');

    console.log(
      '=========================================='
    );

    console.log(
      '🚀 AI RESUME TRACKER SERVER'
    );

    console.log(
      '=========================================='
    );

    console.log(
      `✅ Server running on: http://localhost:${PORT}`
    );

    console.log(
      '✅ CORS: All localhost ports allowed'
    );

    console.log(
      '=========================================='
    );
  }
);




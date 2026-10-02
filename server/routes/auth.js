
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();


// ======================================================
// REGISTER
// ======================================================
router.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email and password are required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: cleanEmail,
      password,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('❌ REGISTER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
});


// ======================================================
// LOGIN
// ======================================================
router.post('/login', async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const passwordMatched =
      await user.matchPassword(password);

    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
});


// ======================================================
// GOOGLE LOGIN
// ======================================================
router.post('/google', async (req, res) => {
  try {
    const {
      fullName,
      email,
      googleId,
      avatar,
    } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: 'Google information is required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    let user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      user = await User.create({
        fullName: fullName || 'Google User',
        email: cleanEmail,
        googleId,
        avatar: avatar || null,
      });
    } else {
      user.googleId = googleId;

      if (avatar) {
        user.avatar = avatar;
      }

      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error('❌ GOOGLE LOGIN ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Google login failed',
    });
  }
});


// ======================================================
// GITHUB LOGIN
// ======================================================
router.post('/github', async (req, res) => {
  try {
    const {
      fullName,
      email,
      githubId,
      avatar,
    } = req.body;

    if (!email || !githubId) {
      return res.status(400).json({
        success: false,
        message: 'GitHub information is required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    let user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      user = await User.create({
        fullName: fullName || 'GitHub User',
        email: cleanEmail,
        githubId,
        avatar: avatar || null,
      });
    } else {
      user.githubId = githubId;

      if (avatar) {
        user.avatar = avatar;
      }

      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return res.status(200).json({
      success: true,
      message: 'GitHub login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error('❌ GITHUB LOGIN ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'GitHub login failed',
    });
  }
});


// ======================================================
// GET PROFILE
// ======================================================
router.get('/profile', async (req, res) => {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    const token =
      authorization.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(
      '❌ GET PROFILE ERROR:',
      error.message
    );

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
});


// ======================================================
// UPDATE PROFILE
// ======================================================
router.put('/profile', async (req, res) => {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    const token =
      authorization.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      fullName,
      email,
      phone,
      university,
      major,
    } = req.body;

    if (fullName !== undefined) {
      user.fullName = fullName.trim();
    }

    if (email !== undefined) {
      user.email = email.trim().toLowerCase();
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (university !== undefined) {
      user.university = university;
    }

    if (major !== undefined) {
      user.major = major;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        university: user.university,
        major: user.major,
        notifications: user.notifications,
      },
    });

  } catch (error) {
    console.error(
      '❌ UPDATE PROFILE ERROR:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
});


// ======================================================
// CHANGE PASSWORD
// ======================================================
router.put('/change-password', async (req, res) => {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    const token =
      authorization.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          'Current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          'New password must be at least 6 characters',
      });
    }

    const passwordMatched =
      await user.matchPassword(currentPassword);

    if (!passwordMatched) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });

  } catch (error) {
    console.error(
      '❌ CHANGE PASSWORD ERROR:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to update password',
    });
  }
});


// ======================================================
// GET NOTIFICATION PREFERENCES
// ======================================================
router.get('/notifications', async (req, res) => {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    const token =
      authorization.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    ).select('notifications');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const notifications =
      user.notifications || {
        emailUpdates: true,
        jobAlerts: true,
        interviewReminders: true,
        weeklyReport: false,
      };

    return res.status(200).json({
      success: true,
      notifications,
    });

  } catch (error) {
    console.error(
      '❌ GET NOTIFICATIONS ERROR:',
      error.message
    );

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
});


// ======================================================
// UPDATE NOTIFICATION PREFERENCES
// ======================================================
router.put('/notifications', async (req, res) => {
  try {
    console.log('');
    console.log(
      '=========================================='
    );
    console.log(
      '🔔 UPDATE NOTIFICATION PREFERENCES'
    );
    console.log(
      '=========================================='
    );

    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    const token =
      authorization.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      emailUpdates,
      jobAlerts,
      interviewReminders,
      weeklyReport,
    } = req.body;

    const currentNotifications =
      user.notifications || {
        emailUpdates: true,
        jobAlerts: true,
        interviewReminders: true,
        weeklyReport: false,
      };

    user.notifications = {
      emailUpdates:
        typeof emailUpdates === 'boolean'
          ? emailUpdates
          : currentNotifications.emailUpdates,

      jobAlerts:
        typeof jobAlerts === 'boolean'
          ? jobAlerts
          : currentNotifications.jobAlerts,

      interviewReminders:
        typeof interviewReminders === 'boolean'
          ? interviewReminders
          : currentNotifications.interviewReminders,

      weeklyReport:
        typeof weeklyReport === 'boolean'
          ? weeklyReport
          : currentNotifications.weeklyReport,
    };

    await user.save();

    console.log(
      '✅ NOTIFICATION PREFERENCES SAVED'
    );
    console.log(user.notifications);
    console.log(
      '=========================================='
    );

    return res.status(200).json({
      success: true,
      message:
        'Notification preferences saved successfully',
      notifications: user.notifications,
    });

  } catch (error) {
    console.error(
      '❌ UPDATE NOTIFICATIONS ERROR:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to save notification preferences',
    });
  }
});


// ======================================================
// EXPORT ROUTER
// ======================================================
module.exports = router;





const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC USER INFORMATION
    // =========================
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
    },

    // =========================
    // PROFILE INFORMATION
    // =========================
    phone: {
      type: String,
      default: '',
      trim: true,
    },

    university: {
      type: String,
      default: '',
      trim: true,
    },

    major: {
      type: String,
      default: '',
      trim: true,
    },

    // =========================
    // NOTIFICATION SETTINGS
    // =========================
    notifications: {
      emailUpdates: {
        type: Boolean,
        default: true,
      },

      jobAlerts: {
        type: Boolean,
        default: true,
      },

      interviewReminders: {
        type: Boolean,
        default: true,
      },

      weeklyReport: {
        type: Boolean,
        default: false,
      },
    },

    // =========================
    // SOCIAL LOGIN
    // =========================
    googleId: {
      type: String,
      default: null,
    },

    githubId: {
      type: String,
      default: null,
    },

    avatar: {
      type: String,
      default: null,
    },

    // =========================
    // DATE
    // =========================
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// =========================
// PASSWORD HASHING
// =========================
userSchema.pre('save', async function () {
  // Do not hash password again when updating
  // profile or notification settings.
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

// =========================
// PASSWORD CHECK
// =========================
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    return false;
  }

  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);


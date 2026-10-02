
const Activity = require('../models/Activity');

// ==========================================
// CREATE ACTIVITY
// ==========================================
exports.createActivity = async (req, res) => {
  try {
    const {
      type,
      message,
      details,
    } = req.body;

    if (!type || !message) {
      return res.status(400).json({
        success: false,
        message: 'Activity type and message are required',
      });
    }

    const activity = await Activity.create({
      userId: req.userId,
      type,
      message,
      details: details || '',
    });

    console.log('==========================================');
    console.log('📝 ACTIVITY CREATED');
    console.log('Type:', activity.type);
    console.log('Message:', activity.message);
    console.log('User ID:', activity.userId);
    console.log('Activity ID:', activity._id);
    console.log('==========================================');

    return res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      activity,
    });

  } catch (error) {
    console.error(
      '❌ Create activity error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to create activity',
    });
  }
};


// ==========================================
// GET ALL ACTIVITIES FOR LOGGED-IN USER
// ==========================================
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    console.log('==========================================');
    console.log('📋 ACTIVITIES FETCHED');
    console.log('Count:', activities.length);
    console.log('User ID:', req.userId);
    console.log('==========================================');

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });

  } catch (error) {
    console.error(
      '❌ Get activities error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
    });
  }
};


// ==========================================
// DELETE ACTIVITY
// ==========================================
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Activity deleted successfully',
    });

  } catch (error) {
    console.error(
      '❌ Delete activity error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to delete activity',
    });
  }
};


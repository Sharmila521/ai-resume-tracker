const JobApplication = require('../models/JobApplication');

// ==========================================
// CREATE JOB APPLICATION
// ==========================================
exports.createApplication = async (req, res) => {
  try {
    const {
      company,
      position,
      status,
      appliedDate,
      salary,
      location,
      jobUrl,
      notes,
    } = req.body;

    // Validate required fields
    if (!company || !position || !appliedDate) {
      return res.status(400).json({
        success: false,
        message: 'Company, position and applied date are required.',
      });
    }

    const application = await JobApplication.create({
      userId: req.userId,
      company,
      position,
      status: status || 'pending',
      appliedDate,
      salary: salary || '',
      location: location || '',
      jobUrl: jobUrl || '',
      notes: notes || '',
    });

    console.log('==========================================');
    console.log('💼 JOB APPLICATION CREATED');
    console.log('User ID:', req.userId);
    console.log('Company:', application.company);
    console.log('Position:', application.position);
    console.log('Application ID:', application._id);
    console.log('==========================================');

    return res.status(201).json({
      success: true,
      message: 'Job application added successfully.',
      application,
    });

  } catch (error) {
    console.error(
      '❌ Create job application error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to create job application.',
    });
  }
};


// ==========================================
// GET ALL JOB APPLICATIONS
// ==========================================
exports.getApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({
      userId: req.userId,
    }).sort({
      appliedDate: -1,
    });

    return res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    console.error(
      '❌ Get job applications error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch job applications.',
    });
  }
};


// ==========================================
// GET SINGLE JOB APPLICATION
// ==========================================
exports.getApplication = async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });

  } catch (error) {
    console.error(
      '❌ Get single job application error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch job application.',
    });
  }
};


// ==========================================
// UPDATE JOB APPLICATION
// ==========================================
exports.updateApplication = async (req, res) => {
  try {
    const {
      company,
      position,
      status,
      appliedDate,
      salary,
      location,
      jobUrl,
      notes,
    } = req.body;

    const application = await JobApplication.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
      });
    }

    // Update only the fields that were provided
    if (company !== undefined) {
      application.company = company;
    }

    if (position !== undefined) {
      application.position = position;
    }

    if (status !== undefined) {
      application.status = status;
    }

    if (appliedDate !== undefined) {
      application.appliedDate = appliedDate;
    }

    if (salary !== undefined) {
      application.salary = salary;
    }

    if (location !== undefined) {
      application.location = location;
    }

    if (jobUrl !== undefined) {
      application.jobUrl = jobUrl;
    }

    if (notes !== undefined) {
      application.notes = notes;
    }

    application.updatedAt = new Date();

    await application.save();

    console.log('==========================================');
    console.log('✏️ JOB APPLICATION UPDATED');
    console.log('Application ID:', application._id);
    console.log('Company:', application.company);
    console.log('==========================================');

    return res.status(200).json({
      success: true,
      message: 'Job application updated successfully.',
      application,
    });

  } catch (error) {
    console.error(
      '❌ Update job application error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to update job application.',
    });
  }
};


// ==========================================
// DELETE JOB APPLICATION
// ==========================================
exports.deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
      });
    }

    console.log('==========================================');
    console.log('🗑️ JOB APPLICATION DELETED');
    console.log('Application ID:', application._id);
    console.log('Company:', application.company);
    console.log('==========================================');

    return res.status(200).json({
      success: true,
      message: 'Job application deleted successfully.',
      id: application._id,
    });

  } catch (error) {
    console.error(
      '❌ Delete job application error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to delete job application.',
    });
  }
};
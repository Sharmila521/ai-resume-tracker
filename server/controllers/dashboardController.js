const Resume = require('../models/Resume');

// ==========================================
// GET DASHBOARD DATA
// @route GET /api/dashboard
// ==========================================

exports.getDashboardData = async (req, res) => {
  try {
    console.log('==========================================');
    console.log('📊 DASHBOARD REQUEST');
    console.log('User ID:', req.userId);
    console.log('==========================================');

    // ==========================================
    // GET LOGGED-IN USER'S RESUMES
    // ==========================================

    const resumes = await Resume.find({
      userId: req.userId
    })
      .select('-fileData')
      .sort({
        uploadedAt: -1
      });

    console.log(
      '📄 Resumes found:',
      resumes.length
    );

    // ==========================================
    // RESUME COUNT
    // ==========================================

    const resumeCount = resumes.length;

    // ==========================================
    // LATEST RESUME
    // ==========================================

    const latestResume =
      resumes.length > 0
        ? resumes[0]
        : null;

    // ==========================================
    // ATS SCORES
    // ==========================================

    const atsScores = resumes
      .map((resume) => resume.atsScore)
      .filter(
        (score) =>
          typeof score === 'number' &&
          score >= 0
      );

    // ==========================================
    // CURRENT ATS SCORE
    // ==========================================

    const currentAtsScore =
      resumes.length > 0 &&
      typeof resumes[0].atsScore === 'number'
        ? resumes[0].atsScore
        : 0;

    // ==========================================
    // AVERAGE ATS SCORE
    // ==========================================

    let averageScore = 0;

    if (atsScores.length > 0) {
      averageScore =
        atsScores.reduce(
          (sum, score) => sum + score,
          0
        ) / atsScores.length;
    }

    // ==========================================
    // RECENT VERSIONS
    // ==========================================

    const recentVersions = resumes
      .slice(0, 5)
      .map((item) => ({
        _id: item._id,

        fileName:
          item.title ||
          item.fileName ||
          'Untitled Resume',

        status:
          item.status ||
          'optimized',

        atsScore:
          typeof item.atsScore === 'number'
            ? item.atsScore
            : 0,

        uploadedAt:
          item.uploadedAt ||
          item.createdAt
      }));

    // ==========================================
    // ACTIVITY FEED
    // ==========================================

    const activityFeed = resumes.map(
      (item) => ({
        type: 'resume',

        message:
          `Uploaded/Analyzed: ${
            item.title ||
            item.fileName ||
            'Untitled Resume'
          }`,

        time:
          item.uploadedAt ||
          item.createdAt
            ? new Date(
                item.uploadedAt ||
                item.createdAt
              ).toLocaleDateString()
            : ''
      })
    );

    // ==========================================
    // SCORE EVOLUTION
    // ==========================================

    const scoreEvolution = resumes
      .slice()
      .reverse()
      .map((resume, index) => {

        const date =
          resume.uploadedAt ||
          resume.createdAt;

        return {
          month: date
            ? new Date(date).toLocaleDateString(
                'en-US',
                {
                  month: 'short'
                }
              )
            : `Version ${index + 1}`,

          score:
            typeof resume.atsScore === 'number'
              ? resume.atsScore
              : 0
        };
      });

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({

      success: true,

      data: {

        // Main ATS score
        atsScore: currentAtsScore,

        // Average ATS score
        averageATSScore:
          Math.round(averageScore),

        // Resume count
        resumeCount,

        // Latest resume
        latestResume,

        // Applications
        applicationsTracked: 0,

        // Interviews
        interviewRequests: 0,

        // Chart data
        scoreEvolution,

        // Recent versions
        recentVersions,

        // Activity
        activityFeed
      }
    });

  } catch (error) {

    console.error(
      '❌ Dashboard error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to load dashboard',

      error:
        error.message
    });
  }
};
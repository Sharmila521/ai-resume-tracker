
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();


const {
  createResume,
  getResumes,
  getLatestResume,
  extractResumeText
} = require('../controllers/resumeController');



// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

const authenticate = (req, res, next) => {

  try {

    // ------------------------------------------
    // GET AUTHORIZATION HEADER
    // ------------------------------------------

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

    const decoded = jwt.verify(

      token,

      process.env.JWT_SECRET

    );


    // ------------------------------------------
    // SAVE USER ID
    // ------------------------------------------

    req.userId =
      decoded.userId;


    // ------------------------------------------
    // CONTINUE
    // ------------------------------------------

    next();


  } catch (error) {

    console.error(
      '❌ Resume authentication error:',
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
// RESUME ROUTES
// ==========================================



// ==========================================
// UPLOAD RESUME
// ==========================================
// POST /api/resumes
// ==========================================

router.post(

  '/',

  authenticate,

  createResume

);



// ==========================================
// GET LATEST RESUME
// ==========================================
// GET /api/resumes/latest
// ==========================================

router.get(

  '/latest',

  authenticate,

  getLatestResume

);



// ==========================================
// EXTRACT PDF TEXT
// ==========================================
// POST /api/resumes/:id/extract
// ==========================================

router.post(

  '/:id/extract',

  authenticate,

  extractResumeText

);



// ==========================================
// GET ALL USER RESUMES
// ==========================================
// GET /api/resumes
// ==========================================

router.get(

  '/',

  authenticate,

  getResumes

);



// ==========================================
// VIEW RESUME
// ==========================================
// GET /api/resumes/:id/view
// ==========================================

router.get(

  '/:id/view',

  authenticate,

  async (req, res) => {

    try {

      console.log(
        '=========================================='
      );

      console.log(
        '👁️ VIEW RESUME REQUEST'
      );

      console.log(
        'Resume ID:',
        req.params.id
      );

      console.log(
        'User ID:',
        req.userId
      );


      // ------------------------------------------
      // IMPORT RESUME MODEL
      // ------------------------------------------

      const Resume =
        require('../models/Resume');


      // ------------------------------------------
      // FIND USER'S RESUME
      // ------------------------------------------

      const resume =
        await Resume.findOne({

          _id: req.params.id,

          userId: req.userId

        });


      // ------------------------------------------
      // CHECK RESUME
      // ------------------------------------------

      if (!resume) {

        console.log(
          '❌ Resume not found'
        );

        return res.status(404).json({

          success: false,

          message:
            'Resume not found'

        });

      }


      // ------------------------------------------
      // CHECK PDF DATA
      // ------------------------------------------

      if (!resume.fileData) {

        console.log(
          '❌ PDF data not available'
        );

        return res.status(404).json({

          success: false,

          message:
            'Resume file not available'

        });

      }


      console.log(
        '✅ Resume found:',
        resume.fileName
      );

      console.log(
        '📦 File size:',
        resume.fileData.length,
        'bytes'
      );


      // ------------------------------------------
      // SEND PDF TO BROWSER
      // ------------------------------------------

      res.set({

        'Content-Type':
          'application/pdf',

        'Content-Disposition':
          `inline; filename="${resume.fileName}"`,

        'Content-Length':
          resume.fileData.length

      });


      return res.send(
        resume.fileData
      );


    } catch (error) {

      console.error(
        '❌ VIEW RESUME ERROR:',
        error
      );


      return res.status(500).json({

        success: false,

        message:
          'Failed to view resume'

      });

    }

  }

);



// ==========================================
// DOWNLOAD RESUME
// ==========================================
// GET /api/resumes/:id/download
// ==========================================

router.get(

  '/:id/download',

  authenticate,

  async (req, res) => {

    try {

      console.log(
        '=========================================='
      );

      console.log(
        '⬇️ DOWNLOAD RESUME REQUEST'
      );

      console.log(
        'Resume ID:',
        req.params.id
      );

      console.log(
        'User ID:',
        req.userId
      );


      // ------------------------------------------
      // IMPORT RESUME MODEL
      // ------------------------------------------

      const Resume =
        require('../models/Resume');


      // ------------------------------------------
      // FIND USER'S RESUME
      // ------------------------------------------

      const resume =
        await Resume.findOne({

          _id: req.params.id,

          userId: req.userId

        });


      // ------------------------------------------
      // CHECK RESUME
      // ------------------------------------------

      if (!resume) {

        console.log(
          '❌ Resume not found'
        );

        return res.status(404).json({

          success: false,

          message:
            'Resume not found'

        });

      }


      // ------------------------------------------
      // CHECK PDF DATA
      // ------------------------------------------

      if (!resume.fileData) {

        console.log(
          '❌ PDF data not available'
        );

        return res.status(404).json({

          success: false,

          message:
            'Resume file not available'

        });

      }


      console.log(
        '✅ Resume found:',
        resume.fileName
      );


      // ------------------------------------------
      // FORCE DOWNLOAD
      // ------------------------------------------

      res.set({

        'Content-Type':
          'application/pdf',

        'Content-Disposition':
          `attachment; filename="${resume.fileName}"`,

        'Content-Length':
          resume.fileData.length

      });


      return res.send(
        resume.fileData
      );


    } catch (error) {

      console.error(
        '❌ DOWNLOAD RESUME ERROR:',
        error
      );


      return res.status(500).json({

        success: false,

        message:
          'Failed to download resume'

      });

    }

  }

);



// ==========================================
// DELETE RESUME
// ==========================================
// DELETE /api/resumes/:id
// ==========================================

router.delete(

  '/:id',

  authenticate,

  async (req, res) => {

    try {

      console.log(
        '=========================================='
      );

      console.log(
        '🗑️ DELETE RESUME REQUEST'
      );

      console.log(
        'Resume ID:',
        req.params.id
      );

      console.log(
        'User ID:',
        req.userId
      );


      // ------------------------------------------
      // IMPORT RESUME MODEL
      // ------------------------------------------

      const Resume =
        require('../models/Resume');


      // ------------------------------------------
      // FIND AND DELETE ONLY USER'S RESUME
      // ------------------------------------------

      const deletedResume =
        await Resume.findOneAndDelete({

          _id: req.params.id,

          userId: req.userId

        });


      // ------------------------------------------
      // CHECK IF RESUME EXISTS
      // ------------------------------------------

      if (!deletedResume) {

        console.log(
          '❌ Resume not found'
        );

        return res.status(404).json({

          success: false,

          message:
            'Resume not found'

        });

      }


      console.log(
        '✅ Resume deleted successfully'
      );

      console.log(
        'Deleted file:',
        deletedResume.fileName
      );


      // ------------------------------------------
      // SUCCESS RESPONSE
      // ------------------------------------------

      return res.status(200).json({

        success: true,

        message:
          'Resume deleted successfully',

        data: {

          id:
            deletedResume._id,

          fileName:
            deletedResume.fileName

        }

      });


    } catch (error) {

      console.error(
        '❌ DELETE RESUME ERROR:',
        error
      );


      return res.status(500).json({

        success: false,

        message:
          'Failed to delete resume'

      });

    }

  }

);



// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;


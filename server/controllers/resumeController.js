const Resume = require('../models/Resume');
const { PDFParse } = require('pdf-parse');

// ==========================================
// CREATE / UPLOAD RESUME
// ==========================================

exports.createResume = async (req, res) => {
  try {
    console.log('==========================================');
    console.log('📄 CREATE RESUME');
    console.log('User ID:', req.userId);
    console.log('==========================================');

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'User is not authenticated'
      });
    }

    // Check whether file exists
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume PDF file'
      });
    }

    const file = req.files.file;

    console.log('File name:', file.name);
    console.log('File size:', file.size);
    console.log('File type:', file.mimetype);

    // ==========================================
    // VALIDATE FILE TYPE
    // ==========================================

    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed'
      });
    }

    // ==========================================
    // VALIDATE FILE SIZE
    // ==========================================

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'Resume file must be less than 5 MB'
      });
    }

    // ==========================================
    // GET CURRENT RESUME COUNT
    // ==========================================

    const resumeCount = await Resume.countDocuments({
      userId: req.userId
    });

    const version = `v${resumeCount + 1}`;

    console.log('New version:', version);

    // ==========================================
    // CREATE RESUME
    // ==========================================

    const resume = new Resume({
      userId: req.userId,

      fileName: file.name,

      fileSize: file.size,

      fileData: file.data,

      atsScore: null,

      status: 'uploaded',

      version: version,

      analysis: {
        scores: {
          ats: 0,
          keyword: 0,
          formatting: 0,
          impact: 0,
          clarity: 0
        },

        strengths: [],

        issues: [],

        presentKeywords: [],

        missingKeywords: [],

        suggestions: []
      }
    });

    await resume.save();

    console.log('==========================================');
    console.log('✅ RESUME SAVED TO MONGODB');
    console.log('Resume ID:', resume._id);
    console.log('File:', resume.fileName);
    console.log('Version:', resume.version);
    console.log('==========================================');

    return res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        id: resume._id,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        version: resume.version,
        status: resume.status,
        uploadedAt: resume.uploadedAt
      }
    });

  } catch (error) {

    console.error('==========================================');
    console.error('❌ CREATE RESUME ERROR');
    console.error(error);
    console.error('==========================================');

    return res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: error.message
    });
  }
};


// ==========================================
// GET ALL USER RESUMES
// ==========================================

exports.getResumes = async (req, res) => {
  try {
    console.log('==========================================');
    console.log('📄 GET ALL RESUMES');
    console.log('User ID:', req.userId);
    console.log('==========================================');

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'User is not authenticated'
      });
    }

    const resumes = await Resume.find({
      userId: req.userId
    })
      .select('-fileData')
      .sort({
        uploadedAt: -1
      });

    console.log('Number of resumes:', resumes.length);

    return res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });

  } catch (error) {

    console.error('==========================================');
    console.error('❌ GET RESUMES ERROR');
    console.error(error);
    console.error('==========================================');

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes',
      error: error.message
    });
  }
};


// ==========================================
// GET LATEST RESUME
// ==========================================

exports.getLatestResume = async (req, res) => {
  try {
    console.log('==========================================');
    console.log('📄 GET LATEST RESUME');
    console.log('User ID:', req.userId);
    console.log('==========================================');

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'User is not authenticated'
      });
    }

    const resume = await Resume.findOne({
      userId: req.userId
    })
      .select('-fileData')
      .sort({
        uploadedAt: -1
      });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No resume found'
      });
    }

    console.log('Resume found:', resume.fileName);
    console.log('Resume ID:', resume._id);
    console.log('Version:', resume.version);
    console.log('Status:', resume.status);
    console.log('ATS Score:', resume.atsScore);

    console.log(
      'Analysis exists:',
      !!resume.analysis
    );

    return res.status(200).json({
      success: true,
      data: resume
    });

  } catch (error) {

    console.error('==========================================');
    console.error('❌ GET LATEST RESUME ERROR');
    console.error(error);
    console.error('==========================================');

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch latest resume',
      error: error.message
    });
  }
};


// ==========================================
// EXTRACT RESUME TEXT
// ==========================================

exports.extractResumeText = async (req, res) => {
  let parser = null;

  try {

    console.log('==========================================');
    console.log('📄 EXTRACT RESUME TEXT');
    console.log('==========================================');

    console.log('User ID:', req.userId);
    console.log('Resume ID:', req.params.id);

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'User is not authenticated'
      });
    }

    // ==========================================
    // FIND USER RESUME
    // ==========================================

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    console.log('Resume found:', resume.fileName);
    console.log('File size:', resume.fileSize);
    console.log(
      'File data type:',
      resume.fileData?.constructor?.name
    );

    if (!resume.fileData) {
      return res.status(400).json({
        success: false,
        message: 'Resume file data is missing'
      });
    }

    // ==========================================
    // PDF PARSER
    // ==========================================

    console.log('==========================================');
    console.log('📄 STARTING PDF EXTRACTION');
    console.log('==========================================');

    parser = new PDFParse({
      data: resume.fileData
    });

    const result = await parser.getText();

    const extractedText =
      result?.text || '';

    const pages =
      result?.pages?.length ||
      result?.total ||
      0;

    console.log('Number of pages:', pages);
    console.log(
      'Extracted characters:',
      extractedText.length
    );

    console.log('TEXT PREVIEW');
    console.log(
      extractedText.substring(0, 1000)
    );

    // ==========================================
    // CHECK SCANNED / IMAGE PDF
    // ==========================================

    if (!extractedText.trim()) {
      return res.status(400).json({
        success: false,
        message:
          'No readable text was found in this PDF. It may be a scanned or image-only resume.'
      });
    }

    console.log('==========================================');
    console.log('✅ PDF EXTRACTION SUCCESSFUL');
    console.log('==========================================');

    return res.status(200).json({
      success: true,
      message: 'Resume text extracted successfully',

      data: {
        resumeId: resume._id,
        fileName: resume.fileName,
        pages: pages,
        textLength: extractedText.length,
        text: extractedText
      }
    });

  } catch (error) {

    console.error('==========================================');
    console.error('❌ PDF EXTRACTION ERROR');
    console.error(error);
    console.error('==========================================');

    return res.status(500).json({
      success: false,
      message: 'Failed to extract resume text',
      error: error.message
    });

  } finally {

    if (parser) {
      try {
        await parser.destroy();
      } catch (destroyError) {
        console.error(
          'PDF parser cleanup error:',
          destroyError.message
        );
      }
    }
  }
};
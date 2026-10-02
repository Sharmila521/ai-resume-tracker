
const OpenAI = require('openai');
const Resume = require('../models/Resume');

// ==========================================
// GROQ AI CLIENT
// ==========================================

const client = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
});

// ==========================================
// SYSTEM PROMPT
// ==========================================

const SYSTEM_PROMPT = `
You are an expert ATS resume analyzer and professional resume reviewer.

Analyze the resume provided by the user.

IMPORTANT:
Return ONLY valid JSON.
Do NOT return markdown.
Do NOT use code fences.
Do NOT write explanations before or after the JSON.

Return exactly this structure:

{
  "atsScore": 0,
  "scores": {
    "ats": 0,
    "keyword": 0,
    "formatting": 0,
    "impact": 0,
    "clarity": 0
  },
  "strengths": [],
  "issues": [],
  "presentKeywords": [],
  "missingKeywords": [],
  "suggestions": [
    {
      "original": "",
      "optimized": ""
    }
  ]
}

Rules:

1. atsScore must be an integer between 0 and 100.

2. All score values must be integers between 0 and 100.

3. "ats" represents overall ATS compatibility.

4. "keyword" evaluates relevant technical and job-related keywords.

5. "formatting" evaluates ATS-friendly formatting, structure, consistency and readability.

6. "impact" evaluates achievements, action verbs and measurable results.

7. "clarity" evaluates readability, concise wording and professional communication.

8. Return exactly 5 strengths.

9. Return exactly 5 important issues.

10. presentKeywords must contain keywords actually present in the resume.

11. missingKeywords should contain useful keywords relevant to the candidate's apparent target roles that are not present in the resume.

12. Do not mark a keyword as missing if it is already present.

13. Return between 5 and 10 suggestions.

14. Every suggestion must have:
   "original"
   "optimized"

15. "original" must represent text actually found in the resume.

16. "optimized" must improve the original while remaining truthful.

17. Never invent experience.

18. Never invent certifications.

19. Never invent achievements.

20. Never invent numbers or percentages.

21. Use strong professional action verbs where appropriate.

22. Return valid JSON that can be parsed using JSON.parse().

23. Do not include comments in the JSON.

24. Do not include trailing commas.
`;

// ==========================================
// CLEAN JSON RESPONSE
// ==========================================

function cleanJsonResponse(text) {

  if (!text || typeof text !== 'string') {
    throw new Error('AI returned an empty response');
  }

  let cleaned = text.trim();

  // Remove markdown code fences if present
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');

  cleaned = cleaned.trim();

  // Extract JSON object if AI added extra text
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(
      firstBrace,
      lastBrace + 1
    );
  }

  return cleaned;
}

// ==========================================
// NORMALIZE ANALYSIS
// ==========================================

function normalizeAnalysis(data) {

  const safeNumber = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(
        100,
        Math.round(number)
      )
    );
  };


  const safeArray = (value) => {

    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(item => typeof item === 'string')
      .map(item => item.trim())
      .filter(Boolean);
  };


  const suggestions =
    Array.isArray(data.suggestions)

      ? data.suggestions
          .filter(item =>
            item &&
            typeof item === 'object' &&
            typeof item.original === 'string' &&
            typeof item.optimized === 'string'
          )
          .map(item => ({
            original: item.original.trim(),
            optimized: item.optimized.trim()
          }))
          .filter(item =>
            item.original &&
            item.optimized
          )

      : [];


  return {

    atsScore:
      safeNumber(data.atsScore),


    scores: {

      ats:
        safeNumber(data.scores?.ats),

      keyword:
        safeNumber(data.scores?.keyword),

      formatting:
        safeNumber(data.scores?.formatting),

      impact:
        safeNumber(data.scores?.impact),

      clarity:
        safeNumber(data.scores?.clarity)

    },


    strengths:
      safeArray(data.strengths).slice(0, 5),


    issues:
      safeArray(data.issues).slice(0, 5),


    presentKeywords:
      safeArray(data.presentKeywords),


    missingKeywords:
      safeArray(data.missingKeywords),


    suggestions:
      suggestions.slice(0, 10)

  };
}

// ==========================================
// ANALYZE RESUME
// POST /api/gemini/analyze
// ==========================================

const analyzeResume = async (req, res) => {

  try {

    console.log('');
    console.log('==========================================');
    console.log('🤖 STARTING GROQ RESUME ANALYSIS');
    console.log('==========================================');


    // ======================================
    // CHECK API KEY
    // ======================================

    if (!process.env.GROQ_API_KEY) {

      console.error(
        '❌ GROQ_API_KEY is missing'
      );

      return res.status(500).json({

        success: false,

        message:
          'Groq API key is not configured on the server.'

      });

    }


    // ======================================
    // GET RESUME TEXT
    // ======================================

    const { resumeText } = req.body;


    if (
      !resumeText ||
      typeof resumeText !== 'string'
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Resume text is required.'

      });

    }


    const trimmedResumeText =
      resumeText.trim();


    if (!trimmedResumeText) {

      return res.status(400).json({

        success: false,

        message:
          'Resume text is empty.'

      });

    }


    console.log(
      '📄 Resume characters:',
      trimmedResumeText.length
    );


    // IMPORTANT:
    // Do not print the complete resume
    console.log(
      '📄 Resume preview:',
      trimmedResumeText
        .substring(0, 200)
        .replace(/\n/g, ' ')
    );


    // ======================================
    // CALL GROQ
    // ======================================

    console.log(
      '🤖 Calling Groq AI...'
    );

    console.log(
      '🤖 Model: openai/gpt-oss-20b'
    );


    const completion =
      await client.chat.completions.create({

        model:
          'openai/gpt-oss-20b',


        messages: [

          {
            role: 'system',

            content:
              SYSTEM_PROMPT
          },

          {
            role: 'user',

            content: `
Analyze the following resume.

Remember:
Return ONLY the JSON object.

RESUME:

${trimmedResumeText}
`
          }

        ],


        temperature: 0.1,


        max_tokens: 4000,


        response_format: {
          type: 'json_object'
        }

      });


    // ======================================
    // GET AI RESPONSE
    // ======================================

    const choice =
      completion?.choices?.[0];


    if (!choice) {

      throw new Error(
        'Groq returned no choices'
      );

    }


    const responseText =
      choice?.message?.content;


    console.log(
      '=========================================='
    );

    console.log(
      '🤖 GROQ RESPONSE RECEIVED'
    );

    console.log(
      '=========================================='
    );


    console.log(
      'Model:',
      completion?.model
    );


    console.log(
      'Finish reason:',
      choice?.finish_reason
    );


    console.log(
      'Content length:',
      responseText?.length || 0
    );


    if (responseText) {

      console.log(
        'Content preview:',
        responseText.substring(0, 300)
      );

    }


    if (!responseText) {

      throw new Error(
        'Groq returned an empty AI response'
      );

    }


    // ======================================
    // PARSE JSON
    // ======================================

    let parsedAnalysis;


    try {

      const cleanedResponse =
        cleanJsonResponse(
          responseText
        );


      parsedAnalysis =
        JSON.parse(
          cleanedResponse
        );


      console.log(
        '✅ AI JSON parsed successfully'
      );

    } catch (jsonError) {

      console.error(
        '❌ JSON PARSE ERROR:',
        jsonError.message
      );


      console.error(
        'AI response preview:',
        responseText.substring(0, 500)
      );


      return res.status(502).json({

        success: false,

        message:
          'AI returned an invalid analysis format.',

        error:
          'Invalid JSON response from AI model.'

      });

    }


    // ======================================
    // NORMALIZE RESULT
    // ======================================

    const analysis =
      normalizeAnalysis(
        parsedAnalysis
      );

      // ==========================================
// SAVE AI ANALYSIS TO MONGODB
// ==========================================

const resume = await Resume.findOne({
  userId: req.userId
}).sort({
  uploadedAt: -1
});

if (!resume) {
  return res.status(404).json({
    success: false,
    message: 'Resume not found.'
  });
}

resume.atsScore = analysis.atsScore;
resume.status = 'analyzed';

resume.analysis = {
  scores: analysis.scores,
  strengths: analysis.strengths,
  issues: analysis.issues,
  presentKeywords: analysis.presentKeywords,
  missingKeywords: analysis.missingKeywords,
  suggestions: analysis.suggestions
};

await resume.save();

console.log('==========================================');
console.log('💾 AI ANALYSIS SAVED TO MONGODB');
console.log('Resume ID:', resume._id);
console.log('ATS Score:', resume.atsScore);
console.log('Status:', resume.status);
console.log('==========================================');


    // ======================================
    // SUCCESS LOG
    // ======================================

    console.log(
      '=========================================='
    );

    console.log(
      '✅ RESUME ANALYSIS SUCCESSFUL'
    );

    console.log(
      '=========================================='
    );


    console.log(
      'ATS Score:',
      analysis.atsScore
    );


    console.log(
      'Strengths:',
      analysis.strengths.length
    );


    console.log(
      'Issues:',
      analysis.issues.length
    );


    console.log(
      'Present keywords:',
      analysis.presentKeywords.length
    );


    console.log(
      'Missing keywords:',
      analysis.missingKeywords.length
    );


    console.log(
      'Suggestions:',
      analysis.suggestions.length
    );


    // ======================================
    // SEND RESULT TO FRONTEND
    // ======================================

    return res.status(200).json({

      success: true,

      message:
        'Resume analyzed successfully.',

      analysis

    });

  } catch (error) {

    console.error('');
    console.error(
      '=========================================='
    );

    console.error(
      '❌ GROQ RESUME ANALYSIS ERROR'
    );

    console.error(
      '=========================================='
    );

    console.error(
      'Error message:',
      error.message
    );


    // ======================================
    // INVALID API KEY
    // ======================================

    if (error.status === 401) {

      return res.status(401).json({

        success: false,

        message:
          'Groq API key is invalid or unauthorized.'

      });

    }


    // ======================================
    // RATE LIMIT
    // ======================================

    if (error.status === 429) {

      return res.status(429).json({

        success: false,

        message:
          'The AI service is rate-limited. Please try again later.'

      });

    }


    // ======================================
    // PROVIDER / MODEL ERROR
    // ======================================

    if (
      error.status === 502 ||
      error.status === 503
    ) {

      return res.status(502).json({

        success: false,

        message:
          'The AI model is temporarily unavailable. Please try again later.'

      });

    }


    // ======================================
    // GENERIC ERROR
    // ======================================

    return res.status(500).json({

      success: false,

      message:
        'Resume analysis failed.',

      error:
        error.message

    });

  }

};


// ==========================================
// EXPORT FUNCTION
// ==========================================

module.exports = {
  analyzeResume
};

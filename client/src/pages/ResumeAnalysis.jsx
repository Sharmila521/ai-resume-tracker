
import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import MainLayout from '../components/Layout/MainLayout';

export default function ResumeAnalysis() {

  // ==========================================
  // STATE
  // ==========================================

  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);

  const [extracting, setExtracting] = useState(false);

  const [extractedText, setExtractedText] = useState('');

  const [error, setError] = useState('');

  // Prevent duplicate API calls during
  // React StrictMode development rendering
  const analysisStartedRef = useRef(false);


  // ==========================================
  // LOAD RESUME + EXTRACT + AI ANALYSIS
  // ==========================================

  useEffect(() => {

    // ------------------------------------------
    // PREVENT DUPLICATE ANALYSIS
    // ------------------------------------------

    if (analysisStartedRef.current) {

      console.log(
        '⏭️ Resume analysis already started. Skipping duplicate call.'
      );

      return;
    }

    analysisStartedRef.current = true;


    // ------------------------------------------
    // MAIN FUNCTION
    // ------------------------------------------

    const loadResumeAndAnalyze = async () => {

      try {

        console.log('==========================================');
        console.log('📄 RESUME ANALYSIS PAGE');
        console.log('==========================================');


        // ==========================================
        // STEP 1: GET TOKEN
        // ==========================================

        const token =
          localStorage.getItem('token');

        console.log(
          '🔐 Token exists:',
          !!token
        );


        if (!token) {

          throw new Error(
            'You are not logged in. Please login again.'
          );

        }


        // ==========================================
        // STEP 2: GET LATEST RESUME
        // ==========================================

        console.log(
          '📄 FETCHING LATEST RESUME...'
        );


        const resumeResponse =
          await fetch(
            'http://localhost:5000/api/resumes/latest',
            {
              method: 'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        const resumeResult =
          await resumeResponse.json();


        console.log(
          '📄 LATEST RESUME RESPONSE:',
          resumeResult
        );


        if (!resumeResponse.ok) {

          throw new Error(
            resumeResult.message ||
            'Failed to load latest resume'
          );

        }


        // ==========================================
        // STEP 3: SAVE RESUME IN STATE
        // ==========================================

        const latestResume =
          resumeResult.data;


        if (!latestResume) {

          throw new Error(
            'No resume found. Please upload a resume first.'
          );

        }


        console.log(
          '✅ LATEST RESUME LOADED'
        );

        console.log(
          'File:',
          latestResume.fileName
        );

        console.log(
          'Version:',
          latestResume.version
        );

        console.log(
          'Status:',
          latestResume.status
        );

        console.log(
          'Resume ID:',
          latestResume._id
        );


        setResume(latestResume);


        // ==========================================
        // STEP 3.5: USE SAVED ANALYSIS IF AVAILABLE
        // ==========================================

        if (
          latestResume.status === 'analyzed' &&
          latestResume.analysis
        ) {

          console.log('==========================================');
          console.log('💾 SAVED ANALYSIS FOUND IN MONGODB');
          console.log('==========================================');

          console.log(
            'ATS SCORE FROM MONGODB:',
            latestResume.atsScore
          );

          console.log(
            'USING SAVED ANALYSIS - AI CALL SKIPPED'
          );

          setExtractedText('');

          setLoading(false);

          setExtracting(false);

          return;
        }


        // ==========================================
        // STEP 4: EXTRACT PDF TEXT
        // ==========================================

        setExtracting(true);

        setError('');


        console.log('==========================================');

        console.log(
          '📄 STARTING PDF EXTRACTION'
        );

        console.log('==========================================');


        const extractResponse =
          await fetch(
            `http://localhost:5000/api/resumes/${latestResume._id}/extract`,
            {
              method: 'POST',

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        const extractResult =
          await extractResponse.json();


        console.log(
          '📄 EXTRACTION RESPONSE:',
          extractResult
        );


        if (!extractResponse.ok) {

          throw new Error(
            extractResult.message ||
            'Resume text extraction failed'
          );

        }


        // ==========================================
        // STEP 5: GET EXTRACTED TEXT
        // ==========================================

        const text =
          extractResult.data?.text ||
          extractResult.text ||
          '';


        console.log(
          'Characters extracted:',
          text.length
        );


        console.log(
          'Text preview:',
          text.substring(0, 500)
        );


        if (!text.trim()) {

          throw new Error(
            'No readable text was found in the PDF.'
          );

        }


        setExtractedText(text);


        console.log(
          '✅ PDF EXTRACTION SUCCESSFUL'
        );


        // ==========================================
        // STEP 6: SEND TEXT TO AI
        // ==========================================

        console.log('==========================================');

        console.log(
          '🤖 STARTING AI ANALYSIS'
        );

        console.log('==========================================');


        const geminiResponse =
          await fetch(
            'http://localhost:5000/api/gemini/analyze',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`
              },

              body: JSON.stringify({
                resumeText: text
              })
            }
          );


        const geminiResult =
          await geminiResponse.json();


        console.log('==========================================');

        console.log(
          '🤖 AI RESPONSE:',
          geminiResult
        );

        console.log('==========================================');


        // ==========================================
        // STEP 7: HANDLE AI ERROR
        // ==========================================

        if (!geminiResponse.ok) {

          throw new Error(
            geminiResult.message ||
            'AI analysis failed'
          );

        }


        // ==========================================
        // STEP 8: GET AI DATA
        // ==========================================

        const analysis =
          geminiResult.analysis;


        if (!analysis) {

          console.error(
            '❌ Full AI response:',
            geminiResult
          );

          throw new Error(
            'AI returned no analysis data.'
          );

        }


        console.log(
          '=========================================='
        );

        console.log(
          '✅ AI ANALYSIS COMPLETED'
        );

        console.log(
          'ATS SCORE:',
          analysis.atsScore
        );

        console.log(
          'Scores:',
          analysis.scores
        );

        console.log(
          'Strengths:',
          analysis.strengths
        );

        console.log(
          'Issues:',
          analysis.issues
        );

        console.log(
          'Present Keywords:',
          analysis.presentKeywords
        );

        console.log(
          'Missing Keywords:',
          analysis.missingKeywords
        );

        console.log(
          'Suggestions:',
          analysis.suggestions
        );

        console.log(
          '=========================================='
        );


        // ==========================================
        // STEP 9: UPDATE UI WITH AI RESULT
        // ==========================================

        setResume(prevResume => {

          if (!prevResume) {

            return prevResume;

          }


          return {

            ...prevResume,

            atsScore:
              analysis.atsScore ?? 0,

            status:
              'analyzed',

            analysis: {

              scores:
                analysis.scores || {},

              strengths:
                analysis.strengths || [],

              issues:
                analysis.issues || [],

              presentKeywords:
                analysis.presentKeywords || [],

              missingKeywords:
                analysis.missingKeywords || [],

              suggestions:
                analysis.suggestions || []

            }

          };

        });


        console.log(
          '✅ RESUME UI UPDATED WITH AI DATA'
        );


      } catch (error) {

        console.error(
          '=========================================='
        );

        console.error(
          '❌ RESUME ANALYSIS ERROR'
        );

        console.error(
          error.message
        );

        console.error(
          '=========================================='
        );


        setError(
          error.message ||
          'Something went wrong while analyzing the resume.'
        );


      } finally {

        setExtracting(false);

        setLoading(false);

      }

    };


    // Start process
    loadResumeAndAnalyze();


  }, []);


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {

    return (

      <MainLayout>

        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">

          <div className="text-center">

            <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4">
            </div>

            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">

              Analyzing Your Resume

            </h2>

            <p className="text-slate-500 mt-2">

              Please wait while we process your resume...

            </p>

          </div>

        </div>

      </MainLayout>

    );

  }


  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error) {

    return (

      <MainLayout>

        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">

          <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 text-center">

            <div className="text-5xl mb-4">

              ⚠️

            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">

              Resume Analysis Failed

            </h2>

            <p className="text-red-500 mb-6">

              {error}

            </p>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >

              Try Again

            </button>

          </div>

        </div>

      </MainLayout>

    );

  }


  // ==========================================
  // RESUME DATA
  // ==========================================

  const atsScore =
    resume?.atsScore ?? 0;


  const analysis =
    resume?.analysis || {};


  const scores =
    analysis.scores || {};


  const strengths =
    analysis.strengths || [];


  const issues =
    analysis.issues || [];


  const presentKeywords =
    analysis.presentKeywords || [];


  const missingKeywords =
    analysis.missingKeywords || [];


  const suggestions =
    analysis.suggestions || [];


  // ==========================================
  // STATUS TEXT
  // ==========================================

  let statusText =
    'Not Analyzed Yet';


  if (extracting) {

    statusText =
      'Analyzing Resume...';

  } else if (
    resume?.status === 'analyzing'
  ) {

    statusText =
      'Analysis in progress...';

  } else if (
    resume?.status === 'analyzed'
  ) {

    if (atsScore >= 80) {

      statusText =
        'Highly Optimized';

    } else if (atsScore >= 60) {

      statusText =
        'Needs Improvement';

    } else {

      statusText =
        'Needs Major Improvement';

    }

  }


  // ==========================================
  // SCORE DATA
  // ==========================================

  const scoreItems = [

    {
      name: 'ATS Compatibility',
      score: scores.ats ?? 0
    },

    {
      name: 'Keywords',
      score: scores.keyword ?? 0
    },

    {
      name: 'Formatting',
      score: scores.formatting ?? 0
    },

    {
      name: 'Impact',
      score: scores.impact ?? 0
    },

    {
      name: 'Clarity',
      score: scores.clarity ?? 0
    }

  ];


  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <MainLayout>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">

          <div className="max-w-7xl mx-auto px-6 py-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">

                  Resume Analysis

                </h1>

                <p className="text-slate-500 mt-1">

                  AI-powered ATS analysis of your resume

                </p>

              </div>


              <div className="text-sm text-slate-500">

                {resume?.fileName}

              </div>

            </div>

          </div>

        </div>


        {/* ===================================== */}
        {/* CONTENT */}
        {/* ===================================== */}

        <main className="max-w-7xl mx-auto px-6 py-8">


          {/* =================================== */}
          {/* OVERALL ATS SCORE */}
          {/* =================================== */}

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 mb-8">

            <div className="flex flex-col md:flex-row items-center gap-8">


              {/* SCORE CIRCLE */}

              <div className="relative w-40 h-40 flex-shrink-0">

                <svg
                  className="w-full h-full -rotate-90"
                  viewBox="0 0 120 120"
                >

                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-slate-200 dark:text-slate-700"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${atsScore * 3.267} 326.7`}
                    className="text-blue-600"
                  />

                </svg>


                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <span className="text-4xl font-bold text-slate-900 dark:text-white">

                    {atsScore}

                  </span>

                  <span className="text-sm text-slate-500">

                    / 100

                  </span>

                </div>

              </div>


              {/* SCORE DETAILS */}

              <div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">

                  Overall ATS Score

                </h2>

                <p className="text-lg font-medium text-blue-600 mb-3">

                  {statusText}

                </p>

                <p className="text-slate-500">

                  Your resume has been analyzed using AI-powered ATS evaluation.

                </p>

              </div>

            </div>

          </div>


          {/* =================================== */}
          {/* SCORE BREAKDOWN */}
          {/* =================================== */}

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 mb-8">

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">

              Score Breakdown

            </h2>


            <div className="space-y-5">

              {scoreItems.map((item) => (

                <div key={item.name}>

                  <div className="flex justify-between mb-2">

                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">

                      {item.name}

                    </span>

                    <span className="text-sm font-bold text-slate-900 dark:text-white">

                      {item.score}/100

                    </span>

                  </div>


                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-700"
                      style={{
                        width: `${item.score}%`
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>


          {/* =================================== */}
          {/* STRENGTHS + ISSUES */}
          {/* =================================== */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">


            {/* STRENGTHS */}

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">

                Strengths

              </h2>


              <div className="space-y-4">

                {strengths.length > 0 ? (

                  strengths.map((strength, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >

                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">

                        ✓

                      </div>

                      <p className="text-slate-700 dark:text-slate-300">

                        {strength}

                      </p>

                    </div>

                  ))

                ) : (

                  <p className="text-slate-500">

                    No strengths available yet.

                  </p>

                )}

              </div>

            </div>


            {/* ISSUES */}

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">

                Areas for Improvement

              </h2>


              <div className="space-y-4">

                {issues.length > 0 ? (

                  issues.map((issue, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >

                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">

                        !

                      </div>

                      <p className="text-slate-700 dark:text-slate-300">

                        {issue}

                      </p>

                    </div>

                  ))

                ) : (

                  <p className="text-slate-500">

                    No improvement areas available yet.

                  </p>

                )}

              </div>

            </div>

          </div>


          {/* =================================== */}
          {/* KEYWORDS */}
          {/* =================================== */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">


            {/* PRESENT KEYWORDS */}

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">

                Present Keywords

              </h2>


              <div className="flex flex-wrap gap-2">

                {presentKeywords.length > 0 ? (

                  presentKeywords.map(
                    (keyword, index) => (

                      <span
                        key={index}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
                      >

                        {keyword}

                      </span>

                    )
                  )

                ) : (

                  <p className="text-slate-500">

                    No keywords detected.

                  </p>

                )}

              </div>

            </div>


            {/* MISSING KEYWORDS */}

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">

                Recommended Keywords

              </h2>


              <div className="flex flex-wrap gap-2">

                {missingKeywords.length > 0 ? (

                  missingKeywords.map(
                    (keyword, index) => (

                      <span
                        key={index}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                      >

                        {keyword}

                      </span>

                    )
                  )

                ) : (

                  <p className="text-slate-500">

                    No additional keywords recommended.

                  </p>

                )}

              </div>

            </div>

          </div>


          {/* =================================== */}
          {/* SUGGESTIONS */}
          {/* =================================== */}

          {suggestions.length > 0 && (

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 mb-8">

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">

                AI Suggestions

              </h2>


              <div className="space-y-5">

                {suggestions.map(
                  (suggestion, index) => {

                    const isObject =
                      typeof suggestion === 'object' &&
                      suggestion !== null;


                    return (

                      <div
                        key={index}
                        className="border border-slate-200 dark:border-slate-700 rounded-lg p-5"
                      >

                        {isObject ? (

                          <>

                            {suggestion.original && (

                              <div className="mb-3">

                                <p className="text-sm font-semibold text-slate-500 mb-1">

                                  Original

                                </p>

                                <p className="text-slate-700 dark:text-slate-300">

                                  {suggestion.original}

                                </p>

                              </div>

                            )}


                            {suggestion.optimized && (

                              <div>

                                <p className="text-sm font-semibold text-green-600 mb-1">

                                  Optimized

                                </p>

                                <p className="text-slate-700 dark:text-slate-300">

                                  {suggestion.optimized}

                                </p>

                              </div>

                            )}

                          </>

                        ) : (

                          <p className="text-slate-700 dark:text-slate-300">

                            {suggestion}

                          </p>

                        )}

                      </div>

                    );

                  }

                )}

              </div>

            </div>

          )}


          {/* =================================== */}
          {/* RESUME INFORMATION */}
          {/* =================================== */}

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">

              Resume Information

            </h2>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


              <div>

                <p className="text-sm text-slate-500 mb-1">

                  File Name

                </p>

                <p className="font-medium text-slate-900 dark:text-white break-words">

                  {resume?.fileName || 'N/A'}

                </p>

              </div>


              <div>

                <p className="text-sm text-slate-500 mb-1">

                  Version

                </p>

                <p className="font-medium text-slate-900 dark:text-white">

                  {resume?.version || 'v1'}

                </p>

              </div>


              <div>

                <p className="text-sm text-slate-500 mb-1">

                  Status

                </p>

                <p className="font-medium text-slate-900 dark:text-white">

                  {resume?.status || 'uploaded'}

                </p>

              </div>


            </div>

          </div>


          {/* =================================== */}
          {/* EXTRACTED TEXT */}
          {/* =================================== */}

          {extractedText && (

            <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">

                Resume Text Extracted

              </h2>

              <p className="text-sm text-slate-500 mb-3">

                {extractedText.length} characters extracted from your PDF.

              </p>

              <div className="max-h-48 overflow-y-auto bg-slate-50 dark:bg-slate-950 rounded-lg p-4">

                <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">

                  {extractedText}

                </pre>

              </div>

            </div>

          )}

        </main>

      </div>

    </MainLayout>

  );

}

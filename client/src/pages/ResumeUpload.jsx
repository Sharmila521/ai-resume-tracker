import { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

import MainLayout from '../components/Layout/MainLayout';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';

export default function ResumeUpload() {

  // ==========================================
  // STATE
  // ==========================================

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  const fileInputRef = useRef(null);


  // ==========================================
  // FILE VALIDATION
  // ==========================================

  const validateFile = (selectedFile) => {

    if (!selectedFile) {
      return 'Please select a file.';
    }

    // ------------------------------------------
    // CHECK PDF
    // ------------------------------------------

    if (
      selectedFile.type !==
      'application/pdf'
    ) {

      return 'Please select a PDF file only.';

    }

    // ------------------------------------------
    // CHECK SIZE
    // ------------------------------------------

    const MAX_FILE_SIZE =
      5 * 1024 * 1024;

    if (
      selectedFile.size >
      MAX_FILE_SIZE
    ) {

      return 'PDF size must be less than 5 MB.';

    }

    return '';

  };


  // ==========================================
  // FILE SELECT
  // ==========================================

  const handleFileSelect = (event) => {

    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setError('');

    setSuccess('');

    const validationError =
      validateFile(selectedFile);

    if (validationError) {

      setFile(null);

      setError(
        validationError
      );

      return;

    }

    setFile(selectedFile);

  };


  // ==========================================
  // DRAG OVER
  // ==========================================

  const handleDragOver = (event) => {

    event.preventDefault();

    event.stopPropagation();

  };


  // ==========================================
  // DROP FILE
  // ==========================================

  const handleDrop = (event) => {

    event.preventDefault();

    event.stopPropagation();

    const droppedFile =
      event.dataTransfer.files?.[0];

    if (!droppedFile) {
      return;
    }

    setError('');

    setSuccess('');

    const validationError =
      validateFile(droppedFile);

    if (validationError) {

      setFile(null);

      setError(
        validationError
      );

      return;

    }

    setFile(droppedFile);

  };


  // ==========================================
  // UPLOAD
  // ==========================================

  const handleUpload = async () => {

    if (!file) {

      setError(
        'Please select a PDF file first.'
      );

      return;

    }

    setLoading(true);

    setError('');

    setSuccess('');


    try {

      // ------------------------------------------
      // GET LOGIN TOKEN
      // ------------------------------------------

      const token =
        localStorage.getItem('token');


      console.log(
        '================================'
      );

      console.log(
        '📄 UPLOAD STARTED'
      );

      console.log(
        'File:',
        file.name
      );

      console.log(
        'Size:',
        file.size
      );

      console.log(
        'Type:',
        file.type
      );

      console.log(
        'Token:',
        token
          ? 'FOUND'
          : 'MISSING'
      );

      console.log(
        '================================'
      );


      // ------------------------------------------
      // CHECK LOGIN
      // ------------------------------------------

      if (!token) {

        setError(
          'You are not logged in. Please login again.'
        );

        return;

      }


      // ------------------------------------------
      // CREATE FORM DATA
      // ------------------------------------------

      const formData =
        new FormData();

      formData.append(
        'file',
        file
      );


      // ------------------------------------------
      // SEND PDF TO BACKEND
      // ------------------------------------------

      const response =
        await fetch(
          'http://localhost:5000/api/resumes',
          {
            method: 'POST',

            headers: {
              Authorization:
                `Bearer ${token}`
            },

            body: formData
          }
        );


      console.log(
        'Response status:',
        response.status
      );


      // ------------------------------------------
      // READ RESPONSE
      // ------------------------------------------

      const data =
        await response.json();


      console.log(
        'Response data:',
        data
      );


      // ------------------------------------------
      // HANDLE ERROR
      // ------------------------------------------

      if (!response.ok) {

        throw new Error(
          data.message ||
          'Resume upload failed'
        );

      }


      // ------------------------------------------
      // SUCCESS
      // ------------------------------------------

      const uploadedResume =
        data.resume;


      setSuccess(
        `✅ Resume uploaded successfully as ${
          uploadedResume?.version || 'v1'
        }`
      );


      // ------------------------------------------
      // CLEAR FILE
      // ------------------------------------------

      setFile(null);


      if (fileInputRef.current) {

        fileInputRef.current.value = '';

      }


      // ------------------------------------------
      // GO TO ANALYSIS
      // ------------------------------------------

      setTimeout(() => {

        window.location.href =
          '/analysis';

      }, 1500);


    } catch (error) {

      console.error(
        '❌ Upload Error:',
        error
      );

      setError(
        error.message ||
        'Error uploading file. Please check whether the backend is running.'
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // CLEAR
  // ==========================================

  const handleClear = () => {

    setFile(null);

    setError('');

    setSuccess('');

    if (fileInputRef.current) {

      fileInputRef.current.value = '';

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <MainLayout>

      <div className="max-w-2xl mx-auto">

        {/* ======================================
            PAGE HEADER
        ====================================== */}

        <h1 className="text-3xl font-bold mb-2">

          Upload Your Resume

        </h1>


        <p className="text-gray-400 mb-8">

          Upload a PDF resume to get
          AI-powered analysis and
          ATS optimization tips.

        </p>


        {/* ======================================
            MAIN CARD
        ====================================== */}

        <Card>

          {/* ====================================
              DROP ZONE
          ==================================== */}

          <div

            onDragOver={
              handleDragOver
            }

            onDrop={
              handleDrop
            }

            className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-purple-500 transition cursor-pointer"

          >

            <Upload
              className="w-12 h-12 mx-auto text-gray-400 mb-4"
            />


            <p className="text-lg font-semibold mb-2">

              Drag and drop your file here

            </p>


            <p className="text-gray-400 mb-6">

              or browse from your computer

            </p>


            {/* ==================================
                HIDDEN FILE INPUT
            ================================== */}

            <input

              ref={fileInputRef}

              type="file"

              accept="application/pdf,.pdf"

              onChange={
                handleFileSelect
              }

              className="hidden"

            />


            <Button

              onClick={() =>
                fileInputRef.current?.click()
              }

              variant="primary"

            >

              📁 Browse PDF Files

            </Button>

          </div>


          {/* ====================================
              SELECTED FILE
          ==================================== */}

          {file && (

            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500 rounded-lg flex items-center gap-3">

              <FileText
                className="w-5 h-5 text-purple-500"
              />


              <div className="flex-1">

                <p className="font-semibold break-all">

                  {file.name}

                </p>


                <p className="text-sm text-gray-400">

                  {(
                    file.size /
                    1024 /
                    1024
                  ).toFixed(2)} MB

                </p>

              </div>


              <button

                type="button"

                onClick={
                  handleClear
                }

                className="text-gray-400 hover:text-red-500"

              >

                ✕

              </button>

            </div>

          )}


          {/* ====================================
              ERROR
          ==================================== */}

          {error && (

            <div className="mt-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-start gap-3">

              <AlertCircle
                className="w-5 h-5 text-red-500 mt-0.5"
              />


              <p className="text-red-500">

                {error}

              </p>

            </div>

          )}


          {/* ====================================
              SUCCESS
          ==================================== */}

          {success && (

            <div className="mt-6 p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-start gap-3">

              <CheckCircle
                className="w-5 h-5 text-green-500 mt-0.5"
              />


              <p className="text-green-500">

                {success}

              </p>

            </div>

          )}


          {/* ====================================
              GUIDELINES
          ==================================== */}

          <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">

            <h3 className="font-semibold mb-3 flex items-center gap-2">

              ✓ ATS Parsing Guidelines

            </h3>


            <ul className="space-y-2 text-sm text-gray-400">

              <li>
                • Use standard fonts
                (Arial, Calibri, Times New Roman)
              </li>

              <li>
                • Stick to simple formatting
                without excessive styling
              </li>

              <li>
                • Include relevant technical
                keywords and skills
              </li>

              <li>
                • Separate sections clearly
                with headers
              </li>

              <li>
                • Maximum 2 pages recommended
              </li>

              <li>
                • PDF size must be less than 5 MB
              </li>

            </ul>

          </div>


          {/* ====================================
              BUTTONS
          ==================================== */}

          <div className="flex gap-4 mt-8">

            <Button

              onClick={
                handleClear
              }

              variant="secondary"

              disabled={
                loading
              }

            >

              Clear

            </Button>


            <Button

              onClick={
                handleUpload
              }

              disabled={
                !file ||
                loading
              }

              className="flex-1"

            >

              {loading
                ? '⏳ Uploading...'
                : '✓ Upload & Analyze'}

            </Button>

          </div>

        </Card>

      </div>

    </MainLayout>

  );

}

import { useEffect, useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/Common/Card';
import { Download, Trash2, Eye } from 'lucide-react';

export default function ResumeVersions() {

  const [versions, setVersions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');


  // ==========================================
  // FETCH RESUME VERSIONS
  // ==========================================

  useEffect(() => {

    const fetchVersions = async () => {

      try {

        console.log('==========================================');
        console.log('📄 FETCHING RESUME VERSIONS');
        console.log('==========================================');

        const token =
          localStorage.getItem('token');

        if (!token) {

          throw new Error(
            'You are not logged in. Please login again.'
          );

        }


        const response =
          await fetch(
            'http://localhost:5000/api/resumes',
            {
              method: 'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        const result =
          await response.json();


        console.log(
          '📄 RESUME VERSIONS RESPONSE:',
          result
        );


        if (!response.ok) {

          throw new Error(
            result.message ||
            'Failed to load resume versions'
          );

        }


        const resumes =
          result.data || [];


        console.log(
          '✅ RESUMES FOUND:',
          resumes.length
        );


        setVersions(resumes);


      } catch (error) {

        console.error(
          '❌ RESUME VERSIONS ERROR:',
          error.message
        );


        setError(
          error.message ||
          'Failed to load resume versions'
        );


      } finally {

        setLoading(false);

      }

    };


    fetchVersions();

  }, []);


  // ==========================================
  // DELETE VERSION
  // ==========================================

  const handleDelete = async (id) => {

    console.log(
      '🗑️ DELETE RESUME:',
      id
    );


    const confirmed =
      window.confirm(
        'Are you sure you want to permanently delete this resume version?'
      );


    if (!confirmed) {

      console.log(
        '❌ Delete cancelled by user'
      );

      return;
    }


    try {

      const token =
        localStorage.getItem('token');


      if (!token) {

        alert(
          'You are not logged in. Please login again.'
        );

        return;
      }


      console.log(
        '🗑️ Sending delete request...'
      );


      const response =
        await fetch(
          `http://localhost:5000/api/resumes/${id}`,
          {
            method: 'DELETE',

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      const result =
        await response.json();


      console.log(
        '🗑️ DELETE RESPONSE:',
        result
      );


      if (!response.ok) {

        throw new Error(
          result.message ||
          'Failed to delete resume'
        );

      }


      console.log(
        '✅ Resume deleted from MongoDB'
      );


      // ------------------------------------------
      // REMOVE FROM SCREEN
      // ------------------------------------------

      setVersions(
        previousVersions =>
          previousVersions.filter(
            version =>
              version._id !== id
          )
      );


      alert(
        'Resume deleted successfully.'
      );


    } catch (error) {

      console.error(
        '❌ DELETE RESUME ERROR:',
        error
      );


      alert(
        error.message ||
        'Failed to delete resume'
      );

    }

  };


  // ==========================================
  // VIEW VERSION
  // ==========================================

  const handleView = (id) => {

    console.log(
      '👁️ VIEW RESUME:',
      id
    );


    const token =
      localStorage.getItem('token');


    if (!token) {

      alert(
        'You are not logged in. Please login again.'
      );

      return;
    }


    const viewUrl =
      `http://localhost:5000/api/resumes/${id}/view`;


    console.log(
      '📄 Opening resume:',
      viewUrl
    );


    fetch(
      viewUrl,
      {
        method: 'GET',

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    )

      .then(async (response) => {

        if (!response.ok) {

          let message =
            'Failed to view resume';


          try {

            const result =
              await response.json();


            message =
              result.message ||
              message;


          } catch (error) {

            // Response was not JSON

          }


          throw new Error(message);

        }


        return response.blob();

      })


      .then((blob) => {

        console.log(
          '✅ PDF received successfully'
        );


        const pdfUrl =
          URL.createObjectURL(blob);


        window.open(
          pdfUrl,
          '_blank'
        );

      })


      .catch((error) => {

        console.error(
          '❌ VIEW RESUME ERROR:',
          error
        );


        alert(
          error.message ||
          'Failed to view resume'
        );

      });

  };


  // ==========================================
  // DOWNLOAD VERSION
  // ==========================================

  const handleDownload = (id) => {

    console.log(
      '⬇️ DOWNLOAD RESUME:',
      id
    );


    const token =
      localStorage.getItem('token');


    if (!token) {

      alert(
        'You are not logged in. Please login again.'
      );

      return;
    }


    const downloadUrl =
      `http://localhost:5000/api/resumes/${id}/download`;


    console.log(
      '📄 Download URL:',
      downloadUrl
    );


    fetch(
      downloadUrl,
      {
        method: 'GET',

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    )

      .then(async (response) => {

        if (!response.ok) {

          let message =
            'Failed to download resume';


          try {

            const result =
              await response.json();


            message =
              result.message ||
              message;


          } catch (error) {

            // Response was not JSON

          }


          throw new Error(message);

        }


        return response.blob();

      })


      .then((blob) => {

        console.log(
          '✅ PDF received successfully'
        );


        const pdfUrl =
          URL.createObjectURL(blob);


        const link =
          document.createElement('a');


        link.href =
          pdfUrl;


        link.download =
          'Resume.pdf';


        document.body.appendChild(link);


        link.click();


        document.body.removeChild(link);


        URL.revokeObjectURL(pdfUrl);


        console.log(
          '✅ Resume download started'
        );

      })


      .catch((error) => {

        console.error(
          '❌ DOWNLOAD RESUME ERROR:',
          error
        );


        alert(
          error.message ||
          'Failed to download resume'
        );

      });

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <MainLayout>

        <div className="flex items-center justify-center py-20">

          <div className="text-center">

            <div className="w-10 h-10 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4">
            </div>


            <p className="text-slate-600 dark:text-slate-400">

              Loading resume versions...

            </p>

          </div>

        </div>

      </MainLayout>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <MainLayout>

        <div className="space-y-6">

          <div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">

              Resume Versions

            </h1>


            <p className="text-slate-600 dark:text-slate-400 mt-2">

              Manage all your resume versions

            </p>

          </div>


          <Card>

            <div className="py-12 text-center">

              <div className="text-5xl mb-4">

                ⚠️

              </div>


              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">

                Failed to Load Resumes

              </h2>


              <p className="text-red-500">

                {error}

              </p>

            </div>

          </Card>

        </div>

      </MainLayout>

    );

  }


  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <MainLayout>

      <div className="space-y-6">


        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">

            Resume Versions

          </h1>


          <p className="text-slate-600 dark:text-slate-400 mt-2">

            Manage all your resume versions

          </p>

        </div>


        {/* RESUME TABLE */}

        <Card>

          {versions.length === 0 ? (

            <div className="py-12 text-center">

              <div className="text-5xl mb-4">

                📄

              </div>


              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">

                No Resume Versions

              </h2>


              <p className="text-slate-600 dark:text-slate-400">

                Upload a resume to create your first version.

              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">


                {/* TABLE HEADER */}

                <thead>

                  <tr className="border-b border-slate-200 dark:border-slate-700">


                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">

                      File Name

                    </th>


                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">

                      Version

                    </th>


                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">

                      Size

                    </th>


                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">

                      ATS Score

                    </th>


                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">

                      Status

                    </th>


                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">

                      Date

                    </th>


                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">

                      Actions

                    </th>

                  </tr>

                </thead>


                {/* TABLE BODY */}

                <tbody>

                  {versions.map((version) => (

                    <tr
                      key={version._id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                    >


                      {/* FILE NAME */}

                      <td className="py-4 px-4 text-slate-900 dark:text-white font-medium">

                        {version.fileName}

                      </td>


                      {/* VERSION */}

                      <td className="py-4 px-4">

                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">

                          {version.version || 'v1'}

                        </span>

                      </td>


                      {/* SIZE */}

                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400">

                        {version.fileSize

                          ? `${(version.fileSize / 1024).toFixed(1)} KB`

                          : 'N/A'

                        }

                      </td>


                      {/* ATS SCORE */}

                      <td className="py-4 px-4">

                        <span className="text-sm font-bold text-slate-900 dark:text-white">

                          {version.atsScore !== null &&
                           version.atsScore !== undefined

                            ? `${version.atsScore}%`

                            : 'Not analyzed'

                          }

                        </span>

                      </td>


                      {/* STATUS */}

                      <td className="py-4 px-4">

                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            version.status === 'analyzed'

                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'

                              : version.status === 'analyzing'

                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'

                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >

                          {version.status || 'uploaded'}

                        </span>

                      </td>


                      {/* DATE */}

                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400 text-sm">

                        {version.uploadedAt

                          ? new Date(
                              version.uploadedAt
                            ).toLocaleDateString()

                          : 'N/A'

                        }

                      </td>


                      {/* ACTIONS */}

                      <td className="py-4 px-4">

                        <div className="flex items-center space-x-2">


                          {/* VIEW */}

                          <button
                            onClick={() =>
                              handleView(
                                version._id
                              )
                            }
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition"
                            title="View"
                          >

                            <Eye
                              size={18}
                              className="text-indigo-600 dark:text-indigo-400"
                            />

                          </button>


                          {/* DOWNLOAD */}

                          <button
                            onClick={() =>
                              handleDownload(
                                version._id
                              )
                            }
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition"
                            title="Download"
                          >

                            <Download
                              size={18}
                              className="text-green-600 dark:text-green-400"
                            />

                          </button>


                          {/* DELETE */}

                          <button
                            onClick={() =>
                              handleDelete(
                                version._id
                              )
                            }
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition"
                            title="Delete"
                          >

                            <Trash2
                              size={18}
                              className="text-red-600 dark:text-red-400"
                            />

                          </button>


                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </Card>

      </div>

    </MainLayout>

  );

}


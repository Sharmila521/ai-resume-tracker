import { useEffect, useState } from 'react';

import {
  BarChart3,
  FileText,
  Briefcase,
  MessageSquare
} from 'lucide-react';

import MainLayout from '../components/Layout/MainLayout';

import StatCard from '../components/Cards/StatCard';

import ATSScoreCard from '../components/Cards/ATSScoreCard';

import Card from '../components/Common/Card';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function Dashboard() {

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        // ------------------------------------------
        // GET JWT TOKEN
        // ------------------------------------------

        const token =
          localStorage.getItem('token');

        if (!token) {

          throw new Error(
            'You are not logged in'
          );
        }

        console.log(
          '📊 Fetching dashboard...'
        );

        // ------------------------------------------
        // CALL BACKEND
        // ------------------------------------------

        const response =
          await fetch(
            'http://localhost:5000/api/dashboard',
            {
              method: 'GET',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        // ------------------------------------------
        // HANDLE ERROR
        // ------------------------------------------

        if (!response.ok) {

          const errorData =
            await response
              .json()
              .catch(() => ({}));

          throw new Error(
            errorData.message ||
            'Failed to fetch dashboard data'
          );
        }

        // ------------------------------------------
        // GET JSON
        // ------------------------------------------

        const result =
          await response.json();

       console.log('==========================================');
console.log('📊 FULL DASHBOARD RESPONSE');
console.log(JSON.stringify(result, null, 2));
console.log('==========================================');

        // ------------------------------------------
        // SAVE DATA
        // ------------------------------------------

        setDashboardData(
          result.data || result
        );

        setError(null);

      } catch (err) {

        console.error(
          '❌ Dashboard error:',
          err
        );

        setError(
          err.message
        );

      } finally {

        setLoading(false);
      }
    };

    fetchData();

  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <MainLayout>

        <div className="flex items-center justify-center h-96">

          <p className="text-slate-600 dark:text-slate-400 font-medium">

            Loading dashboard...

          </p>

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

        <div className="flex flex-col items-center justify-center h-96">

          <p className="text-red-600 font-semibold text-lg">

            Backend Error: {error}

          </p>

          <p className="text-slate-500 text-sm mt-2">

            Make sure you are logged in and the Node
            server is running on localhost:5000.

          </p>

        </div>

      </MainLayout>
    );
  }

  // ==========================================
  // SAFE DATA
  // ==========================================

  const currentAtsScore =
    dashboardData?.atsScore ?? 0;

  const resumeCount =
    dashboardData?.resumeCount ?? 0;

  const applicationsTracked =
    dashboardData?.applicationsTracked ?? 0;

  const interviewRequests =
    dashboardData?.interviewRequests ?? 0;

  const scoreData =
    dashboardData?.scoreEvolution || [];

  const recentVersions =
    dashboardData?.recentVersions || [];

  const activityFeed =
    dashboardData?.activityFeed || [];

  // ==========================================
  // UI
  // ==========================================

  return (

    <MainLayout>

      <div className="space-y-6">

        {/* ======================================
            WELCOME
        ====================================== */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">

            Welcome back!

          </h1>

          <p className="text-slate-600 dark:text-slate-400 mt-2">

            Here's your real-time resume performance
            overview

          </p>

        </div>


        {/* ======================================
            STATS
        ====================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            title="Current ATS Score"
            value={currentAtsScore.toString()}
            change={
              currentAtsScore > 0
                ? "Latest score"
                : "No score yet"
            }
            icon={BarChart3}
          />

          <StatCard
            title="Resume Count"
            value={resumeCount.toString()}
            change="uploaded"
            icon={FileText}
          />

          <StatCard
            title="Applications Tracked"
            value={applicationsTracked.toString()}
            change="tracked"
            icon={Briefcase}
          />

          <StatCard
            title="Interview Requests"
            value={interviewRequests.toString()}
            change="requests"
            icon={MessageSquare}
          />

        </div>


        {/* ======================================
            MAIN GRID
        ====================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          {/* ====================================
              LEFT
          ==================================== */}

          <div className="lg:col-span-2 space-y-6">


            {/* ==================================
                ATS SCORE
            ================================== */}

            <ATSScoreCard
              score={currentAtsScore}
            />


            {/* ==================================
                SCORE EVOLUTION
            ================================== */}

            <Card>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">

                Resume Score Evolution

              </h3>

              {scoreData.length > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <LineChart
                    data={scoreData}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="month"
                    />

                    <YAxis
                      domain={[0, 100]}
                    />

                    <Tooltip />

                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={{
                        fill: '#6366F1',
                        r: 5
                      }}
                      name="ATS Score"
                    />

                  </LineChart>

                </ResponsiveContainer>

              ) : (

                <div className="py-10 text-center">

                  <p className="text-slate-500 dark:text-slate-400">

                    Upload and analyze a resume
                    to see your ATS score evolution.

                  </p>

                </div>

              )}

            </Card>

          </div>


          {/* ====================================
              RIGHT
          ==================================== */}

          <div className="space-y-6">


            {/* ==================================
                RECENT VERSIONS
            ================================== */}

            <Card>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">

                Recent Versions

              </h3>

              {recentVersions.length > 0 ? (

                <div className="space-y-3">

                  {recentVersions.map(
                    (version, i) => (

                      <div
                        key={
                          version._id || i
                        }
                        className="pb-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0 last:pb-0"
                      >

                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">

                          {
                            version.fileName ||
                            version.title ||
                            'Untitled Resume'
                          }

                        </p>


                        <div className="flex items-center justify-between mt-2">

                          <span
                            className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          >

                            {
                              version.status ||
                              'uploaded'
                            }

                          </span>


                          <span className="text-sm font-bold text-slate-900 dark:text-white">

                            {
                              version.atsScore ??
                              0
                            }%

                          </span>

                        </div>


                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">

                          {
                            version.uploadedAt
                              ? new Date(
                                  version.uploadedAt
                                ).toLocaleDateString()
                              : 'Just now'
                          }

                        </p>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="py-6">

                  <p className="text-slate-500 dark:text-slate-400">

                    No resumes uploaded yet.

                  </p>

                </div>

              )}

            </Card>


            {/* ==================================
                ACTIVITY
            ================================== */}

            <Card>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">

                Latest Activity

              </h3>


              {activityFeed.length > 0 ? (

                <div className="space-y-3">

                  {activityFeed
                    .slice(0, 5)
                    .map(
                      (activity, i) => (

                        <div
                          key={i}
                          className="flex space-x-3"
                        >

                          <div
                            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              activity.type ===
                              'resume'
                                ? 'bg-green-500'
                                : activity.type ===
                                  'application'
                                ? 'bg-blue-500'
                                : 'bg-purple-500'
                            }`}
                          />

                          <div>

                            <p className="text-sm font-medium text-slate-900 dark:text-white">

                              {
                                activity.message
                              }

                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400">

                              {
                                activity.time
                              }

                            </p>

                          </div>

                        </div>

                      )
                    )}

                </div>

              ) : (

                <div className="py-6">

                  <p className="text-slate-500 dark:text-slate-400">

                    No activity logged yet.

                  </p>

                </div>

              )}

            </Card>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}
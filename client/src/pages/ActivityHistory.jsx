
import { useEffect, useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/Common/Card';

export default function ActivityHistory() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ==========================================
  // FETCH ACTIVITIES
  // ==========================================
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');

        if (!token) {
          setError('You are not logged in.');
          setLoading(false);
          return;
        }

        const response = await fetch(
          'http://localhost:5000/api/activity',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to fetch activities'
          );
        }

        setActivities(data.activities || []);

      } catch (error) {
        console.error(
          '❌ Activity history error:',
          error
        );

        setError(
          error.message || 'Failed to load activity history'
        );

      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);


  // ==========================================
  // FORMAT TIME
  // ==========================================
  const formatTime = (createdAt) => {
    const activityDate = new Date(createdAt);
    const now = new Date();

    const difference =
      Math.floor(
        (now - activityDate) / 1000
      );

    if (difference < 60) {
      return 'Just now';
    }

    const minutes =
      Math.floor(difference / 60);

    if (minutes < 60) {
      return `${minutes} ${
        minutes === 1
          ? 'minute'
          : 'minutes'
      } ago`;
    }

    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} ${
        hours === 1
          ? 'hour'
          : 'hours'
      } ago`;
    }

    const days =
      Math.floor(hours / 24);

    if (days < 7) {
      return `${days} ${
        days === 1
          ? 'day'
          : 'days'
      } ago`;
    }

    const weeks =
      Math.floor(days / 7);

    if (weeks < 4) {
      return `${weeks} ${
        weeks === 1
          ? 'week'
          : 'weeks'
      } ago`;
    }

    return activityDate.toLocaleDateString();
  };


  // ==========================================
  // COLORS
  // ==========================================
  const typeColors = {
    resume:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',

    application:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',

    interview:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',

    analysis:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',

    auth:
      'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',

    profile:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };


  // ==========================================
  // ICONS
  // ==========================================
  const icons = {
    resume: '📄',
    application: '📋',
    interview: '🎤',
    analysis: '📊',
    auth: '🔐',
    profile: '👤',
  };


  return (
    <MainLayout>
      <div className="space-y-6">

        {/* =====================================
            PAGE HEADER
        ===================================== */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Activity History
          </h1>

          <p className="text-slate-600 dark:text-slate-400 mt-2">
            View all your activities and events
          </p>
        </div>


        {/* =====================================
            LOADING
        ===================================== */}
        {loading && (
          <Card>
            <div className="flex items-center justify-center py-10">
              <p className="text-slate-600 dark:text-slate-400">
                Loading activity history...
              </p>
            </div>
          </Card>
        )}


        {/* =====================================
            ERROR
        ===================================== */}
        {!loading && error && (
          <Card>
            <div className="flex items-center justify-center py-10">
              <p className="text-red-500">
                {error}
              </p>
            </div>
          </Card>
        )}


        {/* =====================================
            EMPTY STATE
        ===================================== */}
        {!loading &&
          !error &&
          activities.length === 0 && (
            <Card>
              <div className="flex flex-col items-center justify-center py-10">

                <div className="text-4xl mb-4">
                  📋
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-white">
                  No activities yet
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Your activities will appear here.
                </p>

              </div>
            </Card>
          )}


        {/* =====================================
            ACTIVITY LIST
        ===================================== */}
        {!loading &&
          !error &&
          activities.length > 0 && (
            <div className="space-y-4">

              {activities.map((activity) => (

                <Card key={activity._id}>

                  <div className="flex items-start space-x-4">

                    {/* ICON */}
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                        typeColors[activity.type] ||
                        typeColors.resume
                      }`}
                    >
                      {icons[activity.type] || '📌'}
                    </div>


                    {/* CONTENT */}
                    <div className="flex-1">

                      <div className="flex items-start justify-between">

                        <div>

                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {activity.message}
                          </h3>

                          {activity.details && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              {activity.details}
                            </p>
                          )}

                        </div>


                        {/* TIME */}
                        <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap ml-4">
                          {formatTime(activity.createdAt)}
                        </span>

                      </div>

                    </div>

                  </div>

                </Card>

              ))}

            </div>
          )}

      </div>
    </MainLayout>
  );
}


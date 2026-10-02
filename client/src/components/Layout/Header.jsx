
import { useEffect, useState } from 'react';
import { Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {

  const navigate = useNavigate();

  // ======================================================
  // USER
  // ======================================================

  const [userName, setUserName] = useState('User');

  // ======================================================
  // NOTIFICATIONS
  // ======================================================

  const [notifications, setNotifications] = useState([]);

  const [showNotifications, setShowNotifications] =
    useState(false);


  // ======================================================
  // LOAD USER NAME
  // ======================================================

  useEffect(() => {

    const storedName =
      localStorage.getItem('userName');

    if (storedName) {
      setUserName(storedName);
    }

  }, []);


  // ======================================================
  // FETCH NOTIFICATIONS
  // ======================================================

  useEffect(() => {

    const fetchNotifications = async () => {

      try {

        const token =
          localStorage.getItem('token');

        if (!token) {
          return;
        }

        const response = await fetch(
          'http://localhost:5000/api/activity',
          {
            method: 'GET',

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        const data =
          await response.json();


        if (response.ok) {

          setNotifications(
            data.activities || []
          );

        }

      } catch (error) {

        console.error(
          '❌ Notification fetch error:',
          error
        );

      }

    };


    fetchNotifications();

  }, []);


  // ======================================================
  // SETTINGS
  // ======================================================

  const handleSettings = () => {

    navigate('/settings');

  };


  // ======================================================
  // NOTIFICATION CLICK
  // ======================================================

  const handleNotificationClick = () => {

    setShowNotifications(
      !showNotifications
    );

  };


  // ======================================================
  // GO TO ACTIVITY HISTORY
  // ======================================================

  const handleViewAllNotifications = () => {

    setShowNotifications(false);

    navigate('/history');

  };


  // ======================================================
  // USER INITIAL
  // ======================================================

  const userInitial =
    userName &&
    userName.trim().length > 0
      ? userName.trim().charAt(0).toUpperCase()
      : 'U';


  // ======================================================
  // FORMAT TIME
  // ======================================================

  const formatTime = (date) => {

    if (!date) {
      return '';
    }

    const activityDate =
      new Date(date);

    const now =
      new Date();

    const difference =
      now.getTime() -
      activityDate.getTime();

    const minutes =
      Math.floor(
        difference / (1000 * 60)
      );

    if (minutes < 1) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${
        hours > 1 ? 's' : ''
      } ago`;
    }

    const days =
      Math.floor(hours / 24);

    return `${days} day${
      days > 1 ? 's' : ''
    } ago`;

  };


  // ======================================================
  // UI
  // ======================================================

  return (

    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-20">

      {/* ============================================== */}
      {/* WELCOME */}
      {/* ============================================== */}

      <div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">

          Welcome back, {userName}!

        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400">

          Here's your resume performance

        </p>

      </div>


      {/* ============================================== */}
      {/* RIGHT SIDE */}
      {/* ============================================== */}

      <div className="flex items-center space-x-4">


        {/* ========================================== */}
        {/* NOTIFICATION */}
        {/* ========================================== */}

        <div className="relative">

          <button
            onClick={
              handleNotificationClick
            }
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition relative"
          >

            <Bell
              size={20}
              className="text-slate-600 dark:text-slate-400"
            />


            {/* NOTIFICATION DOT */}

            {notifications.length > 0 && (

              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full">
              </span>

            )}

          </button>


          {/* ======================================== */}
          {/* NOTIFICATION DROPDOWN */}
          {/* ======================================== */}

          {showNotifications && (

            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-50">


              {/* HEADER */}

              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">

                <div className="flex items-center justify-between">

                  <h3 className="font-semibold text-slate-900 dark:text-white">

                    Notifications

                  </h3>

                  <span className="text-xs text-slate-500">

                    {notifications.length}

                  </span>

                </div>

              </div>


              {/* ==================================== */}
              {/* NOTIFICATION LIST */}
              {/* ==================================== */}

              <div className="max-h-80 overflow-y-auto">

                {notifications.length === 0 ? (

                  <div className="px-4 py-8 text-center">

                    <Bell
                      size={24}
                      className="mx-auto mb-2 text-slate-400"
                    />

                    <p className="text-sm text-slate-500">

                      No notifications yet

                    </p>

                  </div>

                ) : (

                  notifications
                    .slice(0, 5)
                    .map((notification) => (

                      <div
                        key={
                          notification._id
                        }
                        className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                      >

                        <p className="text-sm font-medium text-slate-800 dark:text-white">

                          {notification.message}

                        </p>

                        {notification.details && (

                          <p className="text-xs text-slate-500 mt-1">

                            {notification.details}

                          </p>

                        )}

                        <p className="text-xs text-slate-400 mt-1">

                          {formatTime(
                            notification.createdAt
                          )}

                        </p>

                      </div>

                    ))

                )}

              </div>


              {/* ==================================== */}
              {/* VIEW ALL */}
              {/* ==================================== */}

              {notifications.length > 0 && (

                <button
                  onClick={
                    handleViewAllNotifications
                  }
                  className="w-full px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                >

                  View all activity

                </button>

              )}

            </div>

          )}

        </div>


        {/* ========================================== */}
        {/* SETTINGS */}
        {/* ========================================== */}

        <button
          onClick={
            handleSettings
          }
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
          title="Settings"
        >

          <Settings
            size={20}
            className="text-slate-600 dark:text-slate-400"
          />

        </button>


        {/* ========================================== */}
        {/* USER AVATAR */}
        {/* ========================================== */}

        <div
          className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
          onClick={
            handleSettings
          }
          title="Settings"
        >

          {userInitial}

        </div>


      </div>

    </header>

  );

}

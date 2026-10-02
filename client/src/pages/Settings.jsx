import { useEffect, useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/Common/Card';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';

import {
  Bell,
  Lock,
  User,
  LogOut,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';


export default function Settings() {

  // ======================================================
  // PROFILE
  // ======================================================

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    major: '',
  });


  // ======================================================
  // NOTIFICATIONS
  // ======================================================

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    jobAlerts: true,
    interviewReminders: true,
    weeklyReport: false,
  });


  // ======================================================
  // PASSWORD
  // ======================================================

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });


  // ======================================================
  // STATES
  // ======================================================

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [savingNotifications, setSavingNotifications] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');


  const navigate = useNavigate();


  // ======================================================
  // FETCH PROFILE + NOTIFICATIONS
  // ======================================================

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        setLoadingProfile(true);
        setError('');

        const token =
          localStorage.getItem('token');

        if (!token) {

          setError(
            'You are not logged in.'
          );

          setLoadingProfile(false);

          return;
        }


        const response = await fetch(
          'http://localhost:5000/api/auth/profile',
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


        if (!response.ok) {

          throw new Error(
            data.message ||
            'Failed to load profile'
          );
        }


        // -----------------------------
        // PROFILE
        // -----------------------------

        setProfile({
          fullName:
            data.user.fullName || '',

          email:
            data.user.email || '',

          phone:
            data.user.phone || '',

          university:
            data.user.university || '',

          major:
            data.user.major || '',
        });


        // -----------------------------
        // NOTIFICATIONS
        // -----------------------------

        if (data.user.notifications) {

          setNotifications({
            emailUpdates:
              data.user.notifications.emailUpdates ??
              true,

            jobAlerts:
              data.user.notifications.jobAlerts ??
              true,

            interviewReminders:
              data.user.notifications.interviewReminders ??
              true,

            weeklyReport:
              data.user.notifications.weeklyReport ??
              false,
          });

        }

      } catch (error) {

        console.error(
          '❌ PROFILE LOAD ERROR:',
          error
        );

        setError(
          error.message ||
          'Failed to load profile'
        );

      } finally {

        setLoadingProfile(false);

      }

    };


    fetchProfile();

  }, []);


  // ======================================================
  // SAVE PROFILE
  // ======================================================

  const handleSaveProfile = async () => {

    try {

      setSavingProfile(true);
      setMessage('');
      setError('');


      const token =
        localStorage.getItem('token');


      if (!token) {

        setError(
          'You are not logged in.'
        );

        return;
      }


      if (!profile.fullName.trim()) {

        setError(
          'Full name is required.'
        );

        return;
      }


      if (!profile.email.trim()) {

        setError(
          'Email address is required.'
        );

        return;
      }


      const response = await fetch(
        'http://localhost:5000/api/auth/profile',
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            fullName:
              profile.fullName,

            email:
              profile.email,

            phone:
              profile.phone,

            university:
              profile.university,

            major:
              profile.major,
          }),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Failed to update profile'
        );
      }


      setProfile({
        fullName:
          data.user.fullName || '',

        email:
          data.user.email || '',

        phone:
          data.user.phone || '',

        university:
          data.user.university || '',

        major:
          data.user.major || '',
      });


      localStorage.setItem(
        'userName',
        data.user.fullName
      );

      localStorage.setItem(
        'userEmail',
        data.user.email
      );


      setMessage(
        'Profile updated successfully!'
      );

    } catch (error) {

      console.error(
        '❌ PROFILE UPDATE ERROR:',
        error
      );

      setError(
        error.message ||
        'Failed to update profile'
      );

    } finally {

      setSavingProfile(false);

    }

  };


  // ======================================================
  // SAVE NOTIFICATION PREFERENCES
  // ======================================================

  const handleSaveNotifications = async () => {

    try {

      setSavingNotifications(true);
      setMessage('');
      setError('');


      const token =
        localStorage.getItem('token');


      if (!token) {

        setError(
          'You are not logged in.'
        );

        return;
      }


      console.log(
        '=========================================='
      );

      console.log(
        '🔔 SAVING NOTIFICATION PREFERENCES'
      );

      console.log(
        notifications
      );

      console.log(
        '=========================================='
      );


      const response = await fetch(
        'http://localhost:5000/api/auth/notifications',
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(
              notifications
            ),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Failed to save notification preferences'
        );
      }


      if (data.notifications) {

        setNotifications({
          emailUpdates:
            data.notifications.emailUpdates,

          jobAlerts:
            data.notifications.jobAlerts,

          interviewReminders:
            data.notifications.interviewReminders,

          weeklyReport:
            data.notifications.weeklyReport,
        });

      }


      setMessage(
        'Notification preferences saved successfully!'
      );


      console.log(
        '✅ NOTIFICATIONS SAVED'
      );

    } catch (error) {

      console.error(
        '❌ NOTIFICATION SAVE ERROR:',
        error
      );

      setError(
        error.message ||
        'Failed to save notification preferences'
      );

    } finally {

      setSavingNotifications(false);

    }

  };


  // ======================================================
  // CHANGE PASSWORD
  // ======================================================

  const handleChangePassword = async () => {

    try {

      setChangingPassword(true);
      setMessage('');
      setError('');


      if (
        !password.currentPassword ||
        !password.newPassword ||
        !password.confirmPassword
      ) {

        setError(
          'Please fill all password fields.'
        );

        return;
      }


      if (
        password.newPassword.length < 6
      ) {

        setError(
          'New password must be at least 6 characters.'
        );

        return;
      }


      if (
        password.newPassword !==
        password.confirmPassword
      ) {

        setError(
          'New password and confirm password do not match.'
        );

        return;
      }


      const token =
        localStorage.getItem('token');


      if (!token) {

        setError(
          'You are not logged in.'
        );

        return;
      }


      const response = await fetch(
        'http://localhost:5000/api/auth/change-password',
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            currentPassword:
              password.currentPassword,

            newPassword:
              password.newPassword,
          }),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Failed to update password'
        );
      }


      setPassword({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });


      setMessage(
        'Password updated successfully!'
      );

    } catch (error) {

      console.error(
        '❌ PASSWORD UPDATE ERROR:',
        error
      );

      setError(
        error.message ||
        'Failed to update password'
      );

    } finally {

      setChangingPassword(false);

    }

  };


  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {

    localStorage.clear();

    navigate('/login');

  };


  // ======================================================
  // LOADING
  // ======================================================

  if (loadingProfile) {

    return (
      <MainLayout>

        <div className="flex items-center justify-center min-h-[400px]">

          <p className="text-slate-500">
            Loading settings...
          </p>

        </div>

      </MainLayout>
    );

  }


  // ======================================================
  // UI
  // ======================================================

  return (

    <MainLayout>

      <div className="space-y-6 max-w-2xl">


        {/* ============================================= */}
        {/* PAGE TITLE */}
        {/* ============================================= */}

        <div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Settings
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your profile and preferences
          </p>

        </div>


        {/* ============================================= */}
        {/* SUCCESS / ERROR MESSAGE */}
        {/* ============================================= */}

        {message && (

          <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">

            {message}

          </div>

        )}


        {error && (

          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">

            {error}

          </div>

        )}


        {/* ============================================= */}
        {/* PROFILE SETTINGS */}
        {/* ============================================= */}

        <Card>

          <div className="flex items-center gap-3 mb-6">

            <div className="p-2 rounded-lg bg-blue-50">

              <User
                size={20}
                className="text-blue-600"
              />

            </div>

            <div>

              <h2 className="text-lg font-semibold">
                Profile Settings
              </h2>

              <p className="text-sm text-slate-500">
                Update your personal information
              </p>

            </div>

          </div>


          <div className="space-y-4">

            <Input
              label="Full Name"
              value={profile.fullName}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  fullName:
                    e.target.value,
                })
              }
            />


            <Input
              label="Email Address"
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  email:
                    e.target.value,
                })
              }
            />


            <Input
              label="Phone Number"
              value={profile.phone}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  phone:
                    e.target.value,
                })
              }
            />


            <Input
              label="University"
              value={profile.university}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  university:
                    e.target.value,
                })
              }
            />


            <Input
              label="Major / Field of Study"
              value={profile.major}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  major:
                    e.target.value,
                })
              }
            />


            <Button
              onClick={
                handleSaveProfile
              }
              disabled={
                savingProfile
              }
            >

              {savingProfile
                ? 'Saving...'
                : 'Save Changes'}

            </Button>

          </div>

        </Card>


        {/* ============================================= */}
        {/* NOTIFICATION PREFERENCES */}
        {/* ============================================= */}

        <Card>

          <div className="flex items-center gap-3 mb-6">

            <div className="p-2 rounded-lg bg-blue-50">

              <Bell
                size={20}
                className="text-blue-600"
              />

            </div>

            <div>

              <h2 className="text-lg font-semibold">
                Notification Preferences
              </h2>

              <p className="text-sm text-slate-500">
                Choose what notifications you want to receive
              </p>

            </div>

          </div>


          <div className="space-y-5">


            {/* EMAIL UPDATES */}

            <label className="flex items-center justify-between cursor-pointer">

              <div>

                <p className="font-medium text-slate-800 dark:text-white">
                  Email Updates
                </p>

                <p className="text-sm text-slate-500">
                  Receive important updates by email
                </p>

              </div>


              <input
                type="checkbox"
                checked={
                  notifications.emailUpdates
                }
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    emailUpdates:
                      e.target.checked,
                  })
                }
                className="w-5 h-5"
              />

            </label>


            {/* JOB ALERTS */}

            <label className="flex items-center justify-between cursor-pointer">

              <div>

                <p className="font-medium text-slate-800 dark:text-white">
                  Job Alerts
                </p>

                <p className="text-sm text-slate-500">
                  Get alerts about job opportunities
                </p>

              </div>


              <input
                type="checkbox"
                checked={
                  notifications.jobAlerts
                }
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    jobAlerts:
                      e.target.checked,
                  })
                }
                className="w-5 h-5"
              />

            </label>


            {/* INTERVIEW REMINDERS */}

            <label className="flex items-center justify-between cursor-pointer">

              <div>

                <p className="font-medium text-slate-800 dark:text-white">
                  Interview Reminders
                </p>

                <p className="text-sm text-slate-500">
                  Receive reminders for interviews
                </p>

              </div>


              <input
                type="checkbox"
                checked={
                  notifications.interviewReminders
                }
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    interviewReminders:
                      e.target.checked,
                  })
                }
                className="w-5 h-5"
              />

            </label>


            {/* WEEKLY REPORT */}

            <label className="flex items-center justify-between cursor-pointer">

              <div>

                <p className="font-medium text-slate-800 dark:text-white">
                  Weekly Report
                </p>

                <p className="text-sm text-slate-500">
                  Receive a weekly resume and job tracking report
                </p>

              </div>


              <input
                type="checkbox"
                checked={
                  notifications.weeklyReport
                }
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    weeklyReport:
                      e.target.checked,
                  })
                }
                className="w-5 h-5"
              />

            </label>


            <Button
              onClick={
                handleSaveNotifications
              }
              disabled={
                savingNotifications
              }
            >

              {savingNotifications
                ? 'Saving...'
                : 'Save Preferences'}

            </Button>

          </div>

        </Card>


        {/* ============================================= */}
        {/* PASSWORD SETTINGS */}
        {/* ============================================= */}

        <Card>

          <div className="flex items-center gap-3 mb-6">

            <div className="p-2 rounded-lg bg-blue-50">

              <Lock
                size={20}
                className="text-blue-600"
              />

            </div>

            <div>

              <h2 className="text-lg font-semibold">
                Password Settings
              </h2>

              <p className="text-sm text-slate-500">
                Change your account password
              </p>

            </div>

          </div>


          <div className="space-y-4">


            <Input
              label="Current Password"
              type="password"
              value={
                password.currentPassword
              }
              onChange={(e) =>
                setPassword({
                  ...password,
                  currentPassword:
                    e.target.value,
                })
              }
            />


            <Input
              label="New Password"
              type="password"
              value={
                password.newPassword
              }
              onChange={(e) =>
                setPassword({
                  ...password,
                  newPassword:
                    e.target.value,
                })
              }
            />


            <Input
              label="Confirm New Password"
              type="password"
              value={
                password.confirmPassword
              }
              onChange={(e) =>
                setPassword({
                  ...password,
                  confirmPassword:
                    e.target.value,
                })
              }
            />


            <Button
              onClick={
                handleChangePassword
              }
              disabled={
                changingPassword
              }
            >

              {changingPassword
                ? 'Updating...'
                : 'Update Password'}

            </Button>

          </div>

        </Card>


        {/* ============================================= */}
        {/* LOGOUT */}
        {/* ============================================= */}

        <Card>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="p-2 rounded-lg bg-red-50">

                <LogOut
                  size={20}
                  className="text-red-600"
                />

              </div>

              <div>

                <h2 className="text-lg font-semibold">
                  Logout
                </h2>

                <p className="text-sm text-slate-500">
                  Sign out from your account
                </p>

              </div>

            </div>


            <Button
              onClick={handleLogout}
            >
              Logout
            </Button>

          </div>

        </Card>


      </div>

    </MainLayout>

  );
}

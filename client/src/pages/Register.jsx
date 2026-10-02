
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../components/Common/Input';
import Button from '../components/Common/Button';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'acceptTerms' ? checked : value,
    }));
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    // ------------------------------------------
    // FRONTEND VALIDATION
    // ------------------------------------------

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the Terms and Privacy Policy.');
      return;
    }

    // ------------------------------------------
    // START LOADING
    // ------------------------------------------

    setLoading(true);

    try {
      console.log('================================');
      console.log('📝 REGISTER STARTED');
      console.log('Name:', formData.fullName);
      console.log('Email:', formData.email);
      console.log('================================');

      // ------------------------------------------
      // SEND DATA TO BACKEND
      // ------------------------------------------

      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      // ------------------------------------------
      // READ RESPONSE
      // ------------------------------------------

      const data = await response.json();

      console.log('Register response:', data);

      // ------------------------------------------
      // REGISTRATION FAILED
      // ------------------------------------------

      if (!response.ok) {
        setError(
          data.message || 'Registration failed.'
        );

        return;
      }

      // ------------------------------------------
      // REGISTRATION SUCCESS
      // ------------------------------------------

      console.log('✅ REGISTRATION SUCCESS');

      setSuccess(
        'Account created successfully! Redirecting to login...'
      );

      // ------------------------------------------
      // GO TO LOGIN
      // ------------------------------------------

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      console.error('❌ REGISTER ERROR:', error);

      setError(
        'Unable to connect to the server. Please make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        {/* LOGO */}

        <div className="flex justify-center mb-8">

          <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">

            <span className="text-white font-bold text-3xl">
              AI
            </span>

          </div>

        </div>

        {/* CARD */}

        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-200 dark:border-slate-700">

          <h1 className="text-2xl font-bold text-center mb-2 text-slate-900 dark:text-white">
            Create account
          </h1>

          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Start optimizing your resume with AI today.
          </p>

          {/* ERROR */}

          {error && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">

              <p className="text-sm text-red-700 dark:text-red-400">
                {error}
              </p>

            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">

              <p className="text-sm text-green-700 dark:text-green-400">
                {success}
              </p>

            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >

            <Input
              label="Full Name"
              type="text"
              placeholder="Alex Morgan"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alex.morgan@university.edu"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <label className="flex items-start space-x-3 cursor-pointer">

              <input
                type="checkbox"
                className="rounded w-4 h-4 mt-1"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
              />

              <span className="text-sm text-slate-700 dark:text-slate-300">
                I agree to the{' '}
                <a
                  href="#"
                  className="text-indigo-600 dark:text-indigo-400 font-medium"
                >
                  Terms
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="text-indigo-600 dark:text-indigo-400 font-medium"
                >
                  Privacy Policy
                </a>
              </span>

            </label>

            <Button
              variant="primary"
              className="w-full py-3"
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : 'Create Account'}
            </Button>

          </form>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">

            Already have an account?{' '}

            <a
              href="/login"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Sign in
            </a>

          </p>

        </div>

      </div>

    </div>
  );
}


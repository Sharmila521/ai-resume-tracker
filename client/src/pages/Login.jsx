
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../components/Common/Input';
import Button from '../components/Common/Button';

import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      console.log('================================');
      console.log('🔐 LOGIN STARTED');
      console.log('Email:', email);
      console.log('================================');

      // -------------------------------------------------
      // Send login request to backend
      // -------------------------------------------------

      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      // -------------------------------------------------
      // Convert response to JSON
      // -------------------------------------------------

      const data = await response.json();

      console.log('Login response:', data);

      // -------------------------------------------------
      // Login successful
      // -------------------------------------------------

      if (response.ok) {
        console.log('✅ Login successful');

        // ------------------------------------------------
        // Check backend response
        // ------------------------------------------------

        if (!data.token) {
          throw new Error(
            'Login successful but token was not received from server.'
          );
        }

        if (!data.user || !data.user.id) {
          throw new Error(
            'Login successful but user information was not received.'
          );
        }

        // ------------------------------------------------
        // Save authentication information
        // ------------------------------------------------

        localStorage.setItem(
          'token',
          data.token
        );

        localStorage.setItem(
          'userId',
          data.user.id.toString()
        );

        localStorage.setItem(
          'userEmail',
          data.user.email
        );

        localStorage.setItem(
          'userName',
          data.user.fullName
        );

        // Save complete user object
        localStorage.setItem(
          'user',
          JSON.stringify(data.user)
        );

        // ------------------------------------------------
        // Remember me
        // ------------------------------------------------

        if (rememberMe) {
          localStorage.setItem(
            'rememberMe',
            'true'
          );
        } else {
          localStorage.removeItem(
            'rememberMe'
          );
        }

        // ------------------------------------------------
        // Debug information
        // ------------------------------------------------

        console.log('================================');
        console.log('✅ LOGIN SUCCESS');
        console.log(
          'Token:',
          localStorage.getItem('token')
            ? 'SAVED'
            : 'MISSING'
        );
        console.log(
          'User ID:',
          localStorage.getItem('userId')
        );
        console.log(
          'User:',
          localStorage.getItem('userName')
        );
        console.log('================================');

        // ------------------------------------------------
        // Go to dashboard
        // ------------------------------------------------

        navigate('/dashboard');
      } else {
        // ------------------------------------------------
        // Login failed
        // ------------------------------------------------

        setError(
          data.message ||
            'Invalid email or password'
        );
      }
    } catch (err) {
      console.error('❌ Login Error:', err);

      setError(
        err.message ||
          'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // MOCK GITHUB LOGIN
  // =====================================================

  const handleGitHubLogin = () => {
    const mockUser = {
      id: 'github-demo-user',
      fullName: 'GitHub User',
      email: 'github@example.com',
    };

    localStorage.setItem(
      'token',
      'github-token-123'
    );

    localStorage.setItem(
      'userId',
      mockUser.id
    );

    localStorage.setItem(
      'userName',
      mockUser.fullName
    );

    localStorage.setItem(
      'userEmail',
      mockUser.email
    );

    localStorage.setItem(
      'user',
      JSON.stringify(mockUser)
    );

    navigate('/dashboard');
  };

  // =====================================================
  // MOCK GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = () => {
    const mockUser = {
      id: 'google-demo-user',
      fullName: 'Google User',
      email: 'google@example.com',
    };

    localStorage.setItem(
      'token',
      'google-token-123'
    );

    localStorage.setItem(
      'userId',
      mockUser.id
    );

    localStorage.setItem(
      'userName',
      mockUser.fullName
    );

    localStorage.setItem(
      'userEmail',
      mockUser.email
    );

    localStorage.setItem(
      'user',
      JSON.stringify(mockUser)
    );

    navigate('/dashboard');
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        {/* ============================================= */}
        {/* LOGO */}
        {/* ============================================= */}

        <div className="flex justify-center mb-8">

          <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">

            <span className="text-white font-bold text-3xl">
              AI
            </span>

          </div>

        </div>

        {/* ============================================= */}
        {/* LOGIN CARD */}
        {/* ============================================= */}

        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-200 dark:border-slate-700">

          <h1 className="text-2xl font-bold text-center mb-2 text-slate-900 dark:text-white">
            Welcome back
          </h1>

          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Log in to manage and optimize your engineering resumes.
          </p>

          {/* =========================================== */}
          {/* ERROR */}
          {/* =========================================== */}

          {error && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">

              <p className="text-sm text-red-700 dark:text-red-400">
                {error}
              </p>

            </div>
          )}

          {/* =========================================== */}
          {/* LOGIN FORM */}
          {/* =========================================== */}

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >

            {/* EMAIL */}

            <Input
              label="Institutional or Personal Email"
              type="email"
              placeholder="alex.morgan@university.edu"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            {/* PASSWORD */}

            <div className="w-full">

              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-10"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
                >

                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}

                </button>

              </div>

            </div>

            {/* REMEMBER + FORGOT PASSWORD */}

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center space-x-2 cursor-pointer">

                <input
                  type="checkbox"
                  className="rounded w-4 h-4"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                <span className="text-slate-700 dark:text-slate-300">
                  Remember me for 30 days
                </span>

              </label>

              <a
                href="/forgot-password"
                className="text-indigo-600 hover:underline font-medium dark:text-indigo-400"
              >
                Forgot password?
              </a>

            </div>

            {/* LOGIN BUTTON */}

            <Button
              variant="primary"
              className="w-full py-3"
              disabled={loading}
            >

              {loading
                ? 'Signing in...'
                : 'Sign in to Dashboard →'}

            </Button>

          </form>

          {/* =========================================== */}
          {/* DIVIDER */}
          {/* =========================================== */}

          <div className="relative my-6">

            <div className="absolute inset-0 flex items-center">

              <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>

            </div>

            <div className="relative flex justify-center text-sm">

              <span className="px-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                OR CONTINUE WITH
              </span>

            </div>

          </div>

          {/* =========================================== */}
          {/* SOCIAL LOGIN */}
          {/* =========================================== */}

          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={handleGitHubLogin}
              className="py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium text-slate-700 dark:text-slate-300"
            >
              🐙 GitHub
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium text-slate-700 dark:text-slate-300"
            >
              🔴 Google
            </button>

          </div>

          {/* =========================================== */}
          {/* REGISTER */}
          {/* =========================================== */}

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">

            Don't have an account?{' '}

            <a
              href="/register"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Create an account
            </a>

          </p>

        </div>

      </div>

    </div>
  );
}

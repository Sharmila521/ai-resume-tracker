import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mock API call
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password reset link sent to your email');
        setSubmitted(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-3xl">AI</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-center mb-2 text-slate-900 dark:text-white">
            Forgot Password?
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Enter your email to reset your password.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {submitted && message && (
            <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-400">{message}</p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-2">Redirecting to login...</p>
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="alex.morgan@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button 
                variant="primary" 
                className="w-full py-3"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : null}

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            Remember your password?{' '}
            <a href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
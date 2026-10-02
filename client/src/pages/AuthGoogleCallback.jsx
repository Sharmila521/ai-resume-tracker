import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthGoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        if (!code) {
          throw new Error('No authorization code');
        }

        // Exchange code for user info (in production, do this on backend)
        // For now, use Google's oauth2 library
        
        // Mock: Assume user authenticated
        localStorage.setItem('token', 'google-token-' + Date.now());
        localStorage.setItem('userId', '1');
        localStorage.setItem('userName', 'Google User');

        navigate('/dashboard');
      } catch (error) {
        console.error('Google auth error:', error);
        navigate('/login?error=google_auth_failed');
      }
    };

    handleGoogleAuth();
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Authenticating with Google...</p>
    </div>
  );
}
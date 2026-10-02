import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthGithubCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const handleGithubAuth = async () => {
      try {
        if (!code) {
          throw new Error('No authorization code');
        }

        // In production: Send code to backend to exchange for access token
        const response = await fetch('http://localhost:5000/api/auth/github-callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        if (!response.ok) {
          throw new Error('GitHub authentication failed');
        }

        const data = await response.json();
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.fullName);

        navigate('/dashboard');
      } catch (error) {
        console.error('GitHub auth error:', error);
        navigate('/login?error=github_auth_failed');
      }
    };

    handleGithubAuth();
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Authenticating with GitHub...</p>
    </div>
  );
}
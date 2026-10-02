import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import ResumeAnalysis from './pages/ResumeAnalysis';
import ResumeVersions from './pages/ResumeVersions';
import JobApplications from './pages/JobApplications';
import ActivityHistory from './pages/ActivityHistory';
import Settings from './pages/Settings';
import AuthGoogleCallback from './pages/AuthGoogleCallback';
import AuthGithubCallback from './pages/AuthGithubCallback';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* App Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<ResumeUpload />} />
        <Route path="/analysis" element={<ResumeAnalysis />} />
        <Route path="/versions" element={<ResumeVersions />} />
        <Route path="/jobs" element={<JobApplications />} />
        <Route path="/history" element={<ActivityHistory />} />
        <Route path="/settings" element={<Settings />} />

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/auth/google/callback" element={<AuthGoogleCallback />} />
<Route path="/auth/github/callback" element={<AuthGithubCallback />} />
      </Routes>
    </BrowserRouter>
  );
}
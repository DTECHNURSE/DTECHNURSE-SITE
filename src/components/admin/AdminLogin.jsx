import { useState } from 'react';
import { LogIn, Loader2, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../firebase';

const provider = new GoogleAuthProvider();

export default function AdminLogin({ authLoading }) {
  const [mode, setMode] = useState('choice'); // 'choice' | 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Google sign-in ────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
  };

  // ── Email / password sign-in ──────────────────────────────────────────────
  const handleEmailLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
        'auth/invalid-credential': 'Invalid email or password.',
      };
      setError(messages[err.code] || 'Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleEmailLogin();
  };

  // ── Loading spinner ───────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="section-container py-32 flex justify-center">
        <Loader2 className="animate-spin text-brand-blue w-10 h-10" />
      </div>
    );
  }

  // ── Email form ────────────────────────────────────────────────────────────
  if (mode === 'email') {
    return (
      <div className="section-container py-24 md:py-32 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="mb-8 p-6 bg-brand-light rounded-full">
          <Mail size={40} className="text-brand-blue" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-2">Admin Sign In</h1>
        <p className="text-brand-gray mb-8 text-sm">Sign in with your admin email and password.</p>

        <div className="w-full space-y-4 text-left">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="admin@example.com"
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-brand-dark bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-brand-dark bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-dark"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Sign in button */}
          <button
            onClick={handleEmailLogin}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-brand-gray">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Switch to Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 text-brand-dark hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.34-8.16 2.34-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google instead
          </button>

          {/* Back */}
          <button
            onClick={() => { setMode('choice'); setError(''); }}
            className="w-full text-sm text-brand-gray hover:text-brand-dark transition-colors py-1"
          >
            ← Back to sign-in options
          </button>
        </div>
      </div>
    );
  }

  // ── Choice screen (default) ───────────────────────────────────────────────
  return (
    <div className="section-container py-24 md:py-32 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className="mb-8 p-6 bg-brand-light rounded-full">
        <LogIn size={40} className="text-brand-blue" />
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">Admin Access</h1>
      <p className="text-brand-gray mb-2">Sign in to access the admin panel.</p>
      <p className="text-xs text-brand-gray/70 mb-8">Only authorised accounts can access this panel.</p>

      <div className="w-full space-y-3">
        {/* Email & password */}
        <button
          onClick={() => { setError(''); setMode('email'); }}
          className="btn-primary w-full flex items-center justify-center gap-3 text-base px-8 py-4"
        >
          <Mail size={20} />
          Sign in with Email
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-brand-gray">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-4 text-brand-dark hover:bg-gray-50 transition-colors font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.34-8.16 2.34-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

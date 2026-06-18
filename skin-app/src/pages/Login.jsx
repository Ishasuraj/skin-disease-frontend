import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  Stethoscope, AlertTriangle, Eye, EyeOff,
  Sun, Moon, ArrowLeft, Globe, KeyRound, Mail
} from 'lucide-react';
import signupFlag from '../utils/signupFlag';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [savePassword, setSavePassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const saveUserToFirestore = async (user, extraData = {}) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid:         user.uid,
        email:       user.email,
        displayName: user.displayName || extraData.displayName || '',
        photoURL:    user.photoURL || '',
        phone:       extraData.phone || '',
        scans:       0,
        lastLogin:   serverTimestamp(),
        createdAt:   serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.error('Error saving user to Firestore:', err);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const mapAuthError = (code) => {
    const map = {
      'auth/user-not-found':       'No account found with this email.',
      'auth/wrong-password':       'Incorrect password.',
      'auth/invalid-email':        'Invalid email address.',
      'auth/invalid-credential':   'Invalid email or password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
    };
    return map[code] || null;
  };

  const handleLogin = async () => {
    setError('');
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(
        auth, loginData.email, loginData.password
      );
      await saveUserToFirestore(result.user);
      navigate('/dashboard');
    } catch (err) {
      setError(mapAuthError(err.code) || err.message);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setError('');
    if (!signupData.fullName || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (signupData.phone && !/^\d{10}$/.test(signupData.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);

    // ✅ Set shared flag — tells App.js to ignore auth changes
    signupFlag.isSigningUp = true;

    try {
      const result = await createUserWithEmailAndPassword(
        auth, signupData.email, signupData.password
      );
      await updateProfile(result.user, { displayName: signupData.fullName });
      await saveUserToFirestore(result.user, {
        displayName: signupData.fullName,
        phone:       signupData.phone || '',
      });

      // Sign out immediately
      await signOut(auth);

      // ✅ Reset flag after signing out
      signupFlag.isSigningUp = false;

      // Clear form and switch to login tab
      setSignupData({
        fullName: '', phone: '', email: '', password: '', confirmPassword: ''
      });
      setIsLogin(true);
      setError('');
      alert('✅ Account created successfully! Please login with your credentials.');

    } catch (err) {
      // ✅ Always reset flag on error
      signupFlag.isSigningUp = false;
      setError(mapAuthError(err.code) || err.message);
    }

    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(result.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async (e) => {
    if (e) e.stopPropagation();
    setResetError('');
    if (!resetEmail || !resetEmail.trim()) {
      setResetError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Please enter a valid email address.');
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      console.log('✅ Reset email sent!');
      setResetSent(true);
    } catch (err) {
      console.error('❌ Reset error:', err.code, err.message);
      if (err.code === 'auth/user-not-found') {
        setResetError('No account found with this email.');
      } else if (err.code === 'auth/invalid-email') {
        setResetError('Invalid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setResetError('Too many attempts. Please try again later.');
      } else {
        setResetError(`Error: ${err.code}`);
      }
    }
    setResetLoading(false);
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setResetSent(false);
    setResetEmail('');
    setResetError('');
  };

  const openForgotPassword = (e) => {
    e.stopPropagation();
    setShowForgotPassword(true);
    setResetEmail(loginData.email || '');
    setResetSent(false);
    setResetError('');
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const inputClass = "w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 transition-colors";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 transition-colors duration-300">

      {/* Back to Home */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      {/* Dark mode toggle */}
      <button
        type="button"
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm z-50"
      >
        {darkMode
          ? <Sun  className="w-5 h-5 text-amber-500" />
          : <Moon className="w-5 h-5 text-blue-500"  />
        }
      </button>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-8 transition-colors duration-300">

        {/* Header */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full text-center mb-6 group cursor-pointer"
        >
          <Stethoscope className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-2 group-hover:scale-105 transition-transform" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Derma<span className="text-blue-600 dark:text-blue-400">Lens</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            AI-Powered Skin Disease Detection
          </p>
        </button>

        {/* Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              isLogin
                ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              !isLogin
                ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-100 dark:border-red-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {isLogin && (
          <div>
            <div className="mb-4">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="you@example.com"
                autoComplete="off"
                className={inputClass}
              />
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Password</label>
                <button
                  type="button"
                  onClick={openForgotPassword}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••"
                  autoComplete={savePassword ? 'current-password' : 'off'}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword
                    ? <EyeOff className="w-5 h-5" />
                    : <Eye    className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>

            {/* Save password */}
            <div className="flex items-center gap-2 mb-6 mt-3">
              <input
                type="checkbox"
                id="savePassword"
                checked={savePassword}
                onChange={(e) => setSavePassword(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <label htmlFor="savePassword" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                Save password
              </label>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-all mb-4 disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        )}

        {/* SIGNUP FORM */}
        {!isLogin && (
          <div>
            <div className="mb-4">
              <label className={labelClass}>
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={signupData.fullName}
                onChange={handleSignupChange}
                placeholder="Hannah Elsa"
                autoComplete="off"
                className={inputClass}
              />
            </div>

            <div className="mb-4">
              <label className={labelClass}>
                Phone Number{' '}
                <span className="text-slate-400 text-xs">(optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={signupData.phone}
                onChange={handleSignupChange}
                placeholder="10-digit number"
                autoComplete="off"
                className={inputClass}
              />
            </div>

            <div className="mb-4">
              <label className={labelClass}>
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                placeholder="you@example.com"
                autoComplete="off"
                className={inputClass}
              />
            </div>

            <div className="mb-4">
              <label className={labelClass}>
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword
                    ? <EyeOff className="w-5 h-5" />
                    : <Eye    className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClass}>
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={inputClass}
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-all mb-4 disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600"></div>
          <span className="text-slate-400 dark:text-slate-500 text-sm">or</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600"></div>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Globe className="w-5 h-5 text-blue-500" />
          Continue with Google
        </button>

      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            onClick={closeForgotPassword}
          />
          <div
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100 dark:border-slate-700 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {!resetSent ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
                    <KeyRound className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                    Reset Password
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Enter your email and we'll send you a reset link.
                  </p>
                </div>

                {resetError && (
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-100 dark:border-red-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {resetError}
                  </div>
                )}

                <div className="mb-5">
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleForgotPassword(e);
                    }}
                    placeholder="you@example.com"
                    className={inputClass}
                    autoFocus
                  />
                </div>

                <button
                  type="button"
                  onClick={(e) => handleForgotPassword(e)}
                  disabled={resetLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all mb-3 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  onClick={closeForgotPassword}
                  className="w-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <div className="text-center py-2">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                  Email Sent!
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                  A password reset link has been sent to:
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-5 break-all bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-xl">
                  {resetEmail}
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 mb-5 text-left space-y-1">
                  <p className="text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">💡 Tips</p>
                  <p className="text-amber-600 dark:text-amber-300 text-xs">• Check your spam or junk folder</p>
                  <p className="text-amber-600 dark:text-amber-300 text-xs">• Link expires in 1 hour</p>
                  <p className="text-amber-600 dark:text-amber-300 text-xs">• Request a new link if it doesn't arrive</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setResetSent(false); setResetError(''); }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mb-4 block mx-auto"
                >
                  Didn't receive it? Send again
                </button>
                <button
                  type="button"
                  onClick={closeForgotPassword}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
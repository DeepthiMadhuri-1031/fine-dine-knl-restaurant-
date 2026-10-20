import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, UtensilsCrossed, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);
    const res = await login(email.trim(), password);
    setIsLoading(false);

    if (res.success) {
      if (res.user?.role === 'admin' && (redirectPath === '/' || redirectPath === '/login')) {
        navigate('/admin/dashboard', { replace: true });
      } else if (redirectPath === '/' || redirectPath === '/login') {
        navigate('/account', { replace: true });
      } else {
        navigate(redirectPath, { replace: true });
      }
    } else {
      setErrorMsg(res.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-charcoal-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Brand Card */}
        <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle gold glow accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full border border-gold-500/40 bg-charcoal-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <span className="text-gold-400 font-serif font-bold text-xl">KNL</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 tracking-wide">
              Welcome Back
            </h1>
            <p className="text-xs text-cream-300 mt-1">
              Sign in to manage your orders, saved addresses, and quick checkout
            </p>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 placeholder-charcoal-400 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-gold-400 hover:text-gold-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 placeholder-charcoal-400 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-400 hover:text-gold-400 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-charcoal-750 text-center">
            <p className="text-xs text-cream-300">
              Don't have an account yet?{' '}
              <Link
                to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
                className="text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-4 ml-1 inline-flex items-center gap-1"
              >
                <span>Create Customer Account</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>

          {/* Restaurant Staff & Admin Notice */}
          <div className="mt-4 text-center">
            <Link
              to="/admin/login"
              className="text-[11px] text-cream-400 hover:text-gold-400 transition-colors inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
              <span>Restaurant Staff & Operations Login</span>
            </Link>
          </div>
        </div>

        {/* Back to Menu */}
        <div className="text-center mt-6">
          <Link
            to="/menu"
            className="text-xs text-cream-400 hover:text-cream-200 transition-colors inline-flex items-center gap-1.5"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Browse Restaurant Menu as Guest</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

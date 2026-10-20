import { apiUrl } from '../config/api';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, KeyRound, ExternalLink } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setDevResetUrl(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(apiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message || 'Password reset instructions have been dispatched.');
        if (data.devResetUrl) {
          setDevResetUrl(data.devResetUrl);
        }
      } else {
        setErrorMessage(data.error || 'Failed to process request.');
      }
    } catch (err) {
      setErrorMessage('Could not connect to authentication server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-charcoal-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cream-300 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>

        {/* Card */}
        <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full border border-gold-500/40 bg-charcoal-800 flex items-center justify-center mx-auto mb-3 shadow-inner text-gold-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 tracking-wide">
              Reset Your Password
            </h1>
            <p className="text-xs text-cream-300 mt-1">
              Enter your registered email address and we'll dispatch a secure, single-use recovery link.
            </p>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Notice */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Instructions Dispatched</span>
              </div>
              <p className="leading-relaxed text-cream-200">
                {successMessage}
              </p>
              {devResetUrl && (
                <div className="mt-3 pt-3 border-t border-emerald-800/40 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-gold-400 block tracking-wider">
                    Local Environment Quick Reset Link:
                  </span>
                  <a
                    href={devResetUrl}
                    className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 underline font-mono break-all"
                  >
                    <span>Click here to open Password Reset Form</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200 mb-1.5">
                  Registered Email Address
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer links */}
          <div className="mt-6 pt-5 border-t border-charcoal-750 text-center">
            <p className="text-xs text-cream-300">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-4 ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

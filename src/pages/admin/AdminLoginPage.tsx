import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin/dashboard';

  const [email, setEmail] = useState('admin@finedineknl.com');
  const [password, setPassword] = useState('Admin@KNL2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    const res = await login(email.trim(), password);
    setIsLoading(false);

    if (res.success) {
      if (res.user?.role !== 'admin') {
        setErrorMsg('Access Restricted: This account does not possess restaurant administrative permissions.');
      } else {
        navigate(redirectPath, { replace: true });
      }
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify management credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cream-400 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Restaurant Storefront</span>
        </Link>

        {/* Card */}
        <div className="bg-charcoal-900 border border-gold-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle gold badge accent */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-charcoal-800 border-2 border-gold-500/50 text-gold-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 tracking-wide">
              Management Portal
            </h1>
            <p className="text-xs text-cream-300 mt-1">
              FINE DINE KNL RESTAURANT Operations & Kitchen Control
            </p>
          </div>

          {/* Default Seeded Credentials Notice */}
          <div className="mb-6 p-3.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-xs text-gold-300 space-y-1">
            <div className="font-bold uppercase tracking-wider text-[10px] text-gold-400">
              Default Operations Access Credentials
            </div>
            <div className="font-mono text-[11px] text-cream-200">
              User: <span className="text-gold-300">admin@finedineknl.com</span>
            </div>
            <div className="font-mono text-[11px] text-cream-200">
              Pass: <span className="text-gold-300">Admin@KNL2026!</span>
            </div>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-400 hover:text-gold-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-gold-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Management Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

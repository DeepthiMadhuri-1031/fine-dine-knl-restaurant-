import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
          <p className="text-sm text-cream-300">Verifying administrative security credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/admin/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-charcoal-900 pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-charcoal-850 border border-rose-500/30 rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-cream-100">Access Restricted</h2>
          <p className="text-sm text-cream-300">
            This area requires Restaurant Administrative credentials. Your account (<span className="text-gold-400 font-medium">{user.email}</span>) does not hold manager permissions.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2.5 rounded-xl bg-gold-500 text-charcoal-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors"
          >
            Return to Guest Dining
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

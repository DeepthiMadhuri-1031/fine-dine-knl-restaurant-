import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  Users, 
  Settings,
  LogOut, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Live Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Menu Inventory', path: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Customer Directory', path: '/admin/customers', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-charcoal-950 text-cream-100 flex flex-col font-sans">
      {/* Admin Top Navigation Bar */}
      <header className="bg-charcoal-900 border-b border-gold-500/20 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Admin Badge */}
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-charcoal-800 border border-gold-500/40 text-gold-400 font-serif font-bold text-sm flex items-center justify-center">
                  KNL
                </div>
                <div>
                  <span className="font-serif font-bold text-base tracking-wide text-cream-100 block leading-tight">
                    FINE DINE KNL
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                    Operations Portal
                  </span>
                </div>
              </Link>

              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                Admin Station
              </span>
            </div>

            {/* Navigation Pills */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors ${
                      active
                        ? 'bg-gold-500 text-charcoal-950 shadow-md shadow-gold-500/20 font-bold'
                        : 'text-cream-300 hover:text-gold-300 hover:bg-charcoal-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Admin Profile & Actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-750 text-cream-300 hover:text-gold-400 text-xs transition-colors border border-charcoal-700"
                title="View Live Customer Website"
              >
                <span>Storefront</span>
                <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              </Link>

              <div className="text-right hidden sm:block">
                <span className="text-xs font-semibold text-cream-100 block leading-tight">
                  {user?.name || 'Manager'}
                </span>
                <span className="text-[10px] text-cream-400 block font-mono">
                  {user?.email}
                </span>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 transition-colors"
                title="Sign Out of Admin Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden border-t border-charcoal-800 bg-charcoal-900/95 backdrop-blur px-2 py-2 flex items-center justify-start sm:justify-around gap-1 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center sm:flex-col sm:items-center gap-1.5 py-1.5 px-3 rounded-xl text-[11px] sm:text-[10px] uppercase font-bold tracking-wider transition-colors shrink-0 whitespace-nowrap ${
                  active ? 'text-charcoal-950 bg-gold-500 shadow' : 'text-cream-300 hover:text-cream-100 hover:bg-charcoal-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

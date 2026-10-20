import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  UtensilsCrossed, 
  ShoppingBag, 
  User, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  ChevronDown,
  Clock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { totalCount, subtotal, setIsCartOpen } = useCart();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Menu', path: '/menu' },
    { name: 'Order Online', path: '/menu' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-charcoal-950/95 backdrop-blur-md border-b border-gold-500/20 py-3 shadow-xl'
          : 'bg-gradient-to-b from-charcoal-950/90 via-charcoal-950/60 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-gold-500/40 bg-charcoal-850 flex items-center justify-center p-1 group-hover:border-gold-400 transition-colors">
              <span className="text-gold-400 font-serif font-bold text-lg">KNL</span>
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wide text-cream-100 block group-hover:text-gold-300 transition-colors">
                FINE DINE KNL
              </span>
              <span className="text-[11px] uppercase tracking-widest text-gold-500 font-medium block">
                Restaurant · Kurnool
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                    active
                      ? 'text-gold-400 bg-gold-500/10 border-b-2 border-gold-400'
                      : 'text-cream-200 hover:text-gold-300 hover:bg-charcoal-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons: Cart, User Auth, Order */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Interactive Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-gold-500/40 text-cream-100 transition-all shadow-md group"
              title="View Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-gold-500 text-charcoal-950 text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-serif font-bold text-gold-400 hidden sm:inline">
                {subtotal > 0 ? `₹${subtotal}` : 'Cart'}
              </span>
            </button>

            {/* Admin Hub Link if logged in as Admin */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-gold-500/50 text-gold-400 text-xs font-bold uppercase tracking-wider transition-colors shadow"
                title="Restaurant Operations Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Hub</span>
              </Link>
            )}

            {/* User Account / Sign In */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-gold-500/30 text-cream-100 transition-colors text-xs font-semibold"
                >
                  <div className="w-5 h-5 rounded-full bg-charcoal-800 border border-gold-500/40 text-gold-400 flex items-center justify-center text-[10px] font-serif font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium text-cream-200">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-cream-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-charcoal-900 border border-gold-500/30 shadow-2xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-charcoal-800">
                      <span className="text-xs font-bold text-cream-100 block truncate">
                        {user.name}
                      </span>
                      <span className="text-[11px] text-cream-400 font-mono block truncate">
                        {user.email}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/account"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-cream-200 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-gold-500" />
                        <span>My Account Dashboard</span>
                      </Link>

                      <Link
                        to="/my-orders"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-cream-200 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-gold-500" />
                        <span>My Orders & Live Tracking</span>
                      </Link>

                      <Link
                        to="/cart"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-cream-200 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-gold-500" />
                        <span>Shopping Cart ({totalCount})</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gold-400 hover:bg-charcoal-800 transition-colors font-semibold"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                          <span>Admin Operations Hub</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-charcoal-800">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/40 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-gold-500/30 text-cream-200 hover:text-gold-400 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-gold-400" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Quick Menu / Order Button */}
            <Link
              to="/menu"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gold-500 text-charcoal-950 hover:bg-gold-400 transition-all duration-200 shadow-md shadow-gold-500/20"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Order Online</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-cream-200 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-charcoal-950 border-b border-gold-500/20 px-4 pt-3 pb-6 animate-fadeIn shadow-2xl">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-gold-500/20 text-gold-400 font-semibold'
                      : 'text-cream-200 hover:bg-charcoal-800 hover:text-gold-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Mobile Auth Links */}
            <div className="pt-2 border-t border-charcoal-800 space-y-1">
              {user ? (
                <>
                  <div className="px-4 py-1 text-xs text-cream-400 font-mono">
                    Signed in as <strong className="text-cream-200">{user.name}</strong>
                  </div>
                  <Link
                    to="/account"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-cream-200 hover:bg-charcoal-800"
                  >
                    <User className="w-4 h-4 text-gold-400" />
                    <span>My Account & Addresses</span>
                  </Link>
                  <Link
                    to="/my-orders"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-cream-200 hover:bg-charcoal-800"
                  >
                    <Clock className="w-4 h-4 text-gold-400" />
                    <span>My Orders & Tracking</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gold-400 font-bold hover:bg-charcoal-800"
                    >
                      <ShieldCheck className="w-4 h-4 text-gold-400" />
                      <span>Admin Operations Portal</span>
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-950/40 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-gold-400 hover:bg-charcoal-800 font-bold"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Customer Sign In / Register</span>
                </Link>
              )}
            </div>

            <div className="pt-3 border-t border-charcoal-800 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-charcoal-800 text-gold-400 border border-gold-500/30"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Cart ({totalCount})</span>
              </button>

              <Link
                to="/menu"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-gold-500 text-charcoal-950 hover:bg-gold-400"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Order Food</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

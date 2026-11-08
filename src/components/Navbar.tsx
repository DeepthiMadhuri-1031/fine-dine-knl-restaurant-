import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  CalendarCheck,
  PhoneCall,
  QrCode,
  Truck,
  Sparkles,
  Compass
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { AJWA_RESTAURANT_INFO } from '../data/ajwaData';
import { Button3D } from './Button3D';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { totalCount, subtotal, setIsCartOpen, activeOrder } = useCart();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname, location.hash]);

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
    { name: 'Home', hash: '#hero', fallbackPath: '/' },
    { name: 'Our Story', hash: '#story', fallbackPath: '/about' },
    { name: 'Menu', hash: '#menu', fallbackPath: '/menu' },
    { name: 'Veg & Non-Veg', hash: '#highlights', fallbackPath: '/' },
    { name: 'Digital Menu', path: '/qr-menu' },
    { name: 'Reviews', hash: '#reviews', fallbackPath: '/reviews' },
    { name: 'Contact', hash: '#contact', fallbackPath: '/contact' },
  ];

  const handleNavClick = (e: React.MouseEvent, link: any) => {
    setMobileMenuOpen(false);

    if (link.path) {
      navigate(link.path);
      return;
    }

    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.querySelector(link.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', link.hash);
        return;
      }
    }
    navigate(`/${link.hash}`);
  };

  const handleReserveClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('reservation');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', '#reservation');
        return;
      }
    }
    navigate('/#reservation');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-burgundy-900 via-burgundy-850 to-burgundy-900 border-b border-gold-500/30 text-cream-100 text-[11px] py-1.5 px-4 tracking-wide shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse shrink-0" />
            <span className="font-medium text-cream-100 truncate">
              ✨ <strong className="text-gold-400">Special Offer:</strong> FREE Delivery across Kurnool on orders above ₹500 · Table Bookings Open · Closes at 11:30 PM
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 shrink-0 text-cream-300 font-medium">
            <Link to="/qr-menu" className="hover:text-gold-300 flex items-center gap-1 transition-colors">
              <QrCode className="w-3 h-3 text-gold-400" />
              <span>QR Digital Menu</span>
            </Link>
            <span className="text-charcoal-700">|</span>
            <a href={`tel:${AJWA_RESTAURANT_INFO.phone}`} className="hover:text-gold-300 flex items-center gap-1 transition-colors">
              <PhoneCall className="w-3 h-3 text-gold-400" />
              <span>{AJWA_RESTAURANT_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <header
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-charcoal-900/98 backdrop-blur-md border-b border-gold-500/20 py-2.5 shadow-2xl'
            : 'bg-gradient-to-b from-charcoal-950/95 via-charcoal-900/80 to-transparent py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-lg p-1">
              <div className="w-10 h-10 rounded-full border border-gold-500/60 bg-gradient-to-br from-burgundy-850 to-charcoal-900 flex items-center justify-center p-1 group-hover:border-gold-400 group-hover:scale-105 transition-all shadow-md shadow-gold-500/15">
                <span className="text-gold-400 font-serif font-bold text-base tracking-widest">AE</span>
              </div>
              <div>
                <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-cream-100 block group-hover:text-gold-300 transition-colors uppercase">
                  AJWA EXOTICA
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                  Fine Dining & Delivery · Kurnool
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={(e) => handleNavClick(e, link)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-cream-200 hover:text-gold-300 hover:bg-charcoal-850/80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Active Order Track CTA */}
              {activeOrder && (
                <Link
                  to={`/order-confirmation/${activeOrder.orderId}`}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/20 border border-gold-500/50 text-gold-400 text-xs font-bold uppercase tracking-wider animate-pulse hover:bg-gold-500/30"
                  title="Track Live Order"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Order</span>
                </Link>
              )}

              {/* Interactive Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-gold-500/30 text-cream-100 transition-all shadow-md group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                title="View Cart"
                aria-label={`Shopping cart with ${totalCount} items`}
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
                  <span>Admin</span>
                </Link>
              )}

              {/* User Account / Sign In */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-gold-500/30 text-cream-100 transition-colors text-xs font-semibold"
                  >
                    <div className="w-5 h-5 rounded-full bg-burgundy-850 border border-gold-500/40 text-gold-400 flex items-center justify-center text-[10px] font-serif font-bold">
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
                          <span>My Account</span>
                        </Link>

                        <Link
                          to="/my-orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-cream-200 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-gold-500" />
                          <span>My Orders & Live Tracking</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-gold-400 hover:bg-charcoal-800 transition-colors font-semibold"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                            <span>Admin Portal</span>
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

              {/* Primary 3D Action CTA: Reserve a Table */}
              <Button3D
                variant="gold"
                size="xs"
                onClick={handleReserveClick}
                icon={<CalendarCheck className="w-3.5 h-3.5" />}
              >
                Reserve Table
              </Button3D>

              {/* Mobile hamburger */}
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

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-charcoal-900 border-b border-gold-500/30 px-4 pt-3 pb-6 animate-fadeIn shadow-2xl">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={(e) => handleNavClick(e, link)}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-cream-200 hover:bg-charcoal-800 hover:text-gold-300 transition-colors"
                >
                  {link.name}
                </button>
              ))}

              <div className="pt-3 border-t border-charcoal-800 flex flex-col gap-2">
                <button
                  onClick={handleReserveClick}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gold-500 text-charcoal-950 shadow-md"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Reserve Table Now</span>
                </button>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`tel:${AJWA_RESTAURANT_INFO.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-cream-200 text-xs font-semibold"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-gold-400" />
                    <span>Call Restaurant</span>
                  </a>
                  
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-charcoal-850 border border-gold-500/30 text-gold-400 text-xs font-semibold"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Cart ({totalCount})</span>
                  </button>
                </div>
              </div>

              {/* Mobile Auth Links */}
              <div className="pt-2 border-t border-charcoal-800">
                {user ? (
                  <div className="flex items-center justify-between px-2 pt-2 text-xs">
                    <span className="text-cream-300 truncate">Signed in: {user.name}</span>
                    <button onClick={logout} className="text-rose-400 hover:underline">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="block text-center py-2 text-xs font-semibold text-gold-400 hover:underline"
                  >
                    Customer Sign In / Register
                  </Link>
                )}
              </div>

            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;

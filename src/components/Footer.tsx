import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Heart, 
  QrCode, 
  Banknote, 
  CreditCard,
  Phone,
  Mail
} from 'lucide-react';

export const Footer: React.FC = () => {
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Fine%20Dine%20KNL%20Restaurant%2C%2018%2C%20Khadakpura%20Street%2C%20Khadak%20Pura%2C%20Kurnool%2C%20Andhra%20Pradesh%20518001%2C%20India";
  const reviewsUrl = "https://www.google.com/maps/search/?api=1&query=Fine%20Dine%20KNL%20Restaurant%2C%2018%2C%20Khadakpura%20Street%2C%20Khadak%20Pura%2C%20Kurnool%2C%20Andhra%20Pradesh%20518001%2C%20India";

  return (
    <footer className="bg-charcoal-950 text-cream-200 border-t border-charcoal-800 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold-500/40 bg-charcoal-850 flex items-center justify-center">
                <span className="text-gold-400 font-serif font-bold text-lg">KNL</span>
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-cream-100 block">FINE DINE KNL</span>
                <span className="text-[10px] uppercase tracking-widest text-gold-500 block">Restaurant · Kurnool</span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
              Authentic Indian dining in the heart of Kurnool, Andhra Pradesh. Slow-cooked Hyderabadi biryanis, signature paneer delicacies, and royal curries crafted with warmth and royal care.
            </p>

            {/* Pure Veg Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>100% Pure Vegetarian Restaurant</span>
            </div>

            {/* Payment methods badge */}
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-cream-400 mb-2">
                Accepted Payment Methods:
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-cream-300">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-charcoal-900 border border-charcoal-750">
                  <Banknote className="w-3.5 h-3.5 text-gold-400" />
                  <span>Cash on Delivery</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-charcoal-900 border border-charcoal-750">
                  <QrCode className="w-3.5 h-3.5 text-gold-400" />
                  <span>UPI QR (GPay/PhonePe)</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-charcoal-900 border border-charcoal-750">
                  <CreditCard className="w-3.5 h-3.5 text-gold-400" />
                  <span>Counter Card / Cash</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold text-gold-400 mb-4 tracking-wide uppercase text-xs">
              Customer Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Menu & Food Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-cream-300 hover:text-gold-400 transition-colors">
                  View Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-cream-300 hover:text-gold-400 transition-colors">
                  My Account & Addresses
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-cream-300 hover:text-gold-400 transition-colors">
                  My Orders & Live Tracking
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-cream-300 hover:text-gold-400 transition-colors">
                  About Our Kitchen
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Food Gallery
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Verified Reviews (4.1★)
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="font-serif text-base font-semibold text-gold-400 mb-4 tracking-wide uppercase text-xs">
              Restaurant Policies
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/privacy" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Privacy Policy & Data Security
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/delivery-policy" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Delivery Policy (Kurnool City)
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-charcoal-800 text-xs text-cream-400 space-y-1">
              <p className="font-bold text-cream-300">Staff & Management:</p>
              <p>
                <Link to="/admin/login" className="text-gold-400 hover:underline">
                  Restaurant Staff / Operations Login →
                </Link>
              </p>
            </div>
          </div>

          {/* Restaurant Location & Hours */}
          <div>
            <h4 className="font-serif text-base font-semibold text-gold-400 mb-4 tracking-wide uppercase text-xs">
              Location & Hours
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-cream-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span>
                  18, Khadakpura Street, Khadak Pura, Kurnool, Andhra Pradesh 518001, India
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-cream-100">11:00 AM – 11:00 PM Daily</p>
                  <p className="text-xs text-cream-400">Kitchen accepts fresh orders until 10:30 PM.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span>support@finedineknl.com</span>
              </div>
            </div>

            <div className="mt-4">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-charcoal-800 hover:bg-gold-500 hover:text-charcoal-950 text-gold-400 text-xs font-semibold tracking-wide transition-all duration-200 border border-gold-500/30"
              >
                <span>Directions on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-charcoal-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400 gap-4">
          <p>© {new Date().getFullYear()} FINE DINE KNL RESTAURANT, Kurnool. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gold-400 transition-colors">Terms</Link>
            <Link to="/delivery-policy" className="hover:text-gold-400 transition-colors">Delivery</Link>
            <Link to="/refund-policy" className="hover:text-gold-400 transition-colors">Refunds</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;

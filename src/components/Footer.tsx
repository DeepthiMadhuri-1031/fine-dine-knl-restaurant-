import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  ExternalLink, 
  Phone, 
  Sparkles,
  CalendarCheck,
  ShieldCheck,
  MessageCircle,
  PhoneCall
} from 'lucide-react';
import { AJWA_RESTAURANT_INFO } from '../data/ajwaData';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-950 text-cream-200 border-t border-charcoal-800/80 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* 1. Brand Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold-500/50 bg-charcoal-900 flex items-center justify-center p-1 shadow-md shadow-gold-500/10">
                <span className="text-gold-400 font-serif font-bold text-base tracking-widest">AE</span>
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-cream-100 block tracking-wide uppercase">
                  AJWA EXOTICA
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                  Fine Dining · Kurnool
                </span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-cream-300 leading-relaxed font-light">
              Where flavour meets elegance. Kurnool’s distinguished destination for royal biryani, authentic Arabian mandi, Mughlai gravies, and exquisite multicuisine hospitality.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-cream-300">
              <span className="px-2.5 py-1 rounded-full bg-charcoal-900 border border-charcoal-800">
                Multi-Cuisine Dining
              </span>
              <span className="px-2.5 py-1 rounded-full bg-charcoal-900 border border-charcoal-800">
                Outdoor Terrace
              </span>
              <span className="px-2.5 py-1 rounded-full bg-charcoal-900 border border-charcoal-800">
                Private Dining Room
              </span>
            </div>

            {/* Quick WhatsApp & Call Buttons */}
            <div className="pt-3 flex items-center gap-2">
              <a
                href={`https://wa.me/${AJWA_RESTAURANT_INFO.whatsappNumber}?text=Hello%20Ajwa%20Exotica%2C%20I%20would%20like%20to%20enquire%20about%20dining%20and%20reservations.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>

              <a
                href={`tel:${AJWA_RESTAURANT_INFO.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-850 border border-gold-500/30 text-gold-400 text-xs font-semibold transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* 2. Restaurant Navigation */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-gold-400 mb-4 tracking-wider uppercase">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="/#hero" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Home Experience
                </a>
              </li>
              <li>
                <a href="/#story" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Our Culinary Story
                </a>
              </li>
              <li>
                <a href="/#menu" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Multicuisine Menu & Bestsellers
                </a>
              </li>
              <li>
                <a href="/#experience" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Dining & Outdoor Ambiance
                </a>
              </li>
              <li>
                <a href="/#gallery" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Food & Venue Gallery
                </a>
              </li>
              <li>
                <a href="/#reviews" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Guest Reviews (4.4★ / 611 Reviews)
                </a>
              </li>
              <li>
                <a href="/#reservation" className="text-cream-300 hover:text-gold-400 transition-colors font-semibold text-gold-300">
                  Book Table / Private Room
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Operational Policies */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-gold-400 mb-4 tracking-wider uppercase">
              Hospitality & Policies
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
                  Delivery & Dining Guidelines
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-cream-300 hover:text-gold-400 transition-colors">
                  Cancellation & Booking Policy
                </Link>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-charcoal-800 text-xs text-cream-400 space-y-1">
              <p className="font-bold text-cream-300">Management & Staff:</p>
              <p>
                <Link to="/admin/login" className="text-gold-400 hover:underline inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Restaurant Operations Portal →</span>
                </Link>
              </p>
            </div>
          </div>

          {/* 4. Location & Contact Details */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-gold-400 mb-4 tracking-wider uppercase">
              Location & Hours
            </h4>
            <div className="space-y-3.5 text-xs sm:text-sm text-cream-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span>
                  {AJWA_RESTAURANT_INFO.address.full}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-cream-100">{AJWA_RESTAURANT_INFO.openingHours.closingTime}</p>
                  <p className="text-[11px] text-cream-400">
                    {AJWA_RESTAURANT_INFO.openingHours.displayNotice}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <a href={`tel:${AJWA_RESTAURANT_INFO.phone}`} className="hover:text-gold-300">
                  {AJWA_RESTAURANT_INFO.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="mt-5">
              <a
                href={AJWA_RESTAURANT_INFO.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-gold-400 text-xs font-semibold tracking-wide transition-all duration-200 border border-gold-500/30"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Get Driving Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-charcoal-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400 gap-4">
          <p>© {currentYear} AJWA EXOTICA, Kurnool. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gold-400 transition-colors">Terms</Link>
            <Link to="/delivery-policy" className="hover:text-gold-400 transition-colors">Guidelines</Link>
            <Link to="/refund-policy" className="hover:text-gold-400 transition-colors">Refunds</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

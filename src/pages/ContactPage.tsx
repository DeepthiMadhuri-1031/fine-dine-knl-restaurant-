import React from 'react';
import { MapPin, Clock, ExternalLink, Phone, PhoneCall, MessageCircle, UtensilsCrossed, Car, ShieldAlert, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AJWA_RESTAURANT_INFO } from '../data/ajwaData';

export const ContactPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 bg-charcoal-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            <span>Kurnool, Andhra Pradesh</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-100">
            Visit & Contact Ajwa Exotica
          </h1>
          <p className="text-sm sm:text-base text-cream-300 font-light">
            We welcome you to experience multicuisine fine dining in Kurnool. Here are our verified contact coordinates and visiting guidelines.
          </p>
        </div>

        {/* Location & Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Address Box */}
          <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/30">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-cream-100">
                  Restaurant Location
                </h3>
                <span className="text-xs text-gold-400 font-semibold">Verified Address</span>
              </div>
            </div>

            <div className="text-sm text-cream-200 leading-relaxed space-y-2">
              <p className="font-serif font-bold text-cream-100 text-lg">
                {AJWA_RESTAURANT_INFO.name}
              </p>
              <p>{AJWA_RESTAURANT_INFO.address.line1}</p>
              <p>{AJWA_RESTAURANT_INFO.address.locality}</p>
              <p>{AJWA_RESTAURANT_INFO.address.city}, {AJWA_RESTAURANT_INFO.address.state} {AJWA_RESTAURANT_INFO.address.pincode}, India.</p>
            </div>

            <div className="pt-4 border-t border-charcoal-800 flex flex-col gap-3">
              <a
                href={AJWA_RESTAURANT_INFO.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
              >
                <MapPin className="w-4 h-4" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={`tel:${AJWA_RESTAURANT_INFO.phone}`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-cream-200 border border-charcoal-700 text-xs font-semibold tracking-wide transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-gold-400" />
                <span>Direct Call: {AJWA_RESTAURANT_INFO.phoneDisplay}</span>
              </a>

              <a
                href={`https://wa.me/${AJWA_RESTAURANT_INFO.whatsappNumber}?text=Hello%20Ajwa%20Exotica%2C%20I%20would%20like%20to%20enquire%20about%20dining.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wide transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>
          </div>

          {/* Hours & Amenities Box */}
          <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/30">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-cream-100">
                    Dining Hours & Highlights
                  </h3>
                  <span className="text-xs text-gold-400 font-semibold">Service Times</span>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-cream-200">
                <div className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800">
                  <span className="text-cream-400 block mb-1 font-mono text-[11px] uppercase tracking-wider">
                    Operating Schedule
                  </span>
                  <p className="font-serif font-bold text-cream-100 text-base">
                    {AJWA_RESTAURANT_INFO.openingHours.closingTime}
                  </p>
                  <p className="text-xs text-cream-300 mt-1">
                    {AJWA_RESTAURANT_INFO.openingHours.displayNotice}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-cream-100">Amenities & Seating:</p>
                  <ul className="space-y-1.5 text-xs text-cream-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                      <span>Outdoor 3rd-floor terrace seating with evening breezes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                      <span>Exclusive Private Dining Salon for family events</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                      <span>Reported parking availability for guest vehicles</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                      <span>Typical spend reported between ₹200–₹400 per person</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-charcoal-800">
              <Link
                to="/#reservation"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Reserve a Table Online</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

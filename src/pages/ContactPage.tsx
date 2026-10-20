import React from 'react';
import { MapPin, Clock, ExternalLink, ShieldAlert, CheckCircle2, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Fine%20Dine%20KNL%20Restaurant%2C%2018%2C%20Khadakpura%20Street%2C%20Khadak%20Pura%2C%20Kurnool%2C%20Andhra%20Pradesh%20518001%2C%20India";
  const googleMapsListingUrl = "https://www.google.com/maps/search/?api=1&query=Fine%20Dine%20KNL%20Restaurant%2C%2018%2C%20Khadakpura%20Street%2C%20Khadak%20Pura%2C%20Kurnool%2C%20Andhra%20Pradesh%20518001%2C%20India";

  return (
    <div className="pt-28 pb-24 bg-charcoal-900 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kurnool, Andhra Pradesh</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-100">
            Visit & Contact Us
          </h1>
          <p className="text-sm sm:text-base text-cream-300">
            We welcome you to FINE DINE KNL RESTAURANT. Here is our verified location and dining guidelines.
          </p>
        </div>

        {/* Location & Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Address Box */}
          <div className="bg-charcoal-850 border border-charcoal-700/80 rounded-2xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/30">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-cream-100">
                  Restaurant Location
                </h3>
                <span className="text-xs text-gold-500">Verified Address</span>
              </div>
            </div>

            <div className="text-sm text-cream-200 leading-relaxed pl-1 space-y-2">
              <p className="font-semibold text-cream-100 text-base">
                FINE DINE KNL RESTAURANT
              </p>
              <p>18, Khadakpura Street, Khadak Pura,</p>
              <p>Kurnool, Andhra Pradesh 518001, India.</p>
            </div>

            <div className="pt-4 border-t border-charcoal-700/60 flex flex-col gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-sm tracking-wide transition-all shadow-lg"
              >
                <MapPin className="w-4 h-4" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={googleMapsListingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-cream-200 border border-charcoal-700 text-xs font-semibold tracking-wide transition-colors"
              >
                <span>View Google Maps Profile</span>
                <ExternalLink className="w-3.5 h-3.5 text-cream-400" />
              </a>
            </div>
          </div>

          {/* Operating Hours & Dining Policy */}
          <div className="bg-charcoal-850 border border-charcoal-700/80 rounded-2xl p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/30">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-cream-100">
                    Dining Hours
                  </h3>
                  <span className="text-xs text-gold-500">Service Schedule</span>
                </div>
              </div>

              <div className="text-sm text-cream-200 pl-1 space-y-2">
                <p className="font-semibold text-cream-100 text-base">
                  Closes at 10:30 PM
                </p>
                <p className="text-xs text-cream-400 leading-relaxed">
                  Full morning and afternoon service hours will be published once confirmed directly by the restaurant owner.
                </p>
              </div>

              {/* Verified Menu Terms & Conditions */}
              <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-2 text-xs text-cream-300">
                <p className="font-bold text-gold-400 uppercase tracking-wider text-[11px]">
                  Printed Menu Dine-In Policies:
                </p>
                <p>• Outside food & drinks are not permitted.</p>
                <p>• Orders once placed cannot be cancelled.</p>
                <p>• Please allow 20 minutes time to execute the order fresh.</p>
                <p>• Management is not responsible for personal belongings.</p>
              </div>
            </div>

            <div className="pt-2 text-xs text-cream-400 italic">
              Note: Direct phone and WhatsApp booking numbers will be listed upon restaurant verification.
            </div>
          </div>

        </div>

        {/* Explore Menu Link */}
        <div className="text-center pt-8 border-t border-charcoal-800">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-charcoal-800 hover:bg-gold-500 hover:text-charcoal-950 text-gold-400 text-xs font-bold uppercase tracking-wider border border-gold-500/30 transition-all"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>View Our Full Menu & Pricing</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

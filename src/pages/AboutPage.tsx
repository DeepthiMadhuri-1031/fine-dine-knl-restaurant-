import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Heart, ShieldCheck, MapPin, Sparkles, Clock, Check, CalendarCheck, PhoneCall, Compass } from 'lucide-react';
import { AJWA_RESTAURANT_INFO } from '../data/ajwaData';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 bg-charcoal-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-widest">
            <Heart className="w-3.5 h-3.5 text-gold-400" />
            <span>Our Culinary Story & Hospitality</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-100">
            About Ajwa Exotica
          </h1>
          <p className="text-sm sm:text-base text-cream-300 max-w-2xl mx-auto font-light">
            A sophisticated, welcoming dining destination where flavour, ambience, and genuine Kurnool hospitality meet.
          </p>
        </div>

        {/* Hero Image */}
        <div className="rounded-3xl overflow-hidden border border-gold-500/30 shadow-2xl relative aspect-[21/9] bg-charcoal-900">
          <img
            src="/images/ajwa/dining-ambience.jpg"
            alt="Ajwa Exotica Restaurant Dining Room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-cream-200 gap-2">
            <span className="font-serif text-base sm:text-lg font-bold text-cream-100">
              3rd Floor, above Vishal Mart, Venkata Ramana Colony, Kurnool
            </span>
            <span className="bg-charcoal-900/90 px-3 py-1 rounded-full border border-gold-500/40 text-gold-400 font-semibold self-start sm:self-auto">
              Fine-Dining Multicuisine
            </span>
          </div>
        </div>

        {/* Philosophy & Craft */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold">
              Crafted For Great Company
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100">
              Royal Dum Biryani, Authentic Mandi & Multicuisine Excellence
            </h2>
            <p className="text-sm text-cream-300 leading-relaxed font-light">
              Located on the 3rd Floor above Vishal Mart in Venkata Ramana Colony, Ameen Abbas Nagar, Ajwa Exotica brings together family dining, authentic culinary traditions, and elevated ambiance in the heart of Kurnool.
            </p>
            <p className="text-sm text-cream-300 leading-relaxed font-light">
              From slow-cooked Hyderabadi Chicken and Mutton Dum Biryanis and large Arabian Mandi sharing platters to charcoal-grilled tandoori kebabs, rich Mughlai curries, and fresh coastal seafood, every dish is prepared to deliver genuine flavour and memorable dining.
            </p>
          </div>

          <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-gold-400">
              Why Guests Choose Ajwa Exotica
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-cream-200">
              <li className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Family-Friendly Multicuisine:</strong> A diverse menu catering to all palates—from biryani and mandi lovers to Mughlai, Chinese, and vegetarian options.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Outdoor Terrace & Private Dining:</strong> Enjoy open-air evening breezes on the third floor or book our exclusive private dining salon.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Affordable Premium Experience:</strong> Typical spend reported at ₹200–₹400 per person with generous portions.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Parking & Access:</strong> Centrally situated in Ameen Abbas Nagar above Vishal Mart with reported parking availability.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-charcoal-800 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/#reservation"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xl"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Reserve Table at Ajwa Exotica</span>
          </Link>

          <a
            href={`tel:${AJWA_RESTAURANT_INFO.phone}`}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-charcoal-900 hover:bg-charcoal-850 text-cream-200 border border-charcoal-700 font-semibold text-xs transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-gold-400" />
            <span>Call {AJWA_RESTAURANT_INFO.phone}</span>
          </a>
        </div>

      </div>
    </div>
  );
};

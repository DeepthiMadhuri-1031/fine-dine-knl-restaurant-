import React from 'react';
import { Star, ExternalLink, ShieldCheck, MessageSquare, Award } from 'lucide-react';

export const GoogleReviews: React.FC = () => {
  const googleMapsListingUrl = "https://www.google.com/maps/search/?api=1&query=Fine%20Dine%20KNL%20Restaurant%2C%2018%2C%20Khadakpura%20Street%2C%20Khadak%20Pura%2C%20Kurnool%2C%20Andhra%20Pradesh%20518001%2C%20India";

  return (
    <section className="py-20 bg-charcoal-900 relative overflow-hidden" id="reviews-section">
      {/* Background glow decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Guest Experiences</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-100 tracking-tight">
            What Our Guests Say
          </h2>
          <p className="mt-3 text-sm text-cream-300">
            Real feedback from diners in Kurnool who have enjoyed our biryanis, paneer specialties, and hospitality.
          </p>
        </div>

        {/* Rating Card */}
        <div className="bg-charcoal-850 border border-gold-500/30 rounded-2xl p-8 sm:p-12 shadow-2xl relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Score Column */}
            <div className="md:col-span-5 text-center md:text-left md:border-r md:border-charcoal-700/60 md:pr-8">
              <div className="inline-block">
                <span className="font-serif text-6xl sm:text-7xl font-bold text-gold-400 tracking-tight">
                  4.1
                </span>
                <span className="text-xl sm:text-2xl text-cream-400 font-medium"> / 5.0</span>
              </div>

              {/* Stars */}
              <div className="flex items-center justify-center md:justify-start gap-1.5 my-3 text-gold-400">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-gold-400" />
                ))}
                {/* 4.1 star representation */}
                <div className="relative">
                  <Star className="w-6 h-6 text-charcoal-700 fill-charcoal-700" />
                  <div className="absolute inset-0 overflow-hidden w-[20%]">
                    <Star className="w-6 h-6 text-gold-400 fill-gold-400" />
                  </div>
                </div>
              </div>

              <p className="text-sm text-cream-200 font-medium">
                Based on <span className="text-gold-400 font-bold">129 verified reviews</span> on Google
              </p>

              <div className="mt-4 flex items-center justify-center md:justify-start gap-2 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Google Maps Listing</span>
              </div>
            </div>

            {/* Right Information & CTA Column */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-semibold text-cream-100">
                  Authentic, Unfiltered Customer Reviews
                </h3>
                <p className="text-sm text-cream-300 leading-relaxed">
                  We believe in 100% transparency. Rather than displaying curated or outdated snapshots, we direct you to our live Google Maps page where you can read real experiences from Kurnool residents and travelers, check recent ratings, and see diner photos.
                </p>

                {/* Popular mentions */}
                <div className="pt-2">
                  <p className="text-xs uppercase tracking-wider text-gold-500 font-semibold mb-2">
                    Frequently Praised For:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Hyderabadi Veg Biryani", "Crispy Paneer 65", "Rich Bagara Paneer", "Family Dining", "Affordable (₹200–₹400/person)"].map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs bg-charcoal-900 text-cream-200 border border-charcoal-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href={googleMapsListingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-semibold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-gold-500/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Read 129 Reviews on Google</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  href={googleMapsListingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-cream-200 border border-charcoal-700 hover:border-gold-500/50 font-medium text-sm transition-all duration-200"
                >
                  <span>Leave a Review</span>
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* Reassurance text */}
        <p className="text-center text-xs text-cream-400 mt-6">
          FINE DINE KNL RESTAURANT • 18, Khadakpura Street, Kurnool, Andhra Pradesh 518001
        </p>
      </div>
    </section>
  );
};

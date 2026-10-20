import React from 'react';
import { GoogleReviews } from '../components/GoogleReviews';
import { Star, ShieldCheck, MessageSquare, ExternalLink, ThumbsUp } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const googleMapsListingUrl = "https://www.google.com/maps/search/?api=1&query=Fine%20Dine%20KNL%20Restaurant%2C%2018%2C%20Khadakpura%20Street%2C%20Khadak%20Pura%2C%20Kurnool%2C%20Andhra%20Pradesh%20518001%2C%20India";

  return (
    <div className="pt-28 pb-24 bg-charcoal-900 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            <Star className="w-3.5 h-3.5 fill-gold-400" />
            <span>4.1 / 5.0 Google Rating</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-100">
            Guest Reviews & Ratings
          </h1>
          <p className="text-sm sm:text-base text-cream-300">
            Verified opinions and dining ratings from patrons visiting FINE DINE KNL RESTAURANT in Kurnool.
          </p>
        </div>

        {/* Embedded GoogleReviews Component */}
        <GoogleReviews />

        {/* Why Google Maps Verification Card */}
        <div className="bg-charcoal-850 border border-charcoal-700/80 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="font-serif text-xl font-bold text-cream-100">
              Why We Link Directly to Live Google Reviews
            </h3>
          </div>
          <p className="text-sm text-cream-300 leading-relaxed">
            Unlike platforms that display unverified static testimonials or risk third-party iframe blocking errors, we provide direct access to our verified Google Business Profile. There, you can read real-time unfiltered feedback, see diner-submitted photographs, and review ratings from authentic local patrons.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 text-center space-y-2">
              <span className="font-serif text-3xl font-bold text-gold-400">4.1★</span>
              <p className="text-xs text-cream-300 font-medium">Average Diner Rating</p>
            </div>
            <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 text-center space-y-2">
              <span className="font-serif text-3xl font-bold text-cream-100">129</span>
              <p className="text-xs text-cream-300 font-medium">Verified Google Reviews</p>
            </div>
            <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 text-center space-y-2">
              <span className="font-serif text-3xl font-bold text-emerald-400">100%</span>
              <p className="text-xs text-cream-300 font-medium">Pure Vegetarian Quality</p>
            </div>
          </div>

          <div className="pt-4 text-center">
            <a
              href={googleMapsListingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Google Maps Listing</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

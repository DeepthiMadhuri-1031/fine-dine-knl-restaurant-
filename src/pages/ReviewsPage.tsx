import React from 'react';
import { Star, ShieldCheck, MessageSquare, ExternalLink, ThumbsUp, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AJWA_RESTAURANT_INFO, REVIEWS_DATA } from '../data/ajwaData';

export const ReviewsPage: React.FC = () => {
  const googleMapsListingUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(AJWA_RESTAURANT_INFO.address.full)}`;

  return (
    <div className="pt-28 pb-24 bg-charcoal-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-widest">
            <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <span>{REVIEWS_DATA.averageRating} / 5.0 Google Rating</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-100">
            Guest Ratings & Reviews
          </h1>
          <p className="text-sm sm:text-base text-cream-300 font-light">
            Verified opinions and dining ratings from patrons visiting Ajwa Exotica in Kurnool.
          </p>
        </div>

        {/* Rating Breakdown & Summary Card */}
        <div className="bg-charcoal-900 border border-gold-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Score Big Display */}
            <div className="md:col-span-5 text-center md:text-left space-y-3 md:border-r border-charcoal-800 md:pr-8">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                Overall Google Score
              </span>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="font-serif text-6xl font-bold text-cream-100">
                  {REVIEWS_DATA.averageRating}
                </span>
                <span className="text-2xl text-cream-400 font-serif">/ 5</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1 text-gold-400">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-gold-400" />
                ))}
                <Star className="w-5 h-5 fill-gold-400/50 text-gold-400" />
              </div>
              <p className="text-xs text-cream-300">
                Calculated from <strong className="text-cream-100 font-semibold">{REVIEWS_DATA.reviewCount} customer reviews</strong>.
              </p>
              <p className="text-xs text-gold-400 font-medium">
                Typical Spend: {REVIEWS_DATA.spendPerPerson} per person
              </p>
            </div>

            {/* Rating Bars */}
            <div className="md:col-span-7 space-y-2.5">
              {REVIEWS_DATA.ratingBreakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-cream-300 font-medium">{row.stars} Stars</span>
                  <div className="flex-1 h-2.5 rounded-full bg-charcoal-950 overflow-hidden border border-charcoal-800">
                    <div
                      className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-cream-400 font-mono text-[11px]">{row.percentage}%</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Synthesized Verified Themes */}
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-bold text-cream-100 text-center">
            Key Highlights from Guest Feedback
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {REVIEWS_DATA.verifiedThemes.map((theme, idx) => (
              <div
                key={idx}
                className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-cream-100">
                    {theme.title}
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      theme.sentiment === 'Positive'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {theme.sentiment}
                  </span>
                </div>
                <p className="text-xs text-cream-300/90 leading-relaxed font-light">
                  {theme.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Profile Link Card */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-8 text-center space-y-5 shadow-xl">
          <ShieldCheck className="w-10 h-10 text-gold-400 mx-auto" />
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-100">
            Read All Reviews on Google Maps
          </h3>
          <p className="text-xs sm:text-sm text-cream-300 max-w-xl mx-auto leading-relaxed font-light">
            We value honest feedback and transparent hospitality. Check diner photos, latest ratings, and unfiltered experiences on our verified Google listing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={googleMapsListingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
            >
              <span>Open Google Reviews</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              to="/#reservation"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-cream-100 border border-gold-500/30 text-xs font-semibold transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>Reserve a Table</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

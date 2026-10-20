import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Heart, ShieldCheck, MapPin, Sparkles, Clock, Check } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 bg-charcoal-900 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            <Heart className="w-3.5 h-3.5" />
            <span>Our Heritage & Hospitality</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-100">
            About FINE DINE KNL RESTAURANT
          </h1>
          <p className="text-sm sm:text-base text-cream-300 max-w-2xl mx-auto">
            Discover the culinary philosophy and culinary team dedicated to authentic pure vegetarian Indian flavours in Kurnool, Andhra Pradesh.
          </p>
        </div>

        {/* Hero Image */}
        <div className="rounded-3xl overflow-hidden border border-charcoal-700 shadow-2xl relative aspect-[21/9]">
          <img
            src="/images/hero/restaurant-hero-hq.webp"
            alt="Fine Dine KNL Restaurant Dining Room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-cream-200">
            <span className="font-serif text-lg font-bold text-cream-100">
              18, Khadakpura Street, Khadak Pura, Kurnool
            </span>
            <span className="bg-charcoal-900/80 px-3 py-1 rounded-full border border-gold-500/40 text-gold-400 font-semibold">
              Pure Vegetarian Excellence
            </span>
          </div>
        </div>

        {/* Philosophy & Craft */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold">
              Tradition & Freshness
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100">
              Slow-Cooked Dum Biryanis & Rich Andhra Gravies
            </h2>
            <p className="text-sm text-cream-300 leading-relaxed">
              At FINE DINE KNL, we believe Indian food is an experience crafted for sharing. From the aromatic warmth of our Hyderabad Veg Biryani slow-cooked with basmati rice, mint, and saffron, to the deep nutty gravies of our signature Bagara Paneer, every recipe honors time-tested cooking methods.
            </p>
            <p className="text-sm text-cream-300 leading-relaxed">
              We never take shortcuts with pre-made bases. Spices are roasted and ground in-house, vegetables are sourced fresh daily, and our clay tandoor oven ensures that every naan and roti arrives blistered, hot, and fragrant.
            </p>
          </div>

          <div className="bg-charcoal-850 border border-charcoal-700/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-gold-400">
              Our Core Kitchen Principles
            </h3>
            <ul className="space-y-3 text-sm text-cream-200">
              <li className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>100% Pure Vegetarian:</strong> A dedicated strictly vegetarian kitchen adhering to the highest hygiene standards.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Slow-Cooked Fresh to Order:</strong> We request 20 minutes preparation time because dishes are prepared fresh upon order.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Accessible Fine Dining:</strong> Generous portions and relaxed ambience at an affordable ₹200–₹400 per person.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Authentic Andhra & North Indian Menu:</strong> Over 190 item varieties ranging from regional curries to tandoori breads.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-charcoal-800">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-sm tracking-wide transition-all shadow-xl"
          >
            <Utensils className="w-4 h-4" />
            <span>Browse Full Menu & Pricing</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

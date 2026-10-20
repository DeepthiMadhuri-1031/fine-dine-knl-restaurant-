import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  MapPin, 
  Clock, 
  Star, 
  Sparkles, 
  ChevronRight, 
  ShoppingBag, 
  ArrowRight,
  Flame,
  Check,
  Truck,
  ShieldCheck,
  Layers,
  Award,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MENU_ITEMS } from '../data/menuData';
import { GoogleReviews } from '../components/GoogleReviews';

export const HomePage: React.FC = () => {
  const { addToCart, activeOrder, setIsCartOpen } = useCart();
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Fine%20Dine%20KNL%20Restaurant%2C%2018%2C%20Khadakpura%20Street%2C%20Khadak%20Pura%2C%20Kurnool%2C%20Andhra%20Pradesh%20518001%2C%20India";

  // Filter only bestsellers
  const bestsellers = MENU_ITEMS.filter(item => item.bestseller || item.featured).slice(0, 8);

  const popularCategories = [
    {
      name: "Royal Dum Biryanis",
      desc: "Aged long-grain basmati slow-cooked with saffron and spices",
      image: "/images/dishes/hyderabad-veg-biryani-hq.webp",
      count: "7 Varieties"
    },
    {
      name: "Paneer Delicacies",
      desc: "Bagara Paneer, Paneer Butter Masala & royal curries",
      image: "/images/dishes/bagara-paneer-hq.webp",
      count: "15 Varieties"
    },
    {
      name: "Crispy Starters",
      desc: "Paneer 65, Spring Rolls & sizzling appetizers",
      image: "/images/dishes/paneer-65-hq.webp",
      count: "23 Varieties"
    },
    {
      name: "Tandoori Breads",
      desc: "Clay-oven baked butter naans, rotis & parathas",
      image: "/images/dishes/butter-naan-hq.webp",
      count: "15 Varieties"
    },
    {
      name: "Beverages & Shakes",
      desc: "Fresh fruit juices, mango shakes & mocktails",
      image: "/images/dishes/refreshing-beverages-hq.webp",
      count: "18 Varieties"
    },
    {
      name: "Desserts & Ice Cream",
      desc: "Milkshakes, gourmet scoops & sweet treats",
      image: "/images/dishes/ice-cream-shake.webp",
      count: "12 Varieties"
    }
  ];

  return (
    <div className="space-y-0">
      
      {/* Active Order Banner if order exists */}
      {activeOrder && (
        <div className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-charcoal-950 py-2.5 px-4 text-xs font-bold shadow-lg fixed top-[68px] left-0 right-0 z-30 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Active Order #{activeOrder.orderId}: Kitchen is preparing your dishes (~20 mins).</span>
            </span>
            <Link
              to={`/order-confirmation/${activeOrder.orderId}`}
              className="underline hover:text-black font-semibold ml-4"
            >
              Track Order Live →
            </Link>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Editorial Food Photograph */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/restaurant-hero-hq.webp"
            alt="Fine Dine KNL Restaurant Dining Feast"
            className="w-full h-full object-cover object-center brightness-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-charcoal-950/50"></div>
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-charcoal-950/40 to-charcoal-950/90"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-16">
          
          {/* Top Pill with Restaurant Identity */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs uppercase tracking-widest font-semibold mb-6 shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>100% Pure Vegetarian · Khadakpura, Kurnool</span>
          </div>

          {/* Headline - Exact required text: GOOD FOOD. GREAT MOMENTS. */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-cream-100 leading-[1.1] mb-6">
            GOOD FOOD. <br className="hidden sm:inline" />
            <span className="gold-gradient-text">GREAT MOMENTS.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-cream-200/90 leading-relaxed font-light mb-8">
            Experience the culinary soul of Kurnool. From royal Hyderabadi dum biryanis and velvety Bagara Paneer to sizzling starters and clay-oven tandoori breads, prepared fresh for your family table.
          </p>

          {/* Key Facts Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-10 text-xs sm:text-sm text-cream-300">
            <div className="flex items-center gap-1.5 bg-charcoal-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-charcoal-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>100% Pure Veg Kitchen</span>
            </div>
            <div className="flex items-center gap-1.5 bg-charcoal-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-charcoal-700">
              <span className="text-gold-400 font-bold">₹200–₹400</span>
              <span>per person spend</span>
            </div>
            <div className="flex items-center gap-1.5 bg-charcoal-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-charcoal-700">
              <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
              <span className="font-bold text-cream-100">4.1</span>
              <span>(129 Google Reviews)</span>
            </div>
          </div>

          {/* Primary Action Buttons: Explore Menu & Order Online */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-gold-500 hover:bg-gold-400 text-charcoal-950 transition-all duration-200 shadow-xl shadow-gold-500/25 hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Online Now</span>
            </Link>

            <Link
              to="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-charcoal-850/90 hover:bg-charcoal-800 text-cream-100 border border-gold-500/40 backdrop-blur-md transition-all duration-200 shadow-lg"
            >
              <UtensilsCrossed className="w-4 h-4 text-gold-400" />
              <span>Explore Menu Scans</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 2. POPULAR CATEGORIES SECTION */}
      <section className="py-20 bg-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold block mb-2">
                Explore Flavours
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-100">
                Popular Menu Categories
              </h2>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300"
            >
              <span>View all categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((cat, idx) => (
              <Link
                key={idx}
                to="/menu"
                className="group bg-charcoal-900 border border-charcoal-800 rounded-2xl overflow-hidden hover:border-gold-500/40 transition-all duration-300 flex flex-col text-center p-3 shadow-lg"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-charcoal-950 mb-3 border border-charcoal-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <h4 className="font-serif text-xs sm:text-sm font-bold text-cream-100 group-hover:text-gold-300 transition-colors line-clamp-1">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-gold-500 mt-1">
                  {cat.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BEST-SELLING DISHES (BESTSELLERS ONLY) */}
      <section className="py-24 bg-charcoal-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-widest mb-3">
                <Flame className="w-3.5 h-3.5" />
                <span>Customer Favorites</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-100">
                Best-Selling Dishes
              </h2>
              <p className="mt-2 text-sm text-cream-300 max-w-xl">
                The most-ordered dishes at FINE DINE KNL RESTAURANT, freshly slow-dum cooked and delivered hot.
              </p>
            </div>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-400 hover:text-gold-300 group"
            >
              <span>Browse Full 40+ Item Menu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Bestseller Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((dish) => {
              const displayPrice = dish.price || (dish.priceVariants ? dish.priceVariants[dish.priceVariants.length - 1].price : 180);

              return (
                <div
                  key={dish.id}
                  className="bg-charcoal-850 rounded-2xl border border-charcoal-700/80 overflow-hidden hover:border-gold-500/50 transition-all duration-300 shadow-xl group flex flex-col"
                >
                  {/* Photo Container with Alt Text */}
                  <div className="relative aspect-[4/3] bg-charcoal-950 overflow-hidden">
                    <img
                      src={dish.imageUrl}
                      alt={dish.altText}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent"></div>

                    {/* Veg indicator badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-charcoal-900/90 border border-emerald-500 flex items-center justify-center p-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-950/80 text-red-300 border border-red-500/40">
                        Top Seller
                      </span>
                    </div>

                    {/* Spice badge */}
                    {dish.spicyLevel && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-charcoal-900/90 text-cream-200 border border-charcoal-700 flex items-center gap-1">
                          <Flame className={`w-3 h-3 ${dish.spicyLevel === 'Spicy' ? 'text-red-400' : 'text-amber-400'}`} />
                          {dish.spicyLevel}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-2.5 left-3">
                      <span className="text-[10px] uppercase tracking-wider text-gold-400/90 font-semibold">
                        {dish.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-base font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                          {dish.name}
                        </h3>
                        <span className="font-serif font-bold text-gold-400 text-base shrink-0">
                          ₹{displayPrice}
                        </span>
                      </div>
                      <p className="text-xs text-cream-300 mt-2 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>

                    {/* Quick Order Button */}
                    <div className="pt-3 border-t border-charcoal-800 flex items-center justify-between">
                      <Link
                        to="/menu"
                        className="text-[11px] text-cream-400 hover:text-gold-300 transition-colors"
                      >
                        Details
                      </Link>

                      <button
                        onClick={() => addToCart(dish, displayPrice)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. ONLINE ORDERING HIGHLIGHTS & DELIVERY PROMISE */}
      <section className="py-20 bg-charcoal-950 border-y border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-cream-100">
                Local Kurnool Delivery
              </h3>
              <p className="text-xs text-cream-300 leading-relaxed">
                Prompt delivery across Khadakpura and Kurnool. FREE delivery on all orders above ₹500.
              </p>
            </div>

            <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-cream-100">
                Fresh ~20 Mins Dum Cooking
              </h3>
              <p className="text-xs text-cream-300 leading-relaxed">
                We never pre-pack or reheat. Authentic slow-dum preparation ensures sizzling freshness in every bite.
              </p>
            </div>

            <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-cream-100">
                100% Pure Veg Kitchen
              </h3>
              <p className="text-xs text-cream-300 leading-relaxed">
                Strict vegetarian kitchen guidelines, farm-fresh ingredients, and uncompromised food safety standards.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. MENU SCANS / PHOTOGRAPH VIEWER PREVIEW */}
      <section className="py-20 bg-charcoal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-charcoal-850 rounded-3xl border border-charcoal-700/80 p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Transparent Menu Documentation</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-100">
                  Inspect All 19 Original & Enhanced Menu Scans
                </h2>

                <p className="text-sm text-cream-300 leading-relaxed">
                  We maintain full transparency with our guests. You can inspect the restaurant's actual printed menu photographs with our interactive high-resolution viewer featuring zoom, pan, and side-by-side enhancement comparisons.
                </p>

                <div className="pt-2">
                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                  >
                    <Layers className="w-4 h-4" />
                    <span>View 19 Menu Scans</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                <div className="space-y-1 text-center">
                  <span className="text-[10px] text-cream-400 font-mono">Original Photograph</span>
                  <img
                    src="/images/menu/original/unnamed (4).webp"
                    alt="Original scan"
                    className="w-full h-44 object-cover rounded-xl border border-charcoal-700"
                  />
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-[10px] text-gold-400 font-mono font-bold">Enhanced Scan</span>
                  <img
                    src="/images/menu/enhanced/enhanced_unnamed (4).webp"
                    alt="Enhanced scan"
                    className="w-full h-44 object-cover rounded-xl border border-gold-500/40 shadow-lg"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. GOOGLE REVIEWS SECTION (OPTION C: NO BROKEN IFRAME) */}
      <GoogleReviews />

      {/* 7. LOCATION & VISIT US SECTION */}
      <section className="py-20 bg-charcoal-950 border-t border-charcoal-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-charcoal-850 rounded-2xl border border-gold-500/30 p-8 sm:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold block">
                  Find Us in Kurnool
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100">
                  FINE DINE KNL RESTAURANT
                </h3>
                <div className="space-y-1 text-sm text-cream-300">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                    <span>18, Khadakpura Street, Khadak Pura, Kurnool, Andhra Pradesh 518001, India</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold-500 shrink-0" />
                    <span>Dine-In Closes at 10:30 PM (Full opening hours to be confirmed)</span>
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-sm tracking-wide transition-all shadow-lg"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Driving Directions</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-cream-200 border border-charcoal-700 text-sm font-medium transition-colors"
                >
                  <span>Contact Details</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

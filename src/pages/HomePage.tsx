import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  ArrowRight, 
  Flame, 
  ShoppingBag, 
  Phone, 
  PhoneCall, 
  ExternalLink, 
  Check, 
  UtensilsCrossed, 
  Layers, 
  CalendarCheck, 
  Eye, 
  X, 
  Info,
  Car,
  Compass,
  HeartHandshake,
  Truck,
  Leaf,
  Drumstick,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { 
  AJWA_RESTAURANT_INFO, 
  AJWA_DISHES, 
  MENU_CATEGORIES, 
  MenuCategoryType, 
  GALLERY_ITEMS, 
  REVIEWS_DATA,
  AjwaDish 
} from '../data/ajwaData';
import { Hero3DCanvas } from '../components/Hero3DCanvas';
import { Card3DTilt } from '../components/Card3DTilt';
import { TableReservationSection } from '../components/TableReservationSection';
import { FullMenuModal } from '../components/FullMenuModal';
import { ChefMascot3D } from '../components/ChefMascot3D';
import { ReviewSubmissionForm } from '../components/ReviewSubmissionForm';
import { Button3D } from '../components/Button3D';
import { FoodDetailModal3D } from '../components/FoodDetailModal3D';
import { apiUrl } from '../config/api';

export const HomePage: React.FC = () => {
  const { addToCart, setIsCartOpen, activeOrder } = useCart();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryType>('All');
  const [highlightTab, setHighlightTab] = useState<'all' | 'non-veg' | 'veg'>('non-veg');
  const [galleryCategory, setGalleryCategory] = useState<string>('All');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; caption: string } | null>(null);
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
  const [selectedDetailDish, setSelectedDetailDish] = useState<AjwaDish | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Live reviews state fetched from SQLite database
  const [dbReviews, setDbReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(apiUrl('/api/reviews'));
        if (res.ok) {
          const data = await res.json();
          setDbReviews(data.reviews || []);
        }
      } catch (err) {
        console.warn('Could not fetch reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  // Filter dishes by category for the menu grid
  const displayedDishes = selectedCategory === 'All'
    ? AJWA_DISHES
    : AJWA_DISHES.filter((d) => d.category === selectedCategory);

  // Separate Vegetarian and Non-Vegetarian highlights
  const highlightedDishes = AJWA_DISHES.filter((dish) => {
    if (highlightTab === 'veg') return dish.isVeg;
    if (highlightTab === 'non-veg') return !dish.isVeg;
    return dish.bestseller;
  });

  // Filter gallery items
  const galleryCategories = ['All', 'Mandi & Biryani', 'Ambience', 'Starters & Tandoor', 'Curries & Seafood', 'Mocktails & Drinks'];
  const displayedGallery = galleryCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((g) => g.category.includes(galleryCategory) || galleryCategory.includes(g.category));

  const handleAddDish = (dish: AjwaDish) => {
    addToCart(
      {
        id: dish.id,
        name: dish.name,
        category: dish.category,
        price: dish.price,
        priceConfirmed: !dish.isEstimatedPrice,
        description: dish.description,
        isVeg: dish.isVeg,
        imageUrl: dish.imageUrl,
        altText: dish.altText,
        spicyLevel: dish.spicyLevel,
        menuPageId: 'ajwa-home'
      },
      dish.price
    );

    setAddedToast(`Added ${dish.name} to order`);
    setTimeout(() => {
      setAddedToast(null);
    }, 3000);
  };

  const scrollToReservation = () => {
    const el = document.getElementById('reservation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#reservation');
    }
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#menu');
    }
  };

  return (
    <div className="space-y-0 selection:bg-gold-500 selection:text-charcoal-950">
      
      {/* Toast Notification when adding dish */}
      {addedToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-charcoal-900 border border-gold-500 text-cream-100 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideUp">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold">{addedToast}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-xs font-bold text-gold-400 hover:underline ml-2"
          >
            View Cart →
          </button>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: CINEMATIC HERO — "A TASTE WORTH GATHERING FOR"
          ========================================================================= */}
      <section id="hero" className="relative min-h-[96vh] flex items-center justify-center overflow-hidden bg-charcoal-950 pt-16">
        
        {/* Full-bleed Cinematic Food Photography Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/ajwa/ajwa-hero-feast.jpg"
            alt="Ajwa Exotica Multicuisine Dining Feast in Kurnool"
            className="w-full h-full object-cover object-center brightness-[0.40] contrast-[1.15] scale-105 transform motion-safe:animate-subtleZoom transition-all duration-1000"
          />
          {/* Deep burgundy & charcoal layered gradient masks for luxury depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-charcoal-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 via-burgundy-950/30 to-charcoal-950/90" />
        </div>

        {/* 3D WebGL Canvas Layer (Floating Champagne Gold Particles & Orbital Rings) */}
        <Hero3DCanvas />

        {/* Hero Editorial Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
          
          {/* Top Brand Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-burgundy-900/80 via-charcoal-900/80 to-burgundy-900/80 border border-gold-500/40 text-gold-300 text-xs uppercase tracking-widest font-semibold mb-6 shadow-2xl backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Multicuisine Dining & Fast Delivery · Kurnool, Andhra Pradesh</span>
          </div>

          {/* Exact Headline: "A Taste Worth Gathering For." */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-cream-100 leading-[1.1] mb-6">
            A Taste Worth <br className="hidden sm:inline" />
            <span className="gold-gradient-text">Gathering For.</span>
          </h1>

          {/* Supporting Text */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-cream-200/90 leading-relaxed font-light mb-8">
            Experience exceptional Chicken & Mutton Dum Biryani, authentic Arabian Mandi, sizzling charcoal kebabs, and rich Mughlai gravies at <strong className="font-medium text-cream-100">Ajwa Exotica</strong>, Kurnool.
          </p>

          {/* Information Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 text-xs sm:text-sm text-cream-200">
            {/* Google Rating */}
            <div className="flex items-center gap-2 bg-charcoal-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-gold-500/30 shadow-lg">
              <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
              <span className="font-bold text-cream-100">{AJWA_RESTAURANT_INFO.googleRating.score}</span>
              <span className="text-cream-400">({AJWA_RESTAURANT_INFO.googleRating.totalReviews} Google Reviews)</span>
            </div>

            {/* Spend per person */}
            <div className="flex items-center gap-2 bg-charcoal-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-charcoal-700 shadow-lg">
              <span className="text-gold-400 font-bold">₹200–₹400</span>
              <span className="text-cream-300">typical spend / person</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 bg-charcoal-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-charcoal-700 shadow-lg">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-cream-200">Ameen Abbas Nagar, Kurnool</span>
            </div>

            {/* Operating hours */}
            <div className="flex items-center gap-2 bg-charcoal-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-charcoal-700 shadow-lg">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-cream-300">{AJWA_RESTAURANT_INFO.openingHours.closingTime}</span>
            </div>
          </div>

          {/* Primary 3D Action Buttons: Explore Menu, Order Now, Track Order */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button3D
              variant="gold"
              size="lg"
              onClick={scrollToMenu}
              icon={<UtensilsCrossed className="w-4 h-4" />}
            >
              Explore Menu
            </Button3D>

            <Button3D
              variant="burgundy"
              size="lg"
              onClick={() => navigate('/menu')}
              icon={<ShoppingBag className="w-4 h-4 text-gold-400" />}
            >
              Order Online
            </Button3D>

            <Button3D
              variant="charcoal"
              size="lg"
              onClick={() => navigate('/my-orders')}
              icon={<Truck className="w-4 h-4 text-gold-400" />}
            >
              Track Order
            </Button3D>
          </div>

          {/* Verification Transparency Note */}
          <p className="mt-8 text-[11px] text-cream-400 font-mono">
            {AJWA_RESTAURANT_INFO.openingHours.displayNotice}
          </p>

        </div>

      </section>

      {/* =========================================================================
          SECTION 2: SEPARATE VEGETARIAN & NON-VEGETARIAN HIGHLIGHTS
          ========================================================================= */}
      <section id="highlights" className="py-24 bg-charcoal-900 border-y border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold block mb-2">
              Curated For Every Palate
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-100">
              Vegetarian & Non-Vegetarian Highlights
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-cream-300 font-light">
              We take pride in dedicated preparation standards—whether you are indulging in rich biryanis and juicy Arabian mandi or royal paneer curries and tandoori breads.
            </p>

            {/* Toggle Tabs */}
            <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-charcoal-950 border border-charcoal-750 shadow-xl">
              <button
                onClick={() => setHighlightTab('non-veg')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  highlightTab === 'non-veg'
                    ? 'bg-gradient-to-r from-burgundy-850 to-burgundy-900 text-cream-100 border border-gold-500/40 shadow-lg'
                    : 'text-cream-300 hover:text-gold-300'
                }`}
              >
                <Drumstick className="w-3.5 h-3.5 text-red-400" />
                <span>Non-Vegetarian Specialties</span>
              </button>

              <button
                onClick={() => setHighlightTab('veg')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  highlightTab === 'veg'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-lg'
                    : 'text-cream-300 hover:text-gold-300'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pure Vegetarian Delights</span>
              </button>

              <button
                onClick={() => setHighlightTab('all')}
                className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  highlightTab === 'all'
                    ? 'bg-gold-500 text-charcoal-950 font-bold shadow-lg'
                    : 'text-cream-300 hover:text-gold-300'
                }`}
              >
                <span>All Bestsellers</span>
              </button>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {highlightedDishes.slice(0, 6).map((dish) => (
              <Card3DTilt
                key={dish.id}
                className="bg-charcoal-850 border border-charcoal-750 rounded-2xl overflow-hidden hover:border-gold-500/50 transition-colors flex flex-col group shadow-xl"
              >
                <div className="relative aspect-[16/11] bg-charcoal-950 overflow-hidden">
                  <img
                    src={dish.imageUrl}
                    alt={dish.altText}
                    onError={(e) => {
                      if (dish.fallbackImageUrl) (e.currentTarget as HTMLImageElement).src = dish.fallbackImageUrl;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-850 via-transparent to-transparent" />

                  {/* Dietary badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-md bg-charcoal-950/90 flex items-center justify-center p-0.5 border ${
                        dish.isVeg ? 'border-emerald-500' : 'border-red-500'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      dish.isVeg ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/30' : 'bg-burgundy-950/90 text-gold-300 border border-gold-500/30'
                    }`}>
                      {dish.isVeg ? '100% Pure Veg' : 'Non-Vegetarian'}
                    </span>
                  </div>

                  {dish.spicyLevel && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-charcoal-950/90 text-cream-200 border border-charcoal-700 flex items-center gap-1">
                        <Flame className={`w-3 h-3 ${dish.spicyLevel === 'Spicy' ? 'text-red-400' : 'text-amber-400'}`} />
                        <span>{dish.spicyLevel}</span>
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-4">
                    <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                      {dish.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-lg font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                        {dish.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-gold-400 text-lg">
                          ₹{dish.price}
                        </span>
                        {dish.isEstimatedPrice && (
                          <span className="block text-[9px] text-cream-400 font-mono">(Demo)</span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-cream-300/80 mt-2 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-charcoal-750 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedDetailDish(dish)}
                      className="text-xs text-cream-400 hover:text-gold-300 font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold-400" />
                      <span>3D View</span>
                    </button>

                    <Button3D
                      variant="gold"
                      size="xs"
                      onClick={() => handleAddDish(dish)}
                      icon={<ShoppingBag className="w-3.5 h-3.5" />}
                    >
                      Add
                    </Button3D>
                  </div>
                </div>
              </Card3DTilt>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: SIGNATURE MENU WITH WORKING CATEGORIES
          ========================================================================= */}
      <section id="menu" className="py-28 bg-charcoal-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Multicuisine Selection</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-100">
                Signature Menu
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-cream-300 max-w-xl font-light">
                Explore our full spectrum of dishes—from slow-cooked Biryanis and Mandi to sizzling tandoor starters and chilled mocktails.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/qr-menu"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700 text-cream-200 text-xs font-semibold transition-all"
              >
                <Layers className="w-4 h-4 text-gold-400" />
                <span>QR Digital View</span>
              </Link>

              <button
                onClick={() => setIsFullMenuOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold-500/20 btn-press"
              >
                <span>View Full Menu</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gold-500 text-charcoal-950 shadow-lg shadow-gold-500/25 scale-105 font-bold'
                    : 'bg-charcoal-900 text-cream-300 hover:text-gold-300 hover:bg-charcoal-850 border border-charcoal-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayedDishes.map((dish) => (
              <Card3DTilt
                key={dish.id}
                className="bg-charcoal-900 border border-charcoal-800 rounded-2xl overflow-hidden hover:border-gold-500/40 transition-colors flex flex-col group"
              >
                <div className="relative aspect-[16/11] bg-charcoal-950 overflow-hidden">
                  <img
                    src={dish.imageUrl}
                    alt={dish.altText}
                    onError={(e) => {
                      if (dish.fallbackImageUrl) (e.currentTarget as HTMLImageElement).src = dish.fallbackImageUrl;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-md bg-charcoal-950/90 flex items-center justify-center p-0.5 border ${
                        dish.isVeg ? 'border-emerald-500' : 'border-red-500'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </span>

                    {dish.bestseller && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-950/90 text-red-300 border border-red-500/40">
                        Bestseller
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 left-4">
                    <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                      {dish.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-lg font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                        {dish.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-gold-400 text-lg">
                          ₹{dish.price}
                        </span>
                        {dish.isEstimatedPrice && (
                          <span className="block text-[9px] text-cream-400 font-mono">(Demo)</span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-cream-300/80 mt-2 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-charcoal-800 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedDetailDish(dish)}
                      className="text-xs text-cream-400 hover:text-gold-300 font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold-400" />
                      <span>3D View</span>
                    </button>

                    <Button3D
                      variant="gold"
                      size="xs"
                      onClick={() => handleAddDish(dish)}
                      icon={<ShoppingBag className="w-3.5 h-3.5" />}
                    >
                      Add
                    </Button3D>
                  </div>
                </div>
              </Card3DTilt>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: ABOUT OUR RESTAURANT & OUR STORY
          ========================================================================= */}
      <section id="story" className="py-28 bg-charcoal-900 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Our Hospitality & Philosophy</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-100 leading-tight">
                Crafted for Good Food and Great Company.
              </h2>

              <p className="text-sm sm:text-base text-cream-200/90 font-light leading-relaxed">
                Located on the 3rd Floor above Vishal Mart in Venkata Ramana Colony, Ameen Abbas Nagar, <strong className="font-medium text-cream-100">Ajwa Exotica</strong> is designed as a distinguished dining destination where Kurnool families and friends gather.
              </p>

              <p className="text-sm text-cream-300 leading-relaxed font-light">
                We believe dining is an art of togetherness. Whether bringing the whole family together over our aromatic Hyderabadi chicken dum biryani, sharing a lavish Arabian mutton mandi platter on our open terrace, or hosting an intimate celebration in our private dining room, our kitchen is dedicated to hearty flavours, clean preparation, and respectful hospitality.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                <div className="bg-charcoal-850 border border-charcoal-750 rounded-2xl p-4 space-y-1">
                  <span className="text-gold-400 font-serif font-bold text-base block">Multicuisine</span>
                  <span className="text-xs text-cream-300">Biryani, Mandi, Kebabs, Mughlai, Chinese & Seafood.</span>
                </div>
                <div className="bg-charcoal-850 border border-charcoal-750 rounded-2xl p-4 space-y-1">
                  <span className="text-gold-400 font-serif font-bold text-base block">3rd Floor Terrace</span>
                  <span className="text-xs text-cream-300">Breezy outdoor dining and private family dining suites.</span>
                </div>
                <div className="bg-charcoal-850 border border-charcoal-750 rounded-2xl p-4 space-y-1">
                  <span className="text-gold-400 font-serif font-bold text-base block">Convenient Access</span>
                  <span className="text-xs text-cream-300">Centrally located above Vishal Mart with parking convenience.</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={scrollToReservation}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg btn-press"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Reserve Table at Ajwa Exotica</span>
                </button>

                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-cream-200 border border-charcoal-700 font-semibold text-xs transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-gold-400" />
                  <span>Order Doorstep Delivery</span>
                </Link>
              </div>

            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-gold-500/40 shadow-2xl bg-charcoal-950">
                <img
                  src="/images/ajwa/dining-ambience.jpg"
                  alt="Ajwa Exotica Restaurant Dining Ambiance"
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-charcoal-900/90 backdrop-blur-md border border-gold-500/30">
                  <span className="text-xs font-serif font-bold text-gold-400 block">
                    Ajwa Exotica · Kurnool
                  </span>
                  <span className="text-[11px] text-cream-300 block mt-0.5">
                    3rd Floor, above Vishal Mart, Venkata Ramana Colony
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CUSTOMER TESTIMONIALS & INTERACTIVE REVIEW SUBMISSION
          ========================================================================= */}
      <section id="reviews" className="py-28 bg-charcoal-950 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold block mb-2">
              Customer Testimonials
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-100">
              Verified Ratings & Reviews
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-cream-300 font-light">
              Supplied business profile data accurately presented alongside patron reviews from Kurnool diners.
            </p>
          </div>

          {/* Rating Summary + Customer Reviews Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Score Card */}
            <div className="lg:col-span-4 bg-charcoal-900 border border-gold-500/30 rounded-3xl p-8 text-center space-y-4 shadow-xl">
              <span className="text-[11px] uppercase tracking-widest text-cream-400 font-semibold">
                Google Reviews Score
              </span>
              
              <div className="flex items-center justify-center gap-2">
                <span className="font-serif text-6xl font-bold text-cream-100">
                  {REVIEWS_DATA.averageRating}
                </span>
                <span className="text-xl text-cream-400 font-serif">/ 5</span>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-gold-400">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-gold-400" />
                ))}
                <Star className="w-5 h-5 fill-gold-400/50 text-gold-400" />
              </div>

              <p className="text-xs text-cream-300 font-medium">
                Based on <strong className="text-cream-100 font-bold">{REVIEWS_DATA.reviewCount} customer reviews</strong>
              </p>

              <div className="pt-3 border-t border-charcoal-800 text-[11px] text-cream-400">
                <span>Typical Reported Spend: <strong className="text-gold-400">{REVIEWS_DATA.spendPerPerson}</strong> per person</span>
              </div>

              <div className="pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(AJWA_RESTAURANT_INFO.address.full)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-gold-400 border border-gold-500/30 text-xs font-semibold transition-colors"
                >
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Testimonials Feed */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dbReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-5 space-y-2.5 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-sm font-bold text-cream-100">
                        {rev.customer_name}
                      </h4>
                      <div className="flex items-center gap-0.5 text-gold-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-gold-400" />
                        ))}
                      </div>
                    </div>

                    {rev.dish_experienced && (
                      <span className="text-[10px] text-gold-400 font-medium bg-gold-500/10 px-2 py-0.5 rounded-full inline-block">
                        Dish: {rev.dish_experienced}
                      </span>
                    )}

                    <p className="text-xs text-cream-300 leading-relaxed font-light">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive Review Submission Form */}
          <div className="max-w-3xl mx-auto pt-6">
            <ReviewSubmissionForm
              onReviewSubmitted={(newRev) => setDbReviews((prev) => [newRev, ...prev])}
            />
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6: TABLE RESERVATION INTERFACE (PERSISTED TO SQLITE)
          ========================================================================= */}
      <TableReservationSection />

      {/* =========================================================================
          SECTION 7: LOCATION & CONTACT
          ========================================================================= */}
      <section id="contact" className="py-28 bg-charcoal-900 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-charcoal-850 rounded-3xl border border-gold-500/30 p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold block mb-2">
                    Visit Our Restaurant
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold text-cream-100">
                    AJWA EXOTICA
                  </h3>
                  <span className="text-xs uppercase tracking-wider text-cream-400 block mt-1">
                    Fine-Dining Multicuisine Family Restaurant
                  </span>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-cream-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-cream-100">{AJWA_RESTAURANT_INFO.address.line1}</p>
                      <p className="text-cream-300">{AJWA_RESTAURANT_INFO.address.locality}</p>
                      <p className="text-cream-300">{AJWA_RESTAURANT_INFO.address.city}, {AJWA_RESTAURANT_INFO.address.state} {AJWA_RESTAURANT_INFO.address.pincode}, India</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-cream-100">{AJWA_RESTAURANT_INFO.openingHours.closingTime}</p>
                      <p className="text-[11px] text-cream-400">{AJWA_RESTAURANT_INFO.openingHours.displayNotice}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-cream-100">{AJWA_RESTAURANT_INFO.phoneDisplay}</p>
                      <p className="text-[11px] text-cream-400">Direct phone line for table confirmations and party enquiries</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-cream-100">Parking Convenience</p>
                      <p className="text-[11px] text-cream-400">Reported parking availability for guest cars and two-wheelers.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={AJWA_RESTAURANT_INFO.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg btn-press"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Get Driving Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`tel:${AJWA_RESTAURANT_INFO.phone}`}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-cream-100 border border-charcoal-700 font-semibold text-xs transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-gold-400" />
                    <span>Call 085182 53599</span>
                  </a>

                  <a
                    href={`https://wa.me/${AJWA_RESTAURANT_INFO.whatsappNumber}?text=Hello%20Ajwa%20Exotica%2C%20I%20would%20like%20to%20reserve%20a%20table%20or%20enquire%20about%20ordering.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition-colors"
                  >
                    <span>WhatsApp Enquiries</span>
                  </a>
                </div>

              </div>

              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-charcoal-950 border border-charcoal-700/80 relative shadow-xl">
                  <img
                    src="/images/ajwa/dining-ambience.jpg"
                    alt="Ajwa Exotica Kurnool Location"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />
                  
                  <div className="absolute bottom-5 left-5 right-5 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold">
                      Landmark & Access
                    </span>
                    <p className="text-xs font-semibold text-cream-100">
                      Located on the 3rd Floor above Vishal Mart
                    </p>
                    <p className="text-[11px] text-cream-300">
                      Venkata Ramana Colony, Ameen Abbas Nagar, Kurnool
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3D Food Details Modal */}
      <FoodDetailModal3D
        dish={
          selectedDetailDish
            ? {
                id: selectedDetailDish.id,
                name: selectedDetailDish.name,
                price: selectedDetailDish.price,
                priceConfirmed: !selectedDetailDish.isEstimatedPrice,
                category: selectedDetailDish.category,
                description: selectedDetailDish.description,
                imageUrl: selectedDetailDish.imageUrl,
                isVeg: selectedDetailDish.isVeg,
                bestseller: selectedDetailDish.bestseller,
                featured: selectedDetailDish.featured,
                is_available: 1
              }
            : null
        }
        isOpen={Boolean(selectedDetailDish)}
        onClose={() => setSelectedDetailDish(null)}
        onAddToCart={(d, qty, _v, notes) => {
          for (let i = 0; i < qty; i++) {
            handleAddDish({
              id: d.id,
              name: d.name,
              category: d.category as any,
              price: d.price || 200,
              description: d.description || '',
              isVeg: d.isVeg,
              imageUrl: d.imageUrl || '',
              altText: d.name,
              spicyLevel: 'Medium'
            });
          }
        }}
      />

      {/* Full Menu Modal */}
      <FullMenuModal
        isOpen={isFullMenuOpen}
        onClose={() => setIsFullMenuOpen(false)}
        onSelectReserve={scrollToReservation}
      />

      {/* Interactive 3D Chef Mascot */}
      <ChefMascot3D />

    </div>
  );
};

export default HomePage;

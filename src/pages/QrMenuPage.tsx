import React, { useState, useMemo } from 'react';
import { 
  Search, 
  QrCode, 
  UtensilsCrossed, 
  ShoppingBag, 
  Filter, 
  Share2, 
  Copy, 
  Check, 
  Flame, 
  Sparkles, 
  CalendarCheck,
  PhoneCall,
  Info
} from 'lucide-react';
import { AJWA_DISHES, MENU_CATEGORIES, MenuCategoryType, AJWA_RESTAURANT_INFO, AjwaDish } from '../data/ajwaData';
import { useCart } from '../context/CartContext';
import { Card3DTilt } from '../components/Card3DTilt';
import { Button3D } from '../components/Button3D';

export const QrMenuPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryType>('All');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [selectedDishModal, setSelectedDishModal] = useState<AjwaDish | null>(null);
  const [customNotes, setCustomNotes] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { addToCart, totalCount, setIsCartOpen } = useCart();

  const filteredDishes = useMemo(() => {
    return AJWA_DISHES.filter((dish) => {
      const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
      const matchesDietary =
        dietaryFilter === 'all' ? true : dietaryFilter === 'veg' ? dish.isVeg : !dish.isVeg;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        dish.name.toLowerCase().includes(query) ||
        dish.description.toLowerCase().includes(query) ||
        dish.category.toLowerCase().includes(query);

      return matchesCategory && matchesDietary && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [searchQuery, selectedCategory, dietaryFilter, sortBy]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddToCart = (dish: AjwaDish, notes?: string) => {
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
        menuPageId: 'qr-digital-menu'
      },
      dish.price,
      undefined,
      notes
    );
    setSelectedDishModal(null);
    setCustomNotes('');
  };

  return (
    <div className="pt-24 pb-24 bg-charcoal-950 min-h-screen text-cream-100">
      
      {/* Floating Cart Pill on Mobile */}
      {totalCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-40 sm:hidden animate-slideUp">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gradient-to-r from-burgundy-850 to-gold-600 text-cream-100 shadow-2xl border border-gold-400 font-bold text-xs uppercase tracking-wider"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-cream-100" />
              <span>{totalCount} {totalCount === 1 ? 'Dish' : 'Dishes'} in Order</span>
            </div>
            <span>View Cart →</span>
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & QR Bar */}
        <div className="bg-charcoal-900 border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
              <QrCode className="w-3.5 h-3.5" />
              <span>Contactless Digital Menu & Ordering</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-100">
              Ajwa Exotica Table & Takeaway Menu
            </h1>
            <p className="text-xs sm:text-sm text-cream-300 font-light max-w-xl">
              Scan, browse, and order directly to your table or home across Kurnool.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700 text-cream-200 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4 text-gold-400" />
              <span>Share QR Menu</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({totalCount})</span>
            </button>
          </div>
        </div>

        {/* Search & Dietary Filters Toolbar */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes (e.g. Chicken Biryani, Mutton Mandi, Butter Naan)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 placeholder-cream-400 text-xs sm:text-sm focus:outline-none focus:border-gold-500/70 transition-colors"
              />
            </div>

            {/* Dietary Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  dietaryFilter === 'all'
                    ? 'bg-gold-500 text-charcoal-950 border-gold-500 font-bold'
                    : 'bg-charcoal-950 text-cream-300 border-charcoal-750 hover:border-charcoal-600'
                }`}
              >
                All Dishes
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-charcoal-950 text-cream-300 border-charcoal-750 hover:border-charcoal-600'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Pure Veg</span>
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-red-950 border-red-500 text-red-300 font-bold'
                    : 'bg-charcoal-950 text-cream-300 border-charcoal-750 hover:border-charcoal-600'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>Non-Veg</span>
              </button>
            </div>

            {/* Price Sort */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 text-xs focus:outline-none focus:border-gold-500/60"
            >
              <option value="default">Default Sort</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Category Horizontal Scrolling Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gold-500 text-charcoal-950 shadow-md font-bold'
                    : 'bg-charcoal-950 text-cream-300 hover:text-gold-300 hover:bg-charcoal-850 border border-charcoal-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Indicative Pricing Note */}
        <div className="p-3.5 rounded-2xl bg-charcoal-900/60 border border-charcoal-800 flex items-center gap-2.5 text-xs text-cream-300">
          <Info className="w-4 h-4 text-gold-400 shrink-0" />
          <span>Prices are indicative estimates pending final counter confirmation. All dishes freshly slow-cooked to order.</span>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.length === 0 ? (
            <div className="col-span-full py-16 text-center text-cream-300">
              <UtensilsCrossed className="w-10 h-10 mx-auto text-gold-500/40 mb-3" />
              <p className="text-sm font-semibold">No dishes found matching your selection.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setDietaryFilter('all'); setSearchQuery(''); }}
                className="mt-3 text-xs text-gold-400 underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredDishes.map((dish) => (
              <Card3DTilt
                key={dish.id}
                className="bg-charcoal-900 border border-charcoal-800 rounded-2xl overflow-hidden hover:border-gold-500/40 transition-all flex flex-col group"
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

                  {/* Dietary badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-md bg-charcoal-950/90 flex items-center justify-center p-0.5 border ${
                        dish.isVeg ? 'border-emerald-500' : 'border-red-500'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </span>

                    {dish.bestseller && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-950/90 text-red-300 border border-red-500/40">
                        Bestseller
                      </span>
                    )}
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

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-base font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                        {dish.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-gold-400 text-base">
                          ₹{dish.price}
                        </span>
                        {dish.isEstimatedPrice && (
                          <span className="block text-[9px] text-cream-400 font-mono">(Demo)</span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-cream-300/80 mt-1.5 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-charcoal-800 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedDishModal(dish)}
                      className="text-xs text-cream-400 hover:text-gold-300 transition-colors uppercase font-semibold tracking-wider"
                    >
                      Customise
                    </button>

                    <Button3D
                      variant="gold"
                      size="xs"
                      onClick={() => handleAddToCart(dish)}
                      icon={<ShoppingBag className="w-3.5 h-3.5" />}
                    >
                      Add
                    </Button3D>
                  </div>
                </div>
              </Card3DTilt>
            ))
          )}
        </div>

        {/* Table Reservation & Phone Banner */}
        <div className="bg-charcoal-900 border border-gold-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs uppercase tracking-wider text-gold-400 font-semibold block">
              Dine-In & Private Salons
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-100">
              Visiting Ajwa Exotica in Person?
            </h3>
            <p className="text-xs text-cream-300">
              Reserve our breezy 3rd-floor terrace or private family dining room.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${AJWA_RESTAURANT_INFO.phone}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-cream-100 border border-charcoal-700 text-xs font-semibold"
            >
              <PhoneCall className="w-3.5 h-3.5 text-gold-400" />
              <span>Call 085182 53599</span>
            </a>

            <a
              href="/#reservation"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Reserve Table</span>
            </a>
          </div>
        </div>

      </div>

      {/* Dish Customization Modal */}
      {selectedDishModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-charcoal-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                  {selectedDishModal.category}
                </span>
                <span className="font-serif font-bold text-gold-400 text-base">
                  ₹{selectedDishModal.price}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-cream-100 mt-1">
                {selectedDishModal.name}
              </h3>
              <p className="text-xs text-cream-300 mt-1 leading-relaxed">
                {selectedDishModal.description}
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                Cooking Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Less spicy, extra salan/raita, crispier preparation..."
                className="w-full p-3 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 text-xs focus:outline-none focus:border-gold-500/60 resize-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setSelectedDishModal(null)}
                className="px-4 py-2.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-cream-300 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={() => handleAddToCart(selectedDishModal, customNotes)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Confirm & Add to Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share QR Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-charcoal-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-cream-100">
                Ajwa Exotica Digital Menu URL
              </h3>
              <p className="text-xs text-cream-300 mt-1">
                Share this direct digital menu link with your dining companions or scan from your mobile phone.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-charcoal-950 border border-charcoal-800 text-xs font-mono text-gold-400 truncate">
              {window.location.origin}/qr-menu
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider shadow-md"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-cream-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

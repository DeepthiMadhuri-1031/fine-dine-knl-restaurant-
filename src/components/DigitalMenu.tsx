import { apiUrl } from '../config/api';
import React, { useState, useMemo, useEffect } from 'react';
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { 
  Search, 
  Flame, 
  Sparkles, 
  AlertCircle, 
  Plus, 
  Minus, 
  Check, 
  ShoppingBag,
  FileText,
  X,
  XCircle
} from 'lucide-react';

interface DigitalMenuProps {
  onSelectMenuPage?: (pageId: string) => void;
}

export const DigitalMenu: React.FC<DigitalMenuProps> = ({ onSelectMenuPage }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [variantModalDish, setVariantModalDish] = useState<MenuItem | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, { isAvailable: boolean }>>({});

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(apiUrl('/api/menu/status'));
        if (res.ok) {
          const data = await res.json();
          setStatusMap(data.statusMap || {});
        }
      } catch (err) {
        console.warn('Menu status fetch error:', err);
      }
    };
    fetchStatus();
  }, []);

  const { cartItems, addToCart, updateQuantity } = useCart();

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category match
      const matchesCategory = 
        activeCategory === 'All' 
          ? true 
          : activeCategory === 'Signature Dishes'
            ? item.featured === true
            : item.category.toLowerCase().includes(activeCategory.toLowerCase());

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        query === '' ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const getItemCartQuantity = (dishId: string) => {
    const matching = cartItems.filter(i => i.dish.id === dishId);
    return matching.reduce((sum, i) => sum + i.quantity, 0);
  };

  const handleQuickAdd = (dish: MenuItem) => {
    if (dish.priceVariants && dish.priceVariants.length > 1) {
      setVariantModalDish(dish);
    } else {
      addToCart(dish);
    }
  };

  return (
    <div className="space-y-8" id="digital-menu-section">
      {/* Header & Search Controls */}
      <div className="bg-charcoal-850 border border-charcoal-700/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                Section B
              </span>
              <span className="text-xs text-amber-400/90 font-medium bg-amber-950/40 px-2.5 py-0.5 rounded border border-amber-500/30">
                Verified Items • Authentic Dish Photography • Online Ordering
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-cream-100 mt-2">
              Interactive Digital Restaurant Menu & Online Ordering
            </h3>
            <p className="text-sm text-cream-300 mt-1 max-w-2xl">
              Filter by category, search specific dishes, inspect authentic food photography, and order directly online for home delivery, pickup, or dine-in.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px] sm:min-w-[340px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Biryani, Paneer, Naan)..."
              className="w-full bg-charcoal-900 border border-charcoal-700 focus:border-gold-500/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-cream-100 placeholder:text-cream-400/60 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-cream-400 hover:text-cream-100"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-6 pt-5 border-t border-charcoal-700/60 flex flex-wrap gap-2">
          {MENU_CATEGORIES.map((category) => {
            const isSelected = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-gold-500 text-charcoal-950 font-semibold shadow-md shadow-gold-500/20'
                    : 'bg-charcoal-900 text-cream-300 hover:bg-charcoal-800 hover:text-cream-100 border border-charcoal-800'
                }`}
              >
                {category === 'Signature Dishes' && (
                  <Sparkles className="w-3 h-3 inline mr-1 text-gold-700" />
                )}
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Policy Reminder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-cream-400 gap-2 px-1">
        <p>
          Showing <span className="text-gold-400 font-semibold">{filteredItems.length}</span> dishes
          {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </p>
        <p className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <Check className="w-3.5 h-3.5" />
          <span>Every item mapped to its authentic dish photograph • 100% Pure Vegetarian</span>
        </p>
      </div>

      {/* Dish Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((dish) => {
            const hasConflict = !dish.priceConfirmed || dish.price === null;
            const cartQty = getItemCartQuantity(dish.id);
            const defaultDisplayPrice = dish.price || (dish.priceVariants ? dish.priceVariants[dish.priceVariants.length - 1].price : 180);
            const isSoldOut = statusMap[dish.id] && statusMap[dish.id].isAvailable === false;

            return (
              <div
                key={dish.id}
                className={`bg-charcoal-850 rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col shadow-xl group ${
                  isSoldOut ? 'border-charcoal-800 opacity-80' : 'border-charcoal-700/80 hover:border-gold-500/40'
                }`}
              >
                {/* Dish Card Image Container */}
                <div className="relative aspect-[16/10] bg-charcoal-950 overflow-hidden">
                  <img
                    src={dish.imageUrl}
                    alt={dish.altText || dish.name}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isSoldOut ? 'grayscale contrast-75' : ''}`}
                    loading="lazy"
                  />

                  {/* Sold Out Overlay Banner */}
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-charcoal-950/70 backdrop-blur-[1px] flex items-center justify-center z-20">
                      <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-1.5 border border-rose-400/40">
                        <XCircle className="w-4 h-4" />
                        <span>Sold Out Today</span>
                      </span>
                    </div>
                  )}

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-transparent to-black/20"></div>

                  {/* Veg Indicator Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span 
                      className="w-5 h-5 rounded-md bg-charcoal-900/90 border border-emerald-500 flex items-center justify-center p-0.5 shadow-md"
                      title="100% Pure Vegetarian"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    </span>

                    {dish.featured && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gold-500 text-charcoal-950 flex items-center gap-1 shadow-md">
                        <Sparkles className="w-2.5 h-2.5" />
                        Signature
                      </span>
                    )}

                    {dish.bestseller && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-950/80 text-red-300 border border-red-500/40">
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Spice Level Badge */}
                  {dish.spicyLevel && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-charcoal-900/90 text-cream-200 border border-charcoal-700 flex items-center gap-1 backdrop-blur-sm">
                        <Flame className={`w-3 h-3 ${dish.spicyLevel === 'Spicy' ? 'text-red-400' : 'text-amber-400'}`} />
                        {dish.spicyLevel}
                      </span>
                    </div>
                  )}

                  {/* Category Tag on bottom left */}
                  <div className="absolute bottom-2.5 left-3">
                    <span className="text-[11px] font-medium text-gold-400/90 tracking-wide uppercase">
                      {dish.category}
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-serif text-lg font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                        {dish.name}
                      </h4>

                      {/* Price Display */}
                      <div className="text-right shrink-0">
                        <span className="font-serif text-lg font-bold text-gold-400">
                          ₹{defaultDisplayPrice}
                        </span>
                        {hasConflict && (
                          <span className="block text-[9px] text-amber-400/90">
                            Revised Edition
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-cream-300 mt-2 leading-relaxed line-clamp-3">
                      {dish.description}
                    </p>
                  </div>

                  {/* Price Conflict Details or Verification Details */}
                  {hasConflict ? (
                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Menu Revisions:</span>
                        </span>
                        <button
                          onClick={() => setVariantModalDish(dish)}
                          className="text-[10px] text-gold-400 underline hover:text-gold-300"
                        >
                          Choose Edition
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {dish.priceVariants?.map((v, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-charcoal-900 border border-amber-500/20 text-[10px] text-cream-300">
                            {v.label}: <strong className="text-amber-300">₹{v.price}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                      <span>Verified printed menu price</span>
                    </div>
                  )}

                  {/* Card Order Actions */}
                  <div className="pt-3 border-t border-charcoal-800 flex items-center justify-between gap-3">
                    {onSelectMenuPage && (
                      <button
                        onClick={() => onSelectMenuPage(dish.menuPageId)}
                        className="inline-flex items-center gap-1 text-[11px] text-cream-400 hover:text-gold-300 font-medium transition-colors"
                        title="View printed photograph of this item"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Menu Scan</span>
                      </button>
                    )}

                    {/* Order Button / Quantity Controls */}
                    {isSoldOut ? (
                      <span className="px-3.5 py-2 rounded-xl bg-charcoal-800 border border-charcoal-750 text-cream-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed">
                        Sold Out
                      </span>
                    ) : cartQty > 0 ? (
                      <div className="flex items-center gap-2 bg-charcoal-900 border border-gold-500/50 rounded-xl p-1">
                        <button
                          onClick={() => {
                            const item = cartItems.find(i => i.dish.id === dish.id);
                            if (item) updateQuantity(item.cartItemId, -1);
                          }}
                          className="p-1 rounded-lg text-cream-300 hover:text-gold-400 hover:bg-charcoal-800"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-gold-400 w-5 text-center">
                          {cartQty} in Cart
                        </span>
                        <button
                          onClick={() => handleQuickAdd(dish)}
                          className="p-1 rounded-lg text-cream-300 hover:text-gold-400 hover:bg-charcoal-800"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleQuickAdd(dish)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-gold-500/15"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-charcoal-850 rounded-2xl border border-charcoal-800 p-12 text-center">
          <p className="text-base text-cream-200 font-medium">
            No dishes found matching your current filter.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-gold-500 text-charcoal-950 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* PRICE REVISION / VARIANT SELECTOR MODAL */}
      {variantModalDish && (
        <div 
          className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setVariantModalDish(null)}
        >
          <div 
            className="bg-charcoal-850 border border-charcoal-700 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-gold-500 uppercase tracking-widest font-semibold block">
                  Select Menu Edition / Price
                </span>
                <h3 className="font-serif text-xl font-bold text-cream-100 mt-1">
                  {variantModalDish.name}
                </h3>
              </div>
              <button
                onClick={() => setVariantModalDish(null)}
                className="p-1 rounded-lg text-cream-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-cream-300">
              The uploaded menu scans feature multiple revisions for this dish. Select the edition you wish to order:
            </p>

            <div className="space-y-2.5">
              {variantModalDish.priceVariants?.map((v, i) => (
                <button
                  key={i}
                  onClick={() => {
                    addToCart(variantModalDish, v.price, v.label);
                    setVariantModalDish(null);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-700 hover:border-gold-500/80 hover:bg-charcoal-800 transition-all text-left group"
                >
                  <div>
                    <span className="text-xs font-semibold text-cream-100 block group-hover:text-gold-300">
                      {v.label}
                    </span>
                    <span className="text-[10px] text-cream-400">
                      {i === variantModalDish.priceVariants!.length - 1 ? 'Latest stickered menu price (Recommended)' : 'Printed menu version'}
                    </span>
                  </div>
                  <span className="font-serif font-bold text-gold-400 text-base">
                    ₹{v.price}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setVariantModalDish(null)}
              className="w-full py-2.5 rounded-xl bg-charcoal-800 text-cream-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

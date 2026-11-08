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
  XCircle,
  Leaf,
  Drumstick,
  Eye
} from 'lucide-react';
import { Card3DTilt } from './Card3DTilt';
import { Button3D } from './Button3D';
import { FoodDetailModal3D } from './FoodDetailModal3D';

interface DigitalMenuProps {
  onSelectMenuPage?: (pageId: string) => void;
}

export const DigitalMenu: React.FC<DigitalMenuProps> = ({ onSelectMenuPage }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDetailDish, setSelectedDetailDish] = useState<MenuItem | null>(null);
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
      // Dietary filter
      if (dietaryFilter === 'veg' && !item.isVeg) return false;
      if (dietaryFilter === 'non-veg' && item.isVeg) return false;

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
  }, [activeCategory, dietaryFilter, searchQuery]);

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

  const handleDetailAddToCart = (dish: any, quantity: number, variantLabel?: string, notes?: string) => {
    let price = dish.price;
    if (variantLabel && dish.variants) {
      const v = dish.variants.find((item: any) => item.label === variantLabel);
      if (v) price = v.price;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(dish, price, variantLabel, notes);
    }
  };

  return (
    <div className="space-y-8" id="digital-menu-section">
      {/* 3D Filter Console & Search Controls */}
      <div className="bg-charcoal-850 border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.6)] relative overflow-hidden preserve-3d">
        <div className="gloss-specular" aria-hidden="true" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-400 text-xs font-bold uppercase tracking-wider">
                Ajwa Exotica Multicuisine Catalog
              </span>
              <span className="text-xs text-cream-300 font-medium bg-charcoal-900/80 px-3 py-1 rounded-full border border-charcoal-700">
                100% Authentic Food Photography • Instant Kitchen Order
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 mt-3">
              Interactive 3D Restaurant Menu
            </h3>
            <p className="text-xs sm:text-sm text-cream-300 mt-1 max-w-2xl leading-relaxed">
              Explore authentic Arabian mandis, aromatic Rayalaseema biryanis, tandoori starters, and rich vegetarian gravies. Click any dish to customize spice and portion.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px] sm:min-w-[340px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Mandi, Biryani, Paneer)..."
              className="w-full bg-charcoal-950 border border-charcoal-700 focus:border-gold-400 rounded-2xl pl-10 pr-4 py-3 text-sm text-cream-100 placeholder:text-cream-400/60 box-3d-inset focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-cream-400 hover:text-cream-100 px-2 py-1 rounded bg-charcoal-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Dietary Filter Buttons (3D tactile pills) */}
        <div className="mt-6 pt-5 border-t border-charcoal-750 flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-charcoal-950/80 border border-charcoal-750 box-3d-inset">
            <button
              onClick={() => setDietaryFilter('all')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                dietaryFilter === 'all'
                  ? 'btn-3d-gold'
                  : 'text-cream-300 hover:text-white'
              }`}
            >
              All Dishes
            </button>
            <button
              onClick={() => setDietaryFilter('veg')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                dietaryFilter === 'veg'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-md'
                  : 'text-cream-300 hover:text-emerald-300'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pure Veg</span>
            </button>
            <button
              onClick={() => setDietaryFilter('non-veg')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                dietaryFilter === 'non-veg'
                  ? 'btn-3d-burgundy'
                  : 'text-cream-300 hover:text-red-300'
              }`}
            >
              <Drumstick className="w-3.5 h-3.5 text-red-400" />
              <span>Non-Veg</span>
            </button>
          </div>

          <div className="text-xs text-cream-400 font-mono">
            Showing <strong className="text-gold-400">{filteredItems.length}</strong> items
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 flex flex-wrap gap-2 relative z-10">
          {MENU_CATEGORIES.map((category) => {
            const isSelected = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isSelected
                    ? 'btn-3d-gold'
                    : 'bg-charcoal-900 border border-charcoal-750 text-cream-300 hover:border-gold-500/40 hover:text-cream-100 shadow-sm active:translate-y-0.5'
                }`}
              >
                {category === 'Signature Dishes' && (
                  <Sparkles className="w-3 h-3 inline mr-1 text-gold-500" />
                )}
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dish Grid in 3D Perspective */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredItems.map((dish) => {
            const hasConflict = !dish.priceConfirmed || dish.price === null;
            const cartQty = getItemCartQuantity(dish.id);
            const defaultDisplayPrice = dish.price || (dish.priceVariants ? dish.priceVariants[dish.priceVariants.length - 1].price : 180);
            const isSoldOut = statusMap[dish.id] && statusMap[dish.id].isAvailable === false;

            return (
              <Card3DTilt
                key={dish.id}
                className={`bg-charcoal-850 rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col group ${
                  isSoldOut ? 'border-charcoal-800 opacity-75' : 'border-charcoal-750 hover:border-gold-500/50'
                }`}
              >
                {/* Dish Card Image Container */}
                <div
                  onClick={() => setSelectedDetailDish(dish)}
                  className="relative aspect-[16/10] bg-charcoal-950 overflow-hidden cursor-pointer"
                  title="Click to view 3D food details & customization"
                >
                  <img
                    src={dish.imageUrl}
                    alt={dish.altText || dish.name}
                    className={`w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ${isSoldOut ? 'grayscale contrast-75' : ''}`}
                    loading="lazy"
                  />

                  {/* Sold Out Overlay Banner */}
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-charcoal-950/75 backdrop-blur-[2px] flex items-center justify-center z-20">
                      <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-1.5 border border-rose-400/40">
                        <XCircle className="w-4 h-4" />
                        <span>Sold Out Today</span>
                      </span>
                    </div>
                  )}

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/95 via-charcoal-950/20 to-black/30" />

                  {/* Veg / Non-Veg Indicator Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
                    <span 
                      className={`w-5 h-5 rounded-md bg-charcoal-900/90 border-2 flex items-center justify-center shadow-md ${
                        dish.isVeg ? 'border-emerald-500' : 'border-rose-500'
                      }`}
                      title={dish.isVeg ? '100% Vegetarian' : 'Non-Vegetarian'}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${dish.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    </span>

                    {dish.featured && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-charcoal-950 flex items-center gap-1 shadow-md">
                        <Sparkles className="w-2.5 h-2.5" />
                        Signature
                      </span>
                    )}

                    {dish.bestseller && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-950/90 text-red-300 border border-red-500/40 shadow-md">
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Inspect Dish Pill */}
                  <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <span className="px-2.5 py-1 rounded-full bg-charcoal-900/90 border border-gold-500/50 text-[10px] font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1 shadow-md">
                      <Eye className="w-3 h-3" />
                      <span>3D View</span>
                    </span>
                  </div>

                  {/* Category Tag on bottom left */}
                  <div className="absolute bottom-2.5 left-3.5 z-10">
                    <span className="text-[11px] font-bold text-gold-400/90 tracking-widest uppercase">
                      {dish.category}
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h4
                        onClick={() => setSelectedDetailDish(dish)}
                        className="font-serif text-lg font-bold text-cream-100 group-hover:text-gold-300 transition-colors cursor-pointer"
                      >
                        {dish.name}
                      </h4>

                      {/* Price Display */}
                      <div className="text-right shrink-0">
                        <span className="font-serif text-lg font-bold text-gold-400">
                          ₹{defaultDisplayPrice}
                        </span>
                        {hasConflict && (
                          <span className="block text-[9px] text-amber-400/90 font-mono">
                            Options
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-cream-300 mt-2 leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>
                  </div>

                  {/* Price Conflict Details or Verification Details */}
                  {hasConflict ? (
                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Portions / Editions:</span>
                        </span>
                        <button
                          onClick={() => setSelectedDetailDish(dish)}
                          className="text-[10px] text-gold-400 underline hover:text-gold-300"
                        >
                          Customize
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
                      <span>Verified authentic restaurant preparation</span>
                    </div>
                  )}

                  {/* Card Order Actions */}
                  <div className="pt-3 border-t border-charcoal-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedDetailDish(dish)}
                      className="inline-flex items-center gap-1 text-[11px] text-cream-400 hover:text-gold-300 font-semibold uppercase tracking-wider transition-colors"
                      title="View details and customize spice"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold-400" />
                      <span>Details</span>
                    </button>

                    {/* Order Button / Quantity Controls */}
                    {isSoldOut ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-charcoal-800 border border-charcoal-750 text-cream-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed">
                        Sold Out
                      </span>
                    ) : cartQty > 0 ? (
                      <div className="flex items-center gap-2 bg-charcoal-950 border border-gold-500/50 rounded-xl p-1 box-3d-inset">
                        <button
                          onClick={() => {
                            const item = cartItems.find(i => i.dish.id === dish.id);
                            if (item) updateQuantity(item.cartItemId, -1);
                          }}
                          className="w-6 h-6 rounded-lg bg-charcoal-800 hover:bg-charcoal-750 text-cream-200 flex items-center justify-center transition-colors active:scale-95"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-gold-400 w-5 text-center font-mono">
                          {cartQty}
                        </span>
                        <button
                          onClick={() => handleQuickAdd(dish)}
                          className="w-6 h-6 rounded-lg bg-charcoal-800 hover:bg-charcoal-750 text-cream-200 flex items-center justify-center transition-colors active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <Button3D
                        variant="gold"
                        size="xs"
                        onClick={() => handleQuickAdd(dish)}
                        icon={<ShoppingBag className="w-3.5 h-3.5" />}
                      >
                        Add to Order
                      </Button3D>
                    )}
                  </div>
                </div>
              </Card3DTilt>
            );
          })}
        </div>
      ) : (
        <div className="bg-charcoal-850 rounded-3xl border border-charcoal-800 p-12 text-center shadow-xl">
          <p className="text-base text-cream-200 font-medium">
            No dishes found matching your current filter.
          </p>
          <div className="mt-4 flex justify-center">
            <Button3D
              variant="gold"
              size="sm"
              onClick={() => {
                setActiveCategory('All');
                setDietaryFilter('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button3D>
          </div>
        </div>
      )}

      {/* 3D Food Details & Customization Modal */}
      <FoodDetailModal3D
        dish={
          selectedDetailDish
            ? {
                id: selectedDetailDish.id,
                name: selectedDetailDish.name,
                price: selectedDetailDish.price,
                priceConfirmed: selectedDetailDish.priceConfirmed,
                category: selectedDetailDish.category,
                description: selectedDetailDish.description,
                imageUrl: selectedDetailDish.imageUrl,
                isVeg: selectedDetailDish.isVeg,
                bestseller: selectedDetailDish.bestseller,
                featured: selectedDetailDish.featured,
                variants: selectedDetailDish.priceVariants?.map((v) => ({
                  label: v.label,
                  price: v.price
                })),
                is_available: statusMap[selectedDetailDish.id]?.isAvailable === false ? 0 : 1
              }
            : null
        }
        isOpen={Boolean(selectedDetailDish)}
        onClose={() => setSelectedDetailDish(null)}
        onAddToCart={handleDetailAddToCart}
      />

      {/* PRICE REVISION / VARIANT SELECTOR MODAL */}
      {variantModalDish && (
        <div 
          className="fixed inset-0 z-50 bg-charcoal-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setVariantModalDish(null)}
        >
          <div 
            className="bg-charcoal-900 border-2 border-gold-500/40 max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-5 preserve-3d"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gloss-specular" aria-hidden="true" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-gold-400 uppercase tracking-widest font-bold block">
                  Select Portion / Edition
                </span>
                <h3 className="font-serif text-xl font-bold text-cream-100 mt-1">
                  {variantModalDish.name}
                </h3>
              </div>
              <button
                onClick={() => setVariantModalDish(null)}
                className="p-1 rounded-full text-cream-400 hover:text-white hover:bg-charcoal-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-cream-300">
              Select the desired serving portion or menu edition to add to your order:
            </p>

            <div className="space-y-2.5">
              {variantModalDish.priceVariants?.map((v, i) => (
                <button
                  key={i}
                  onClick={() => {
                    addToCart(variantModalDish, v.price, v.label);
                    setVariantModalDish(null);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-charcoal-850 border border-charcoal-700 hover:border-gold-400 hover:bg-charcoal-800 transition-all text-left group shadow-md active:scale-98"
                >
                  <div>
                    <span className="text-xs font-bold text-cream-100 block group-hover:text-gold-300">
                      {v.label}
                    </span>
                    <span className="text-[10px] text-cream-400">
                      {i === variantModalDish.priceVariants!.length - 1 ? 'Standard restaurant edition' : 'Alternate portion'}
                    </span>
                  </div>
                  <span className="font-serif font-bold text-gold-400 text-base">
                    ₹{v.price}
                  </span>
                </button>
              ))}
            </div>

            <Button3D
              variant="charcoal"
              size="sm"
              fullWidth
              onClick={() => setVariantModalDish(null)}
            >
              Cancel
            </Button3D>
          </div>
        </div>
      )}
    </div>
  );
};

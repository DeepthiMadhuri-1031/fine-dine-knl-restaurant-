import React, { useState } from 'react';
import { X, Search, Sparkles, UtensilsCrossed, ShoppingBag, Flame, Filter } from 'lucide-react';
import { AJWA_DISHES, MENU_CATEGORIES, MenuCategoryType, AjwaDish } from '../data/ajwaData';
import { useCart } from '../context/CartContext';

interface FullMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReserve?: () => void;
}

export const FullMenuModal: React.FC<FullMenuModalProps> = ({
  isOpen,
  onClose,
  onSelectReserve
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const filteredDishes = AJWA_DISHES.filter((dish) => {
    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = filterVegOnly ? dish.isVeg : true;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  const handleAddDish = (dish: AjwaDish) => {
    // Adapt to cart item schema
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
        menuPageId: 'ajwa-full-menu'
      },
      dish.price
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-charcoal-900 border border-gold-500/30 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="full-menu-title"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-charcoal-800 bg-charcoal-950/80 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-1">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Multicuisine Selection · Kurnool</span>
            </div>
            <h2 id="full-menu-title" className="font-serif text-2xl sm:text-3xl font-bold text-cream-100">
              Ajwa Exotica Full Menu
            </h2>
            <p className="text-xs text-cream-300 mt-1">
              Biryani, Arabian Mandi, Tandoori Kebabs, Mughlai, Chinese, and Seafood.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700 text-cream-200 hover:text-gold-400 flex items-center justify-center transition-colors"
            aria-label="Close full menu modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 sm:p-6 bg-charcoal-900/90 border-b border-charcoal-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Biryani, Mandi, Kebab, Prawns)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-cream-100 placeholder-cream-400 text-xs sm:text-sm focus:outline-none focus:border-gold-500/60"
            />
          </div>

          {/* Veg Only Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterVegOnly(!filterVegOnly)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                filterVegOnly
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                  : 'bg-charcoal-850 border-charcoal-700 text-cream-300 hover:border-charcoal-600'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${filterVegOnly ? 'bg-emerald-400' : 'bg-cream-400'}`} />
              <span>Veg Only</span>
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="px-4 sm:px-6 py-3 border-b border-charcoal-800/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none bg-charcoal-950/40">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gold-500 text-charcoal-950 shadow-md shadow-gold-500/20'
                  : 'bg-charcoal-850 text-cream-300 hover:text-gold-300 hover:bg-charcoal-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dishes Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDishes.length === 0 ? (
            <div className="col-span-full py-16 text-center text-cream-300">
              <UtensilsCrossed className="w-10 h-10 mx-auto text-gold-500/40 mb-3" />
              <p className="text-sm font-semibold">No dishes match your filter criteria.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setFilterVegOnly(false); }}
                className="mt-3 text-xs text-gold-400 underline hover:text-gold-300"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-charcoal-850 border border-charcoal-800 rounded-2xl p-4 flex gap-4 hover:border-gold-500/40 transition-all group"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-charcoal-950 shrink-0">
                  <img
                    src={dish.imageUrl}
                    alt={dish.altText}
                    onError={(e) => {
                      if (dish.fallbackImageUrl) (e.currentTarget as HTMLImageElement).src = dish.fallbackImageUrl;
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span
                      className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center p-0.5 border ${
                        dish.isVeg
                          ? 'bg-charcoal-900 border-emerald-500'
                          : 'bg-charcoal-900 border-red-500'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-sm sm:text-base font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                        {dish.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-gold-400 text-sm sm:text-base">
                          ₹{dish.price}
                        </span>
                        {dish.isEstimatedPrice && (
                          <span className="block text-[9px] text-cream-400 font-mono">
                            (Demo price)
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-cream-300/80 mt-1 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-gold-500/90 font-semibold">
                      {dish.category}
                    </span>

                    <button
                      onClick={() => handleAddDish(dish)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-[11px] uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add to Order</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-charcoal-950 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-300">
          <p className="text-center sm:text-left">
            Dishes are freshly prepared to order at Ajwa Exotica, Kurnool.
          </p>
          <div className="flex items-center gap-3">
            {onSelectReserve && (
              <button
                onClick={() => {
                  onClose();
                  onSelectReserve();
                }}
                className="px-4 py-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-gold-500/40 text-gold-400 font-semibold"
              >
                Reserve a Table
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

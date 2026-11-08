import React, { useState, useEffect } from 'react';
import { X, Flame, Plus, Minus, ShoppingBag, ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Button3D } from './Button3D';
import confetti from 'canvas-confetti';

interface DishItem {
  id: string;
  name: string;
  price: number | null;
  priceConfirmed?: boolean;
  category: string;
  description?: string;
  imageUrl?: string;
  isVeg: boolean;
  bestseller?: boolean;
  featured?: boolean;
  variants?: Array<{ label: string; price: number }>;
  is_available?: number;
}

interface FoodDetailModal3DProps {
  dish: DishItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: DishItem, quantity: number, variantLabel?: string, notes?: string) => void;
}

export const FoodDetailModal3D: React.FC<FoodDetailModal3DProps> = ({
  dish,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Royal Spicy'>('Medium');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (dish) {
      setQuantity(1);
      setNotes('');
      setIsAdded(false);
      setSpiceLevel('Medium');
      if (dish.variants && dish.variants.length > 0) {
        setSelectedVariant(dish.variants[0].label);
      } else {
        setSelectedVariant('');
      }
    }
  }, [dish]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !dish) return null;

  const currentPrice = () => {
    if (selectedVariant && dish.variants) {
      const v = dish.variants.find(item => item.label === selectedVariant);
      if (v) return v.price;
    }
    return dish.price || 0;
  };

  const lineTotal = currentPrice() * quantity;
  const isAvailable = dish.is_available !== 0;

  const handleAdd = () => {
    if (!isAvailable) return;
    onAddToCart(dish, quantity, selectedVariant || undefined, notes.trim() || undefined);
    setIsAdded(true);

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D7A64A', '#FFF7E9', '#4A1020']
      });
    } catch {}

    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* 3D Dark Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 3D Perspective Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-charcoal-900 border-2 border-gold-500/40 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(215,166,74,0.15)] overflow-hidden my-auto preserve-3d">
        {/* Top Specular Rim */}
        <div className="gloss-specular" aria-hidden="true" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-charcoal-850/90 border border-charcoal-700 text-cream-300 hover:text-white hover:border-gold-400 transition-colors flex items-center justify-center shadow-lg"
          title="Close Modal (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: 3D Image Showcase (5 cols) */}
          <div className="md:col-span-5 relative bg-charcoal-950 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-charcoal-800">
            {/* Dish Image in 3D Stage */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-gold-500/30 shadow-[0_12px_30px_rgba(0,0,0,0.7)] group">
              <img
                src={dish.imageUrl || '/images/dishes/hyderabad-veg-biryani-hq.webp'}
                alt={dish.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-black/20" />

              {/* 3D Veg/Non-Veg Emblem */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-md bg-charcoal-900/90 border-2 flex items-center justify-center shadow-md ${
                    dish.isVeg ? 'border-emerald-500' : 'border-rose-500'
                  }`}
                  title={dish.isVeg ? '100% Vegetarian' : 'Non-Vegetarian'}
                >
                  <span
                    className={`w-3 h-3 rounded-full ${
                      dish.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                </span>

                {dish.bestseller && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-charcoal-950 shadow-md">
                    Bestseller
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gold-400">
                {dish.category}
              </span>
              <p className="text-xs text-cream-400 mt-1 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span>Prepared Fresh to Order</span>
              </p>
            </div>
          </div>

          {/* Right Column: Dish Details & Customizer (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-100 leading-snug">
                  {dish.name}
                </h3>
              </div>

              {/* Price Banner */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif font-bold text-2xl text-gold-400">
                  ₹{currentPrice()}
                </span>
                {!dish.priceConfirmed && (
                  <span className="text-[10px] text-cream-400 italic">
                    (Standard Restaurant Serving)
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-3 text-xs sm:text-sm text-cream-300 leading-relaxed">
                {dish.description ||
                  'Prepared with authentic Hyderabadi culinary traditions, fragrant spices, and royal kitchen heritage in Kurnool.'}
              </p>
            </div>

            {/* Variants / Portion Size Selector */}
            {dish.variants && dish.variants.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-cream-200">
                  Choose Portion / Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {dish.variants.map((v) => {
                    const isSelected = selectedVariant === v.label;
                    return (
                      <button
                        key={v.label}
                        type="button"
                        onClick={() => setSelectedVariant(v.label)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-gold-500/15 border-gold-400 text-cream-100 shadow-[0_0_12px_rgba(215,166,74,0.25)]'
                            : 'bg-charcoal-850 border-charcoal-750 text-cream-300 hover:border-charcoal-650'
                        }`}
                      >
                        <span className="block text-xs font-bold">{v.label}</span>
                        <span className="block text-xs font-mono text-gold-400 font-semibold mt-0.5">
                          ₹{v.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Spice Level Preference */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-cream-200 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>Spice Preference</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Mild', 'Medium', 'Royal Spicy'] as const).map((level) => {
                  const isSelected = spiceLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSpiceLevel(level)}
                      className={`py-2 px-2 rounded-xl border text-center text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-burgundy-900/80 border-gold-500/60 text-gold-300 shadow-md'
                          : 'bg-charcoal-850 border-charcoal-750 text-cream-400 hover:border-charcoal-650'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Kitchen Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300">
                Special Kitchen Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Less oil, extra onions, packing instructions"
                className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 text-xs box-3d-inset focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>

            {/* Quantity & Add to Cart Footer */}
            <div className="pt-3 border-t border-charcoal-800 flex items-center justify-between gap-4">
              {/* 3D Quantity Stepper */}
              <div className="flex items-center gap-2 bg-charcoal-950 border border-charcoal-750 rounded-xl p-1 shrink-0 box-3d-inset">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-cream-200 flex items-center justify-center transition-colors active:scale-95"
                  title="Decrease Quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono font-bold text-xs text-gold-400 w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-cream-200 flex items-center justify-center transition-colors active:scale-95"
                  title="Increase Quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* 3D CTA Button */}
              <div className="flex-1">
                {isAvailable ? (
                  <Button3D
                    variant="gold"
                    size="md"
                    fullWidth
                    onClick={handleAdd}
                    icon={isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  >
                    {isAdded ? 'Added to Order!' : `Add to Order · ₹${lineTotal}`}
                  </Button3D>
                ) : (
                  <div className="p-2.5 rounded-xl bg-charcoal-850 border border-rose-500/30 text-rose-300 text-center text-xs font-bold flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Item Sold Out Today</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

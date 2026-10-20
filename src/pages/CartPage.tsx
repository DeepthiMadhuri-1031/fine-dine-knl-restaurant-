import { apiUrl } from '../config/api';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  UtensilsCrossed, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, totalCount } = useCart();
  const navigate = useNavigate();

  const [restaurantSettings, setRestaurantSettings] = useState<any>(null);

  useEffect(() => {
    fetch(apiUrl('/api/settings'))
      .then(r => r.json())
      .then(data => setRestaurantSettings(data.settings))
      .catch(() => {});
  }, []);

  const packagingFee = cartItems.length > 0 ? (restaurantSettings?.packaging_fee ?? 15) : 0;
  const freeThreshold = restaurantSettings?.free_delivery_threshold ?? 500;
  const deliveryCharge = restaurantSettings?.delivery_fee ?? 30;
  const deliveryFee = subtotal >= freeThreshold ? 0 : deliveryCharge;
  const grandTotal = subtotal + packagingFee + deliveryFee;

  const isOpen = restaurantSettings ? restaurantSettings.is_open_for_orders === 1 : true;

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-24 bg-charcoal-900 min-h-screen">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-charcoal-800 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400 shadow-xl">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-cream-100">
            Your Order Cart is Empty
          </h1>
          <p className="text-sm text-cream-300">
            Explore authentic Rayalaseema biryanis, freshly prepared paneer gravies, and tandoori breads from our verified menu.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 text-charcoal-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Explore Restaurant Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-charcoal-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cream-300 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Adding Dishes</span>
          </Link>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all dishes from your cart?')) {
                clearCart();
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold self-start sm:self-auto flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire Cart</span>
          </button>
        </div>

        {/* Operating status notice if closed */}
        {!isOpen && (
          <div className="p-4 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2.5 shadow-lg">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
            <div>
              <strong className="block font-serif text-sm">Restaurant Ordering Currently Paused</strong>
              <span>
                Our kitchen is currently closed for live orders. Kitchen operational hours are{' '}
                {restaurantSettings?.opening_time || '11:00 AM'} to {restaurantSettings?.closing_time || '11:00 PM'}. You can still browse and prepare your cart.
              </span>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List (8 cols) */}
          <div className="lg:col-span-8 bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-charcoal-750 pb-4">
              <h1 className="font-serif text-2xl font-bold text-cream-100 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-gold-400" />
                <span>Your Selected Dishes ({totalCount})</span>
              </h1>
            </div>

            {/* Dishes list */}
            <div className="divide-y divide-charcoal-750">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Dish Info & Image */}
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.dish.imageUrl}
                      alt={item.dish.name}
                      className="w-16 h-16 rounded-xl object-cover bg-charcoal-900 border border-charcoal-700 shrink-0"
                    />
                    <div>
                      <h3 className="font-serif font-bold text-base text-cream-100 leading-snug">
                        {item.dish.name}
                      </h3>
                      <div className="text-xs text-cream-400 flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-gold-400 font-semibold font-mono">₹{item.selectedPrice}</span>
                        {item.selectedVariantLabel && (
                          <span className="px-2 py-0.5 rounded bg-charcoal-800 text-[10px] text-cream-300 border border-charcoal-700">
                            {item.selectedVariantLabel}
                          </span>
                        )}
                        <span className="text-[10px] uppercase text-cream-400 tracking-wider">
                          {item.dish.category}
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-amber-300 mt-1">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-charcoal-900 border border-gold-500/40 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="p-1 rounded-lg text-cream-300 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                        title="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-xs text-gold-400 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="p-1 rounded-lg text-cream-300 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-mono font-bold text-base text-cream-100 min-w-[70px] text-right">
                      ₹{item.selectedPrice * item.quantity}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-1.5 rounded-lg text-cream-400 hover:text-rose-400 hover:bg-charcoal-800 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Free Delivery Bar */}
            <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-750 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cream-300 flex items-center gap-1.5 font-semibold">
                  <Truck className="w-4 h-4 text-gold-400" />
                  <span>Kurnool Doorstep Delivery Policy</span>
                </span>
                <span className="font-mono font-bold text-gold-400">
                  {subtotal >= freeThreshold ? 'FREE DELIVERY UNLOCKED!' : `Add ₹${freeThreshold - subtotal} for FREE Delivery`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-charcoal-750 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / freeThreshold) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Bill Summary (4 cols) */}
          <div className="lg:col-span-4 bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 shadow-2xl space-y-6">
            <h2 className="font-serif text-lg font-bold text-cream-100 border-b border-charcoal-750 pb-3">
              Order Breakdown
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-cream-300">
                <span>Dishes Subtotal ({totalCount} items)</span>
                <span className="font-mono text-cream-100 font-semibold">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-cream-300">
                <span>Restaurant Packaging Fee</span>
                <span className="font-mono text-cream-100 font-semibold">₹{packagingFee}</span>
              </div>

              <div className="flex justify-between text-cream-300">
                <span>Delivery Charge</span>
                <span className="font-mono font-semibold">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-400 font-bold uppercase text-[11px]">FREE (₹500+)</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-charcoal-750 flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-cream-100">Estimated Total</span>
                <span className="font-mono font-bold text-2xl text-gold-400">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              disabled={!isOpen}
              className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-gold-500/20 disabled:opacity-50"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-750 text-[11px] text-cream-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cream-200 uppercase text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span>Verified Quality Dining</span>
              </div>
              <p>Authentic regional flavours slow-cooked upon order. Clean hygienic preparation.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

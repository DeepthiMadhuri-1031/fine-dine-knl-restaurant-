import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Utensils, 
  Clock, 
  Truck, 
  MessageSquare,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    updateItemNotes,
    subtotal, 
    totalCount 
  } = useCart();
  
  const navigate = useNavigate();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const packagingFee = cartItems.length > 0 ? 15 : 0;
  const deliveryFee = subtotal >= 500 || cartItems.length === 0 ? 0 : 30;
  const grandTotal = subtotal + packagingFee + deliveryFee;
  const freeDeliveryThreshold = 500;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-charcoal-900 border-l border-charcoal-700/80 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-charcoal-800 flex items-center justify-between bg-charcoal-850">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-cream-100">
                  Your Food Order
                </h3>
                <p className="text-xs text-cream-400">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'} in order
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg text-cream-400 hover:text-white hover:bg-charcoal-700/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {subtotal > 0 && (
            <div className="bg-charcoal-950 px-5 py-2.5 border-b border-charcoal-800 text-xs">
              {remainingForFreeDelivery > 0 ? (
                <div className="flex items-center justify-between text-cream-300">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-gold-400" />
                    <span>Add <strong>₹{remainingForFreeDelivery}</strong> more for <strong>FREE Delivery</strong></span>
                  </span>
                  <span className="text-[10px] text-cream-400">₹{subtotal}/₹500</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Congratulations! You unlocked FREE Delivery in Kurnool!</span>
                </div>
              )}
              {/* Progress bar */}
              <div className="w-full bg-charcoal-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-gold-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-charcoal-800 flex items-center justify-center text-cream-400">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-cream-100">
                    Your cart is empty
                  </h4>
                  <p className="text-xs text-cream-400 mt-1 max-w-xs">
                    Explore our fragrant biryanis, crispy paneer starters, and comforting curries.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/menu');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gold-500 text-charcoal-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors shadow-lg"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-charcoal-850 border border-charcoal-800 rounded-2xl p-3.5 space-y-3 hover:border-charcoal-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Dish Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-charcoal-950 shrink-0 border border-charcoal-700">
                      <img
                        src={item.dish.imageUrl || '/images/dishes/hyderabad-veg-biryani-hq.webp'}
                        alt={item.dish.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Dish Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded border border-emerald-500 flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        </span>
                        <h4 className="font-serif text-sm font-bold text-cream-100 truncate">
                          {item.dish.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-serif font-bold text-gold-400">
                          ₹{item.selectedPrice}
                        </span>
                        {item.selectedVariantLabel && (
                          <span className="text-[10px] text-cream-400 bg-charcoal-900 px-1.5 py-0.5 rounded border border-charcoal-700">
                            {item.selectedVariantLabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-charcoal-900 border border-charcoal-700 rounded-lg p-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="p-1 rounded text-cream-300 hover:text-white hover:bg-charcoal-800"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-cream-100 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="p-1 rounded text-cream-300 hover:text-white hover:bg-charcoal-800"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-1.5 text-cream-400 hover:text-red-400 transition-colors ml-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Cooking Note / Instructions */}
                  <div className="pt-2 border-t border-charcoal-800 text-xs">
                    {editingNoteId === item.cartItemId ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          defaultValue={item.notes}
                          placeholder="e.g. Less spicy, extra raita..."
                          onBlur={(e) => {
                            updateItemNotes(item.cartItemId, e.target.value);
                            setEditingNoteId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateItemNotes(item.cartItemId, (e.target as HTMLInputElement).value);
                              setEditingNoteId(null);
                            }
                          }}
                          autoFocus
                          className="w-full bg-charcoal-950 border border-gold-500/50 rounded-lg px-2.5 py-1 text-xs text-cream-100 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingNoteId(item.cartItemId)}
                        className="text-[11px] text-cream-400 hover:text-gold-300 flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3 h-3 text-gold-500" />
                        <span>{item.notes ? `Note: "${item.notes}"` : '+ Add special instruction'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-charcoal-800 bg-charcoal-850 space-y-4">
              {/* Order Policy Notice */}
              <div className="flex items-center gap-2 text-[11px] text-cream-400 bg-charcoal-900 p-2.5 rounded-xl border border-charcoal-800">
                <Clock className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Prepared fresh to order. Typical prep time: <strong>~20 mins</strong></span>
              </div>

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-cream-300">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-medium text-cream-100">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Restaurant Packaging</span>
                  <span className="font-medium text-cream-100">₹{packagingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="pt-2 border-t border-charcoal-700 flex justify-between text-sm font-bold text-cream-100">
                  <span className="font-serif">Grand Total</span>
                  <span className="font-serif text-gold-400 text-base">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleProceedCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-gold-500/20"
              >
                <span>Proceed to Order (₹{grandTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

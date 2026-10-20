import { apiUrl } from '../config/api';
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  Truck, 
  UtensilsCrossed, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard,
  Banknote,
  QrCode,
  ArrowLeft,
  ArrowRight,
  LogIn,
  AlertCircle,
  Home,
  Briefcase
} from 'lucide-react';

interface SavedAddress {
  id: string;
  label: string;
  address_line: string;
  city: string;
  pincode: string;
  landmark?: string;
  is_default: number;
}

export const CheckoutPage: React.FC = () => {
  const { cartItems, subtotal, totalCount, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [orderType, setOrderType] = useState<'delivery' | 'pickup' | 'dine-in'>('delivery');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'counter'>('cod');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Load saved addresses if logged in
  useEffect(() => {
    if (!token) return;
    const loadAddresses = async () => {
      try {
        const res = await fetch(apiUrl('/api/addresses'), {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSavedAddresses(data.addresses);
          const defaultAddr = data.addresses.find((a: SavedAddress) => a.is_default === 1) || data.addresses[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setDeliveryAddress(`${defaultAddr.address_line}${defaultAddr.landmark ? `, Near: ${defaultAddr.landmark}` : ''}, ${defaultAddr.city} - ${defaultAddr.pincode}`);
          }
        }
      } catch (err) {
        console.warn('Address loading error:', err);
      }
    };
    loadAddresses();
  }, [token]);

  const packagingFee = cartItems.length > 0 ? 15 : 0;
  const deliveryFee = orderType === 'delivery' ? (subtotal >= 500 ? 0 : 30) : 0;
  const grandTotal = subtotal + packagingFee + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-24 bg-charcoal-900 min-h-screen">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-charcoal-800 flex items-center justify-center mx-auto text-cream-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-cream-100">
            Your Order is Empty
          </h2>
          <p className="text-sm text-cream-300">
            Please add items from our digital menu before proceeding to checkout.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 text-charcoal-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors shadow-lg"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Go to Restaurant Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddressSelect = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setDeliveryAddress(`${addr.address_line}${addr.landmark ? `, Near: ${addr.landmark}` : ''}, ${addr.city} - ${addr.pincode}`);
  };

  const executeOrderSubmission = async () => {
    setErrorMessage('');

    if (!user || !token) {
      setErrorMessage('Please sign in to place your order.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for order delivery.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Please provide your delivery address in Kurnool.');
      return;
    }
    if (orderType === 'dine-in' && !tableNumber.trim()) {
      setErrorMessage('Please enter your table number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        tableNumber: orderType === 'dine-in' ? tableNumber.trim() : undefined,
        notes: orderNotes ? orderNotes.trim() : undefined,
        paymentMethod,
        items: cartItems.map(item => ({
          dishId: item.dish.id,
          quantity: item.quantity,
          selectedVariantLabel: item.selectedVariantLabel,
          notes: item.notes
        }))
      };

      const res = await fetch(apiUrl('/api/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        navigate(`/orders/${data.order.orderId}`);
      } else {
        setErrorMessage(data.error || 'Failed to place order. Please review your cart.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Could not connect to order server.');
    } finally {
      setIsSubmitting(false);
      setShowUpiModal(false);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'upi') {
      setShowUpiModal(true);
    } else {
      executeOrderSubmission();
    }
  };

  return (
    <div className="pt-28 pb-24 bg-charcoal-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cream-300 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Ordering From Menu</span>
          </Link>
        </div>

        {/* Guest Authentication Callout if not logged in */}
        {!user && (
          <div className="p-6 rounded-2xl bg-charcoal-850 border border-gold-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 text-gold-400 font-serif font-bold text-lg">
                <LogIn className="w-5 h-5" />
                <span>Customer Login Required to Place Order</span>
              </div>
              <p className="text-xs text-cream-300">
                You can freely browse the menu as a guest, but customer registration or sign-in is required to secure your order and track live kitchen preparation.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors shadow"
              >
                Sign In
              </Link>
              <Link
                to={`/register?redirect=${encodeURIComponent(location.pathname)}`}
                className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-750 border border-gold-500/30 text-gold-400 font-bold text-xs uppercase tracking-wider transition-colors shadow"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Customer & Delivery Details Form (7 cols) */}
          <div className="lg:col-span-7 bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="border-b border-charcoal-750 pb-4">
              <h1 className="font-serif text-2xl font-bold text-cream-100 flex items-center gap-2">
                <UtensilsCrossed className="w-6 h-6 text-gold-400" />
                <span>Complete Your Order</span>
              </h1>
              <p className="text-xs text-cream-300 mt-1">
                Verified Kurnool dining service with real-time kitchen tracking
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Order Service Type Tabs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-cream-200 mb-2">
                  Dining Service Mode
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'delivery', label: 'Home Delivery', icon: Truck, note: 'Within Kurnool city' },
                    { id: 'pickup', label: 'Takeaway / Pickup', icon: ShoppingBag, note: 'Ready in ~20 mins' },
                    { id: 'dine-in', label: 'Dine-In Table', icon: UtensilsCrossed, note: 'Order to your table' },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = orderType === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setOrderType(mode.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-gold-500/10 border-gold-400 text-cream-100 ring-1 ring-gold-400'
                            : 'bg-charcoal-900 border-charcoal-700 text-cream-300 hover:border-charcoal-600'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-gold-400' : 'text-cream-400'}`} />
                          <span className="text-xs font-bold leading-tight block">{mode.label}</span>
                        </div>
                        <span className="text-[10px] text-cream-400 block">{mode.note}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1.5">
                    Customer Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Dinesh Kumar"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1.5">
                    Mobile Number (10 digits)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address or Table Number */}
              {orderType === 'delivery' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300">
                      Delivery Address in Kurnool
                    </label>
                    {user && savedAddresses.length > 0 && (
                      <span className="text-[11px] text-gold-400">
                        {savedAddresses.length} saved address(es) available
                      </span>
                    )}
                  </div>

                  {/* Saved Address Quick Selector */}
                  {user && savedAddresses.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => handleAddressSelect(addr)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            selectedAddressId === addr.id
                              ? 'bg-gold-500/10 border-gold-400 text-cream-100'
                              : 'bg-charcoal-900 border-charcoal-700 text-cream-300 hover:border-charcoal-600'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-cream-200 mb-0.5">
                            <span className="flex items-center gap-1.5">
                              {addr.label === 'Home' ? <Home className="w-3.5 h-3.5 text-gold-400" /> : <Briefcase className="w-3.5 h-3.5 text-gold-400" />}
                              <span>{addr.label}</span>
                            </span>
                            {addr.is_default === 1 && (
                              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-gold-500/20 text-gold-400">
                                Default
                              </span>
                            )}
                          </div>
                          <span className="line-clamp-1 text-[11px] text-cream-400">{addr.address_line}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-cream-400" />
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value);
                        setSelectedAddressId('');
                      }}
                      rows={2}
                      placeholder="Street address, Flat/Door No., Landmark, Kurnool, Andhra Pradesh"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>
                </div>
              )}

              {orderType === 'dine-in' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1.5">
                    Dine-In Table Number
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 4 or AC Cabin 2"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1.5">
                  Kitchen Notes & Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Less spicy, pack extra mint chutney, call before delivery"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-cream-200 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'cod',
                      label: 'Cash on Delivery',
                      icon: Banknote,
                      subtext: orderType === 'delivery' ? 'Pay cash to delivery rider' : 'Pay at counter'
                    },
                    {
                      id: 'upi',
                      label: 'UPI Direct',
                      icon: QrCode,
                      subtext: 'GPay, PhonePe, Paytm QR'
                    },
                    {
                      id: 'counter',
                      label: 'Pay at Counter',
                      icon: CreditCard,
                      subtext: 'Card or Cash upon pickup'
                    },
                  ].map((pay) => {
                    const Icon = pay.icon;
                    const isSelected = paymentMethod === pay.id;
                    return (
                      <button
                        key={pay.id}
                        type="button"
                        onClick={() => setPaymentMethod(pay.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-gold-500/10 border-gold-400 text-cream-100 ring-1 ring-gold-400'
                            : 'bg-charcoal-900 border-charcoal-700 text-cream-300 hover:border-charcoal-600'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-gold-400' : 'text-cream-400'}`} />
                          <span className="text-xs font-bold block">{pay.label}</span>
                        </div>
                        <span className="text-[10px] text-cream-400 block leading-tight">{pay.subtext}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting || !user}
                className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-gold-500/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Place Restaurant Order · ₹{grandTotal}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {!user && (
                <p className="text-center text-xs text-amber-400">
                  * Please log in or register above to submit your order to the kitchen.
                </p>
              )}
            </form>
          </div>

          {/* Right: Itemized Order Bill Summary (5 cols) */}
          <div className="lg:col-span-5 bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 shadow-2xl space-y-6">
            
            <div className="border-b border-charcoal-750 pb-4">
              <h2 className="font-serif text-lg font-bold text-cream-100 flex items-center justify-between">
                <span>Your Order Summary</span>
                <span className="text-xs font-mono font-normal text-gold-400">
                  {totalCount} item{totalCount !== 1 ? 's' : ''}
                </span>
              </h2>
            </div>

            {/* Dishes list */}
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded bg-charcoal-800 border border-gold-500/30 flex items-center justify-center font-bold text-gold-400 font-mono text-[11px]">
                      {item.quantity}
                    </span>
                    <div>
                      <span className="font-semibold text-cream-100 block">{item.dish.name}</span>
                      <span className="text-[10px] text-cream-400">
                        {item.selectedVariantLabel ? `${item.selectedVariantLabel} · ` : ''}₹{item.selectedPrice} each
                      </span>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-cream-200">
                    ₹{item.selectedPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-charcoal-750 space-y-2.5 text-xs">
              <div className="flex justify-between text-cream-300">
                <span>Subtotal</span>
                <span className="font-mono text-cream-100">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-cream-300">
                <span>Restaurant Packaging Fee</span>
                <span className="font-mono text-cream-100">₹{packagingFee}</span>
              </div>

              <div className="flex justify-between text-cream-300">
                <span>Kurnool Delivery Charge</span>
                <span className="font-mono">
                  {orderType === 'delivery' ? (
                    deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">FREE (₹500+)</span>
                    ) : (
                      `₹${deliveryFee}`
                    )
                  ) : (
                    <span className="text-cream-400">N/A ({orderType})</span>
                  )}
                </span>
              </div>

              {subtotal < 500 && orderType === 'delivery' && (
                <div className="p-2.5 rounded-lg bg-charcoal-900 border border-gold-500/20 text-[11px] text-gold-300 flex items-center gap-2">
                  <span>💡 Add items worth <strong className="text-cream-100 font-mono">₹{500 - subtotal}</strong> more for <strong>FREE Delivery</strong>!</span>
                </div>
              )}

              <div className="pt-3 border-t border-charcoal-700 flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-cream-100">Grand Total Payable</span>
                <span className="font-mono font-bold text-xl text-gold-400">₹{grandTotal}</span>
              </div>
            </div>

            {/* Quality assurance banner */}
            <div className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-750 text-[11px] text-cream-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-cream-100 uppercase tracking-wider text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span>Restaurant Commitment</span>
              </div>
              <p className="leading-relaxed">
                Prepared with royal Hyderabadi spices, cold-pressed oils, and fresh farm ingredients in Kurnool. Served piping hot.
              </p>
            </div>
          </div>

        </div>

        {/* UPI Interactive Payment Modal */}
        {showUpiModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-charcoal-850 border border-gold-500/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
                <QrCode className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-cream-100">
                  Scan & Pay with UPI
                </h3>
                <p className="text-xs text-cream-300 mt-1">
                  Pay directly using Google Pay, PhonePe, Paytm, or BHIM
                </p>
              </div>

              {/* Dynamic Mock UPI QR Placeholder */}
              <div className="p-4 bg-white rounded-xl inline-block shadow-inner mx-auto">
                <div className="w-44 h-44 bg-charcoal-100 border-2 border-dashed border-charcoal-300 rounded flex flex-col items-center justify-center p-2 text-charcoal-900">
                  <QrCode className="w-20 h-20 text-charcoal-900 mb-1" />
                  <span className="font-mono font-bold text-xs">UPI: finedineknl@upi</span>
                  <span className="font-serif font-bold text-sm text-gold-600 mt-1">₹{grandTotal}</span>
                </div>
              </div>

              <div className="text-xs text-cream-300 space-y-1">
                <div>UPI ID: <strong className="text-gold-400 font-mono">finedineknl@upi</strong></div>
                <div className="text-[11px] text-cream-400">After payment or verification, your order is instantly sent to the kitchen.</div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpiModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-charcoal-800 text-cream-300 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-750"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeOrderSubmission}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider"
                >
                  {isSubmitting ? 'Placing...' : 'Confirm Paid'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShoppingBag, 
  Printer, 
  Share2, 
  UtensilsCrossed, 
  ChefHat, 
  Truck, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { activeOrder } = useCart();

  // 20 minute live preparation countdown (in seconds: 1200)
  const [timeLeft, setTimeLeft] = useState<number>(1200);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const order = activeOrder && activeOrder.orderId === orderId ? activeOrder : null;

  if (!order) {
    return (
      <div className="pt-32 pb-24 bg-charcoal-900 min-h-screen">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-cream-100">
            Order #{orderId}
          </h2>
          <p className="text-sm text-cream-300">
            Order details were placed or expired. You can view the full menu or place a new order anytime.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 text-charcoal-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Explore Restaurant Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  // Pre-formatted WhatsApp order message
  const itemsText = order.items
    .map(i => `• ${i.quantity}x ${i.dish.name} (₹${i.selectedPrice * i.quantity})${i.notes ? ` [Note: ${i.notes}]` : ''}`)
    .join('\n');

  const whatsappMessage = 
    `*NEW ORDER - FINE DINE KNL RESTAURANT*\n` +
    `--------------------------------\n` +
    `*Order ID:* ${order.orderId}\n` +
    `*Customer:* ${order.customerName}\n` +
    `*Phone:* ${order.customerPhone}\n` +
    `*Order Type:* ${order.orderType.toUpperCase()}${order.deliveryAddress ? ` (${order.deliveryAddress})` : order.tableNumber ? ` (${order.tableNumber})` : ''}\n` +
    `--------------------------------\n` +
    `*ITEMS ORDERED:*\n${itemsText}\n` +
    `--------------------------------\n` +
    `*Subtotal:* ₹${order.subtotal}\n` +
    `*Packaging:* ₹${order.packagingFee}\n` +
    `*Delivery:* ₹${order.deliveryFee}\n` +
    `*Total Payable:* ₹${order.total}\n` +
    `*Payment Mode:* ${order.paymentMethod.toUpperCase()}\n` +
    `--------------------------------\n` +
    `_Thank you for ordering with FINE DINE KNL RESTAURANT, Kurnool!_`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="pt-28 pb-24 bg-charcoal-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 font-mono text-xs font-bold uppercase tracking-wider">
            Order ID: {order.orderId}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-100">
            Order Received & Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-cream-300 max-w-lg mx-auto">
            Thank you, <strong className="text-cream-100">{order.customerName}</strong>! Our kitchen has received your order and our chefs have started preparing it fresh.
          </p>
        </div>

        {/* Live Preparation Countdown Stepper */}
        <div className="bg-charcoal-850 border border-charcoal-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-700/60">
            <div>
              <span className="text-xs text-gold-500 uppercase tracking-widest font-semibold block">
                Live Kitchen Status
              </span>
              <h3 className="font-serif text-xl font-bold text-cream-100 mt-0.5">
                Fresh Dum Cooking in Progress
              </h3>
            </div>
            
            <div className="flex items-center gap-3 bg-charcoal-900 border border-gold-500/30 px-4 py-2.5 rounded-xl">
              <Clock className="w-5 h-5 text-gold-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-cream-400 uppercase tracking-wider block">Estimated Ready In</span>
                <span className="font-mono text-lg font-bold text-gold-400">{formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Stepper Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-charcoal-950 font-bold flex items-center justify-center shrink-0">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-cream-100">Order Placed</p>
                <p className="text-[10px] text-cream-400">Received at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-charcoal-950 font-bold flex items-center justify-center shrink-0 animate-bounce">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gold-400">In the Kitchen</p>
                <p className="text-[10px] text-cream-400">Cooking fresh to order</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 opacity-60">
              <div className="w-10 h-10 rounded-full bg-charcoal-800 border border-charcoal-700 text-cream-400 font-bold flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-cream-300">
                  {order.orderType === 'delivery' ? 'Out for Delivery' : order.orderType === 'pickup' ? 'Ready for Pickup' : 'Table Service'}
                </p>
                <p className="text-[10px] text-cream-400">Estimated ~{minutes} mins</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 opacity-60">
              <div className="w-10 h-10 rounded-full bg-charcoal-800 border border-charcoal-700 text-cream-400 font-bold flex items-center justify-center shrink-0">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-cream-300">Enjoy Your Food</p>
                <p className="text-[10px] text-cream-400">Khadakpura, Kurnool</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-charcoal-850 border border-charcoal-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-700 gap-2">
            <div>
              <h3 className="font-serif text-lg font-bold text-cream-100">
                Order Receipt & Item Details
              </h3>
              <p className="text-xs text-cream-400">
                FINE DINE KNL RESTAURANT • 18, Khadakpura Street, Kurnool
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-charcoal-900 border border-charcoal-700 text-xs font-medium text-cream-300 uppercase">
                {order.orderType}
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-xs font-medium text-emerald-400 uppercase">
                {order.paymentMethod}
              </span>
            </div>
          </div>

          {/* Delivery or Table Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 text-xs">
            <div>
              <span className="text-cream-400 block mb-0.5">Customer Contact:</span>
              <p className="font-semibold text-cream-100">{order.customerName}</p>
              <p className="text-gold-400 font-mono">{order.customerPhone}</p>
            </div>
            <div>
              <span className="text-cream-400 block mb-0.5">
                {order.orderType === 'delivery' ? 'Delivery Address:' : order.orderType === 'dine-in' ? 'Dine-In Location:' : 'Pickup Location:'}
              </span>
              <p className="font-semibold text-cream-100">
                {order.deliveryAddress || (order.tableNumber ? `Table: ${order.tableNumber}` : '18, Khadakpura Street, Kurnool')}
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-cream-300 uppercase tracking-wider">
              Dishes Ordered:
            </h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between text-xs py-2 border-b border-charcoal-800/80">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.dish.imageUrl}
                      alt={item.dish.name}
                      className="w-10 h-10 rounded-lg object-cover border border-charcoal-700"
                    />
                    <div>
                      <p className="font-semibold text-cream-100">
                        {item.quantity}x {item.dish.name}
                      </p>
                      {item.selectedVariantLabel && (
                        <p className="text-[10px] text-cream-400">{item.selectedVariantLabel}</p>
                      )}
                      {item.notes && (
                        <p className="text-[10px] text-gold-400 italic">"{item.notes}"</p>
                      )}
                    </div>
                  </div>
                  <span className="font-serif font-bold text-gold-400">
                    ₹{item.selectedPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="pt-2 space-y-1.5 text-xs text-cream-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-cream-100">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Packaging Charges</span>
              <span className="text-cream-100">₹{order.packagingFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>{order.deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="pt-2 border-t border-charcoal-700 flex justify-between text-base font-bold text-cream-100">
              <span className="font-serif">Total Amount</span>
              <span className="font-serif text-gold-400 text-lg">₹{order.total}</span>
            </div>
          </div>

          {/* Action Buttons: WhatsApp & Print */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
            >
              <Share2 className="w-4 h-4" />
              <span>Send Order Copy to WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-cream-200 border border-charcoal-700 text-xs font-semibold tracking-wide transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300"
          >
            <span>Back to Digital Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

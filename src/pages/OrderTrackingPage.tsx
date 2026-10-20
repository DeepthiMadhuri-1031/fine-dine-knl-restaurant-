import { apiUrl } from '../config/api';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  ArrowLeft,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Phone,
  RefreshCw
} from 'lucide-react';

interface OrderItem {
  dishId: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantLabel?: string;
  notes?: string;
  imageUrl?: string;
}

interface Order {
  id: string;
  orderId: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  order_type: 'delivery' | 'pickup' | 'dine-in';
  delivery_address?: string;
  table_number?: string;
  notes?: string;
  subtotal: number;
  packaging_fee: number;
  delivery_fee: number;
  total: number;
  payment_method: 'cod' | 'upi' | 'counter';
  payment_status: 'pending' | 'paid';
  status: 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  cancellation_reason?: string;
  cancelled_by?: string;
  estimated_time_mins: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const fetchOrderDetails = async () => {
    if (!orderId || !token) return;
    try {
      const res = await fetch(apiUrl(`/api/orders/${orderId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setErrorMsg('');
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to retrieve order details.');
      }
    } catch (err) {
      setErrorMsg('Network error while checking order status.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    // Poll every 5 seconds for live status updates from kitchen
    const interval = setInterval(fetchOrderDetails, 5000);
    return () => clearInterval(interval);
  }, [orderId, token]);

  const handleCancel = async () => {
    if (!order || !token) return;
    setCancelError('');
    setIsCancelling(true);

    try {
      const res = await fetch(apiUrl(`/api/orders/${order.orderId}/cancel`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: cancelReason })
      });

      const data = await res.json();
      if (res.ok) {
        setShowCancelModal(false);
        fetchOrderDetails();
      } else {
        setCancelError(data.error || 'Cancellation failed.');
      }
    } catch (err) {
      setCancelError('Error sending cancellation request.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 bg-charcoal-900 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-cream-300">Connecting to restaurant live tracking...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="pt-32 pb-24 bg-charcoal-900 min-h-screen">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-cream-100">Order Not Accessible</h2>
          <p className="text-sm text-cream-300">
            {errorMsg || 'We could not locate this order under your account credentials.'}
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/orders"
              className="px-5 py-2.5 rounded-xl bg-charcoal-800 border border-gold-500/30 text-gold-400 font-bold text-xs uppercase tracking-wider hover:bg-charcoal-750"
            >
              My Orders
            </Link>
            <Link
              to="/menu"
              className="px-5 py-2.5 rounded-xl bg-gold-500 text-charcoal-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400"
            >
              Order Food
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pre-formatted WhatsApp message
  const itemsText = order.items
    .map(i => `• ${i.quantity}x ${i.name} (₹${i.totalPrice})`)
    .join('\n');

  const whatsappMessage = 
    `*ORDER STATUS - FINE DINE KNL RESTAURANT*\n` +
    `--------------------------------\n` +
    `*Order ID:* ${order.orderId}\n` +
    `*Status:* ${order.status.toUpperCase()}\n` +
    `*Customer:* ${order.customer_name}\n` +
    `*Type:* ${order.order_type.toUpperCase()}\n` +
    `--------------------------------\n` +
    `*ITEMS:*\n${itemsText}\n` +
    `--------------------------------\n` +
    `*Total:* ₹${order.total} (${order.payment_method.toUpperCase()})\n` +
    `_FINE DINE KNL RESTAURANT, Kurnool_`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

  // Determine stage active states
  const stages = [
    { key: 'confirmed', title: 'Order Confirmed', desc: 'Received & sent to kitchen' },
    { key: 'preparing', title: 'Preparing in Kitchen', desc: 'Chef cooking fresh dishes' },
    { key: 'ready', title: order.order_type === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup / Dine-in', desc: 'Packed hot & ready' },
    { key: 'delivered', title: 'Delivered / Completed', desc: 'Enjoy your meal!' },
  ];

  const getStageIndex = (status: Order['status']) => {
    switch (status) {
      case 'confirmed': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
    }
  };

  const currentStageIdx = getStageIndex(order.status);
  const isCancelled = order.status === 'cancelled';
  const isCancellable = order.status === 'confirmed';

  return (
    <div className="pt-28 pb-24 bg-charcoal-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cream-300 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Orders</span>
          </Link>

          <button
            onClick={fetchOrderDetails}
            className="inline-flex items-center gap-1.5 text-xs text-cream-400 hover:text-gold-400 transition-colors"
            title="Refresh Status"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Live Updating (Every 5s)</span>
          </button>
        </div>

        {/* Tracking Header */}
        <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-4">
          <div className="inline-block px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 font-mono text-xs font-bold uppercase tracking-wider">
            Order ID: {order.orderId}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-100">
            {isCancelled ? 'Order Cancelled' : order.status === 'delivered' ? 'Order Completed!' : 'Live Order Progress'}
          </h1>

          <p className="text-sm text-cream-300 max-w-lg mx-auto">
            {isCancelled
              ? `This order was cancelled by ${order.cancelled_by === 'admin' ? 'Restaurant Management' : 'you'}. Reason: ${order.cancellation_reason || 'N/A'}`
              : order.status === 'delivered'
              ? 'Your meal has been delivered. Thank you for dining with FINE DINE KNL RESTAURANT!'
              : 'Our kitchen team has received your order and is preparing authentic Kurnool delicacies.'}
          </p>

          {/* Cancellation Notice Banner */}
          {isCancelled && (
            <div className="mt-4 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-center gap-2 max-w-md mx-auto">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>Cancelled: {order.cancellation_reason || 'Order cancelled'}</span>
            </div>
          )}

          {/* 4-Stage Live Stepper (if not cancelled) */}
          {!isCancelled && (
            <div className="pt-8 pb-4">
              <div className="relative">
                {/* Connecting bar */}
                <div className="absolute top-5 left-8 right-8 h-1 bg-charcoal-750 -z-0">
                  <div
                    className="h-full bg-gold-500 transition-all duration-700"
                    style={{ width: `${(currentStageIdx / (stages.length - 1)) * 100}%` }}
                  />
                </div>

                {/* Stage Steps */}
                <div className="relative z-10 grid grid-cols-4 gap-2">
                  {stages.map((stage, idx) => {
                    const isDone = idx <= currentStageIdx;
                    const isCurrent = idx === currentStageIdx;

                    return (
                      <div key={stage.key} className="flex flex-col items-center text-center space-y-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isCurrent
                              ? 'bg-gold-500 text-charcoal-950 ring-4 ring-gold-500/30 scale-110 shadow-lg shadow-gold-500/30'
                              : isDone
                              ? 'bg-gold-500/20 text-gold-400 border-2 border-gold-400'
                              : 'bg-charcoal-800 text-cream-500 border border-charcoal-700'
                          }`}
                        >
                          {isDone ? (
                            idx < currentStageIdx ? (
                              <CheckCircle2 className="w-5 h-5 text-gold-400" />
                            ) : (
                              <span>{idx + 1}</span>
                            )
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        <div>
                          <div className={`text-xs font-bold ${isCurrent ? 'text-gold-400' : isDone ? 'text-cream-100' : 'text-cream-400'}`}>
                            {stage.title}
                          </div>
                          <div className="text-[10px] text-cream-400 hidden sm:block">
                            {stage.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Cancel button if order is still in 'confirmed' status */}
          {isCancellable && (
            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-950/40 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel Order (Eligible before cooking begins)</span>
              </button>
            </div>
          )}
        </div>

        {/* Two Column Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Items Summary (2 cols) */}
          <div className="md:col-span-2 bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2 border-b border-charcoal-750 pb-3">
              <UtensilsCrossed className="w-4 h-4 text-gold-400" />
              <span>Ordered Dishes ({order.items.length})</span>
            </h2>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-charcoal-800/80 last:border-0 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-charcoal-800 border border-gold-500/30 flex items-center justify-center text-xs font-bold text-gold-400 font-mono">
                      {item.quantity}x
                    </div>
                    <div>
                      <span className="font-medium text-cream-100 block">{item.name}</span>
                      <span className="text-[11px] text-cream-400">
                        {item.variantLabel ? `${item.variantLabel} · ` : ''}₹{item.unitPrice} each
                        {item.notes && <span className="text-gold-400 block">Note: {item.notes}</span>}
                      </span>
                    </div>
                  </div>

                  <div className="font-mono font-semibold text-cream-200">
                    ₹{item.totalPrice}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-charcoal-750 space-y-2 text-xs">
              <div className="flex justify-between text-cream-300">
                <span>Items Subtotal:</span>
                <span className="font-mono text-cream-200">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-cream-300">
                <span>Restaurant Packaging Fee:</span>
                <span className="font-mono text-cream-200">₹{order.packaging_fee}</span>
              </div>
              <div className="flex justify-between text-cream-300">
                <span>Delivery Charge:</span>
                <span className="font-mono text-cream-200">
                  {order.delivery_fee === 0 ? <span className="text-emerald-400 font-semibold">FREE (Order ₹500+)</span> : `₹${order.delivery_fee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-cream-100 pt-2 border-t border-charcoal-800">
                <span>Total Amount:</span>
                <span className="text-gold-400 font-mono text-lg">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Sidebar (1 col) */}
          <div className="space-y-6">
            <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="font-serif text-lg font-bold text-cream-100 border-b border-charcoal-750 pb-3">
                Order Info
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-cream-400 block uppercase tracking-wider text-[10px]">Recipient</span>
                  <span className="font-semibold text-cream-100 text-sm">{order.customer_name}</span>
                  <span className="block text-cream-300">{order.customer_phone}</span>
                </div>

                <div>
                  <span className="text-cream-400 block uppercase tracking-wider text-[10px]">Service Mode</span>
                  <span className="font-semibold text-gold-400 capitalize">{order.order_type}</span>
                </div>

                {order.delivery_address && (
                  <div>
                    <span className="text-cream-400 block uppercase tracking-wider text-[10px]">Delivery Destination</span>
                    <span className="text-cream-200 leading-relaxed block mt-0.5">{order.delivery_address}</span>
                  </div>
                )}

                {order.table_number && (
                  <div>
                    <span className="text-cream-400 block uppercase tracking-wider text-[10px]">Table Allocation</span>
                    <span className="text-cream-100 font-semibold">Table #{order.table_number}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-charcoal-800">
                  <span className="text-cream-400 block uppercase tracking-wider text-[10px]">Payment Method</span>
                  <span className="font-bold text-cream-100 uppercase">{order.payment_method}</span>
                  <span className={`inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    order.payment_status === 'paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-5 shadow-xl space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-cream-100 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>

              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-750 border border-charcoal-700 text-cream-200 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-gold-400" />
                <span>Print Bill Receipt</span>
              </button>
            </div>
          </div>

        </div>

        {/* Cancellation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-charcoal-850 border border-gold-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl font-bold text-cream-100">
                  Cancel Order #{order.orderId}?
                </h3>
                <p className="text-xs text-cream-300 mt-1">
                  Cancellation is only permitted while your order is in "Confirmed" status prior to food preparation in the kitchen.
                </p>
              </div>

              {cancelError && (
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                  {cancelError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                  Reason for Cancellation
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Changed dining plans, ordered wrong item..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  disabled={isCancelling}
                  className="flex-1 py-2 rounded-xl bg-charcoal-800 text-cream-300 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-750"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-cream-100 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

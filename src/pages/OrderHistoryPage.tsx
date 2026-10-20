import { apiUrl } from '../config/api';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  UtensilsCrossed, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RefreshCw,
  ChefHat,
  Truck,
  RotateCcw
} from 'lucide-react';

interface OrderItem {
  dishId: string;
  name: string;
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
  order_type: 'delivery' | 'pickup' | 'dine-in';
  delivery_address?: string;
  table_number?: string;
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
}

export const OrderHistoryPage: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(apiUrl('/api/orders/my-orders'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (err) {
      console.warn('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll every 15 seconds to update order status automatically
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [token]);

  const handleCancelOrder = async () => {
    if (!cancelModalOrder || !token) return;
    setCancelError('');
    setIsCancelling(true);

    try {
      const res = await fetch(apiUrl(`/api/orders/${cancelModalOrder.orderId}/cancel`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: cancelReason })
      });

      const data = await res.json();
      if (res.ok) {
        setCancelModalOrder(null);
        setCancelReason('');
        fetchOrders();
      } else {
        setCancelError(data.error || 'Failed to cancel order.');
      }
    } catch (err) {
      setCancelError('Network error while cancelling order.');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-950/70 border border-sky-500/40 text-sky-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Order Confirmed</span>
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/70 border border-amber-500/40 text-amber-400">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Kitchen Preparing</span>
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 border border-indigo-500/40 text-indigo-400">
            <Truck className="w-3.5 h-3.5" />
            <span>Out for Delivery / Ready</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered & Enjoyed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/70 border border-rose-500/40 text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="pt-28 pb-24 bg-charcoal-900 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-750 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-cream-100 flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-gold-400" />
              <span>My Orders</span>
            </h1>
            <p className="text-sm text-cream-300 mt-1">
              Live status, order history, digital receipts, and tracking for FINE DINE KNL
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="p-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-750 border border-charcoal-700 text-cream-300 hover:text-gold-400 transition-colors"
              title="Refresh Orders"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-gold-500/20"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Order Again</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-cream-300">Retrieving your order records...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center bg-charcoal-850 border border-charcoal-750 rounded-2xl p-8 space-y-5 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-cream-100">No Orders Yet</h2>
            <p className="text-sm text-cream-300">
              You haven't placed any orders with FINE DINE KNL yet. Explore our authentic royal menu and treat yourself today!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-gold-500/20"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Explore Menu</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const dateStr = new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              const isCancellable = order.status === 'confirmed';

              return (
                <div
                  key={order.orderId}
                  className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 shadow-xl hover:border-gold-500/40 transition-all space-y-5"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-750">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-lg bg-charcoal-800 border border-gold-500/30 text-gold-400 font-mono text-sm font-bold tracking-wider">
                        #{order.orderId}
                      </div>
                      <span className="text-xs text-cream-400">
                        {dateStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded bg-charcoal-800 text-cream-300 border border-charcoal-700">
                        {order.order_type}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-cream-400">
                        Items Ordered ({order.items.reduce((s, i) => s + i.quantity, 0)})
                      </p>
                      <ul className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="text-sm text-cream-200 flex items-center justify-between">
                            <span>
                              <span className="font-semibold text-gold-400">{item.quantity}x</span>{' '}
                              {item.name}
                              {item.variantLabel && (
                                <span className="text-[11px] text-cream-400 ml-1">({item.variantLabel})</span>
                              )}
                            </span>
                            <span className="font-mono text-cream-300">
                              ₹{item.totalPrice}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Order Details & Summary */}
                    <div className="bg-charcoal-900 rounded-xl p-4 border border-charcoal-750 space-y-2 text-xs">
                      {order.delivery_address && (
                        <div className="flex items-start gap-2 text-cream-300">
                          <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{order.delivery_address}</span>
                        </div>
                      )}
                      {order.table_number && (
                        <div className="text-cream-300">
                          <span className="text-cream-400">Dine-in Table:</span> Table #{order.table_number}
                        </div>
                      )}
                      <div className="flex justify-between text-cream-400 pt-2 border-t border-charcoal-800">
                        <span>Payment Method:</span>
                        <span className="font-semibold text-cream-200 uppercase">{order.payment_method}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-cream-100 pt-1">
                        <span>Total Paid / Payable:</span>
                        <span className="text-gold-400 font-mono text-base">₹{order.total}</span>
                      </div>

                      {order.status === 'cancelled' && order.cancellation_reason && (
                        <div className="pt-2 text-rose-300 text-[11px] border-t border-charcoal-800">
                          <span className="font-semibold">Reason for Cancellation:</span> {order.cancellation_reason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-charcoal-750 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-cream-400">
                      {order.status === 'confirmed' && (
                        <span className="text-sky-300">Order acknowledged. Kitchen preparation scheduled.</span>
                      )}
                      {order.status === 'preparing' && (
                        <span className="text-amber-300">Chef is preparing your fresh meal now!</span>
                      )}
                      {order.status === 'ready' && (
                        <span className="text-indigo-300">Dispatched from restaurant kitchen.</span>
                      )}
                      {order.status === 'delivered' && (
                        <span className="text-emerald-300">Delivered successfully. Thank you for dining with us!</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {isCancellable && (
                        <button
                          onClick={() => setCancelModalOrder(order)}
                          className="px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-400 hover:bg-rose-950/40 text-xs font-semibold transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}

                      <Link
                        to={`/orders/${order.orderId}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors shadow"
                      >
                        <span>Live Visual Tracker</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancelModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-charcoal-850 border border-gold-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl font-bold text-cream-100">
                  Cancel Order #{cancelModalOrder.orderId}?
                </h3>
                <p className="text-xs text-cream-300 mt-1">
                  Orders can only be cancelled while in "Confirmed" status prior to kitchen food preparation.
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
                  placeholder="e.g. Ordered incorrect items, delivery address change, etc."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  disabled={isCancelling}
                  className="flex-1 py-2 rounded-xl bg-charcoal-800 text-cream-300 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-750 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-cream-100 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

import { apiUrl } from '../config/api';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
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
  RotateCcw,
  Search,
  Filter,
  CreditCard,
  ChevronDown,
  Info
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

export const MyOrdersPage: React.FC = () => {
  const { token } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reorderLoadingId, setReorderLoadingId] = useState<string | null>(null);

  // Cancellation modal
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
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.warn('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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

  const handleReorder = async (orderId: string) => {
    setReorderLoadingId(orderId);
    try {
      const res = await fetch(apiUrl(`/api/orders/${orderId}/reorder`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.items) {
        data.items.forEach((item: any) => {
          if (item.dish) {
            addToCart(item.dish, item.unitPrice, item.variantLabel, item.notes);
          }
        });
        navigate('/cart');
      } else {
        alert(data.error || 'Failed to reorder items.');
      }
    } catch (err) {
      alert('Network error while reordering.');
    } finally {
      setReorderLoadingId(null);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-950/70 border border-sky-500/40 text-sky-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Confirmed</span>
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
            <span>Out for Delivery</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
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

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      order.orderId.toLowerCase().includes(q) ||
      order.items.some(i => i.name.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="pt-28 pb-24 bg-charcoal-900 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-800 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-cream-100 flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-gold-400" />
              <span>My Orders & Receipts</span>
            </h1>
            <p className="text-sm text-cream-300 mt-1">
              Track live kitchen status, view item receipts, and easily reorder your favourite dishes
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

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-charcoal-850 border border-gold-500/20 p-3 rounded-2xl">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-cream-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID or dish name..."
              className="w-full pl-10 pr-4 py-2 bg-charcoal-900 border border-charcoal-750 rounded-xl text-cream-100 text-xs focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'preparing', label: 'Preparing' },
              { id: 'ready', label: 'Ready' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-gold-500 text-charcoal-950 font-bold shadow'
                    : 'bg-charcoal-900 border border-charcoal-750 text-cream-300 hover:text-gold-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Feed */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-cream-300">Retrieving order details from database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center bg-charcoal-850 border border-charcoal-800 rounded-2xl p-8 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-cream-100">No Orders Found</h2>
            <p className="text-sm text-cream-300">
              {orders.length === 0 
                ? "You haven't placed any orders with FINE DINE KNL yet." 
                : "No orders match your selected filters."}
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-gold-500/20"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Explore Restaurant Menu</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
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
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-750">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-lg bg-charcoal-800 border border-gold-500/30 text-gold-400 font-mono text-sm font-bold tracking-wider">
                        #{order.orderId}
                      </div>
                      <span className="text-xs text-cream-400">{dateStr}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded bg-charcoal-800 text-cream-300 border border-charcoal-700">
                        {order.order_type}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Body: Items and Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-cream-400">
                        Items Ordered ({order.items.reduce((s, i) => s + i.quantity, 0)})
                      </p>
                      <ul className="space-y-2">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="text-sm text-cream-200 flex items-center justify-between bg-charcoal-900/60 px-3 py-2 rounded-xl border border-charcoal-800">
                            <div>
                              <span className="font-semibold text-gold-400">{item.quantity}x</span>{' '}
                              <span>{item.name}</span>
                              {item.variantLabel && (
                                <span className="text-[11px] text-cream-400 ml-1.5 block sm:inline">
                                  ({item.variantLabel})
                                </span>
                              )}
                              {item.notes && (
                                <span className="text-[10px] text-cream-400 block italic">
                                  "{item.notes}"
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-cream-300 font-medium shrink-0 ml-2">
                              ₹{item.totalPrice}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-charcoal-900 rounded-xl p-4 border border-charcoal-750 space-y-2 text-xs flex flex-col justify-between">
                      <div className="space-y-2">
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

                        <div className="border-t border-charcoal-800 pt-2 space-y-1 text-cream-400">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-mono">₹{order.subtotal}</span>
                          </div>
                          {order.delivery_fee > 0 && (
                            <div className="flex justify-between">
                              <span>Delivery Fee:</span>
                              <span className="font-mono">₹{order.delivery_fee}</span>
                            </div>
                          )}
                          {order.packaging_fee > 0 && (
                            <div className="flex justify-between">
                              <span>Packaging Charge:</span>
                              <span className="font-mono">₹{order.packaging_fee}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-cream-300 pt-1 border-t border-charcoal-800">
                            <span>Payment Method:</span>
                            <span className="font-semibold uppercase">{order.payment_method}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm font-bold text-cream-100 pt-2 border-t border-charcoal-800">
                        <span>Total Paid / Payable:</span>
                        <span className="text-gold-400 font-mono text-base">₹{order.total}</span>
                      </div>

                      {order.status === 'cancelled' && order.cancellation_reason && (
                        <div className="pt-2 text-rose-300 text-[11px] border-t border-charcoal-800">
                          <span className="font-semibold">Cancellation Reason:</span> {order.cancellation_reason}
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

                      <button
                        onClick={() => handleReorder(order.orderId)}
                        disabled={reorderLoadingId === order.orderId}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-750 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${reorderLoadingId === order.orderId ? 'animate-spin' : ''}`} />
                        <span>Reorder</span>
                      </button>

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
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
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
export default MyOrdersPage;

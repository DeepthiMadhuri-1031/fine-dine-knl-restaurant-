import { apiUrl } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Phone, 
  User, 
  RotateCcw,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

interface OrderItem {
  dishId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantLabel?: string;
  notes?: string;
}

interface Order {
  id: string;
  orderId: string;
  user_id: string;
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
}

export const AdminOrdersPage: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cancellation modal state
  const [cancelTargetOrder, setCancelTargetOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Cancelled by restaurant operations');
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      let url = `/api/admin/orders?status=${statusFilter}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (err) {
      console.warn('Admin fetch orders error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, [token, statusFilter, searchQuery]);

  const updateStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const res = await fetch(apiUrl(`/api/admin/orders/${orderId}/status`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, paymentStatus })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.warn('Update status error:', err);
    }
  };

  const handleAdminCancel = async () => {
    if (!cancelTargetOrder || !token) return;
    setIsCancelling(true);
    try {
      const res = await fetch(apiUrl(`/api/admin/orders/${cancelTargetOrder.id}/cancel`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: cancelReason })
      });
      if (res.ok) {
        setCancelTargetOrder(null);
        fetchOrders();
      }
    } catch (err) {
      console.warn('Admin cancel error:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-cream-100 flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-gold-400" />
              <span>Restaurant Order Management</span>
            </h1>
            <p className="text-xs text-cream-300 mt-1">
              Advance kitchen statuses, view customer allocations, and process live tickets
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 hover:border-gold-500/40 text-cream-300 hover:text-gold-400 text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Poll Updates (8s)</span>
          </button>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-charcoal-900 border border-gold-500/20 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'confirmed', label: 'Confirmed (Queue)' },
              { id: 'preparing', label: 'Kitchen Preparing' },
              { id: 'ready', label: 'Ready / Dispatched' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md'
                    : 'bg-charcoal-800 text-cream-300 hover:bg-charcoal-750'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, phone..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-charcoal-800 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* Orders Roster */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-cream-300">Retrieving operational tickets...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center bg-charcoal-900 border border-charcoal-750 rounded-2xl p-6">
            <ShoppingBag className="w-8 h-8 text-cream-400 mx-auto mb-2" />
            <p className="text-sm text-cream-200">No orders found matching the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const dateStr = new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={order.id}
                  className="bg-charcoal-900 border border-gold-500/20 rounded-2xl p-5 shadow-xl hover:border-gold-500/40 transition-all space-y-4"
                >
                  {/* Order Card Summary Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="p-1 rounded-md bg-charcoal-800 text-gold-400 hover:bg-charcoal-750"
                        title="Toggle Details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <div className="font-mono font-bold text-sm text-gold-400">
                        #{order.id}
                      </div>

                      <span className="text-xs text-cream-400">{dateStr}</span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-charcoal-800 text-cream-200 border border-charcoal-700">
                        {order.order_type}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs text-cream-300 font-semibold block">{order.customer_name}</span>
                        <span className="text-[11px] text-cream-400 font-mono block">{order.customer_phone}</span>
                      </div>

                      <div className="font-mono font-bold text-base text-cream-100 px-3 py-1 rounded-lg bg-charcoal-800 border border-charcoal-700">
                        ₹{order.total}
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'confirmed' ? 'bg-sky-950 text-sky-400 border border-sky-500/30' :
                        order.status === 'preparing' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                        order.status === 'ready' ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/30' :
                        order.status === 'delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                        'bg-rose-950 text-rose-400 border border-rose-500/30'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Stage Advancement Control Buttons */}
                  <div className="pt-3 border-t border-charcoal-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-cream-400 uppercase tracking-wider font-semibold">
                        Progress Stage:
                      </span>
                      
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(order.id, 'preparing')}
                          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>Send to Kitchen (Cook)</span>
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateStatus(order.id, 'ready')}
                          className="px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-cream-100 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Mark Ready / Dispatched</span>
                        </button>
                      )}

                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateStatus(order.id, 'delivered', 'paid')}
                          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-charcoal-950 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Delivered (Complete)</span>
                        </button>
                      )}

                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => setCancelTargetOrder(order)}
                          className="px-2.5 py-1 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-950/40 text-[11px] font-semibold transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-cream-400">
                      Payment: <strong className="text-cream-200 uppercase">{order.payment_method}</strong> ({order.payment_status})
                    </div>
                  </div>

                  {/* Expandable Order Detail Accordion */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-charcoal-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-fadeIn bg-charcoal-925 p-4 rounded-xl">
                      {/* Dishes list */}
                      <div className="space-y-2">
                        <span className="font-bold uppercase tracking-wider text-gold-400 block">
                          Ticket Items Breakdown
                        </span>
                        <div className="space-y-1.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-cream-200">
                              <span>
                                <strong className="text-gold-400">{item.quantity}x</strong> {item.name}
                                {item.variantLabel && <span className="text-cream-400 ml-1">({item.variantLabel})</span>}
                                {item.notes && <span className="text-amber-400 block text-[10px]">Note: {item.notes}</span>}
                              </span>
                              <span className="font-mono text-cream-300">₹{item.totalPrice}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Delivery & Allocation */}
                      <div className="space-y-2">
                        <span className="font-bold uppercase tracking-wider text-gold-400 block">
                          Service Destination & Notes
                        </span>
                        {order.delivery_address && (
                          <div className="text-cream-300">
                            <span className="text-cream-400 block">Delivery Address:</span>
                            <span>{order.delivery_address}</span>
                          </div>
                        )}
                        {order.table_number && (
                          <div className="text-cream-300">
                            <span className="text-cream-400 block">Dine-in Table:</span>
                            <span className="font-bold text-cream-100">Table #{order.table_number}</span>
                          </div>
                        )}
                        {order.notes && (
                          <div className="text-cream-300">
                            <span className="text-cream-400 block">Special Customer Instruction:</span>
                            <span className="text-amber-300 font-medium">{order.notes}</span>
                          </div>
                        )}
                        {order.cancellation_reason && (
                          <div className="text-rose-300 pt-1 border-t border-charcoal-800">
                            <span className="font-bold">Cancellation Reason:</span> {order.cancellation_reason}
                            {order.cancelled_by && <span className="block text-[10px] text-cream-400">By: {order.cancelled_by}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Admin Cancellation Dialog */}
        {cancelTargetOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-charcoal-850 border border-gold-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl font-bold text-cream-100">
                  Cancel Ticket #{cancelTargetOrder.id}
                </h3>
                <p className="text-xs text-cream-300 mt-1">
                  Specify the operations reason for voiding this dining ticket.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                  Cancellation Reason
                </label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelTargetOrder(null)}
                  disabled={isCancelling}
                  className="flex-1 py-2 rounded-xl bg-charcoal-800 text-cream-300 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-750"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={handleAdminCancel}
                  disabled={isCancelling}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-cream-100 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {isCancelling ? 'Voiding...' : 'Confirm Void'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

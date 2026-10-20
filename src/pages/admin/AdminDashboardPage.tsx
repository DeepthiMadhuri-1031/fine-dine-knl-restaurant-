import { apiUrl } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  IndianRupee, 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Users, 
  ArrowRight, 
  RefreshCw,
  UtensilsCrossed,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface StatsMetrics {
  totalOrders: number;
  totalRevenue: number;
  confirmedOrders: number;
  preparingOrders: number;
  readyOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
}

interface RecentOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  order_type: string;
  total: number;
  status: string;
  created_at: string;
}

export const AdminDashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState<StatsMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStats = async () => {
    if (!token) return;
    try {
      const res = await fetch(apiUrl('/api/admin/stats'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setRecentOrders(data.recentOrders || []);
        setErrorMsg('');
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to fetch dashboard metrics.');
      }
    } catch (err) {
      setErrorMsg('Could not connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const advanceOrderStatus = async (orderId: string, nextStatus: string) => {
    try {
      const res = await fetch(apiUrl(`/api/admin/orders/${orderId}/status`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchStats();
      }
    } catch (err) {
      console.warn('Update status error:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Top Title & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-cream-100 flex items-center gap-3">
              <span>Operations Executive Dashboard</span>
            </h1>
            <p className="text-xs text-cream-300 mt-1">
              Live restaurant throughput, sales volume, kitchen load & fulfillment metrics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 hover:border-gold-500/40 text-cream-300 hover:text-gold-400 text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Stats</span>
            </button>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-gold-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Manage All Orders</span>
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Total Revenue */}
          <div className="bg-charcoal-900 border border-gold-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-gold-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cream-400">Total Net Revenue</span>
              <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-gold-400">
                ₹{metrics ? metrics.totalRevenue.toLocaleString('en-IN') : '...'}
              </span>
            </div>
            <span className="text-[11px] text-cream-400 mt-1 block">From verified paid dining orders</span>
          </div>

          {/* Total Orders */}
          <div className="bg-charcoal-900 border border-gold-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-gold-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cream-400">Total Orders Placed</span>
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-cream-100">
                {metrics ? metrics.totalOrders : '...'}
              </span>
            </div>
            <span className="text-[11px] text-cream-400 mt-1 block">All-time order volume</span>
          </div>

          {/* Active Kitchen Load */}
          <div className="bg-charcoal-900 border border-gold-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-gold-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cream-400">Active Kitchen Orders</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center animate-pulse">
                <ChefHat className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-amber-400">
                {metrics ? metrics.confirmedOrders + metrics.preparingOrders : '...'}
              </span>
            </div>
            <span className="text-[11px] text-cream-400 mt-1 block">
              {metrics ? `${metrics.confirmedOrders} queued · ${metrics.preparingOrders} cooking` : 'Loading...'}
            </span>
          </div>

          {/* Registered Customers */}
          <div className="bg-charcoal-900 border border-gold-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-gold-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cream-400">Customer Accounts</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-cream-100">
                {metrics ? metrics.totalCustomers : '...'}
              </span>
            </div>
            <span className="text-[11px] text-cream-400 mt-1 block">Registered Kurnool patrons</span>
          </div>

        </div>

        {/* Status Pipeline Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Confirmed (Queue)', count: metrics?.confirmedOrders ?? 0, color: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-950/20' },
            { label: 'Kitchen Cooking', count: metrics?.preparingOrders ?? 0, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-950/20' },
            { label: 'Ready / Dispatched', count: metrics?.readyOrders ?? 0, color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-950/20' },
            { label: 'Delivered', count: metrics?.deliveredOrders ?? 0, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/20' },
            { label: 'Cancelled', count: metrics?.cancelledOrders ?? 0, color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-950/20' },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${item.border} ${item.bg} text-center`}>
              <span className={`text-2xl font-bold font-mono ${item.color} block`}>
                {item.count}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cream-300 block mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Orders Section with Quick Advancement */}
        <div className="bg-charcoal-900 border border-gold-500/20 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-charcoal-750 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-400" />
                <span>Recent Live Incoming Orders</span>
              </h2>
              <p className="text-xs text-cream-300 mt-0.5">
                Real-time dining requests requiring kitchen progression
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="text-xs text-gold-400 hover:text-gold-300 font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <span>View Full Order Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-cream-400 text-xs">
              No orders placed yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-charcoal-750 text-cream-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-800">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-charcoal-850/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gold-400">
                        #{ord.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-cream-100 block">{ord.customer_name}</span>
                        <span className="text-[11px] text-cream-400">{ord.customer_phone}</span>
                      </td>
                      <td className="py-3.5 px-4 uppercase text-cream-300 font-semibold">
                        {ord.order_type}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-cream-100 text-sm">
                        ₹{ord.total}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === 'confirmed' ? 'bg-sky-950 text-sky-400 border border-sky-500/30' :
                          ord.status === 'preparing' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                          ord.status === 'ready' ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/30' :
                          ord.status === 'delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                          'bg-rose-950 text-rose-400 border border-rose-500/30'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {ord.status === 'confirmed' && (
                          <button
                            onClick={() => advanceOrderStatus(ord.id, 'preparing')}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold text-[11px] uppercase tracking-wider transition-colors"
                          >
                            Start Cooking
                          </button>
                        )}
                        {ord.status === 'preparing' && (
                          <button
                            onClick={() => advanceOrderStatus(ord.id, 'ready')}
                            className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-cream-100 font-bold text-[11px] uppercase tracking-wider transition-colors"
                          >
                            Mark Ready
                          </button>
                        )}
                        {ord.status === 'ready' && (
                          <button
                            onClick={() => advanceOrderStatus(ord.id, 'delivered')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-charcoal-950 font-bold text-[11px] uppercase tracking-wider transition-colors"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {(ord.status === 'delivered' || ord.status === 'cancelled') && (
                          <span className="text-cream-500 text-[11px]">Finalized</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

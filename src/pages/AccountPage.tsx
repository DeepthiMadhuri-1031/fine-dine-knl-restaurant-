import { apiUrl } from '../config/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  ShoppingBag, 
  ShieldCheck, 
  Lock, 
  AlertCircle,
  CheckCircle2,
  Home,
  Briefcase,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  Edit2,
  X,
  CreditCard,
  Truck,
  ChefHat,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface Address {
  id: string;
  label: string;
  house_flat?: string;
  street_locality?: string;
  landmark?: string;
  city: string;
  state?: string;
  pincode: string;
  delivery_instructions?: string;
  address_line?: string;
  is_default: number;
}

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
  estimated_time_mins: number;
  items: OrderItem[];
  created_at: string;
}

export const AccountPage: React.FC = () => {
  const { user, token, updateProfile, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'security'>('orders');

  // Profile update state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrHouseFlat, setAddrHouseFlat] = useState('');
  const [addrStreetLocality, setAddrStreetLocality] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState('Kurnool');
  const [addrState, setAddrState] = useState('Andhra Pradesh');
  const [addrPincode, setAddrPincode] = useState('518002');
  const [addrInstructions, setAddrInstructions] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [addressMsg, setAddressMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Orders states
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [reorderLoadingId, setReorderLoadingId] = useState<string | null>(null);

  // Cancel modal states
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load addresses
  const fetchAddresses = async () => {
    if (!token) return;
    try {
      const res = await fetch(apiUrl('/api/addresses'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (err) {
      console.warn('Failed to fetch addresses:', err);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Load orders
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
      console.warn('Failed to fetch orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchOrders();
  }, [token]);

  // Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setIsUpdatingProfile(true);

    const res = await updateProfile(name, phone);
    setIsUpdatingProfile(false);

    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile details saved successfully.' });
    } else {
      setProfileMsg({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
  };

  // Open Address Modal for New or Edit
  const openNewAddressModal = () => {
    setEditingAddressId(null);
    setAddrLabel('Home');
    setAddrHouseFlat('');
    setAddrStreetLocality('');
    setAddrLandmark('');
    setAddrCity('Kurnool');
    setAddrState('Andhra Pradesh');
    setAddrPincode('518002');
    setAddrInstructions('');
    setAddrIsDefault(addresses.length === 0);
    setAddressMsg(null);
    setShowAddressModal(true);
  };

  const openEditAddressModal = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddrLabel(addr.label || 'Home');
    setAddrHouseFlat(addr.house_flat || '');
    setAddrStreetLocality(addr.street_locality || addr.address_line || '');
    setAddrLandmark(addr.landmark || '');
    setAddrCity(addr.city || 'Kurnool');
    setAddrState(addr.state || 'Andhra Pradesh');
    setAddrPincode(addr.pincode || '518002');
    setAddrInstructions(addr.delivery_instructions || '');
    setAddrIsDefault(addr.is_default === 1);
    setAddressMsg(null);
    setShowAddressModal(true);
  };

  // Save Address (Create or Update)
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressMsg(null);

    const payload = {
      label: addrLabel,
      house_flat: addrHouseFlat.trim(),
      street_locality: addrStreetLocality.trim(),
      landmark: addrLandmark.trim(),
      city: addrCity.trim(),
      state: addrState.trim(),
      pincode: addrPincode.trim(),
      delivery_instructions: addrInstructions.trim(),
      is_default: addrIsDefault
    };

    if (!payload.street_locality && !payload.house_flat) {
      setAddressMsg({ type: 'error', text: 'Please provide flat/house number and street details.' });
      return;
    }

    try {
      const url = editingAddressId ? `/api/addresses/${editingAddressId}` : '/api/addresses';
      const method = editingAddressId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setShowAddressModal(false);
        fetchAddresses();
      } else {
        setAddressMsg({ type: 'error', text: data.error || 'Failed to save address.' });
      }
    } catch (err) {
      setAddressMsg({ type: 'error', text: 'Error connecting to address service.' });
    }
  };

  // Set Default Address
  const handleSetDefault = async (addrId: string) => {
    try {
      const res = await fetch(apiUrl(`/api/addresses/${addrId}/default`), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAddresses();
    } catch (err) {
      console.warn('Set default error:', err);
    }
  };

  // Delete Address
  const handleDeleteAddress = async (addrId: string) => {
    if (!window.confirm('Are you sure you wish to remove this saved delivery address?')) return;
    try {
      const res = await fetch(apiUrl(`/api/addresses/${addrId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAddresses();
    } catch (err) {
      console.warn('Delete address error:', err);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch(apiUrl('/api/auth/change-password'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ type: 'success', text: 'Your password was updated securely.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: data.error || 'Failed to change password.' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: 'Server error updating password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Reorder Handler
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
        alert(data.error || 'Could not reorder items.');
      }
    } catch (err) {
      alert('Network error while processing reorder.');
    } finally {
      setReorderLoadingId(null);
    }
  };

  // Cancel Order Handler
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
            <span>Dispatched / Ready</span>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header Card */}
        <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-charcoal-800 border-2 border-gold-500/40 text-gold-400 flex items-center justify-center font-serif text-3xl font-bold shadow-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/30 text-gold-400">
                  {user?.role === 'admin' ? 'Restaurant Manager' : 'Verified Dining Customer'}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 mt-1">
                Welcome, {user?.name || 'Customer'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-cream-300 mt-1.5">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gold-500" />
                  <span>{user?.email}</span>
                </span>
                {user?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gold-500" />
                    <span>+91 {user.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-gold-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Food</span>
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal-800 border border-gold-500/40 text-gold-400 hover:bg-charcoal-750 text-xs font-bold uppercase tracking-wider transition-colors shadow"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Hub</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-charcoal-800 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-gold-500 text-charcoal-950 shadow-md shadow-gold-500/20'
                : 'text-cream-300 hover:text-gold-300 hover:bg-charcoal-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Recent Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'bg-gold-500 text-charcoal-950 shadow-md shadow-gold-500/20'
                : 'text-cream-300 hover:text-gold-300 hover:bg-charcoal-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-gold-500 text-charcoal-950 shadow-md shadow-gold-500/20'
                : 'text-cream-300 hover:text-gold-300 hover:bg-charcoal-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account & Security</span>
          </button>
        </div>

        {/* Tab 1: Recent Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-cream-100">Your Dining Orders</h2>
                <p className="text-xs text-cream-300">Live order status, item details, reordering and receipts</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchOrders}
                  className="p-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700 text-cream-300 hover:text-gold-400 transition-colors"
                  title="Refresh Orders"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <Link
                  to="/my-orders"
                  className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-semibold"
                >
                  <span>View All Orders</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {isLoadingOrders ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-cream-300">Loading order records...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center bg-charcoal-850 border border-charcoal-800 rounded-2xl p-8 space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-cream-100">No Orders Placed Yet</h3>
                <p className="text-xs text-cream-300">
                  You haven't ordered yet. Explore our authentic royal menu and treat yourself to our signature biryanis!
                </p>
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <span>Explore Menu</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => {
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
                      className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 hover:border-gold-500/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal-800">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-gold-400 bg-charcoal-800 px-3 py-1 rounded-lg border border-gold-500/30">
                            #{order.orderId}
                          </span>
                          <span className="text-xs text-cream-400">{dateStr}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-charcoal-800 text-cream-300 border border-charcoal-700">
                            {order.order_type}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-cream-400 mb-2">
                            Dishes Ordered ({order.items.reduce((s, i) => s + i.quantity, 0)})
                          </p>
                          <ul className="space-y-1 text-xs">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="text-cream-200 flex items-center justify-between">
                                <span>
                                  <span className="font-bold text-gold-400">{item.quantity}x</span>{' '}
                                  {item.name}
                                  {item.variantLabel && (
                                    <span className="text-[10px] text-cream-400 ml-1">({item.variantLabel})</span>
                                  )}
                                </span>
                                <span className="font-mono text-cream-300">₹{item.totalPrice}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-charcoal-900 rounded-xl p-3.5 border border-charcoal-800 space-y-1.5 text-xs">
                          {order.delivery_address && (
                            <div className="flex items-start gap-1.5 text-cream-300">
                              <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{order.delivery_address}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-cream-400 pt-1 border-t border-charcoal-800">
                            <span>Payment Method:</span>
                            <span className="font-semibold text-cream-200 uppercase">{order.payment_method}</span>
                          </div>
                          <div className="flex justify-between font-bold text-cream-100 pt-1 text-sm">
                            <span>Total Bill:</span>
                            <span className="text-gold-400 font-mono">₹{order.total}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-charcoal-800 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-cream-400">
                          {order.status === 'confirmed' && (
                            <span className="text-sky-300">Order acknowledged. Kitchen prep begins shortly.</span>
                          )}
                          {order.status === 'preparing' && (
                            <span className="text-amber-300">Freshly cooking in Kurnool royal kitchen.</span>
                          )}
                          {order.status === 'ready' && (
                            <span className="text-indigo-300">Dispatched from restaurant.</span>
                          )}
                          {order.status === 'delivered' && (
                            <span className="text-emerald-300">Delivered successfully. Thank you!</span>
                          )}
                          {order.status === 'cancelled' && (
                            <span className="text-rose-300">Cancelled ({order.cancellation_reason || 'By customer'})</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
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
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-750 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                          >
                            <RotateCcw className={`w-3.5 h-3.5 ${reorderLoadingId === order.orderId ? 'animate-spin' : ''}`} />
                            <span>Reorder</span>
                          </button>
                          <Link
                            to={`/orders/${order.orderId}`}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors shadow"
                          >
                            <span>Live Tracker</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Delivery Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-cream-100">Saved Delivery Addresses</h2>
                <p className="text-xs text-cream-300">Manage residential and work locations for swift Kurnool delivery</p>
              </div>
              <button
                onClick={openNewAddressModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-gold-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {isLoadingAddresses ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-cream-300">Loading saved addresses...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="py-16 text-center bg-charcoal-850 border border-charcoal-800 rounded-2xl p-8 space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-cream-100">No Saved Addresses</h3>
                <p className="text-xs text-cream-300">
                  Save your home, office, or dining address to complete future checkouts in a single click.
                </p>
                <button
                  onClick={openNewAddressModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Address</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => {
                  const fullText = [
                    addr.house_flat,
                    addr.street_locality || addr.address_line,
                    addr.landmark ? `Near ${addr.landmark}` : null,
                    `${addr.city} - ${addr.pincode}`,
                    addr.state
                  ].filter(Boolean).join(', ');

                  return (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-2xl border transition-all space-y-3 relative ${
                        addr.is_default === 1
                          ? 'bg-charcoal-850 border-gold-400 shadow-xl shadow-gold-500/5'
                          : 'bg-charcoal-850/70 border-charcoal-800 hover:border-charcoal-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {addr.label === 'Home' ? (
                            <Home className="w-4 h-4 text-gold-400" />
                          ) : (
                            <Briefcase className="w-4 h-4 text-gold-400" />
                          )}
                          <span className="font-serif font-bold text-cream-100 text-sm">
                            {addr.label}
                          </span>
                          {addr.is_default === 1 && (
                            <span className="px-2 py-0.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 text-[10px] font-bold uppercase tracking-wider">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditAddressModal(addr)}
                            className="p-1.5 rounded-lg text-cream-400 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                            title="Edit Address"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 rounded-lg text-cream-400 hover:text-rose-400 hover:bg-charcoal-800 transition-colors"
                            title="Delete Address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-cream-200 leading-relaxed">
                        {fullText}
                      </p>

                      {addr.delivery_instructions && (
                        <p className="text-[11px] text-cream-400 italic bg-charcoal-900 p-2 rounded-lg border border-charcoal-800">
                          Note: "{addr.delivery_instructions}"
                        </p>
                      )}

                      {addr.is_default !== 1 && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-xs text-gold-400 hover:text-gold-300 font-semibold pt-1 block"
                        >
                          Make this default address
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Account & Security */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Personal Profile Form */}
            <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-gold-400" />
                  <span>Personal Profile</span>
                </h3>
                <p className="text-xs text-cream-300 mt-1">
                  Manage your display name and mobile number for deliveries
                </p>
              </div>

              {profileMsg && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  profileMsg.type === 'success' 
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                }`}>
                  {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                    Email Address (Registered)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950/70 border border-charcoal-800 text-cream-400 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                    Mobile Number (Indian 10-digit)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gold-400" />
                  <span>Update Password</span>
                </h3>
                <p className="text-xs text-cream-300 mt-1">
                  Change your secure account password using scrypt hashing
                </p>
              </div>

              {passwordMsg && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  passwordMsg.type === 'success' 
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                }`}>
                  {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                    New Password (Min. 6 chars)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-750 border border-gold-500/40 text-gold-400 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {isChangingPassword ? 'Updating Password...' : 'Change Password'}
                </button>
              </form>
            </div>

          </div>
        )}

        {/* Address Modal (Add / Edit) */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-charcoal-850 border border-gold-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-charcoal-750">
                <h3 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold-400" />
                  <span>{editingAddressId ? 'Edit Delivery Address' : 'Add Delivery Address'}</span>
                </h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-cream-400 hover:text-cream-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {addressMsg && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  addressMsg.type === 'success' 
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addressMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Address Label
                  </label>
                  <div className="flex gap-2">
                    {['Home', 'Work', 'Other'].map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setAddrLabel(lbl)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          addrLabel === lbl
                            ? 'bg-gold-500 text-charcoal-950 border-gold-400 font-bold'
                            : 'bg-charcoal-900 border-charcoal-700 text-cream-300 hover:border-charcoal-600'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Flat / House No. / Building *
                  </label>
                  <input
                    type="text"
                    value={addrHouseFlat}
                    onChange={(e) => setAddrHouseFlat(e.target.value)}
                    required
                    placeholder="e.g. Flat 302, Sai Residency"
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Street / Locality / Area *
                  </label>
                  <input
                    type="text"
                    value={addrStreetLocality}
                    onChange={(e) => setAddrStreetLocality(e.target.value)}
                    required
                    placeholder="e.g. 18, Khadakpura Street, Khadak Pura"
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={addrLandmark}
                      onChange={(e) => setAddrLandmark(e.target.value)}
                      placeholder="e.g. Near Clock Tower"
                      className="w-full px-3 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      required
                      placeholder="518001"
                      className="w-full px-3 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={addrInstructions}
                    onChange={(e) => setAddrInstructions(e.target.value)}
                    placeholder="e.g. Ring doorbell, leave at gate, call before reaching"
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-cream-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                    className="rounded border-charcoal-700 text-gold-500 focus:ring-gold-400 bg-charcoal-900"
                  />
                  <span>Set as my default delivery address</span>
                </label>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-charcoal-800 text-cream-300 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-750 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-gold-500/20"
                  >
                    {editingAddressId ? 'Save Changes' : 'Add Address'}
                  </button>
                </div>
              </form>
            </div>
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
                  placeholder="e.g. Changed mind, placed duplicate order, etc."
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
export default AccountPage;

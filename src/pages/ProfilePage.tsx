import { apiUrl } from '../config/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
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
  Briefcase
} from 'lucide-react';

interface Address {
  id: string;
  label: string;
  address_line: string;
  city: string;
  pincode: string;
  landmark?: string;
  is_default: number;
}

export const ProfilePage: React.FC = () => {
  const { user, token, updateProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPincode, setNewPincode] = useState('518002');
  const [newIsDefault, setNewIsDefault] = useState(false);
  const [addressMsg, setAddressMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!token) return;
    try {
      const res = await fetch(apiUrl('/api/addresses'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.warn('Failed to load addresses:', err);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setIsUpdatingProfile(true);

    const res = await updateProfile(name, phone);
    setIsUpdatingProfile(false);

    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile details updated successfully!' });
    } else {
      setProfileMsg({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
  };

  // Handle Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressMsg(null);

    if (!newAddressLine.trim() || newAddressLine.trim().length < 5) {
      setAddressMsg({ type: 'error', text: 'Please enter a complete address (minimum 5 characters).' });
      return;
    }

    try {
      const res = await fetch(apiUrl('/api/addresses'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          label: newLabel,
          address_line: newAddressLine.trim(),
          city: 'Kurnool',
          pincode: newPincode.trim(),
          landmark: newLandmark.trim(),
          is_default: newIsDefault
        })
      });

      const data = await res.json();
      if (res.ok) {
        setAddressMsg({ type: 'success', text: 'Delivery address saved!' });
        setShowAddAddress(false);
        setNewAddressLine('');
        setNewLandmark('');
        fetchAddresses();
      } else {
        setAddressMsg({ type: 'error', text: data.error || 'Failed to save address.' });
      }
    } catch (err) {
      setAddressMsg({ type: 'error', text: 'Server error saving address.' });
    }
  };

  // Handle Set Default Address
  const handleSetDefault = async (addrId: string) => {
    try {
      const res = await fetch(apiUrl(`/api/addresses/${addrId}/default`), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAddresses();
      }
    } catch (err) {
      console.warn('Set default error:', err);
    }
  };

  // Handle Delete Address
  const handleDeleteAddress = async (addrId: string) => {
    if (!window.confirm('Are you sure you want to delete this saved address?')) return;
    try {
      const res = await fetch(apiUrl(`/api/addresses/${addrId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAddresses();
      }
    } catch (err) {
      console.warn('Delete address error:', err);
    }
  };

  // Handle Password Change
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
        setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: data.error || 'Password update failed.' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: 'Server error while updating password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-charcoal-900 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-charcoal-800 border-2 border-gold-500/40 text-gold-400 flex items-center justify-center font-serif text-2xl font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100">
                {user?.name}
              </h1>
              <p className="text-xs text-cream-300 flex items-center gap-2 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-gold-500" />
                <span>{user?.email}</span>
                <span className="w-1 h-1 rounded-full bg-charcoal-600" />
                <span className="text-gold-400 font-semibold uppercase tracking-wider text-[10px]">
                  {user?.role === 'admin' ? 'Restaurant Manager' : 'Verified Customer'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal-800 border border-gold-500/30 text-gold-400 hover:bg-charcoal-750 text-xs font-bold uppercase tracking-wider transition-colors shadow"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>My Orders</span>
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Details & Password */}
          <div className="space-y-8">
            {/* Contact Details Card */}
            <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 shadow-xl space-y-5">
              <h2 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2">
                <User className="w-4 h-4 text-gold-400" />
                <span>Personal Information</span>
              </h2>

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
                    className="w-full px-3.5 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-charcoal-950/70 border border-charcoal-800 text-cream-400 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full px-3.5 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 shadow-xl space-y-5">
              <h2 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gold-400" />
                <span>Security & Password</span>
              </h2>

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
                    className="w-full px-3.5 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-750 border border-gold-500/30 text-gold-400 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column (2 cols): Saved Delivery Addresses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-charcoal-750">
                <div>
                  <h2 className="font-serif text-xl font-bold text-cream-100 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gold-400" />
                    <span>Saved Delivery Addresses</span>
                  </h2>
                  <p className="text-xs text-cream-300 mt-0.5">
                    Your saved delivery locations in Kurnool for 1-click checkout
                  </p>
                </div>

                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {addressMsg && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  addressMsg.type === 'success' 
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                }`}>
                  {addressMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{addressMsg.text}</span>
                </div>
              )}

              {/* Add Address Form Accordion */}
              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="p-5 rounded-xl bg-charcoal-900 border border-gold-500/30 space-y-4 animate-fadeIn">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400">
                    Add New Kurnool Delivery Address
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-cream-300 mb-1">
                        Location Label
                      </label>
                      <select
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work / Office</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase text-cream-300 mb-1">
                        Landmark / Area (Optional)
                      </label>
                      <input
                        type="text"
                        value={newLandmark}
                        onChange={(e) => setNewLandmark(e.target.value)}
                        placeholder="Near Birla Mandir / Collector Office"
                        className="w-full px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                      >
                      </input>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-cream-300 mb-1">
                      Street Address & Door Number
                    </label>
                    <textarea
                      value={newAddressLine}
                      onChange={(e) => setNewAddressLine(e.target.value)}
                      rows={2}
                      placeholder="Door No, Street Name, Colony / Apartment Name, Kurnool"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs text-cream-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newIsDefault}
                        onChange={(e) => setNewIsDefault(e.target.checked)}
                        className="rounded border-charcoal-700 text-gold-500 focus:ring-0"
                      />
                      <span>Make this my default delivery address</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-3 py-1.5 rounded-lg bg-charcoal-800 text-cream-300 text-xs hover:bg-charcoal-750"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-gold-500 text-charcoal-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Addresses List */}
              {isLoadingAddresses ? (
                <div className="py-12 text-center text-cream-400 text-sm">
                  Loading saved addresses...
                </div>
              ) : addresses.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-charcoal-750 rounded-xl space-y-3">
                  <MapPin className="w-8 h-8 text-cream-400 mx-auto" />
                  <p className="text-sm text-cream-300">You don't have any saved addresses yet.</p>
                  <p className="text-xs text-cream-400">Add an address now to save time on your next order!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-xl border transition-all ${
                        addr.is_default === 1
                          ? 'bg-charcoal-800/90 border-gold-500/50 shadow-md ring-1 ring-gold-500/20'
                          : 'bg-charcoal-900 border-charcoal-750 hover:border-charcoal-650'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {addr.label === 'Home' ? (
                            <Home className="w-4 h-4 text-gold-400" />
                          ) : (
                            <Briefcase className="w-4 h-4 text-gold-400" />
                          )}
                          <span className="font-serif font-bold text-sm text-cream-100">
                            {addr.label}
                          </span>
                        </div>

                        {addr.is_default === 1 ? (
                          <span className="px-2 py-0.5 rounded-md bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] font-bold uppercase tracking-wider">
                            Default
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefault(addr.id)}
                            className="text-[11px] text-cream-400 hover:text-gold-400 underline underline-offset-2"
                          >
                            Set Default
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-cream-200 leading-relaxed mb-3">
                        {addr.address_line}
                        {addr.landmark && <span className="block text-cream-400 text-[11px]">Near: {addr.landmark}</span>}
                        <span className="block text-cream-400 text-[11px]">{addr.city} - {addr.pincode}</span>
                      </p>

                      <div className="pt-2 border-t border-charcoal-750/60 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

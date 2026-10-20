import { apiUrl } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings, 
  Clock, 
  Truck, 
  ShoppingBag, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ShieldCheck, 
  QrCode, 
  Phone, 
  Mail, 
  MapPin, 
  Percent,
  Power
} from 'lucide-react';

interface RestaurantSettingsData {
  id: number;
  restaurant_name: string;
  is_open: number;
  opening_time: string;
  closing_time: string;
  delivery_enabled: number;
  pickup_enabled: number;
  delivery_fee: number;
  free_delivery_threshold: number;
  packaging_fee: number;
  tax_percentage: number;
  min_order_value: number;
  cancellation_window_mins: number;
  upi_id: string;
  upi_qr_url: string;
  razorpay_key_id?: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  updated_at?: string;
}

export const AdminSettingsPage: React.FC = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState<RestaurantSettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [isOpen, setIsOpen] = useState(true);
  const [openingTime, setOpeningTime] = useState('11:00 AM');
  const [closingTime, setClosingTime] = useState('11:00 PM');
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [pickupEnabled, setPickupEnabled] = useState(true);

  const [deliveryFee, setDeliveryFee] = useState(30);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(500);
  const [packagingFee, setPackagingFee] = useState(15);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [minOrderValue, setMinOrderValue] = useState(100);
  const [cancellationWindowMins, setCancellationWindowMins] = useState(5);

  const [upiId, setUpiId] = useState('finedineknl@upi');
  const [upiQrUrl, setUpiQrUrl] = useState('/images/upi-qr-placeholder.png');
  const [contactPhone, setContactPhone] = useState('9876543210');
  const [contactEmail, setContactEmail] = useState('support@finedineknl.com');
  const [address, setAddress] = useState('18, Khadakpura Street, Khadak Pura, Kurnool, Andhra Pradesh 518001');

  const fetchSettings = async () => {
    if (!token) return;
    try {
      const res = await fetch(apiUrl('/api/admin/settings'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const s: RestaurantSettingsData = data.settings;
        setSettings(s);
        setIsOpen(s.is_open === 1);
        setOpeningTime(s.opening_time || '11:00 AM');
        setClosingTime(s.closing_time || '11:00 PM');
        setDeliveryEnabled(s.delivery_enabled === 1);
        setPickupEnabled(s.pickup_enabled === 1);
        setDeliveryFee(s.delivery_fee || 30);
        setFreeDeliveryThreshold(s.free_delivery_threshold || 500);
        setPackagingFee(s.packaging_fee || 15);
        setTaxPercentage(s.tax_percentage || 0);
        setMinOrderValue(s.min_order_value || 100);
        setCancellationWindowMins(s.cancellation_window_mins || 5);
        setUpiId(s.upi_id || 'finedineknl@upi');
        setUpiQrUrl(s.upi_qr_url || '/images/upi-qr-placeholder.png');
        setContactPhone(s.contact_phone || '9876543210');
        setContactEmail(s.contact_email || 'support@finedineknl.com');
        setAddress(s.address || '18, Khadakpura Street, Khadak Pura, Kurnool, Andhra Pradesh 518001');
      }
    } catch (err) {
      console.warn('Error fetching settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMsg(null);
    setIsSaving(true);

    const payload = {
      is_open: isOpen ? 1 : 0,
      opening_time: openingTime,
      closing_time: closingTime,
      delivery_enabled: deliveryEnabled ? 1 : 0,
      pickup_enabled: pickupEnabled ? 1 : 0,
      delivery_fee: Number(deliveryFee),
      free_delivery_threshold: Number(freeDeliveryThreshold),
      packaging_fee: Number(packagingFee),
      tax_percentage: Number(taxPercentage),
      min_order_value: Number(minOrderValue),
      cancellation_window_mins: Number(cancellationWindowMins),
      upi_id: upiId.trim(),
      upi_qr_url: upiQrUrl.trim(),
      contact_phone: contactPhone.trim(),
      contact_email: contactEmail.trim(),
      address: address.trim()
    };

    try {
      const res = await fetch(apiUrl('/api/admin/settings'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setAlertMsg({ type: 'success', text: 'Restaurant operations settings updated successfully!' });
        fetchSettings();
      } else {
        setAlertMsg({ type: 'error', text: data.error || 'Failed to update settings.' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Network error connecting to management API.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-800 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-cream-100 flex items-center gap-3">
              <Settings className="w-8 h-8 text-gold-400" />
              <span>Restaurant Operations Settings</span>
            </h1>
            <p className="text-sm text-cream-300 mt-1">
              Configure daily business hours, delivery thresholds, packaging fees, cancellation policy, and payment details
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isOpen
                ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                : 'bg-rose-950/80 border border-rose-500/40 text-rose-400'
            }`}>
              <Power className="w-3.5 h-3.5" />
              <span>{isOpen ? 'Store Accepting Orders' : 'Store Paused / Closed'}</span>
            </span>
          </div>
        </div>

        {alertMsg && (
          <div className={`p-4 rounded-2xl text-sm flex items-center gap-3 ${
            alertMsg.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
          }`}>
            {alertMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span className="font-medium">{alertMsg.text}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-cream-300">Loading current restaurant settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* 1. Operating Hours & Acceptance */}
            <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
              <h2 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-400" />
                <span>Operating Hours & Store Status</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase text-cream-300">
                    Online Ordering Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider border transition-colors flex items-center justify-center gap-2 ${
                      isOpen
                        ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                        : 'bg-rose-900/40 border-rose-500/50 text-rose-300 hover:bg-rose-900/60'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    <span>{isOpen ? 'Open (Accepting Orders)' : 'Closed (Orders Blocked)'}</span>
                  </button>
                  <p className="text-[11px] text-cream-400">
                    When closed, customer checkout shows a friendly notice.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Opening Time
                  </label>
                  <input
                    type="text"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    placeholder="e.g. 11:00 AM"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Closing Time
                  </label>
                  <input
                    type="text"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    placeholder="e.g. 11:00 PM"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-750 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliveryEnabled}
                    onChange={(e) => setDeliveryEnabled(e.target.checked)}
                    className="rounded border-charcoal-700 text-gold-500 focus:ring-gold-400 bg-charcoal-950 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-cream-100 block">Enable Home Delivery</span>
                    <span className="text-[11px] text-cream-400">Allow customers to choose door delivery in Kurnool</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-750 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pickupEnabled}
                    onChange={(e) => setPickupEnabled(e.target.checked)}
                    className="rounded border-charcoal-700 text-gold-500 focus:ring-gold-400 bg-charcoal-950 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-cream-100 block">Enable Takeaway / Pickup</span>
                    <span className="text-[11px] text-cream-400">Allow customers to pick up orders directly from counter</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Fees, Thresholds & Policy Rules */}
            <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
              <h2 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-gold-400" />
                <span>Pricing Rules, Delivery Fees & Policy Thresholds</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Standard Delivery Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Free Delivery Minimum Order (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={freeDeliveryThreshold}
                    onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                  <p className="text-[10px] text-cream-400 mt-1">Orders above this get free delivery.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Packaging Fee per Order (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={packagingFee}
                    onChange={(e) => setPackagingFee(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Minimum Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Tax / GST Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="28"
                    value={taxPercentage}
                    onChange={(e) => setTaxPercentage(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                  <p className="text-[10px] text-cream-400 mt-1">Set to 0 if menu items are GST inclusive.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Customer Cancellation Window (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={cancellationWindowMins}
                    onChange={(e) => setCancellationWindowMins(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                  <p className="text-[10px] text-cream-400 mt-1">Orders can be self-cancelled before kitchen prep.</p>
                </div>
              </div>
            </div>

            {/* 3. UPI QR & Payment Gateways */}
            <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
              <h2 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-gold-400" />
                <span>UPI Payment & Gateway Configuration</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Restaurant Official UPI VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. finedineknl@okaxis"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400 font-mono"
                  />
                  <p className="text-[11px] text-cream-400 mt-1">
                    Used to generate direct customer payment links and QR display.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    UPI QR Code Image Asset URL
                  </label>
                  <input
                    type="text"
                    value={upiQrUrl}
                    onChange={(e) => setUpiQrUrl(e.target.value)}
                    placeholder="/images/upi-qr-placeholder.png"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              {/* Informational callout regarding online payment gateway */}
              <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-750 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-cream-200">
                    Payment Gateway Integration Status
                  </p>
                  <p className="text-cream-400">
                    Live Cash on Delivery (COD), UPI QR scan, and Counter Payments are actively enabled. Credit/Debit card gateway is kept securely in offline notice mode until the restaurant provides merchant credentials.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Contact & Address Info */}
            <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
              <h2 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-400" />
                <span>Contact Details & Physical Location</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Customer Support Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Customer Support Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-cream-300 mb-1">
                    Restaurant Physical Address (Kurnool)
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-gold-500/20 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Saving Settings...' : 'Save Restaurant Settings'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </AdminLayout>
  );
};
export default AdminSettingsPage;

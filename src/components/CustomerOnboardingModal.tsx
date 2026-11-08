import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, User, Mail, Compass, Check, AlertCircle, Home, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

export interface CustomerProfileData {
  name: string;
  phone: string;
  email?: string;
  houseFlat: string;
  streetLocality: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  deliveryInstructions?: string;
  fullAddressString: string;
}

interface CustomerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: CustomerProfileData) => void;
  initialData?: Partial<CustomerProfileData>;
}

export const CustomerOnboardingModal: React.FC<CustomerOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialData
}) => {
  const { user, token } = useAuth();

  const [name, setName] = useState(initialData?.name || user?.name || '');
  const [phone, setPhone] = useState(initialData?.phone || user?.phone || '');
  const [email, setEmail] = useState(initialData?.email || user?.email || '');
  const [houseFlat, setHouseFlat] = useState(initialData?.houseFlat || '');
  const [streetLocality, setStreetLocality] = useState(initialData?.streetLocality || '');
  const [landmark, setLandmark] = useState(initialData?.landmark || '');
  const [city, setCity] = useState(initialData?.city || 'Kurnool');
  const [state, setState] = useState(initialData?.state || 'Andhra Pradesh');
  const [pincode, setPincode] = useState(initialData?.pincode || '518003');
  const [deliveryInstructions, setDeliveryInstructions] = useState(initialData?.deliveryInstructions || '');

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [geoStatusMessage, setGeoStatusMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!phone && user.phone) setPhone(user.phone);
      if (!email && user.email) setEmail(user.email);
    }
  }, [user]);

  if (!isOpen) return null;

  const validatePhone = (p: string) => {
    const cleaned = p.replace(/[\s\-\(\)\+]/g, '');
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return /^[6-9]\d{9}$/.test(cleaned.slice(2));
    }
    if (cleaned.length === 10) {
      return /^[6-9]\d{9}$/.test(cleaned);
    }
    return false;
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatusMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    setGeoStatusMessage('Detecting your GPS location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGeoStatusMessage(`Location detected (Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}). Please confirm address details below.`);
        setIsDetectingLocation(false);
        if (!city) setCity('Kurnool');
        if (!streetLocality) setStreetLocality('Kurnool Central Area');
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setGeoStatusMessage('Location permission denied or unavailable. Please type address manually.');
        setIsDetectingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!validatePhone(phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    if (!houseFlat.trim()) {
      setErrorMsg('Please enter your house or flat number.');
      return;
    }

    if (!streetLocality.trim()) {
      setErrorMsg('Please enter your street or locality name.');
      return;
    }

    if (!pincode.trim() || !/^\d{6}$/.test(pincode.trim())) {
      setErrorMsg('Please enter a valid 6-digit Kurnool PIN code (e.g. 518001, 518002, 518003).');
      return;
    }

    const fullAddress = `${houseFlat.trim()}, ${streetLocality.trim()}${landmark ? `, Near: ${landmark.trim()}` : ''}, ${city}, ${state} - ${pincode}`;

    const profileData: CustomerProfileData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      houseFlat: houseFlat.trim(),
      streetLocality: streetLocality.trim(),
      landmark: landmark.trim() || undefined,
      city,
      state,
      pincode: pincode.trim(),
      deliveryInstructions: deliveryInstructions.trim() || undefined,
      fullAddressString: fullAddress
    };

    // If customer is authenticated, also save address to backend database
    if (token) {
      try {
        await fetch(apiUrl('/api/addresses'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            label: 'Home',
            house_flat: houseFlat.trim(),
            street_locality: streetLocality.trim(),
            landmark: landmark.trim() || undefined,
            city,
            state,
            pincode: pincode.trim(),
            delivery_instructions: deliveryInstructions.trim() || undefined,
            is_default: true
          })
        });
      } catch (saveErr) {
        console.warn('Could not save address to account:', saveErr);
      }
    }

    onComplete(profileData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-charcoal-900 border border-gold-500/40 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        {/* Header */}
        <div className="p-6 border-b border-charcoal-800 bg-charcoal-950/90 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Delivery Details · Kurnool</span>
            </div>
            <h2 id="onboarding-title" className="font-serif text-2xl font-bold text-cream-100">
              Customer Onboarding & Address
            </h2>
            <p className="text-xs text-cream-300 font-light mt-0.5">
              Confirm your contact & delivery details for hot doorstep fulfillment.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700 text-cream-300 hover:text-gold-400 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* GPS Location Button */}
          <div className="p-3.5 rounded-2xl bg-charcoal-950 border border-charcoal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-cream-100 block">Deliver to current location?</span>
              <span className="text-[11px] text-cream-400 block font-light">
                {geoStatusMessage || 'Use GPS to auto-detect your delivery locality'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-gold-500/30 text-gold-400 text-xs font-semibold transition-colors shrink-0 disabled:opacity-50"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isDetectingLocation ? 'Detecting...' : 'Detect My Location'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label htmlFor="customerNameInput" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                Full Name <span className="text-gold-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="customerNameInput"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 text-xs focus:outline-none focus:border-gold-500/60 transition-colors"
                />
              </div>
            </div>

            {/* Indian Phone Number */}
            <div className="space-y-1">
              <label htmlFor="customerPhoneInput" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                Mobile Number (+91) <span className="text-gold-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="customerPhoneInput"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 98480 12345"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 text-xs focus:outline-none focus:border-gold-500/60 transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="customerEmailInput" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                Email Address (For e-receipt & tracking updates)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="customerEmailInput"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ramesh@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 text-xs focus:outline-none focus:border-gold-500/60 transition-colors"
                />
              </div>
            </div>

            {/* Flat / House Number */}
            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="houseFlatInput" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                House / Flat / Block / Floor <span className="text-gold-400">*</span>
              </label>
              <input
                id="houseFlatInput"
                type="text"
                required
                value={houseFlat}
                onChange={(e) => setHouseFlat(e.target.value)}
                placeholder="e.g. Flat 302, Sai Residency"
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 text-xs focus:outline-none focus:border-gold-500/60 transition-colors"
              />
            </div>

            {/* Street / Locality */}
            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="streetLocalityInput" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                Street / Area / Locality <span className="text-gold-400">*</span>
              </label>
              <input
                id="streetLocalityInput"
                type="text"
                required
                value={streetLocality}
                onChange={(e) => setStreetLocality(e.target.value)}
                placeholder="e.g. Venkata Ramana Colony, Ameen Abbas Nagar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 text-xs focus:outline-none focus:border-gold-500/60 transition-colors"
              />
            </div>

            {/* Landmark */}
            <div className="space-y-1">
              <label htmlFor="landmarkInput" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                Nearby Landmark (Optional)
              </label>
              <input
                id="landmarkInput"
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Above Vishal Mart, Near Park"
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 text-xs focus:outline-none focus:border-gold-500/60 transition-colors"
              />
            </div>

            {/* PIN Code */}
            <div className="space-y-1">
              <label htmlFor="pincodeInput" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                Kurnool PIN Code <span className="text-gold-400">*</span>
              </label>
              <input
                id="pincodeInput"
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="518003"
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 text-xs focus:outline-none focus:border-gold-500/60 transition-colors font-mono"
              />
            </div>

            {/* Delivery Instructions */}
            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="deliveryInstructionsInput" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                Delivery Instructions (Optional)
              </label>
              <input
                id="deliveryInstructionsInput"
                type="text"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="e.g. Ring bell twice, leave with security, call upon reaching building gate"
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-750 text-cream-100 text-xs focus:outline-none focus:border-gold-500/60 transition-colors"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-charcoal-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-cream-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold-500/20 btn-press"
            >
              <Check className="w-4 h-4" />
              <span>Save & Proceed to Order</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  UserPlus, 
  AlertCircle, 
  ArrowRight, 
  MapPin, 
  Home, 
  Check, 
  ShieldCheck 
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  // Personal Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Address Fields
  const [includeAddress, setIncludeAddress] = useState(true);
  const [houseFlat, setHouseFlat] = useState('');
  const [streetLocality, setStreetLocality] = useState('');
  const [city, setCity] = useState('Kurnool');
  const [state, setState] = useState('Andhra Pradesh');
  const [pincode, setPincode] = useState('518002');
  const [landmark, setLandmark] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Consent & State
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password strength evaluation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-charcoal-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score, label: 'Weak (min 6 chars)', color: 'bg-rose-500' };
      case 2:
        return { score, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score, label: 'Good', color: 'bg-sky-400' };
      case 4:
        return { score, label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { score: 0, label: '', color: 'bg-charcoal-700' };
    }
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (name.trim().length < 2) {
      setErrorMsg('Please enter your full name (minimum 2 characters).');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Please review and accept the restaurant terms and ordering policy.');
      return;
    }

    // Address validation if included
    let addressData = undefined;
    if (includeAddress && (houseFlat || streetLocality)) {
      const cleanPin = pincode.replace(/\D/g, '');
      if (cleanPin.length !== 6) {
        setErrorMsg('Please enter a valid 6-digit Kurnool PIN code (e.g. 518001 or 518002).');
        return;
      }

      addressData = {
        houseFlat: houseFlat.trim(),
        streetLocality: streetLocality.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: cleanPin,
        landmark: landmark.trim() || undefined,
        deliveryInstructions: deliveryInstructions.trim() || undefined,
      };
    }

    setIsLoading(true);
    const res = await register(name.trim(), email.trim(), password, cleanPhone, addressData);
    setIsLoading(false);

    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMsg(res.error || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-charcoal-900 flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        <div className="bg-charcoal-850 border border-gold-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-full border border-gold-500/40 bg-charcoal-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <span className="text-gold-400 font-serif font-bold text-xl">KNL</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 tracking-wide">
              Create Customer Account
            </h1>
            <p className="text-xs text-cream-300 mt-1 max-w-sm mx-auto">
              Register for verified Kurnool dining, live order updates, saved addresses, and express checkout.
            </p>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Section 1: Customer Contact Info */}
            <div className="space-y-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gold-400 border-b border-charcoal-750 pb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>1. Personal & Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Reddy"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                    Mobile Number * (10 Digits)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                    Password * (min 6 chars)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-gold-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-cream-100 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Password strength */}
              {password && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-cream-400">
                    <span>Password Strength:</span>
                    <span className="font-semibold">{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-charcoal-750 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Delivery Address (Optional / Recommended) */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between border-b border-charcoal-750 pb-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5" />
                  <span>2. Primary Delivery Address (Optional)</span>
                </h2>
                <label className="flex items-center gap-1.5 text-xs text-cream-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAddress}
                    onChange={(e) => setIncludeAddress(e.target.checked)}
                    className="rounded border-charcoal-700 text-gold-500 focus:ring-0"
                  />
                  <span>Save now</span>
                </label>
              </div>

              {includeAddress && (
                <div className="space-y-3 p-4 rounded-xl bg-charcoal-900/70 border border-charcoal-750">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-cream-300 mb-1">
                        House / Flat / Door Number
                      </label>
                      <input
                        type="text"
                        value={houseFlat}
                        onChange={(e) => setHouseFlat(e.target.value)}
                        placeholder="e.g. Flat 302, Sai Residency"
                        className="w-full px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-cream-300 mb-1">
                        Street / Locality / Colony
                      </label>
                      <input
                        type="text"
                        value={streetLocality}
                        onChange={(e) => setStreetLocality(e.target.value)}
                        placeholder="e.g. Birla Mandir Road, B-Camp"
                        className="w-full px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-cream-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-cream-300 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-cream-300 mb-1">
                        PIN Code (6 digits)
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        maxLength={6}
                        placeholder="518002"
                        className="w-full px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-cream-300 mb-1">
                        Nearby Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Near Collectorate / Rythu Bazaar"
                        className="w-full px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-cream-300 mb-1">
                        Delivery Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        placeholder="Ring bell twice / Call upon arrival"
                        className="w-full px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms Consent */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-cream-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-charcoal-700 text-gold-500 focus:ring-0"
                />
                <span className="leading-relaxed">
                  I agree to FINE DINE KNL's{' '}
                  <Link to="/terms" target="_blank" className="text-gold-400 underline">Terms of Dining</Link>{' '}
                  and{' '}
                  <Link to="/privacy" target="_blank" className="text-gold-400 underline">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-gold-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Complete Account Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-5 border-t border-charcoal-750 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-300 gap-2">
            <div>
              Already have an account?{' '}
              <Link
                to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
                className="text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-4 ml-1"
              >
                Sign In
              </Link>
            </div>

            <Link
              to="/forgot-password"
              className="text-cream-400 hover:text-gold-400 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  MessageSquare, 
  PhoneCall, 
  Send, 
  Share2,
  CalendarPlus,
  Utensils
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiUrl } from '../config/api';
import { AJWA_RESTAURANT_INFO } from '../data/ajwaData';
import { Button3D } from './Button3D';

interface ReservationConfirmation {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  seatingPreference: string;
  specialRequests?: string;
}

export const TableReservationSection: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    reservationDate: '',
    reservationTime: '07:30 PM',
    guests: 4,
    seatingPreference: 'standard',
    specialRequests: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ReservationConfirmation | null>(null);

  // Today in YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  const timeSlots = [
    // Lunch Slots
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM',
    // Dinner Slots
    '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM'
  ];

  const validateIndianPhone = (phone: string) => {
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return /^[6-9]\d{9}$/.test(cleaned.slice(2));
    }
    if (cleaned.length === 10) {
      return /^[6-9]\d{9}$/.test(cleaned);
    }
    if (/^08518\d{6}$/.test(cleaned)) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Client-side Validations
    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!validateIndianPhone(formData.customerPhone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    if (!formData.reservationDate) {
      setErrorMsg('Please select a reservation date.');
      return;
    }

    if (formData.reservationDate < todayStr) {
      setErrorMsg('Reservation date cannot be in the past.');
      return;
    }

    if (!formData.reservationTime) {
      setErrorMsg('Please select a dining time slot.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(apiUrl('/api/reservations'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          customerPhone: formData.customerPhone.trim(),
          customerEmail: formData.customerEmail.trim() || undefined,
          reservationDate: formData.reservationDate,
          reservationTime: formData.reservationTime,
          guests: Number(formData.guests),
          seatingPreference: formData.seatingPreference,
          specialRequests: formData.specialRequests.trim() || undefined
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete reservation. Please try again or call us.');
      }

      // Success! Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#E6CA65', '#FFF', '#10B981']
        });
      } catch {
        // Confetti non-critical
      }

      setConfirmedBooking(data.booking);
    } catch (err: any) {
      console.error('Reservation submit error:', err);
      setErrorMsg(err.message || 'Unable to connect to reservation service. Please call 085182 53599.');
    } finally {
      setIsLoading(false);
    }
  };

  const seatingNames: Record<string, string> = {
    standard: 'Main Dining Hall',
    outdoor_terrace: 'Outdoor Terrace (3rd Floor)',
    private_dining: 'Private Dining Salon'
  };

  const handleShareWhatsApp = (booking: ReservationConfirmation) => {
    const text = `Hello! I have confirmed a table reservation at Ajwa Exotica, Kurnool.%0A%0A*Booking Code:* ${booking.bookingCode}%0A*Name:* ${booking.customerName}%0A*Date:* ${booking.reservationDate}%0A*Time:* ${booking.reservationTime}%0A*Guests:* ${booking.guests} Guests%0A*Seating:* ${seatingNames[booking.seatingPreference] || 'Main Hall'}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <section id="reservation" className="py-24 bg-charcoal-950 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs uppercase tracking-widest font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Table Reservation</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-100 tracking-tight">
            Reserve Your Experience
          </h2>
          <p className="mt-4 text-sm sm:text-base text-cream-300 font-light leading-relaxed">
            Join us for an unforgettable evening of multicuisine dining at Ajwa Exotica. Reserve your family table, private salon, or open terrace.
          </p>
        </div>

        {/* Content Box */}
        <div className="max-w-4xl mx-auto bg-charcoal-900 border border-gold-500/30 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative">
          
          {confirmedBooking ? (
            /* CONFIRMED BOOKING VIEW */
            <div className="text-center py-6 sm:py-8 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                  Reservation Confirmed & Persisted
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100">
                  We look forward to hosting you, {confirmedBooking.customerName}!
                </h3>
                <p className="text-xs sm:text-sm text-cream-300 max-w-lg mx-auto">
                  Your table has been reserved in our system. Please present your booking confirmation code upon arrival.
                </p>
              </div>

              {/* Booking Pass Card */}
              <div className="max-w-md mx-auto bg-charcoal-950 border border-gold-500/40 rounded-2xl p-6 text-left space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
                  <span className="text-[11px] uppercase tracking-wider text-cream-400 font-medium">
                    Booking Code
                  </span>
                  <span className="font-mono text-base font-bold text-gold-400 tracking-wider">
                    {confirmedBooking.bookingCode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-cream-400 block mb-0.5">Date</span>
                    <span className="font-semibold text-cream-100 font-serif text-sm">
                      {confirmedBooking.reservationDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-cream-400 block mb-0.5">Time Slot</span>
                    <span className="font-semibold text-cream-100 font-serif text-sm">
                      {confirmedBooking.reservationTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-cream-400 block mb-0.5">Party Size</span>
                    <span className="font-semibold text-cream-100">
                      {confirmedBooking.guests} Guests
                    </span>
                  </div>
                  <div>
                    <span className="text-cream-400 block mb-0.5">Seating Preference</span>
                    <span className="font-semibold text-gold-400">
                      {seatingNames[confirmedBooking.seatingPreference] || 'Main Hall'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-charcoal-800 text-[11px] text-cream-400">
                  <span>📍 Ajwa Exotica · 3rd Floor, above Vishal Mart, Venkata Ramana Colony, Ameen Abbas Nagar, Kurnool</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Button3D
                  variant="emerald"
                  size="sm"
                  onClick={() => handleShareWhatsApp(confirmedBooking)}
                  icon={<Share2 className="w-3.5 h-3.5" />}
                >
                  Share on WhatsApp
                </Button3D>

                <a
                  href={`tel:${AJWA_RESTAURANT_INFO.phone}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-cream-200 border border-charcoal-750 text-xs font-semibold transition-colors shadow-md active:translate-y-0.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-gold-400" />
                  <span>Call 085182 53599</span>
                </a>

                <Button3D
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    setConfirmedBooking(null);
                    setFormData({
                      customerName: '',
                      customerPhone: '',
                      customerEmail: '',
                      reservationDate: '',
                      reservationTime: '07:30 PM',
                      guests: 4,
                      seatingPreference: 'standard',
                      specialRequests: ''
                    });
                  }}
                >
                  Book Another Table
                </Button3D>
              </div>

            </div>
          ) : (
            /* RESERVATION FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-3 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="customerName" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                    Guest Name <span className="text-gold-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="customerName"
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-cream-100 placeholder-cream-400 text-xs sm:text-sm focus:outline-none focus:border-gold-500/80 transition-colors"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label htmlFor="customerPhone" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                    Indian Mobile Number <span className="text-gold-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="customerPhone"
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="e.g. 98765 43210"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-cream-100 placeholder-cream-400 text-xs sm:text-sm focus:outline-none focus:border-gold-500/80 transition-colors"
                    />
                  </div>
                  <span className="text-[10px] text-cream-400">10-digit mobile number for SMS / WhatsApp confirmation</span>
                </div>

                {/* Reservation Date */}
                <div className="space-y-1.5">
                  <label htmlFor="reservationDate" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                    Date <span className="text-gold-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="reservationDate"
                      type="date"
                      required
                      min={todayStr}
                      value={formData.reservationDate}
                      onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-cream-100 text-xs sm:text-sm focus:outline-none focus:border-gold-500/80 transition-colors"
                    />
                  </div>
                </div>

                {/* Time Slot */}
                <div className="space-y-1.5">
                  <label htmlFor="reservationTime" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                    Time Slot <span className="text-gold-400">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      id="reservationTime"
                      value={formData.reservationTime}
                      onChange={(e) => setFormData({ ...formData, reservationTime: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-cream-100 text-xs sm:text-sm focus:outline-none focus:border-gold-500/80 transition-colors"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Number of Guests */}
                <div className="space-y-1.5">
                  <label htmlFor="guests" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                    Number of Guests <span className="text-gold-400">*</span>
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      id="guests"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-cream-100 text-xs sm:text-sm focus:outline-none focus:border-gold-500/80 transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Seating Preference */}
                <div className="space-y-1.5">
                  <label htmlFor="seatingPreference" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                    Seating Area
                  </label>
                  <select
                    id="seatingPreference"
                    value={formData.seatingPreference}
                    onChange={(e) => setFormData({ ...formData, seatingPreference: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-cream-100 text-xs sm:text-sm focus:outline-none focus:border-gold-500/80 transition-colors"
                  >
                    <option value="standard">Main Dining Hall (Air Conditioned)</option>
                    <option value="outdoor_terrace">Outdoor Terrace (Open Air Skyline)</option>
                    <option value="private_dining">Private Dining Salon (Family / Meeting)</option>
                  </select>
                </div>

              </div>

              {/* Special Requests */}
              <div className="space-y-1.5">
                <label htmlFor="specialRequests" className="block text-xs uppercase tracking-wider text-cream-300 font-semibold">
                  Special Requests / Occasion (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                  <textarea
                    id="specialRequests"
                    rows={2}
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    placeholder="e.g. Birthday anniversary dinner, baby high-chair needed, spicy preparation preference..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-cream-100 placeholder-cream-400 text-xs sm:text-sm focus:outline-none focus:border-gold-500/80 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Submit Button & Direct Call Notice */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button3D
                  variant="gold"
                  size="lg"
                  type="submit"
                  isLoading={isLoading}
                  icon={<Utensils className="w-4 h-4" />}
                >
                  Confirm Table Reservation
                </Button3D>

                <div className="flex items-center gap-2 text-xs text-cream-400">
                  <span>Prefer immediate phone booking?</span>
                  <a
                    href={`tel:${AJWA_RESTAURANT_INFO.phone}`}
                    className="text-gold-400 hover:text-gold-300 font-semibold inline-flex items-center gap-1 underline"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>085182 53599</span>
                  </a>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};

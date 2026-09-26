import React, { useState, useEffect } from 'react';
import { TableBooking } from '../types';
import { CAFE_LOCATIONS, ASSET_IMAGES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { syncBookingToSupabase } from '../lib/supabase';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Sparkles, 
  Check, 
  Coffee, 
  ShieldCheck, 
  HelpCircle,
  ChevronDown,
  RefreshCw
} from 'lucide-react';

interface BookTablePageProps {
  onBookingSuccess: (booking: TableBooking) => void;
}

export const BookTablePage: React.FC<BookTablePageProps> = ({ onBookingSuccess }) => {
  const { user, token } = useAuth();
  const [selectedOutlet, setSelectedOutlet] = useState(CAFE_LOCATIONS[0].name);
  const [selectedZone, setSelectedZone] = useState('Traditional Baithak (Floor Cushions)');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedSession, setSelectedSession] = useState('Shaam ki Chai (4:30 PM - 7:30 PM)');
  const [selectedTime, setSelectedTime] = useState('5:30 PM');
  const [guests, setGuests] = useState(2);
  const [hasChaiFlight, setHasChaiFlight] = useState(true);
  
  // Guest form
  const [fullName, setFullName] = useState(user?.displayName || 'Aarav Sharma');
  const [phone, setPhone] = useState('760414533');
  const [email, setEmail] = useState(user?.email || 'majeamu98@gmail.com');
  const [occasion, setOccasion] = useState('Chai & Catchup');
  const [notes, setNotes] = useState('Corner seating preferred if available');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.displayName && fullName === 'Aarav Sharma') {
      setFullName(user.displayName);
    }
    if (user?.email && email === 'majeamu98@gmail.com') {
      setEmail(user.email);
    }
  }, [user]);

  const zones = [
    {
      id: 'Traditional Baithak (Floor Cushions)',
      title: 'Traditional Baithak',
      desc: 'Authentic Indian low seating with handloom bolsters & brass tables. Unhurried and cozy.',
      icon: '🛋️',
      tag: 'Most Popular',
    },
    {
      id: 'Verandah Garden (Pet-Friendly)',
      title: 'Verandah Garden',
      desc: 'Sunlit breezy outdoor patio with hanging ferns and fresh air. 100% pet friendly.',
      icon: '🌿',
      tag: 'Outdoor',
    },
    {
      id: 'Co-Work Nook (WiFi & Power)',
      title: 'Quiet Work Nook',
      desc: 'Ergonomic wooden tables with private power outlets and blazing-fast fiber WiFi.',
      icon: '💻',
      tag: 'Work Friendly',
    },
    {
      id: 'Main Cafe Dining Hall',
      title: 'Main Cafe Hall',
      desc: 'Spacious dining tables overlooking the open live brass chai counter & aroma.',
      icon: '☕',
      tag: 'Family Seating',
    },
  ];

  const sessions = [
    { id: 'Subah ki Chai (8:00 AM - 11:30 AM)', title: 'Subah ki Chai', times: ['8:30 AM', '9:30 AM', '10:30 AM', '11:00 AM'] },
    { id: 'Afternoon Work (12:00 PM - 4:00 PM)', title: 'Afternoon Work & Tea', times: ['12:30 PM', '1:30 PM', '2:30 PM', '3:30 PM'] },
    { id: 'Shaam ki Chai (4:30 PM - 7:30 PM)', title: 'Shaam ki Chai (Golden Hour)', times: ['4:30 PM', '5:00 PM', '5:30 PM', '6:30 PM', '7:00 PM'] },
    { id: 'Raat ki Baithak (8:00 PM - 11:00 PM)', title: 'Raat ki Baithak', times: ['8:30 PM', '9:15 PM', '10:00 PM'] },
  ];

  const currentTimes = sessions.find((s) => s.id === selectedSession)?.times || ['5:00 PM', '6:00 PM'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let bookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          fullName,
          phone: phone || '760414533',
          email: email || 'majeamu98@gmail.com',
          location: selectedOutlet,
          date: selectedDate,
          session: selectedSession,
          timeSlot: selectedTime,
          guests,
          zone: selectedZone,
          occasion,
          notes,
          hasChaiFlight,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.booking?.id) {
          bookingId = `BK-${data.booking.id}`;
        }
      }

      // Dual-sync to Supabase if configured
      syncBookingToSupabase({
        user_id: user?.uid || null,
        full_name: fullName,
        phone: phone || '760414533',
        email: email || 'majeamu98@gmail.com',
        location: selectedOutlet,
        date: selectedDate,
        session: selectedSession,
        time_slot: selectedTime,
        guests,
        zone: selectedZone,
        occasion: occasion || null,
        notes: notes || null,
        has_chai_flight: hasChaiFlight,
        status: 'confirmed',
      });
    } catch (err) {
      console.warn('Backend booking save notice:', err);
    } finally {
      setIsSubmitting(false);
      const newBooking: TableBooking = {
        id: bookingId,
        location: selectedOutlet,
        date: selectedDate,
        session: selectedSession,
        timeSlot: selectedTime,
        guests,
        zone: selectedZone,
        fullName,
        phone,
        email,
        occasion,
        notes,
        hasChaiFlight,
        timestamp: new Date().toISOString(),
      };

      onBookingSuccess(newBooking);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d] flex items-center justify-center gap-1.5 mb-2">
          <Calendar className="w-4 h-4" />
          <span>Complimentary Table Reservations</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d1b13]">
          Reserve Your Cozy Baithak Table
        </h1>
        <p className="text-xs sm:text-sm text-[#6f5647] mt-2 leading-relaxed">
          Whether it&apos;s a monsoon chai date, a long-due gossip session with friends, or a focused afternoon of writing — we hold your spot with zero booking fees.
        </p>
      </div>

      {/* Main Reservation Form Card */}
      <div className="bg-white rounded-3xl border border-[#ebdcd0] shadow-xl overflow-hidden">
        {/* Banner with Ambience Photo */}
        <div className="relative h-44 sm:h-56 bg-[#24150f] overflow-hidden">
          <img
            src={ASSET_IMAGES.cafeInterior}
            alt="Baithak Seating"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-8">
            <div className="text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e89f53]">
                Instant Confirmation
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold mt-0.5">
                The Chachee&apos;s Baithak Promise
              </h3>
              <p className="text-xs text-[#d5c3b7] mt-1">
                Zero reservation fee. 15-minute grace period. Complimentary welcome cookies.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          {/* Step 1: Cafe Outlet */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d] block mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>Step 1: Choose Cafe Location</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CAFE_LOCATIONS.map((loc) => {
                const isSelected = selectedOutlet === loc.name;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setSelectedOutlet(loc.name)}
                    className={`text-left p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-[#8e3a1d] bg-[#fdf3ec] ring-2 ring-[#8e3a1d]/20 shadow-xs'
                        : 'border-[#ebdcd0] hover:border-[#8e3a1d]/40 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2d1b13]">{loc.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#8e3a1d]" />}
                    </div>
                    <p className="text-[11px] text-[#7d6558] mt-1 truncate">{loc.address}</p>
                    <span className="text-[10px] text-[#8e3a1d] font-semibold mt-1 inline-block">
                      {loc.city} • {loc.type}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Seating Zone */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d] block mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Step 2: Choose Seating Zone</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {zones.map((z) => {
                const isSelected = selectedZone === z.id;
                return (
                  <div
                    key={z.id}
                    onClick={() => setSelectedZone(z.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#8e3a1d] bg-[#fdf3ec] ring-2 ring-[#8e3a1d]/20 shadow-xs'
                        : 'border-[#ebdcd0] hover:border-[#8e3a1d]/40 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{z.icon}</span>
                        <h4 className="text-xs font-bold text-[#2d1b13]">{z.title}</h4>
                      </div>
                      <span className="text-[10px] bg-white border border-[#d8c3b2] text-[#8e3a1d] font-semibold px-2 py-0.5 rounded-full">
                        {z.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#6f5647] mt-1.5 leading-relaxed">{z.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Date, Session & Time */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d] block mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Step 3: Select Date, Session & Arrival Slot</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                  Reservation Date:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                  Chai Session:
                </label>
                <select
                  value={selectedSession}
                  onChange={(e) => {
                    setSelectedSession(e.target.value);
                    const newSession = sessions.find((s) => s.id === e.target.value);
                    if (newSession) setSelectedTime(newSession.times[0]);
                  }}
                  className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                  Number of Guests:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Arrival Time Chips */}
            <div>
              <label className="text-[11px] font-bold text-[#7d6558] block mb-2">
                Available Arrival Slots:
              </label>
              <div className="flex flex-wrap gap-2">
                {currentTimes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedTime === t
                        ? 'bg-[#8e3a1d] text-white border-[#8e3a1d] shadow-xs'
                        : 'bg-white text-[#2d1b13] border-[#ebdcd0] hover:border-[#8e3a1d]/40'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Chai Tasting Add-on */}
          <div
            onClick={() => setHasChaiFlight(!hasChaiFlight)}
            className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
              hasChaiFlight
                ? 'bg-[#fdf3ec] border-[#8e3a1d]'
                : 'bg-white border-[#ebdcd0]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8e3a1d] text-white flex items-center justify-center shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2d1b13]">
                  Include Welcome Chai Flight (Tasting Trio)
                </h4>
                <p className="text-[11px] text-[#7d6558] mt-0.5">
                  Three artisanal mini kulhad chais (Masala, Kesar Badam, Sulaimani) served upon seating. Complimentary tasting notes.
                </p>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                hasChaiFlight
                  ? 'bg-[#8e3a1d] border-[#8e3a1d] text-white'
                  : 'border-[#c4b5ac] bg-white'
              }`}
            >
              {hasChaiFlight && <Check className="w-4 h-4" />}
            </div>
          </div>

          {/* Step 4: Contact Details */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d] block mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Step 4: Guest Details & Occasion</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                  Mobile Number (For SMS Pass):
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                  Email Address:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                  Occasion:
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                >
                  <option value="Chai & Catchup">Chai & Friendly Catchup</option>
                  <option value="Romantic Chai Date">Romantic Chai Date</option>
                  <option value="Remote Work Session">Remote Work & Coffee Session</option>
                  <option value="Birthday Celebration">Birthday Celebration</option>
                  <option value="Book Club Meeting">Book Club Meeting</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                  Special Notes for Host:
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Quiet corner, high chair, birthday greeting..."
                  className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#ebdcd0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#7d6558]">
              <ShieldCheck className="w-4 h-4 text-[#206927] shrink-0" />
              <span>Instant confirmation pass generated upon booking</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#8e3a1d] hover:bg-[#a64523] text-white font-bold py-3.5 px-8 rounded-2xl text-xs transition-all shadow-lg active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Reserving Table...</span>
                </>
              ) : (
                <span>Confirm Baithak Table Reservation</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Reservation FAQs */}
      <div className="bg-[#fbf4eb] rounded-3xl p-8 border border-[#e6d3c2]">
        <h3 className="font-serif font-bold text-xl text-[#2d1b13] mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#8e3a1d]" />
          <span>Table Reservation Policy & FAQs</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#6f5647]">
          <div className="bg-white p-4 rounded-2xl border border-[#ebdcd0]">
            <h4 className="font-bold text-[#2d1b13] mb-1">Is there any advance payment or booking charge?</h4>
            <p>None at all! Reserving a baithak table is 100% complimentary. You only pay for what you eat and drink.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#ebdcd0]">
            <h4 className="font-bold text-[#2d1b13] mb-1">How long will my table be held?</h4>
            <p>We hold your table for up to 15 minutes past your chosen arrival slot. If running late, please call the cafe outlet.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#ebdcd0]">
            <h4 className="font-bold text-[#2d1b13] mb-1">Can I bring my pet?</h4>
            <p>Yes! Our Verandah Garden zones in Colaba, Bandra, and Indiranagar are pet-friendly. We love furry tea enthusiasts.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#ebdcd0]">
            <h4 className="font-bold text-[#2d1b13] mb-1">Can I book for large groups (15+ people)?</h4>
            <p>For groups larger than 12, please reach out via our Contact / Catering page so we can curate a custom high-tea spread!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

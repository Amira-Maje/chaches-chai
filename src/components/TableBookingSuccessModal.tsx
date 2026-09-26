import React from 'react';
import { TableBooking } from '../types';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  QrCode, 
  X, 
  Share2, 
  Download,
  Coffee,
  Sparkles
} from 'lucide-react';

interface TableBookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: TableBooking | null;
}

export const TableBookingSuccessModal: React.FC<TableBookingSuccessModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  if (!isOpen || !booking) return null;

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`Chai & Baithak at Chachees' - ${booking.location}`);
    const details = encodeURIComponent(`Table reservation under ${booking.fullName} for ${booking.guests} guest(s). Zone: ${booking.zone}. Welcome Chai Flight included: ${booking.hasChaiFlight ? 'Yes' : 'No'}.`);
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${encodeURIComponent(booking.location)}`;
    window.open(gcalUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fffcf7] rounded-3xl max-w-md w-full shadow-2xl border border-[#e6d7c8] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Pass Header */}
        <div className="bg-[#2d1b13] text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-[#23451e] border-2 border-[#4ade80] rounded-full flex items-center justify-center mx-auto mb-3 text-[#4ade80] shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#e89f53]">
            Baithak Table Reserved
          </span>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            See You at Chachees&apos;!
          </h2>
          <p className="text-xs text-[#d5c3b7] mt-1">
            Reservation Pass: <span className="font-mono font-bold text-[#e89f53]">{booking.id}</span>
          </p>
        </div>

        {/* Boarding Pass Ticket Body */}
        <div className="p-6 space-y-4">
          <div className="bg-[#fcf8f3] border-2 border-dashed border-[#d8c3b2] rounded-2xl p-5 relative overflow-hidden">
            {/* Cutout notch left & right */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fffcf7] border border-[#d8c3b2]" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fffcf7] border border-[#d8c3b2]" />

            <div className="flex items-start justify-between border-b border-[#e9dcce] pb-3 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d6558]">
                  Guest Name
                </span>
                <h4 className="text-base font-bold text-[#2d1b13] font-serif">
                  {booking.fullName}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d6558]">
                  Party Size
                </span>
                <p className="text-sm font-bold text-[#8e3a1d] flex items-center justify-end gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{booking.guests} Guests</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <span className="text-[10px] text-[#7d6558] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#8e3a1d]" />
                  <span>Date</span>
                </span>
                <p className="font-bold text-[#2d1b13] mt-0.5">{booking.date}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#7d6558] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#8e3a1d]" />
                  <span>Time & Session</span>
                </span>
                <p className="font-bold text-[#2d1b13] mt-0.5">{booking.timeSlot} ({booking.session})</p>
              </div>
            </div>

            <div className="border-t border-[#e9dcce] pt-3 space-y-2 text-xs">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8e3a1d] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#2d1b13]">{booking.location}</span>
                  <p className="text-[11px] text-[#7d6558]">Reserved Zone: <strong className="text-[#8e3a1d]">{booking.zone}</strong></p>
                </div>
              </div>

              {booking.hasChaiFlight && (
                <div className="bg-[#fbf1e8] p-2 rounded-xl text-[11px] text-[#8e3a1d] font-semibold flex items-center gap-1.5 border border-[#eed7c4]">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Welcome Chai Tasting Flight reserved for your table</span>
                </div>
              )}
            </div>

            {/* Simulated QR Code for desk checkin */}
            <div className="mt-4 pt-4 border-t border-dashed border-[#d8c3b2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white p-1 rounded-xl border border-[#d8c3b2] flex items-center justify-center shadow-xs">
                  <QrCode className="w-12 h-12 text-[#2d1b13]" />
                </div>
                <div className="text-[10px] text-[#7d6558] leading-tight">
                  <p className="font-bold text-[#2d1b13]">Quick Desk Check-in</p>
                  <p>Show this pass or QR to your cafe host upon arrival.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#7d6558] text-center italic">
            Table will be held for 15 minutes past scheduled arrival time. SMS confirmation sent to {booking.phone}.
          </p>
        </div>

        {/* Actions */}
        <div className="p-5 bg-[#f5eade] border-t border-[#ebdcd0] flex gap-3">
          <button
            onClick={handleAddToCalendar}
            className="flex-1 bg-white hover:bg-[#fcf8f4] text-[#8e3a1d] border border-[#d8c3b2] py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Add to Calendar</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#8e3a1d] hover:bg-[#a64523] text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

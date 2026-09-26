import React, { useState } from 'react';
import { FAQS_DATA } from '../data/mockData';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  MessageSquare, 
  Coffee, 
  Sparkles,
  Building2,
  Calendar
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [inquiryType, setInquiryType] = useState<'general' | 'catering' | 'franchise'>('catering');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [guestCount, setGuestCount] = useState('50 - 100 Guests');
  const [eventDate, setEventDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          topic: inquiryType,
          message: `${message} [City: ${city}, Guests: ${guestCount}, Date: ${eventDate || 'N/A'}]`,
        }),
      });
    } catch (err) {
      console.warn('Contact message submission notice:', err);
    }

    setTimeout(() => {
      setIsSubmitted(false);
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 4000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Header Banner */}
      <div className="bg-[#24150f] rounded-3xl p-8 sm:p-12 text-white border border-[#422c21]">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e89f53] flex items-center gap-1.5 mb-2">
            <MessageSquare className="w-4 h-4" />
            <span>We&apos;re All Ears</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Connect With the Chachees&apos; Family
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#d5c3b7] leading-relaxed">
            Planning a wedding or corporate chai bar? Interested in bringing Chachees&apos; to your city? Or just want to share feedback on your last cup? We’d love to hear from you.
          </p>
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#ebdcd0] shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#fdf3ec] text-[#8e3a1d] flex items-center justify-center mb-4">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#2d1b13]">Chai Hotline</h3>
          <p className="text-xs text-[#7d6558] mt-1">Daily 7:30 AM to 11:30 PM</p>
          <a
            href="tel:760414533"
            className="text-sm font-bold text-[#8e3a1d] mt-3 inline-block hover:underline"
          >
            760414533
          </a>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#ebdcd0] shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#fdf3ec] text-[#8e3a1d] flex items-center justify-center mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#2d1b13]">Email Concierge</h3>
          <p className="text-xs text-[#7d6558] mt-1">Expect a reply within 24 hours</p>
          <a
            href="mailto:majeamu98@gmail.com"
            className="text-sm font-bold text-[#8e3a1d] mt-3 inline-block hover:underline"
          >
            majeamu98@gmail.com
          </a>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#ebdcd0] shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#fdf3ec] text-[#8e3a1d] flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#2d1b13]">Corporate & Flagship</h3>
          <p className="text-xs text-[#7d6558] mt-1">Colaba Heritage Quarter</p>
          <p className="text-xs font-semibold text-[#2d1b13] mt-2">
            14 Heritage Lane, Near Gateway of India, Colaba, Mumbai 400001
          </p>
        </div>
      </div>

      {/* Interactive Form Section */}
      <div className="bg-white rounded-3xl border border-[#ebdcd0] shadow-xl overflow-hidden">
        <div className="p-6 sm:p-10">
          <div className="max-w-xl mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d]">
              Inquiry Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d1b13] mt-1">
              Send an Inquiry or Book Catering
            </h2>
            <p className="text-xs text-[#6f5647] mt-1">
              Select the purpose of your inquiry to route directly to the specialized team.
            </p>
          </div>

          {/* Inquiry Type Tabs */}
          <div className="flex gap-2 p-1 bg-[#f8eee3] rounded-2xl max-w-lg mb-8">
            <button
              type="button"
              onClick={() => setInquiryType('catering')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                inquiryType === 'catering'
                  ? 'bg-white text-[#8e3a1d] shadow-sm'
                  : 'text-[#6f5647] hover:text-[#2d1b13]'
              }`}
            >
              🎉 Event & Chai Bar Catering
            </button>
            <button
              type="button"
              onClick={() => setInquiryType('franchise')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                inquiryType === 'franchise'
                  ? 'bg-white text-[#8e3a1d] shadow-sm'
                  : 'text-[#6f5647] hover:text-[#2d1b13]'
              }`}
            >
              🏪 Franchise Expansion
            </button>
            <button
              type="button"
              onClick={() => setInquiryType('general')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                inquiryType === 'general'
                  ? 'bg-white text-[#8e3a1d] shadow-sm'
                  : 'text-[#6f5647] hover:text-[#2d1b13]'
              }`}
            >
              💬 General Feedback
            </button>
          </div>

          {isSubmitted ? (
            <div className="bg-[#f0f9ed] border border-[#bbf7d0] rounded-3xl p-8 text-center max-w-lg mx-auto space-y-3">
              <div className="w-14 h-14 bg-[#23451e] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8 text-[#4ade80]" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#2d1b13]">Message Received with Gratitude!</h3>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                Our catering & relationships manager has been notified and will call you back within 2-4 working hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3.5 py-2.5 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. majeamu98@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3.5 py-2.5 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                    Mobile Phone Number:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 760414533"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3.5 py-2.5 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                  />
                </div>
              </div>

              {/* Catering specific inputs */}
              {inquiryType === 'catering' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#fdf8f3] p-4 rounded-2xl border border-[#ebdcd0]">
                  <div>
                    <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                      Event City:
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Pune">Pune</option>
                      <option value="Other">Other City</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                      Estimated Guests:
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full bg-white border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                    >
                      <option value="25 - 50 Guests">25 - 50 Guests (Intimate / Meeting)</option>
                      <option value="50 - 150 Guests">50 - 150 Guests (Party / Offsite)</option>
                      <option value="150 - 500 Guests">150 - 500 Guests (Wedding / Festive)</option>
                      <option value="500+ Guests">500+ Guests (Large Scale)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                      Target Event Date:
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-white border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                    />
                  </div>
                </div>
              )}

              {/* Franchise specific inputs */}
              {inquiryType === 'franchise' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#fdf8f3] p-4 rounded-2xl border border-[#ebdcd0]">
                  <div>
                    <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                      Proposed City & Neighborhood:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad (Jubilee Hills)"
                      className="w-full bg-white border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                      Investment Capacity:
                    </label>
                    <select
                      className="w-full bg-white border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                    >
                      <option>₹25L - ₹40L (Kiosk / Quick Counter)</option>
                      <option>₹40L - ₹75L (Standard Cafe with Baithak)</option>
                      <option>₹75L+ (Flagship Experience Center)</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                  Your Message or Requirements:
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you have in mind..."
                  className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3.5 py-2.5 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#8e3a1d] hover:bg-[#a64523] text-white font-bold py-3.5 px-8 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-[#fbf4eb] rounded-3xl p-8 sm:p-12 border border-[#e6d3c2]">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d]">
            Clear Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d1b13] mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS_DATA.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#ebdcd0] overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm text-[#2d1b13] hover:text-[#8e3a1d] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8e3a1d] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs text-[#6f5647] leading-relaxed border-t border-[#f7eee6]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

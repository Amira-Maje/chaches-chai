import React, { useState } from 'react';
import { PageType } from '../types';
import { ChacheesLogo } from './ChacheesLogo';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter, 
  ArrowRight, 
  CheckCircle2, 
  Coffee,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  const handleLink = (page: PageType) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#211611] text-[#e8dfd8] border-t border-[#3d2c23] pt-16 pb-12">
      {/* Top Value Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#3b2a22]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#392419] flex items-center justify-center text-[#e89f53] shrink-0 border border-[#523424]">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Artisanal Slow Brewing</h4>
              <p className="text-xs text-[#b8a79d] mt-0.5">Fresh single-estate Assam tea with hand-pounded spices.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#392419] flex items-center justify-center text-[#e89f53] shrink-0 border border-[#523424]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">100% Earthen Kulhads</h4>
              <p className="text-xs text-[#b8a79d] mt-0.5">Clay cups supporting rural artisans, 100% compostable.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#392419] flex items-center justify-center text-[#e89f53] shrink-0 border border-[#523424]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Unhurried Conversations</h4>
              <p className="text-xs text-[#b8a79d] mt-0.5">Our baithak seating is made for relaxing, reading & connecting.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <ChacheesLogo variant="white" size="md" />
            <p className="text-sm text-[#c4b5ac] leading-relaxed max-w-sm mt-3">
              Born from the timeless nostalgia of Indian chai tapris and the comfort of neighborhood cafes. Brewing memories, one clay kulhad at a time.
            </p>
            
            <div className="pt-2 flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#342218] hover:bg-[#8e3a1d] text-[#e8dfd8] flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#342218] hover:bg-[#8e3a1d] text-[#e8dfd8] flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#342218] hover:bg-[#8e3a1d] text-[#e8dfd8] flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>

            <div className="pt-2 text-xs text-[#a08f84] space-y-1">
              <p>FSSAI Lic. No: 11521004000384</p>
              <p>GSTIN: 27AABCC3928H1Z8</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 text-[#e89f53]">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => handleLink('menu')}
                  className="hover:text-[#e89f53] transition-colors"
                >
                  Artisanal Chai Menu
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLink('order')}
                  className="hover:text-[#e89f53] transition-colors"
                >
                  Order Online & Takeaway
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLink('book-table')}
                  className="hover:text-[#e89f53] transition-colors"
                >
                  Reserve a Baithak Table
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLink('reviews')}
                  className="hover:text-[#e89f53] transition-colors"
                >
                  Customer Stories & Love
                </button>
              </li>
            </ul>
          </div>

          {/* About & Corporate */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 text-[#e89f53]">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => handleLink('about')}
                  className="hover:text-[#e89f53] transition-colors"
                >
                  Our Chai Heritage
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLink('about')}
                  className="hover:text-[#e89f53] transition-colors"
                >
                  Single Estate Sourcing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLink('contact')}
                  className="hover:text-[#e89f53] transition-colors"
                >
                  Catering & Wedding Chai Bar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLink('contact')}
                  className="hover:text-[#e89f53] transition-colors"
                >
                  Franchise Inquiries
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLink('contact')}
                  className="hover:text-[#e89f53] transition-colors"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 text-[#e89f53]">
              Chai Gazette
            </h3>
            <p className="text-xs text-[#c4b5ac] mb-3 leading-relaxed">
              Get secret monsoon tea recipes, secret tasting invites, and 15% off your next online order.
            </p>

            {subscribed ? (
              <div className="bg-[#2a3c26] text-[#bbf7d0] border border-[#3b5335] rounded-xl p-3 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0" />
                <span>You&apos;re subscribed! Check your inbox for chai love.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-[#180f0b] border border-[#483327] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#7d6d64] focus:outline-none focus:border-[#e89f53]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#8e3a1d] hover:bg-[#a64523] text-white rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Subscribe for Chai Treats</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="mt-4 pt-4 border-t border-[#342319] text-xs text-[#a08f84] space-y-1">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#e89f53]" />
                <a href="tel:760414533" className="hover:text-white transition-colors">
                  Hotline: 760414533
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#e89f53]" />
                <a href="mailto:majeamu98@gmail.com" className="hover:text-white transition-colors">
                  majeamu98@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#332219] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9a887d] gap-4">
        <p className="flex items-center gap-1">
          &copy; {new Date().getFullYear()} Chachees&apos; Chai Cafe Pvt. Ltd. Crafted with{' '}
          <Heart className="w-3.5 h-3.5 text-[#e89f53] inline fill-current" /> for chai lovers worldwide.
        </p>
        <div className="flex items-center gap-6">
          <span className="hover:text-[#e8dfd8] cursor-pointer">Privacy Policy</span>
          <span className="hover:text-[#e8dfd8] cursor-pointer">Terms of Service</span>
          <span className="hover:text-[#e8dfd8] cursor-pointer">Refund Policy</span>
          <span className="hover:text-[#e8dfd8] cursor-pointer">Sitemap</span>
        </div>
      </div>
    </footer>
  );
};

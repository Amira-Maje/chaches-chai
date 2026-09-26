import React, { useState } from 'react';
import { PageType, MenuItem } from '../types';
import { MENU_ITEMS, ASSET_IMAGES, CUSTOMER_REVIEWS } from '../data/mockData';
import { 
  Coffee, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Heart, 
  MapPin, 
  Users, 
  Calendar, 
  ShieldCheck, 
  UtensilsCrossed, 
  SlidersHorizontal,
  ChevronRight,
  Send
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
  onOpenCustomizer: (item: MenuItem) => void;
  onQuickAddToCart: (item: MenuItem) => void;
  currency: 'INR' | 'CAD';
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenCustomizer,
  onQuickAddToCart,
  currency,
}) => {
  // Chai quiz state
  const [quizMood, setQuizMood] = useState<'refresh' | 'focus' | 'comfort' | 'royal'>('comfort');
  const [quizSpice, setQuizSpice] = useState<'mild' | 'kadak' | 'fragrant'>('kadak');

  // Match chai based on quiz
  const getMatchedChai = (): MenuItem => {
    if (quizMood === 'focus') {
      return MENU_ITEMS.find((i) => i.id === 'cutting-chai') || MENU_ITEMS[0];
    }
    if (quizMood === 'royal') {
      return MENU_ITEMS.find((i) => i.id === 'kesar-badam-chai') || MENU_ITEMS[0];
    }
    if (quizSpice === 'fragrant') {
      return MENU_ITEMS.find((i) => i.id === 'elaichi-chai') || MENU_ITEMS[0];
    }
    if (quizSpice === 'mild') {
      return MENU_ITEMS.find((i) => i.id === 'sulaimani-chai') || MENU_ITEMS[0];
    }
    return MENU_ITEMS.find((i) => i.id === 'masala-chai') || MENU_ITEMS[0];
  };

  const matchedChai = getMatchedChai();
  const bestsellers = MENU_ITEMS.filter((i) => i.tag === 'Bestseller' || i.tag === "Chef's Special").slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Announcement Strip */}
      <div className="bg-[#8e3a1d] text-[#fef9f3] text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#f6cb9d]" />
        <span>
          Monsoon Special: Earthen Kulhad Chai + Warm Bun Maska for just {currency === 'CAD' ? '$4.99' : '₹119'}! Use code <strong>CHACHEE20</strong>
        </span>
        <button
          onClick={() => onNavigate('order')}
          className="underline font-bold hover:text-white ml-1 inline-flex items-center gap-0.5"
        >
          <span>Order Now</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#24150f] text-white shadow-2xl border border-[#422c21]">
          {/* Background image with warm gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={ASSET_IMAGES.heroChai}
              alt="Steaming Kulhad Chai"
              className="w-full h-full object-cover object-center opacity-35 filter brightness-90 saturate-125"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c0f0a] via-[#1c0f0a]/85 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#8e3a1d]/30 border border-[#e89f53]/40 rounded-full px-3.5 py-1 text-xs font-semibold text-[#f6cb9d] mb-6 backdrop-blur-xs">
              <Flame className="w-3.5 h-3.5 text-[#e89f53]" />
              <span>Slow-Brewed In Authentic Brass Degchis</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
              Where Every Sip Tells an <span className="text-[#e89f53] italic">Indian Story.</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-[#d8c3b2] leading-relaxed">
              Step into Chachee&apos;s Chai — your neighborhood baithak for freshly pounded spice chais served in earthen clay kulhads, buttery bun maska, and unhurried conversations that last for hours.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => onNavigate('order')}
                className="bg-[#8e3a1d] hover:bg-[#a64523] text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg transition-all flex items-center gap-2 text-sm active:scale-95"
              >
                <span>Order Online Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('book-table')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-2xl backdrop-blur-xs transition-all flex items-center gap-2 text-sm"
              >
                <Calendar className="w-4 h-4 text-[#e89f53]" />
                <span>Reserve a Baithak</span>
              </button>

              <button
                onClick={() => onNavigate('menu')}
                className="text-xs font-semibold text-[#f6cb9d] hover:text-white px-3 py-2 transition-colors"
              >
                View Full Menu →
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-serif font-bold text-white">1.4M+</p>
                <p className="text-[11px] text-[#b49e91] mt-0.5">Kulhads Brewed</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-white">24+</p>
                <p className="text-[11px] text-[#b49e91] mt-0.5">Artisanal Blends</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-white flex items-center gap-1">
                  <span>4.9</span>
                  <Star className="w-4 h-4 text-[#e89f53] fill-[#e89f53]" />
                </p>
                <p className="text-[11px] text-[#b49e91] mt-0.5">8,400+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Rituals of Chachee's Chai */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d]">
            The Artisanal Way
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#2d1b13] mt-1">
            The Chachee&apos;s Chai Ritual
          </h2>
          <p className="text-xs text-[#6f5647] mt-2">
            No instant pre-mixes. No artificial syrups. Just authentic Indian tea craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md transition-shadow relative">
            <span className="text-3xl font-serif font-black text-[#8e3a1d]/15 absolute top-4 right-5">
              01
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#fbf1e8] text-[#8e3a1d] flex items-center justify-center font-bold text-lg mb-4">
              🍃
            </div>
            <h3 className="font-serif font-bold text-[#2d1b13] text-base mb-1">
              Single-Estate Assam Tea
            </h3>
            <p className="text-xs text-[#6f5647] leading-relaxed">
              Harvested from the lush Brahmaputra valley. Robust, malty CTC leaves that hold their body through deep simmering.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md transition-shadow relative">
            <span className="text-3xl font-serif font-black text-[#8e3a1d]/15 absolute top-4 right-5">
              02
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#fbf1e8] text-[#8e3a1d] flex items-center justify-center font-bold text-lg mb-4">
              🫚
            </div>
            <h3 className="font-serif font-bold text-[#2d1b13] text-base mb-1">
              Fresh Pounded Spices
            </h3>
            <p className="text-xs text-[#6f5647] leading-relaxed">
              Green Idukki cardamom, fiery ginger root, and Ceylon cinnamon crushed in stone mortar-pestles right before brewing.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md transition-shadow relative">
            <span className="text-3xl font-serif font-black text-[#8e3a1d]/15 absolute top-4 right-5">
              03
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#fbf1e8] text-[#8e3a1d] flex items-center justify-center font-bold text-lg mb-4">
              🫖
            </div>
            <h3 className="font-serif font-bold text-[#2d1b13] text-base mb-1">
              Brass Degchi Simmer
            </h3>
            <p className="text-xs text-[#6f5647] leading-relaxed">
              Slow-boiled in heavy bell-metal brass degchis, allowing whole milk and spices to coalesce into a creamy, golden brew.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md transition-shadow relative">
            <span className="text-3xl font-serif font-black text-[#8e3a1d]/15 absolute top-4 right-5">
              04
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#fbf1e8] text-[#8e3a1d] flex items-center justify-center font-bold text-lg mb-4">
              🏺
            </div>
            <h3 className="font-serif font-bold text-[#2d1b13] text-base mb-1">
              Earthen Kulhad Aroma
            </h3>
            <p className="text-xs text-[#6f5647] leading-relaxed">
              Poured steaming hot into porous terracotta kulhads that infuse the unmistakable baked-earth &apos;sondhi khushboo&apos;.
            </p>
          </div>
        </div>
      </section>

      {/* Signature Bestsellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d]">
              Customer Favorites
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#2d1b13] mt-1">
              Signature Kulhads & Nashta
            </h2>
            <p className="text-xs text-[#6f5647] mt-1">
              Handcrafted specialties ordered by thousands of regulars daily.
            </p>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-[#8e3a1d] hover:text-[#a64523] flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore Complete 24+ Item Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-3xl border border-[#ebdcd0] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
            >
              {/* Image Banner */}
              <div className="relative h-44 overflow-hidden bg-[#f4ebe1]">
                <img
                  src={dish.image || ASSET_IMAGES.heroChai}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#8e3a1d] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {dish.tag || 'Popular'}
                </div>
                {dish.servingInfo && (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-lg">
                    {dish.servingInfo}
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-base text-[#2d1b13] group-hover:text-[#8e3a1d] transition-colors">
                      {dish.name}
                    </h3>
                    <span className="font-serif font-bold text-base text-[#8e3a1d] shrink-0">
                      {currency === 'CAD' ? `$${(dish.cadPrice || dish.price / 60).toFixed(2)}` : `₹${dish.price}`}
                    </span>
                  </div>

                  {dish.hindiName && (
                    <p className="text-xs text-[#a07a61] mt-0.5">{dish.hindiName}</p>
                  )}

                  <p className="text-xs text-[#6f5647] mt-2 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#ebdcd0] flex items-center gap-2">
                  <button
                    onClick={() => onOpenCustomizer(dish)}
                    className="flex-1 bg-[#fbf1e8] hover:bg-[#8e3a1d] hover:text-white text-[#8e3a1d] text-xs font-bold py-2.5 px-3 rounded-xl transition-all"
                  >
                    Customize
                  </button>
                  <button
                    onClick={() => onQuickAddToCart(dish)}
                    className="bg-[#8e3a1d] hover:bg-[#a64523] text-white text-xs font-bold py-2.5 px-3.5 rounded-xl transition-colors shadow-sm"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Feature: "Find Your Chai Vibe" Quiz */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#fbf4eb] rounded-3xl p-8 sm:p-12 border border-[#e6d3c2]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d] inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Chai Sommelier</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d1b13] mt-1">
                Find Your Perfect Chai Mood
              </h2>
              <p className="text-xs text-[#6f5647] mt-1.5">
                Tell us your mood and spice preference, and we’ll match you with your soul chai.
              </p>
            </div>

            {/* Quiz Filters */}
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7d6558] block mb-2 text-center">
                  1. What does your day feel like right now?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'comfort', label: '🌧️ Cozy Comfort' },
                    { id: 'focus', label: '⚡ Deep Work & Focus' },
                    { id: 'refresh', label: '🌿 Light & Digestif' },
                    { id: 'royal', label: '👑 Indulgent & Royal' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setQuizMood(m.id as any)}
                      className={`p-3 rounded-2xl text-xs font-semibold border transition-all ${
                        quizMood === m.id
                          ? 'bg-[#8e3a1d] text-white border-[#8e3a1d] shadow-sm'
                          : 'bg-white text-[#2d1b13] border-[#ebdcd0] hover:border-[#8e3a1d]/40'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7d6558] block mb-2 text-center">
                  2. Your Spice & Kadak Preference
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'mild', label: 'Gentle & Mild' },
                    { id: 'kadak', label: 'Kadak & Gingery' },
                    { id: 'fragrant', label: 'Aromatic Elaichi' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setQuizSpice(s.id as any)}
                      className={`p-3 rounded-2xl text-xs font-semibold border transition-all ${
                        quizSpice === s.id
                          ? 'bg-[#8e3a1d] text-white border-[#8e3a1d] shadow-sm'
                          : 'bg-white text-[#2d1b13] border-[#ebdcd0] hover:border-[#8e3a1d]/40'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Matched Chai Result Card */}
            <div className="mt-8 bg-white rounded-3xl p-6 border-2 border-[#8e3a1d]/30 shadow-md flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-[#f4ebe1]">
                <img
                  src={matchedChai.image || ASSET_IMAGES.heroChai}
                  alt={matchedChai.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="inline-block bg-[#fdf3ec] text-[#8e3a1d] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1">
                  Your Perfect Match
                </div>
                <h4 className="text-xl font-serif font-bold text-[#2d1b13]">
                  {matchedChai.name} {matchedChai.hindiName && <span className="text-sm font-sans font-normal text-[#8e3a1d]">({matchedChai.hindiName})</span>}
                </h4>
                <p className="text-xs text-[#6f5647] mt-1 leading-relaxed">
                  {matchedChai.description}
                </p>
                <p className="text-xs font-bold text-[#8e3a1d] mt-2">
                  {currency === 'CAD' ? `$${(matchedChai.cadPrice || matchedChai.price / 60).toFixed(2)}` : `₹${matchedChai.price}`} • {matchedChai.servingInfo || 'Served in Clay Kulhad'}
                </p>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => onQuickAddToCart(matchedChai)}
                  className="flex-1 sm:flex-initial bg-[#8e3a1d] hover:bg-[#a64523] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-sm transition-all"
                >
                  Add to Order
                </button>
                <button
                  onClick={() => onOpenCustomizer(matchedChai)}
                  className="flex-1 sm:flex-initial bg-[#fbf1e8] hover:bg-[#8e3a1d] hover:text-white text-[#8e3a1d] text-xs font-bold px-4 py-3 rounded-xl transition-all"
                >
                  Customize
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Baithak Cafe Ambience Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#24150f] rounded-3xl overflow-hidden text-white border border-[#422c21] grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#e89f53]">
                The Third Space Experience
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2 leading-tight">
                Not Just a Cafe. A Sanctuary of <span className="text-[#e89f53] italic">Slow Living.</span>
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-[#d5c3b7] leading-relaxed">
                Step away from the city hustle. Our cafes feature traditional Indian baithak low seating with handloom bolsters, warm brass hanging lamps, retro vinyl classics playing softly, and shelves stocked with Indian poetry and regional literature.
              </p>

              <div className="mt-6 space-y-3 text-xs text-[#e8dfd8]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#e89f53] shrink-0" />
                  <span>Work-friendly nooks with high-speed fiber WiFi and power outlets.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#e89f53] shrink-0" />
                  <span>Pet-friendly garden verandas with complimentary water bowls.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#e89f53] shrink-0" />
                  <span>Community board games & book exchange club on weekends.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => onNavigate('book-table')}
                className="bg-[#e89f53] hover:bg-[#f6cb9d] text-[#24150f] font-bold px-6 py-3 rounded-2xl transition-colors text-xs flex items-center gap-2 shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve a Baithak Corner</span>
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="border border-white/20 hover:bg-white/10 text-white font-semibold px-5 py-3 rounded-2xl transition-colors text-xs"
              >
                Contact & Inquiries
              </button>
            </div>
          </div>

          <div className="relative min-h-[300px] lg:min-h-full">
            <img
              src={ASSET_IMAGES.cafeInterior}
              alt="Chachee's Chai Baithak Ambience"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#24150f] via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Customer Love Reviews Carousel Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d]">
              Chai Wallah Chronicles
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#2d1b13] mt-1">
              Loved by 8,400+ Regulars
            </h2>
            <p className="text-xs text-[#6f5647] mt-1">
              From morning commuters to evening poets and remote workers.
            </p>
          </div>

          <button
            onClick={() => onNavigate('reviews')}
            className="text-xs font-bold text-[#8e3a1d] hover:text-[#a64523] flex items-center gap-1"
          >
            <span>Read All Verified Stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CUSTOMER_REVIEWS.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#ebdcd0] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-[#e89f53]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#8e3a1d] font-bold bg-[#fbf1e8] px-2 py-0.5 rounded-full">
                    {rev.badge}
                  </span>
                </div>

                <p className="text-xs text-[#3d2e26] italic leading-relaxed">
                  &ldquo;{rev.text}&rdquo;
                </p>

                {rev.itemsMentioned && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {rev.itemsMentioned.map((item, idx) => (
                      <span key={idx} className="text-[9px] bg-[#fdf3ec] text-[#8e3a1d] px-1.5 py-0.5 rounded font-medium">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-[#ebdcd0] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#8e3a1d] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {rev.initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2d1b13]">{rev.author}</h4>
                  <p className="text-[10px] text-[#7d6558]">{rev.branch}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Catering & Private Chai Bar Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#8e3a1d] to-[#67250e] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#f6cb9d]">
              Live Artisanal Chai Counter
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Host a Chachee&apos;s Chai Bar at Your Event
            </h3>
            <p className="text-xs sm:text-sm text-[#f6dfd0] mt-2 leading-relaxed">
              We bring piping hot brass degchis, earthen kulhads, tandoori chai, and fresh hot samosas to your weddings, corporate offsites, and festive gatherings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-white hover:bg-[#fff9f4] text-[#8e3a1d] font-bold px-6 py-3.5 rounded-2xl text-xs shadow-md transition-colors text-center"
            >
              Inquire Event Catering
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="bg-[#24150f] hover:bg-black text-white font-bold px-6 py-3.5 rounded-2xl text-xs transition-colors text-center"
            >
              Franchise Opportunities
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

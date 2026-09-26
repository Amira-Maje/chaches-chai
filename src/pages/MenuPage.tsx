import React, { useState, useMemo } from 'react';
import { MenuItem, PageType } from '../types';
import { MENU_ITEMS, ASSET_IMAGES } from '../data/mockData';
import { 
  Search, 
  Flame, 
  Sparkles, 
  Check, 
  SlidersHorizontal, 
  Coffee, 
  ShoppingBag, 
  Heart,
  Plus,
  Info
} from 'lucide-react';

interface MenuPageProps {
  onOpenCustomizer: (item: MenuItem) => void;
  onQuickAddToCart: (item: MenuItem) => void;
  onNavigate: (page: PageType) => void;
  currency: 'INR' | 'CAD';
}

export const MenuPage: React.FC<MenuPageProps> = ({
  onOpenCustomizer,
  onQuickAddToCart,
  onNavigate,
  currency,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'chai' | 'snacks' | 'cold' | 'combos'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'veg' | 'bestseller' | 'kadak'>('all');

  const categories = [
    { id: 'all', label: 'All Delights', icon: '✨' },
    { id: 'chai', label: 'Handcrafted Chais', icon: '☕' },
    { id: 'snacks', label: 'Street Snacks & Bakes', icon: '🥟' },
    { id: 'cold', label: 'Cold Brews & Shakes', icon: '🧊' },
    { id: 'combos', label: 'Signature Combos', icon: '🍱' },
  ];

  const filterPills = [
    { id: 'all', label: 'All Items' },
    { id: 'bestseller', label: '⭐ Bestsellers' },
    { id: 'kadak', label: '🔥 Kadak Specials' },
    { id: 'veg', label: '🌱 Pure Vegetarian' },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Pill filter
      if (selectedFilter === 'veg' && !item.isVeg) return false;
      if (selectedFilter === 'bestseller' && item.tag !== 'Bestseller' && item.tag !== "Chef's Special") return false;
      if (selectedFilter === 'kadak' && item.spiceLevel !== 'Kadak' && item.tag !== 'Kadak Special') return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesHindi = item.hindiName?.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTag = item.tag?.toLowerCase().includes(query);
        if (!matchesName && !matchesHindi && !matchesDesc && !matchesTag) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header Banner */}
      <div className="bg-[#24150f] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-[#422c21]">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e89f53] flex items-center gap-1.5 mb-2">
            <Coffee className="w-4 h-4" />
            <span>The Artisanal Chai Catalog</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
            Slow-Brewed Kulhads, Fresh Street Bakes & Combos
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#d5c3b7] leading-relaxed">
            Every cup of chai is made from single-origin Assam leaves and freshly ground spices. Order online with customizable milk, sweetness, and spice levels.
          </p>

          <div className="mt-5 flex items-center gap-4 text-xs text-[#e8dfd8]">
            <span className="bg-[#382015] px-3 py-1.5 rounded-full border border-[#5a3827]">
              ✓ 100% Biodegradable Kulhads
            </span>
            <span className="bg-[#382015] px-3 py-1.5 rounded-full border border-[#5a3827]">
              ✓ Zero Artificial Flavoring
            </span>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-25 hidden md:block">
          <img
            src={ASSET_IMAGES.heroChai}
            alt="Chai Steam"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#24150f] to-transparent" />
        </div>
      </div>

      {/* Search and Quick Filters Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#ebdcd0] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#8e3a1d] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search chai, samosas, bun maska..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fcf8f3] border border-[#d8c3b2] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#2d1b13] placeholder-[#99877b] focus:outline-none focus:border-[#8e3a1d] focus:bg-white transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {filterPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setSelectedFilter(pill.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedFilter === pill.id
                    ? 'bg-[#8e3a1d] text-white shadow-xs'
                    : 'bg-[#f8eee3] text-[#6b584d] hover:bg-[#ede0d1]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="pt-2 border-t border-[#ebdcd0] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#2d1b13] text-white shadow-sm'
                    : 'bg-white text-[#5d4b40] hover:bg-[#fbf1e8] border border-[#ebdcd0]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[#7d6558]">
            Showing <strong className="text-[#2d1b13]">{filteredItems.length}</strong> delicious creations
          </p>
          <div className="text-xs text-[#7d6558]">
            Prices listed in <strong className="text-[#8e3a1d]">{currency === 'CAD' ? 'CAD ($)' : 'INR (₹)'}</strong>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#ebdcd0]">
            <div className="w-16 h-16 rounded-full bg-[#fbf1e8] flex items-center justify-center text-[#8e3a1d] mx-auto mb-3">
              <Search className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2d1b13]">No dishes matched your search</h3>
            <p className="text-xs text-[#7d6558] mt-1 max-w-sm mx-auto">
              Try searching for &quot;masala&quot;, &quot;bun maska&quot;, or reset your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedFilter('all');
              }}
              className="mt-4 bg-[#8e3a1d] text-white px-5 py-2 rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const displayPrice = currency === 'CAD' ? `$${(item.cadPrice || item.price / 60).toFixed(2)}` : `₹${item.price}`;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-[#ebdcd0] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative h-48 overflow-hidden bg-[#f4ebe1]">
                      <img
                        src={item.image || ASSET_IMAGES.heroChai}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Dietary green dot badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-white/95 border border-[#206927] flex items-center justify-center shadow-xs">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#206927]" />
                        </div>
                        {item.tag && (
                          <span className="bg-[#8e3a1d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                            {item.tag}
                          </span>
                        )}
                      </div>

                      {/* Spice indicator */}
                      {item.spiceLevel && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Flame className="w-3 h-3 text-[#e89f53]" />
                          <span>{item.spiceLevel}</span>
                        </div>
                      )}

                      {/* Serving vessel note */}
                      {item.servingInfo && (
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2.5 py-0.5 rounded-lg">
                          {item.servingInfo}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif font-bold text-lg text-[#2d1b13] group-hover:text-[#8e3a1d] transition-colors">
                            {item.name}
                          </h3>
                          {item.hindiName && (
                            <p className="text-xs text-[#a07a61] mt-0.5">{item.hindiName}</p>
                          )}
                        </div>
                        <span className="font-serif font-bold text-lg text-[#8e3a1d] shrink-0">
                          {displayPrice}
                        </span>
                      </div>

                      <p className="text-xs text-[#6f5647] mt-2.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0">
                    <div className="pt-4 border-t border-[#ebdcd0] flex items-center gap-2">
                      <button
                        onClick={() => onOpenCustomizer(item)}
                        className="flex-1 bg-[#fbf1e8] hover:bg-[#8e3a1d] hover:text-white text-[#8e3a1d] text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Customize</span>
                      </button>

                      <button
                        onClick={() => onQuickAddToCart(item)}
                        className="bg-[#8e3a1d] hover:bg-[#a64523] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chai Catering / Office Order Callout */}
      <div className="bg-[#fdf3ec] rounded-3xl p-6 sm:p-8 border border-[#e8c7b0] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#8e3a1d] text-white flex items-center justify-center shrink-0">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-[#2d1b13] text-base">
              Ordering Chai For Your Team or Meeting?
            </h4>
            <p className="text-xs text-[#7d6558] mt-0.5">
              Get 500ml & 1000ml spill-proof thermal flasks delivered piping hot with disposable clay kulhads.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('contact')}
          className="bg-[#8e3a1d] hover:bg-[#a64523] text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors whitespace-nowrap"
        >
          Book Chai Flask Subscription
        </button>
      </div>
    </div>
  );
};

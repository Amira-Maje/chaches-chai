import React, { useState, useEffect } from 'react';
import { CUSTOMER_REVIEWS, CAFE_LOCATIONS } from '../data/mockData';
import { ReviewItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { syncReviewToSupabase } from '../lib/supabase';
import { 
  Star, 
  ThumbsUp, 
  MessageSquarePlus, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Heart, 
  Filter, 
  Check, 
  RefreshCw 
} from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(CUSTOMER_REVIEWS);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<'all' | '5' | '4'>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [upvotedReviewIds, setUpvotedReviewIds] = useState<string[]>([]);

  // New review form state
  const [author, setAuthor] = useState(user?.displayName || '');
  const [branch, setBranch] = useState(CAFE_LOCATIONS[0].name);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [favoriteItems, setFavoriteItems] = useState('Masala Kulhad Chai, Warm Bun Maska');
  const [submittedMessage, setSubmittedMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reviews from Cloud SQL on mount
  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: ReviewItem[] = data.map((item: any) => ({
            id: String(item.id),
            author: item.author,
            initials: item.initials,
            role: item.role || 'Chai Lover',
            branch: item.branch,
            rating: item.rating,
            date: new Date(item.createdAt || Date.now()).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
            }),
            text: item.text,
            itemsMentioned: typeof item.itemsMentioned === 'string'
              ? item.itemsMentioned.split(',').map((s: string) => s.trim())
              : Array.isArray(item.itemsMentioned)
              ? item.itemsMentioned
              : ['Kulhad Chai'],
            helpfulCount: item.helpfulCount || 0,
            verified: item.verified ?? true,
            badge: item.badge || 'Verified Visit',
          }));
          setReviewsList(mapped);
        }
      })
      .catch((err) => console.warn('Could not load reviews from DB:', err));
  }, []);

  useEffect(() => {
    if (user?.displayName && !author) {
      setAuthor(user.displayName);
    }
  }, [user]);

  const handleUpvote = async (id: string) => {
    if (upvotedReviewIds.includes(id)) return;
    setUpvotedReviewIds([...upvotedReviewIds, id]);
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );

    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      try {
        await fetch(`/api/reviews/${numericId}/helpful`, { method: 'POST' });
      } catch (err) {
        console.warn('Upvote sync notice:', err);
      }
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    setIsSubmitting(true);

    const initials = author
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'CL';

    let savedId = `rev-${Date.now()}`;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          author,
          branch,
          rating,
          text,
          itemsMentioned: favoriteItems,
          badge: 'Verified Visit',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.review?.id) {
          savedId = String(data.review.id);
        }
      }

      // Dual-sync to Supabase if configured
      syncReviewToSupabase({
        user_id: user?.uid || null,
        author,
        initials,
        role: "Chachee's Community Member",
        branch,
        rating,
        text,
        items_mentioned: favoriteItems || null,
        helpful_count: 0,
        verified: true,
        badge: 'Verified Visit',
      });
    } catch (err) {
      console.warn('Backend review save notice:', err);
    } finally {
      setIsSubmitting(false);
      const newRev: ReviewItem = {
        id: savedId,
        author,
        initials,
        role: "Chachee's Community Member",
        branch,
        rating,
        date: 'Just now',
        text,
        itemsMentioned: favoriteItems.split(',').map((s) => s.trim()).filter(Boolean),
        helpfulCount: 1,
        verified: true,
        badge: 'Verified Visit',
      };

      setReviewsList([newRev, ...reviewsList]);
      setSubmittedMessage(true);
      setTimeout(() => {
        setSubmittedMessage(false);
        setIsWriteModalOpen(false);
        setText('');
      }, 1500);
    }
  };

  const filteredReviews = reviewsList.filter((r) => {
    if (selectedRatingFilter === '5') return r.rating === 5;
    if (selectedRatingFilter === '4') return r.rating === 4;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#24150f] rounded-3xl p-8 sm:p-12 text-white border border-[#422c21]">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e89f53] flex items-center gap-1.5 mb-2">
            <Heart className="w-4 h-4 fill-current text-[#e89f53]" />
            <span>Chai Wallah Chronicles</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Unfiltered Love from Our Community
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#d5c3b7] leading-relaxed">
            From early morning college catchups to midnight deadlines fueled by cutting chai — read genuine memories shared by our patrons across India.
          </p>
        </div>

        {/* Aggregate Score Card */}
        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4">
            <div className="text-5xl font-serif font-bold text-[#e89f53]">4.9</div>
            <div>
              <div className="flex text-[#e89f53]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#b8a79d] mt-1">Based on 8,400+ Verified Patron Reviews</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-[#d5c3b7]">
            <div className="flex items-center gap-2">
              <span className="w-12 text-[11px]">5 Stars</span>
              <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-[#e89f53] h-full w-[94%]" />
              </div>
              <span className="w-8 text-right font-mono text-[11px]">94%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-[11px]">4 Stars</span>
              <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-[#e89f53] h-full w-[5%]" />
              </div>
              <span className="w-8 text-right font-mono text-[11px]">5%</span>
            </div>
          </div>

          <div className="flex md:justify-end">
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="bg-[#8e3a1d] hover:bg-[#a64523] text-white font-bold py-3 px-6 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Share Your Chai Story</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#7d6558] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#8e3a1d]" />
            <span>Filter:</span>
          </span>
          <button
            onClick={() => setSelectedRatingFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedRatingFilter === 'all'
                ? 'bg-[#8e3a1d] text-white'
                : 'bg-[#f8eee3] text-[#6b584d] hover:bg-[#ede0d1]'
            }`}
          >
            All Reviews ({reviewsList.length})
          </button>
          <button
            onClick={() => setSelectedRatingFilter('5')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedRatingFilter === '5'
                ? 'bg-[#8e3a1d] text-white'
                : 'bg-[#f8eee3] text-[#6b584d] hover:bg-[#ede0d1]'
            }`}
          >
            ⭐ 5 Stars Only
          </button>
        </div>

        <span className="text-xs text-[#7d6558]">
          Showing {filteredReviews.length} stories
        </span>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => {
          const isUpvoted = upvotedReviewIds.includes(rev.id);
          return (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#ebdcd0] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-[#e89f53]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#8e3a1d] font-bold bg-[#fdf3ec] px-2 py-0.5 rounded-full border border-[#8e3a1d]/20">
                    {rev.badge || 'Verified Regular'}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-[#2d1b13] leading-relaxed italic">
                  &ldquo;{rev.text}&rdquo;
                </p>

                {/* Mentioned dishes */}
                {rev.itemsMentioned && rev.itemsMentioned.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {rev.itemsMentioned.map((dish, i) => (
                      <span
                        key={i}
                        className="bg-[#fbf4eb] text-[#8e3a1d] text-[10px] font-medium px-2 py-0.5 rounded-md"
                      >
                        ✓ {dish}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-[#ebdcd0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#8e3a1d] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {rev.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2d1b13]">{rev.author}</h4>
                    <p className="text-[10px] text-[#7d6558]">{rev.branch} • {rev.date}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleUpvote(rev.id)}
                  disabled={isUpvoted}
                  className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-xl transition-colors ${
                    isUpvoted
                      ? 'bg-[#e9f5e6] text-[#206927]'
                      : 'hover:bg-[#f8eee3] text-[#7d6558]'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{rev.helpfulCount}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fffcf7] rounded-3xl max-w-lg w-full shadow-2xl border border-[#e6d7c8] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#2d1b13] text-white p-6 relative">
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold uppercase tracking-wider text-[#e89f53]">
                Patron Review
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">
                Share Your Chachee&apos;s Memory
              </h3>
            </div>

            {submittedMessage ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 bg-[#e9f5e6] text-[#206927] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#2d1b13]">Thank you for your warmth!</h4>
                <p className="text-xs text-[#7d6558]">
                  Your review has been verified and added to the community chronicles.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d] block mb-1">
                    Your Rating:
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-[#e89f53] hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${rating >= star ? 'fill-current' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                      Your Full Name:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Rao"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                      Cafe Branch Visited:
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                    >
                      {CAFE_LOCATIONS.map((l) => (
                        <option key={l.id} value={l.name}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                    What Did You Savor? (Separated by commas)
                  </label>
                  <input
                    type="text"
                    value={favoriteItems}
                    onChange={(e) => setFavoriteItems(e.target.value)}
                    placeholder="e.g. Kulhad Chai, Bun Maska, Mumbai Vada Pav"
                    className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#7d6558] block mb-1">
                    Your Story & Feedback:
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tell us about the chai, the hospitality, or the vibe..."
                    className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl px-3 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#7d6558] hover:bg-[#f8eee3]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#8e3a1d] hover:bg-[#a64523] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

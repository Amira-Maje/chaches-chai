import React, { useState, useEffect } from 'react';
import { MenuItem, CartItem, PageType } from '../types';
import { MENU_ITEMS, ASSET_IMAGES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { syncOrderToSupabase } from '../lib/supabase';
import { 
  Bike, 
  Store, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  Check, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Flame,
  Search,
  SlidersHorizontal
} from 'lucide-react';

interface OrderPageProps {
  cart: CartItem[];
  onOpenCustomizer: (item: MenuItem) => void;
  onQuickAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (orderSummary: {
    orderId: string;
    items: CartItem[];
    subtotal: number;
    taxes: number;
    deliveryFee: number;
    discount: number;
    total: number;
    orderType: 'delivery' | 'takeaway';
    address?: string;
    outlet?: string;
  }) => void;
  currency: 'INR' | 'CAD';
}

export const OrderPage: React.FC<OrderPageProps> = ({
  cart,
  onOpenCustomizer,
  onQuickAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess,
  currency,
}) => {
  const { user, token } = useAuth();
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [selectedOutlet, setSelectedOutlet] = useState('Colaba Flagship (Near Gateway)');
  const [deliveryAddress, setDeliveryAddress] = useState('402 Sea Green Apts, Colaba Causeway, Mumbai');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'chai' | 'snacks' | 'cold' | 'combos'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Promo state
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number; maxDiscount: number } | null>({
    code: 'CHACHEE20',
    discountPercent: 20,
    maxDiscount: currency === 'CAD' ? 5 : 100
  });
  const [promoError, setPromoError] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Filter items
  const filteredItems = MENU_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.hindiName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate bill
  const subtotal = cart.reduce((acc, curr) => acc + curr.pricePerUnit * curr.quantity, 0);
  let discountAmount = 0;
  if (appliedPromo) {
    discountAmount = Math.min((subtotal * appliedPromo.discountPercent) / 100, appliedPromo.maxDiscount);
  }

  const packagingFee = cart.length > 0 ? (currency === 'CAD' ? 0.30 : 20) : 0;
  const isFreeDelivery = subtotal >= (currency === 'CAD' ? 10 : 249) && orderType === 'delivery';
  const deliveryFee = orderType === 'delivery' ? (isFreeDelivery ? 0 : (currency === 'CAD' ? 1.00 : 35)) : 0;
  const taxes = Number((subtotal * 0.05).toFixed(2));
  const grandTotal = Math.max(0, subtotal - discountAmount + packagingFee + deliveryFee + taxes);

  const handleApplyPromo = (codeArg?: string) => {
    const code = (codeArg || promoCode).trim().toUpperCase();
    if (code === 'CHACHEE20') {
      setAppliedPromo({ code: 'CHACHEE20', discountPercent: 20, maxDiscount: currency === 'CAD' ? 5 : 100 });
      setPromoError('');
    } else if (code === 'KADAKCHAI') {
      setAppliedPromo({ code: 'KADAKCHAI', discountPercent: 15, maxDiscount: currency === 'CAD' ? 3 : 60 });
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try CHACHEE20 or KADAKCHAI');
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);

    let generatedOrderId = `CC-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customerName: user?.displayName || 'Chai Lover',
          customerPhone: '760414533',
          customerEmail: user?.email || 'majeamu98@gmail.com',
          deliveryAddress: orderType === 'delivery' ? deliveryAddress : selectedOutlet,
          orderType,
          items: cart,
          subtotal: Math.round(subtotal),
          tax: Math.round(taxes),
          deliveryFee: Math.round(deliveryFee),
          total: Math.round(grandTotal),
          paymentMethod: 'cash_on_delivery',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.order?.id) {
          generatedOrderId = `CC-${data.order.id}`;
        }
      }

      // Dual-sync to Supabase if configured
      syncOrderToSupabase({
        user_id: user?.uid || null,
        customer_name: user?.displayName || 'Chai Lover',
        customer_phone: '760414533',
        customer_email: user?.email || 'majeamu98@gmail.com',
        delivery_address: orderType === 'delivery' ? deliveryAddress : selectedOutlet,
        order_type: orderType,
        items: JSON.stringify(cart),
        subtotal: Math.round(subtotal),
        tax: Math.round(taxes),
        delivery_fee: Math.round(deliveryFee),
        total: Math.round(grandTotal),
        status: 'confirmed',
        payment_method: 'cash_on_delivery',
      });
    } catch (err) {
      console.warn('Backend order save fallback:', err);
    } finally {
      setIsPlacingOrder(false);
      onCheckoutSuccess({
        orderId: generatedOrderId,
        items: [...cart],
        subtotal,
        taxes,
        deliveryFee,
        discount: discountAmount,
        total: grandTotal,
        orderType,
        address: orderType === 'delivery' ? deliveryAddress : undefined,
        outlet: orderType === 'takeaway' ? selectedOutlet : undefined,
      });
      onClearCart();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="bg-[#24150f] rounded-3xl p-6 sm:p-8 text-white mb-8 border border-[#422c21] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#e89f53] flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Express Online Kitchen • Average Delivery: 22 Mins</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Order Piping Hot Kulhad Chai & Snacks
          </h1>
          <p className="text-xs text-[#d5c3b7] mt-1">
            Carefully packaged in insulated thermal flasks to maintain boiling temperature right at your door.
          </p>
        </div>

        {/* Fulfillment switcher */}
        <div className="bg-[#382015] p-1 rounded-2xl flex items-center border border-[#523424] shrink-0">
          <button
            onClick={() => setOrderType('delivery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              orderType === 'delivery'
                ? 'bg-[#8e3a1d] text-white shadow-xs'
                : 'text-[#d5c3b7] hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Instant Delivery</span>
          </button>
          <button
            onClick={() => setOrderType('takeaway')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              orderType === 'takeaway'
                ? 'bg-[#8e3a1d] text-white shadow-xs'
                : 'text-[#d5c3b7] hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Takeaway Pickup</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Menu / Right Sticky Basket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Menu Items Selection (col-span-8) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Search & Category Filter */}
          <div className="bg-white rounded-3xl p-4 border border-[#ebdcd0] shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8e3a1d] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#fdf8f3] border border-[#d8c3b2] rounded-xl pl-10 pr-4 py-2 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'chai', label: '☕ Chais' },
                { id: 'snacks', label: '🥟 Street Snacks' },
                { id: 'cold', label: '🧊 Cold Brews' },
                { id: 'combos', label: '🍱 Combos' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id as any)}
                  className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === c.id
                      ? 'bg-[#8e3a1d] text-white'
                      : 'bg-[#f8eee3] text-[#6b584d] hover:bg-[#ede0d1]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dish List */}
          <div className="space-y-4">
            {filteredItems.map((dish) => {
              const displayPrice = currency === 'CAD' ? `$${(dish.cadPrice || dish.price / 60).toFixed(2)}` : `₹${dish.price}`;
              return (
                <div
                  key={dish.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ebdcd0] shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#f4ebe1] shrink-0">
                      <img
                        src={dish.image || ASSET_IMAGES.heroChai}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="w-4 h-4 rounded-xs border border-[#206927] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#206927]" />
                        </div>
                        <h3 className="font-serif font-bold text-base text-[#2d1b13] truncate">
                          {dish.name}
                        </h3>
                        {dish.tag && (
                          <span className="bg-[#fbf1e8] text-[#8e3a1d] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {dish.tag}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#6f5647] mt-1 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="font-serif font-bold text-[#8e3a1d] text-base">
                          {displayPrice}
                        </span>
                        {dish.servingInfo && (
                          <span className="text-[11px] text-[#7d6558] bg-[#f8eee3] px-2 py-0.5 rounded-md">
                            {dish.servingInfo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <button
                      onClick={() => onOpenCustomizer(dish)}
                      className="bg-[#fdf3ec] hover:bg-[#8e3a1d] hover:text-white text-[#8e3a1d] text-xs font-bold py-2 px-3 rounded-xl transition-all"
                    >
                      Customize
                    </button>
                    <button
                      onClick={() => onQuickAddToCart(dish)}
                      className="bg-[#8e3a1d] hover:bg-[#a64523] text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors shadow-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sticky Cart & Checkout Panel (col-span-5) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
          <div className="bg-white rounded-3xl border border-[#ebdcd0] shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#2d1b13] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#e89f53]" />
                <h3 className="font-serif font-bold text-base text-white">Live Order Basket</h3>
              </div>
              <span className="text-xs bg-[#8e3a1d] text-white px-2.5 py-0.5 rounded-full font-bold">
                {cart.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </div>

            {/* Address or Outlet info */}
            <div className="p-4 bg-[#fbf6f0] border-b border-[#ebdcd0] text-xs">
              {orderType === 'delivery' ? (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6558] block mb-1">
                    Delivering To:
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-white border border-[#d8c3b2] rounded-xl px-3 py-1.5 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6558] block mb-1">
                    Pickup Counter:
                  </label>
                  <select
                    value={selectedOutlet}
                    onChange={(e) => setSelectedOutlet(e.target.value)}
                    className="w-full bg-white border border-[#d8c3b2] rounded-xl px-3 py-1.5 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                  >
                    <option value="Colaba Flagship (Near Gateway)">Colaba Flagship (Mumbai)</option>
                    <option value="Bandra West Pali Hill">Bandra West Pali Hill (Mumbai)</option>
                    <option value="Indiranagar 100ft Road">Indiranagar 100ft Road (Bengaluru)</option>
                    <option value="Connaught Place Inner Circle">Connaught Place (Delhi)</option>
                    <option value="Koregaon Park Lane 6">Koregaon Park (Pune)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Basket items list */}
            <div className="p-4 max-h-64 overflow-y-auto space-y-3 divide-y divide-[#ebdcd0]">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-[#7d6558]">
                  <ShoppingBag className="w-8 h-8 mx-auto opacity-30 mb-2" />
                  <p className="text-xs font-medium">Your basket is waiting for hot chai!</p>
                </div>
              ) : (
                cart.map((cartItem) => (
                  <div key={cartItem.cartId} className="pt-3 first:pt-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#2d1b13] truncate">
                          {cartItem.item.name}
                        </p>
                        <p className="text-xs font-semibold text-[#8e3a1d]">
                          {currency === 'CAD' ? `$${cartItem.pricePerUnit.toFixed(2)}` : `₹${cartItem.pricePerUnit}`}
                        </p>
                        {cartItem.customization?.notes && (
                          <p className="text-[10px] text-[#7d6558] truncate">
                            {cartItem.customization.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#fdf8f3] border border-[#ebdcd0] rounded-xl px-2 py-0.5 shrink-0">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.cartId, -1)}
                          className="w-5 h-5 rounded hover:bg-[#8e3a1d] hover:text-white flex items-center justify-center text-[#8e3a1d]"
                        >
                          {cartItem.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3" />}
                        </button>
                        <span className="text-xs font-bold text-[#2d1b13] w-4 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.cartId, 1)}
                          className="w-5 h-5 rounded hover:bg-[#8e3a1d] hover:text-white flex items-center justify-center text-[#8e3a1d]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Promo Code & Bill Summary */}
            {cart.length > 0 && (
              <div className="p-4 bg-[#fbf6f0] border-t border-[#ebdcd0] space-y-3">
                {/* Promo input */}
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo (CHACHEE20)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-white border border-[#d8c3b2] rounded-xl px-3 py-1.5 text-xs text-[#2d1b13] placeholder-[#99877b] focus:outline-none focus:border-[#8e3a1d]"
                    />
                    <button
                      onClick={() => handleApplyPromo()}
                      className="bg-[#2d1b13] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#8e3a1d] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-[11px] text-[#206927] font-semibold mt-1">
                      ✓ Promo {appliedPromo.code} applied (20% off)
                    </p>
                  )}
                </div>

                {/* Calculation */}
                <div className="space-y-1.5 text-xs text-[#4b3c33] pt-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{currency === 'CAD' ? `$${subtotal.toFixed(2)}` : `₹${subtotal.toFixed(0)}`}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#206927] font-semibold">
                      <span>Discount</span>
                      <span>-{currency === 'CAD' ? `$${discountAmount.toFixed(2)}` : `₹${discountAmount.toFixed(0)}`}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Taxes (5% GST)</span>
                    <span>{currency === 'CAD' ? `$${taxes.toFixed(2)}` : `₹${taxes.toFixed(0)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eco Kulhad Pack</span>
                    <span>{currency === 'CAD' ? `$${packagingFee.toFixed(2)}` : `₹${packagingFee}`}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>{isFreeDelivery ? <strong className="text-[#206927]">FREE</strong> : (currency === 'CAD' ? `$${deliveryFee.toFixed(2)}` : `₹${deliveryFee}`)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[#ebdcd0] flex justify-between font-bold text-sm text-[#2d1b13]">
                    <span>Total Amount</span>
                    <span className="text-[#8e3a1d] text-base">
                      {currency === 'CAD' ? `$${grandTotal.toFixed(2)}` : `₹${grandTotal.toFixed(0)}`}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-[#8e3a1d] hover:bg-[#a64523] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-between shadow-lg transition-all"
                >
                  <span>{isPlacingOrder ? 'Confirming Order...' : 'Place Order Now'}</span>
                  <div className="flex items-center gap-1">
                    <span>{currency === 'CAD' ? `$${grandTotal.toFixed(2)}` : `₹${grandTotal.toFixed(0)}`}</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

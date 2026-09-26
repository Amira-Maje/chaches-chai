import React, { useState } from 'react';
import { CartItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { syncOrderToSupabase } from '../lib/supabase';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Bike, 
  Store, 
  Tag, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
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

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess,
  currency,
}) => {
  if (!isOpen) return null;

  const { user, token } = useAuth();
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [selectedOutlet, setSelectedOutlet] = useState('Colaba Flagship (Near Gateway)');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Sea Green Apts, Colaba, Mumbai');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number; maxDiscount: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [tip, setTip] = useState<number>(30);
  const [isProcessing, setIsProcessing] = useState(false);

  // Math
  const subtotal = cart.reduce((acc, curr) => acc + curr.pricePerUnit * curr.quantity, 0);

  let discountAmount = 0;
  if (appliedPromo) {
    discountAmount = Math.min((subtotal * appliedPromo.discountPercent) / 100, appliedPromo.maxDiscount);
  }

  const packagingFee = cart.length > 0 ? (currency === 'CAD' ? 0.30 : 20) : 0;
  const standardDeliveryFee = orderType === 'delivery' ? (currency === 'CAD' ? 1.00 : 35) : 0;
  const isFreeDelivery = subtotal >= (currency === 'CAD' ? 10 : 249) && orderType === 'delivery';
  const deliveryFee = isFreeDelivery ? 0 : standardDeliveryFee;

  const gstTax = Number((subtotal * 0.05).toFixed(2));
  const tipAmount = orderType === 'delivery' ? tip : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + gstTax + packagingFee + deliveryFee + tipAmount);

  const handleApplyPromo = (codeToApply?: string) => {
    const code = (codeToApply || promoCode).trim().toUpperCase();
    if (code === 'CHACHEE20') {
      setAppliedPromo({ code: 'CHACHEE20', discountPercent: 20, maxDiscount: currency === 'CAD' ? 5 : 100 });
      setPromoError('');
    } else if (code === 'KADAKCHAI') {
      setAppliedPromo({ code: 'KADAKCHAI', discountPercent: 15, maxDiscount: currency === 'CAD' ? 3 : 60 });
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try CHACHEE20 or KADAKCHAI');
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

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
          tax: Math.round(gstTax),
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
        tax: Math.round(gstTax),
        delivery_fee: Math.round(deliveryFee),
        total: Math.round(grandTotal),
        status: 'confirmed',
        payment_method: 'cash_on_delivery',
      });
    } catch (err) {
      console.warn('Backend order save fallback:', err);
    } finally {
      setIsProcessing(false);
      onCheckoutSuccess({
        orderId: generatedOrderId,
        items: [...cart],
        subtotal,
        taxes: gstTax,
        deliveryFee,
        discount: discountAmount,
        total: grandTotal,
        orderType,
        address: orderType === 'delivery' ? deliveryAddress : undefined,
        outlet: orderType === 'takeaway' ? selectedOutlet : undefined,
      });
      onClearCart();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#fffcf7] h-full shadow-2xl flex flex-col border-l border-[#e6d7c8] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 bg-[#2d1b13] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#8e3a1d] flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white">Your Chai Basket</h2>
              <p className="text-xs text-[#d5c3b7]">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} freshly brewed item(s)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Type Toggle */}
        <div className="p-4 bg-[#f8eee3] border-b border-[#e9dcce] shrink-0">
          <div className="grid grid-cols-2 p-1 bg-[#ede0d1] rounded-2xl gap-1">
            <button
              onClick={() => setOrderType('delivery')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                orderType === 'delivery'
                  ? 'bg-white text-[#8e3a1d] shadow-sm'
                  : 'text-[#6f5647] hover:text-[#2d1b13]'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Instant Delivery (25m)</span>
            </button>
            <button
              onClick={() => setOrderType('takeaway')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                orderType === 'takeaway'
                  ? 'bg-white text-[#8e3a1d] shadow-sm'
                  : 'text-[#6f5647] hover:text-[#2d1b13]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Self Takeaway (10m)</span>
            </button>
          </div>

          {/* Fulfillment details */}
          <div className="mt-3 text-xs">
            {orderType === 'delivery' ? (
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7d6558] block mb-1">
                  Deliver To Address:
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-white border border-[#dac8b8] rounded-xl px-3 py-1.5 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                />
              </div>
            ) : (
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7d6558] block mb-1">
                  Pick Up From Cafe Outlet:
                </label>
                <select
                  value={selectedOutlet}
                  onChange={(e) => setSelectedOutlet(e.target.value)}
                  className="w-full bg-white border border-[#dac8b8] rounded-xl px-3 py-1.5 text-xs text-[#2d1b13] focus:outline-none focus:border-[#8e3a1d]"
                >
                  <option value="Colaba Flagship (Near Gateway)">Colaba Flagship (Mumbai)</option>
                  <option value="Bandra West Pali Hill">Bandra West Pali Hill (Mumbai)</option>
                  <option value="Indiranagar 100ft Road">Indiranagar 100ft Road (Bengaluru)</option>
                  <option value="Connaught Place Inner Circle">Connaught Place (Delhi NCR)</option>
                  <option value="Koregaon Park Lane 6">Koregaon Park (Pune)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-[#ebdcd0]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#7d6558]">
              <div className="w-16 h-16 rounded-full bg-[#f8eee3] flex items-center justify-center text-[#8e3a1d] mb-4">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2d1b13]">Your basket is empty</h3>
              <p className="text-xs text-[#7d6558] mt-1 max-w-xs">
                Warm masala chai, hot bun maska, and crispy samosas are waiting for you.
              </p>
              <button
                onClick={onClose}
                className="mt-5 bg-[#8e3a1d] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#a64523] transition-colors"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            cart.map((cartItem) => (
              <div key={cartItem.cartId} className="pt-3.5 first:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#2d1b13] truncate">
                      {cartItem.item.name}
                    </h4>
                    <p className="text-xs font-semibold text-[#8e3a1d] mt-0.5">
                      {currency === 'CAD' ? `$${cartItem.pricePerUnit.toFixed(2)}` : `₹${cartItem.pricePerUnit}`}
                    </p>

                    {/* Customization pills */}
                    {cartItem.customization && (
                      <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-[#6b584d]">
                        {cartItem.customization.milk && (
                          <span className="bg-[#ede0d1] px-1.5 py-0.5 rounded-md">
                            {cartItem.customization.milk}
                          </span>
                        )}
                        {cartItem.customization.sweetness && (
                          <span className="bg-[#ede0d1] px-1.5 py-0.5 rounded-md">
                            {cartItem.customization.sweetness}
                          </span>
                        )}
                        {cartItem.customization.spice && (
                          <span className="bg-[#ede0d1] px-1.5 py-0.5 rounded-md">
                            {cartItem.customization.spice}
                          </span>
                        )}
                        {cartItem.customization.notes && (
                          <span className="bg-[#f5e6d8] text-[#8e3a1d] px-1.5 py-0.5 rounded-md">
                            {cartItem.customization.notes}
                          </span>
                        )}
                        {cartItem.customization.addOns && cartItem.customization.addOns.length > 0 && (
                          <span className="bg-[#e4efe0] text-[#2c6126] px-1.5 py-0.5 rounded-md">
                            +{cartItem.customization.addOns.join(', ')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quantity control */}
                  <div className="flex items-center gap-2 bg-[#fdf8f3] border border-[#ebdcd0] rounded-xl px-2 py-1 shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(cartItem.cartId, -1)}
                      className="w-5 h-5 rounded-md hover:bg-[#8e3a1d] hover:text-white flex items-center justify-center text-[#8e3a1d] transition-colors"
                    >
                      {cartItem.quantity === 1 ? (
                        <Trash2 className="w-3 h-3 text-red-500" />
                      ) : (
                        <Minus className="w-3 h-3" />
                      )}
                    </button>
                    <span className="text-xs font-bold text-[#2d1b13] w-4 text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(cartItem.cartId, 1)}
                      className="w-5 h-5 rounded-md hover:bg-[#8e3a1d] hover:text-white flex items-center justify-center text-[#8e3a1d] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo code & Summary Section (only if cart has items) */}
        {cart.length > 0 && (
          <div className="p-4 bg-[#fbf6f0] border-t border-[#ebdcd0] space-y-3.5 shrink-0">
            {/* Promo Code Input */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-[#8e3a1d] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Enter CHACHEE20 or KADAKCHAI"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-[#d8c3b2] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2d1b13] placeholder-[#99877b] focus:outline-none focus:border-[#8e3a1d]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyPromo()}
                  className="bg-[#342218] hover:bg-[#8e3a1d] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Promo suggestions */}
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-[#7d6558]">Try:</span>
                <button
                  onClick={() => {
                    setPromoCode('CHACHEE20');
                    handleApplyPromo('CHACHEE20');
                  }}
                  className="text-[10px] font-bold text-[#8e3a1d] bg-[#fdf3ec] px-1.5 py-0.5 rounded border border-[#8e3a1d]/30 hover:bg-[#8e3a1d] hover:text-white transition-colors"
                >
                  CHACHEE20 (20% OFF)
                </button>
                <button
                  onClick={() => {
                    setPromoCode('KADAKCHAI');
                    handleApplyPromo('KADAKCHAI');
                  }}
                  className="text-[10px] font-bold text-[#8e3a1d] bg-[#fdf3ec] px-1.5 py-0.5 rounded border border-[#8e3a1d]/30 hover:bg-[#8e3a1d] hover:text-white transition-colors"
                >
                  KADAKCHAI
                </button>
              </div>

              {appliedPromo && (
                <div className="mt-1.5 text-xs text-[#206927] font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Code {appliedPromo.code} applied successfully!</span>
                </div>
              )}
              {promoError && (
                <p className="mt-1 text-xs text-red-600">{promoError}</p>
              )}
            </div>

            {/* Bill Breakdown */}
            <div className="bg-white rounded-2xl p-3 border border-[#e4d3c3] space-y-1.5 text-xs text-[#4b3c33]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#2d1b13]">
                  {currency === 'CAD' ? `$${subtotal.toFixed(2)}` : `₹${subtotal.toFixed(0)}`}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#206927]">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span>-{currency === 'CAD' ? `$${discountAmount.toFixed(2)}` : `₹${discountAmount.toFixed(0)}`}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Govt Taxes (5% GST)</span>
                <span>{currency === 'CAD' ? `$${gstTax.toFixed(2)}` : `₹${gstTax.toFixed(0)}`}</span>
              </div>

              <div className="flex justify-between">
                <span>Eco Kulhad & Thermal Pack</span>
                <span>{currency === 'CAD' ? `$${packagingFee.toFixed(2)}` : `₹${packagingFee}`}</span>
              </div>

              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span>
                    {isFreeDelivery ? (
                      <span className="text-[#206927] font-semibold">FREE (Above ₹249)</span>
                    ) : (
                      currency === 'CAD' ? `$${deliveryFee.toFixed(2)}` : `₹${deliveryFee}`
                    )}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-[#ebdcd0] flex justify-between text-sm font-bold text-[#2d1b13]">
                <span>To Pay</span>
                <span className="text-[#8e3a1d] text-base">
                  {currency === 'CAD' ? `$${grandTotal.toFixed(2)}` : `₹${grandTotal.toFixed(0)}`}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-[#8e3a1d] hover:bg-[#a64523] disabled:opacity-50 text-white py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-between shadow-lg transition-all active:scale-[0.99]"
            >
              <span>
                {isProcessing ? 'Simulating Kitchen Order...' : `Place ${orderType === 'delivery' ? 'Delivery' : 'Takeaway'} Order`}
              </span>
              <div className="flex items-center gap-1 font-bold">
                <span>{currency === 'CAD' ? `$${grandTotal.toFixed(2)}` : `₹${grandTotal.toFixed(0)}`}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#7d6558]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#206927]" />
              <span>100% Spill-Proof Guarantee & Contactless Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

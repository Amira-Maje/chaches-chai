import React, { useState } from 'react';
import { MenuItem, CartItemCustomization } from '../types';
import { X, Plus, Minus, Check, Flame, Sparkles } from 'lucide-react';

interface ProductCustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, customization: CartItemCustomization, unitPrice: number) => void;
  currency: 'INR' | 'CAD';
}

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
  currency,
}) => {
  if (!isOpen || !item) return null;

  const isChai = item.category === 'chai';

  // State
  const [quantity, setQuantity] = useState(1);
  const [milk, setMilk] = useState('Full Cream Milk');
  const [sweetness, setSweetness] = useState('Regular (Medium)');
  const [spice, setSpice] = useState<string>(item.spiceLevel || 'Kadak');
  const [servingVessel, setServingVessel] = useState('Terracotta Clay Kulhad');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const milkOptions = [
    { label: 'Full Cream Milk', price: 0, tag: 'Traditional & Rich' },
    { label: 'Oat Milk', price: 25, tag: 'Plant-based creamy' },
    { label: 'Almond Milk', price: 30, tag: 'Nutty & light' },
    { label: 'Toned Light Milk', price: 0, tag: 'Lower fat' },
  ];

  const sweetnessOptions = [
    { label: 'Regular (Medium)', price: 0 },
    { label: 'Organic Desi Gur (Jaggery)', price: 10, highlight: true },
    { label: 'Less Sweet (Mild)', price: 0 },
    { label: 'Extra Sweet (Meethi)', price: 0 },
    { label: 'Feekhi (Zero Sugar)', price: 0 },
  ];

  const spiceOptions = [
    { label: 'Kadak (Classic Spice)', tag: 'Signature' },
    { label: 'Extra Ginger (Double Adrak)', tag: '+₹10', extraPrice: 10 },
    { label: 'Cardamom Rich (Elaichi)', tag: 'Aromatic' },
    { label: 'Feisty (Black Pepper & Clove)', tag: 'Winter warm' },
    { label: 'Mild (Gentle warm)', tag: 'Kids friendly' },
  ];

  const vesselOptions = [
    { label: 'Terracotta Clay Kulhad', desc: '100% natural, earthen aroma, eco-friendly' },
    { label: 'Mumbai Tapri Glass Tumbler', desc: 'Authentic street tapri experience' },
    { label: 'Insulated Thermal Flask/Cup', desc: 'Keeps steaming hot on the move' },
  ];

  const addOnOptions = [
    { id: 'bun-maska', name: 'Add Maska Bun (+₹55)', price: 55 },
    { id: 'samosa-single', name: 'Add 1x Crispy Punjabi Samosa (+₹30)', price: 30 },
    { id: 'parle-g', name: 'Classic Parle-G Biscuit Dip Pack (+₹10)', price: 10 },
  ];

  const toggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) {
      setSelectedAddOns(selectedAddOns.filter((x) => x !== id));
    } else {
      setSelectedAddOns([...selectedAddOns, id]);
    }
  };

  // Calculate unit price based on options
  const basePrice = currency === 'CAD' ? (item.cadPrice || item.price / 60) : item.price;
  
  // Additional costs in INR
  let additionalCostINR = 0;
  if (isChai) {
    const milkObj = milkOptions.find((m) => m.label === milk);
    if (milkObj) additionalCostINR += milkObj.price;

    const sweetObj = sweetnessOptions.find((s) => s.label === sweetness);
    if (sweetObj) additionalCostINR += sweetObj.price;

    const spiceObj = spiceOptions.find((s) => s.label === spice);
    if (spiceObj?.extraPrice) additionalCostINR += spiceObj.extraPrice;
  }

  addOnOptions.forEach((addOn) => {
    if (selectedAddOns.includes(addOn.id)) {
      additionalCostINR += addOn.price;
    }
  });

  const additionalCostConverted = currency === 'CAD' ? additionalCostINR / 60 : additionalCostINR;
  const unitPrice = Number((basePrice + additionalCostConverted).toFixed(2));
  const totalPrice = Number((unitPrice * quantity).toFixed(2));

  const handleConfirmAdd = () => {
    const customization: CartItemCustomization = {
      milk: isChai ? milk : undefined,
      sweetness: isChai ? sweetness : undefined,
      spice: isChai ? spice : undefined,
      addOns: selectedAddOns.map((id) => addOnOptions.find((o) => o.id === id)?.name || id),
      notes: notes.trim() ? `${servingVessel ? `[${servingVessel}] ` : ''}${notes}` : servingVessel ? `[${servingVessel}]` : undefined,
    };

    onAddToCart(item, quantity, customization, unitPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fffcf7] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#e6d7c8] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-[#2d1b13] text-white p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-[#e89f53] text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customize Your Order</span>
          </div>

          <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <span>{item.name}</span>
            {item.hindiName && (
              <span className="text-sm font-normal text-[#e89f53] font-sans">
                {item.hindiName}
              </span>
            )}
          </h3>

          <p className="text-xs text-[#d5c3b7] mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#2d1b13]">
          {/* Serving Vessel (For Chais) */}
          {isChai && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8e3a1d] mb-2.5">
                1. Choose Serving Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {vesselOptions.map((v) => {
                  const isSelected = servingVessel === v.label;
                  return (
                    <button
                      key={v.label}
                      type="button"
                      onClick={() => setServingVessel(v.label)}
                      className={`text-left p-3 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-[#8e3a1d] bg-[#fdf3ec] ring-2 ring-[#8e3a1d]/20'
                          : 'border-[#ebdcd0] hover:border-[#8e3a1d]/40 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2d1b13]">{v.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#8e3a1d]" />}
                      </div>
                      <p className="text-[10px] text-[#7d6558] mt-1 leading-tight">{v.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Milk Options */}
          {isChai && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8e3a1d]">
                  2. Milk Choice
                </label>
                <span className="text-[10px] text-[#7d6558]">Plant-based available</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {milkOptions.map((m) => {
                  const isSelected = milk === m.label;
                  return (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => setMilk(m.label)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? 'border-[#8e3a1d] bg-[#fdf3ec] font-semibold text-[#8e3a1d]'
                          : 'border-[#ebdcd0] hover:border-[#8e3a1d]/40 bg-white text-[#2d1b13]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{m.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#8e3a1d]" />}
                      </div>
                      {m.price > 0 && (
                        <span className="text-[10px] font-bold text-[#8e3a1d] block mt-0.5">
                          +{currency === 'CAD' ? `$${(m.price / 60).toFixed(2)}` : `₹${m.price}`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sweetness */}
          {isChai && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8e3a1d] mb-2.5">
                3. Sweetness & Sweetener
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sweetnessOptions.map((s) => {
                  const isSelected = sweetness === s.label;
                  return (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setSweetness(s.label)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? 'border-[#8e3a1d] bg-[#fdf3ec] font-semibold text-[#8e3a1d]'
                          : 'border-[#ebdcd0] hover:border-[#8e3a1d]/40 bg-white text-[#2d1b13]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{s.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#8e3a1d] shrink-0" />}
                      </div>
                      {s.price > 0 && (
                        <span className="text-[10px] font-bold text-[#8e3a1d] block mt-0.5">
                          +{currency === 'CAD' ? `$${(s.price / 60).toFixed(2)}` : `₹${s.price}`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spiciness / Kadak */}
          {isChai && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8e3a1d] mb-2.5 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#e89f53]" />
                <span>4. Kadak Intensity & Spice</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {spiceOptions.map((sp) => {
                  const isSelected = spice === sp.label;
                  return (
                    <button
                      key={sp.label}
                      type="button"
                      onClick={() => setSpice(sp.label)}
                      className={`text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#8e3a1d] bg-[#fdf3ec] font-semibold text-[#8e3a1d]'
                          : 'border-[#ebdcd0] hover:border-[#8e3a1d]/40 bg-white text-[#2d1b13]'
                      }`}
                    >
                      <div>
                        <span>{sp.label}</span>
                        <span className="text-[10px] text-[#7d6558] block">{sp.tag}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#8e3a1d]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Snack Pairings */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8e3a1d] mb-2.5">
              Make it a Chai Session (Add-Ons)
            </label>
            <div className="space-y-2">
              {addOnOptions.map((addOn) => {
                const isChecked = selectedAddOns.includes(addOn.id);
                return (
                  <div
                    key={addOn.id}
                    onClick={() => toggleAddOn(addOn.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isChecked
                        ? 'border-[#8e3a1d] bg-[#fdf3ec]'
                        : 'border-[#ebdcd0] hover:border-[#8e3a1d]/40 bg-white'
                    }`}
                  >
                    <span className="text-xs font-medium text-[#2d1b13]">{addOn.name}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isChecked
                          ? 'bg-[#8e3a1d] border-[#8e3a1d] text-white'
                          : 'border-[#c4b5ac] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8e3a1d] mb-1.5">
              Special Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Extra hot, ginger pounded fresh, less ice..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-[#ebdcd0] rounded-xl px-3.5 py-2.5 text-xs text-[#2d1b13] placeholder-[#99877b] focus:outline-none focus:border-[#8e3a1d]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#f7efe6] border-t border-[#ebdcd0] p-5 shrink-0 flex items-center justify-between gap-4">
          {/* Quantity */}
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-[#d8c3b2]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-full bg-[#fdf3ec] hover:bg-[#8e3a1d] hover:text-white text-[#8e3a1d] flex items-center justify-center transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-sm text-[#2d1b13]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-full bg-[#fdf3ec] hover:bg-[#8e3a1d] hover:text-white text-[#8e3a1d] flex items-center justify-center transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Button with Total */}
          <button
            onClick={handleConfirmAdd}
            className="flex-1 bg-[#8e3a1d] hover:bg-[#a64523] text-white py-3 px-5 rounded-2xl font-semibold text-sm flex items-center justify-between shadow-md transition-all active:scale-[0.98]"
          >
            <span>Add to Order</span>
            <span className="font-bold">
              {currency === 'CAD' ? `$${totalPrice.toFixed(2)}` : `₹${totalPrice.toFixed(0)}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

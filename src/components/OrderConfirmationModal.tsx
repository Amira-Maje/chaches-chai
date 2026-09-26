import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Bike, 
  Store, 
  Phone, 
  MapPin, 
  X, 
  Coffee, 
  Sparkles,
  Receipt
} from 'lucide-react';
import { CartItem } from '../types';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
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
  } | null;
  currency: 'INR' | 'CAD';
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  orderData,
  currency,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Simulate kitchen order progress
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      return;
    }
    const timer1 = setTimeout(() => setCurrentStep(2), 4000);
    const timer2 = setTimeout(() => setCurrentStep(3), 9000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  if (!isOpen || !orderData) return null;

  const steps = [
    { step: 1, title: 'Order Confirmed', desc: 'Chai master notified' },
    { step: 2, title: 'Slow-Brewing Fresh', desc: 'Crushing ginger & cardamom in degchi' },
    { step: 3, title: orderData.orderType === 'delivery' ? 'Rider Assigned' : 'Ready for Counter Pickup', desc: orderData.orderType === 'delivery' ? 'Hot flask dispatched' : 'Packaged in earthen bag' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fffcf7] rounded-3xl max-w-lg w-full shadow-2xl border border-[#e6d7c8] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Success Banner */}
        <div className="bg-[#2d1b13] text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-[#23451e] border-2 border-[#4ade80] rounded-full flex items-center justify-center mx-auto mb-3 text-[#4ade80] shadow-lg animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[#e89f53]">
            Piping Hot Chai On The Way
          </span>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Order Confirmed!
          </h2>
          <p className="text-xs text-[#d5c3b7] mt-1">
            Order Reference: <span className="font-mono font-bold text-[#e89f53]">{orderData.orderId}</span>
          </p>
        </div>

        {/* Live Status Tracker */}
        <div className="p-6 bg-[#fdf8f2] border-b border-[#ebdcd0]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8e3a1d] mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8e3a1d] animate-spin" />
              <span>Est. {orderData.orderType === 'delivery' ? 'Arrival: 22-25 mins' : 'Ready in: 10 mins'}</span>
            </div>
            <span className="bg-[#8e3a1d]/10 text-[#8e3a1d] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              {orderData.orderType === 'delivery' ? 'Express Delivery' : 'Quick Counter Pickup'}
            </span>
          </div>

          {/* Stepper */}
          <div className="relative flex justify-between">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#e4d3c3] -z-0" />
            <div 
              className="absolute top-4 left-6 h-0.5 bg-[#8e3a1d] -z-0 transition-all duration-700"
              style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '90%' }}
            />

            {steps.map((s) => {
              const isDone = currentStep >= s.step;
              const isCurrent = currentStep === s.step;
              return (
                <div key={s.step} className="flex flex-col items-center relative z-10 max-w-[100px] text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-[#8e3a1d] text-white ring-4 ring-[#8e3a1d]/20'
                        : 'bg-white border-2 border-[#d8c3b2] text-[#99877b]'
                    }`}
                  >
                    {s.step === 2 ? <Coffee className="w-4 h-4" /> : s.step}
                  </div>
                  <span className={`text-[11px] font-bold mt-2 ${isCurrent ? 'text-[#8e3a1d]' : 'text-[#3d2e26]'}`}>
                    {s.title}
                  </span>
                  <span className="text-[9px] text-[#7d6558] leading-tight mt-0.5">
                    {s.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fulfillment location */}
        <div className="px-6 py-3 bg-[#f8eee3] border-b border-[#ebdcd0] flex items-center gap-3 text-xs text-[#4b3c33]">
          {orderData.orderType === 'delivery' ? (
            <>
              <Bike className="w-4 h-4 text-[#8e3a1d] shrink-0" />
              <div className="truncate">
                <span className="font-bold">Delivering to: </span>
                <span>{orderData.address || 'Your saved address'}</span>
              </div>
            </>
          ) : (
            <>
              <Store className="w-4 h-4 text-[#8e3a1d] shrink-0" />
              <div className="truncate">
                <span className="font-bold">Pick up from: </span>
                <span>{orderData.outlet || 'Colaba Flagship Outlet'}</span>
              </div>
            </>
          )}
        </div>

        {/* Receipt items list */}
        <div className="p-6 max-h-56 overflow-y-auto space-y-2 text-xs divide-y divide-[#ebdcd0]">
          <div className="flex items-center gap-1.5 font-bold text-[#8e3a1d] pb-1 uppercase tracking-wider text-[11px]">
            <Receipt className="w-3.5 h-3.5" />
            <span>Order Summary</span>
          </div>

          {orderData.items.map((item) => (
            <div key={item.cartId} className="pt-2 first:pt-0 flex justify-between items-start">
              <div>
                <span className="font-bold text-[#2d1b13]">
                  {item.quantity}x {item.item.name}
                </span>
                {item.customization?.notes && (
                  <p className="text-[10px] text-[#7d6558]">{item.customization.notes}</p>
                )}
              </div>
              <span className="font-semibold text-[#2d1b13]">
                {currency === 'CAD' ? `$${(item.pricePerUnit * item.quantity).toFixed(2)}` : `₹${item.pricePerUnit * item.quantity}`}
              </span>
            </div>
          ))}

          <div className="pt-2 flex justify-between font-bold text-sm text-[#2d1b13]">
            <span>Total Paid</span>
            <span className="text-[#8e3a1d]">
              {currency === 'CAD' ? `$${orderData.total.toFixed(2)}` : `₹${orderData.total.toFixed(0)}`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 bg-[#f5eade] border-t border-[#ebdcd0] flex gap-3">
          <a
            href="tel:760414533"
            className="flex-1 bg-white hover:bg-[#fcf8f4] text-[#8e3a1d] border border-[#d8c3b2] py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Chai Master (760414533)</span>
          </a>
          <button
            onClick={onClose}
            className="flex-1 bg-[#8e3a1d] hover:bg-[#a64523] text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors shadow-sm"
          >
            Back to Chai Cafe
          </button>
        </div>
      </div>
    </div>
  );
};

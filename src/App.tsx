/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageType, MenuItem, CartItem, CartItemCustomization, TableBooking } from './types';
import { MENU_ITEMS } from './data/mockData';
import { AuthProvider } from './context/AuthContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductCustomizerModal } from './components/ProductCustomizerModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { TableBookingSuccessModal } from './components/TableBookingSuccessModal';
import { UserAccountModal } from './components/UserAccountModal';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { OrderPage } from './pages/OrderPage';
import { BookTablePage } from './pages/BookTablePage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

import { CheckCircle2, Coffee } from 'lucide-react';

function ChaiCafeApp() {
  // Navigation
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [currency, setCurrency] = useState<'INR' | 'CAD'>('INR');

  // Cart state with initial friendly item so user can see it right away
  const [cart, setCart] = useState<CartItem[]>([
    {
      cartId: 'init-1',
      item: MENU_ITEMS[0], // Masala Chai
      quantity: 2,
      pricePerUnit: 60,
      customization: {
        milk: 'Full Cream Milk',
        sweetness: 'Regular (Medium)',
        spice: 'Kadak',
        notes: '[Terracotta Clay Kulhad]',
      },
    },
    {
      cartId: 'init-2',
      item: MENU_ITEMS[6], // Bun Maska
      quantity: 1,
      pricePerUnit: 55,
      customization: {
        notes: 'Extra Amul Butter toasted warm',
      },
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Customizer modal state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // User Account Modal
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Order confirmation modal
  const [orderConfirmationData, setOrderConfirmationData] = useState<{
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
  } | null>(null);
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);

  // Table reservation confirmation modal
  const [latestTableBooking, setLatestTableBooking] = useState<TableBooking | null>(null);
  const [isTableBookingSuccessOpen, setIsTableBookingSuccessOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCurrency = () => {
    setCurrency((prev) => (prev === 'INR' ? 'CAD' : 'INR'));
  };

  const handleOpenCustomizer = (item: MenuItem) => {
    setCustomizingItem(item);
    setIsCustomizerOpen(true);
  };

  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    customization: CartItemCustomization,
    unitPrice: number
  ) => {
    const newItem: CartItem = {
      cartId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      item,
      quantity,
      customization,
      pricePerUnit: unitPrice,
    };
    setCart((prev) => [...prev, newItem]);
    showToast(`Added ${quantity}x ${item.name} to your basket! ☕`);
  };

  const handleQuickAddToCart = (item: MenuItem) => {
    const unitPrice = currency === 'CAD' ? (item.cadPrice || item.price / 60) : item.price;
    const newItem: CartItem = {
      cartId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      item,
      quantity: 1,
      pricePerUnit: Number(unitPrice.toFixed(2)),
      customization: {
        milk: item.category === 'chai' ? 'Full Cream Milk' : undefined,
        sweetness: item.category === 'chai' ? 'Regular' : undefined,
        spice: item.spiceLevel || 'Kadak',
        notes: item.category === 'chai' ? '[Terracotta Clay Kulhad]' : undefined,
      },
    };
    setCart((prev) => [...prev, newItem]);
    showToast(`Added 1x ${item.name} to your basket! ☕`);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (cartId: string) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCheckoutSuccess = (orderData: {
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
  }) => {
    setOrderConfirmationData(orderData);
    setIsOrderConfirmationOpen(true);
  };

  const handleTableBookingSuccess = (booking: TableBooking) => {
    setLatestTableBooking(booking);
    setIsTableBookingSuccessOpen(true);
  };

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fef9f3] text-[#1d1b18]">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2d1b13] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#e89f53]/50 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Coffee className="w-4 h-4 text-[#e89f53]" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 underline text-[#e89f53] hover:text-white"
          >
            View Basket
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currency}
        onToggleCurrency={handleToggleCurrency}
        onOpenAccount={() => setIsAccountModalOpen(true)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenCustomizer={handleOpenCustomizer}
            onQuickAddToCart={handleQuickAddToCart}
            currency={currency}
          />
        )}

        {currentPage === 'menu' && (
          <MenuPage
            onOpenCustomizer={handleOpenCustomizer}
            onQuickAddToCart={handleQuickAddToCart}
            onNavigate={handleNavigate}
            currency={currency}
          />
        )}

        {currentPage === 'order' && (
          <OrderPage
            cart={cart}
            onOpenCustomizer={handleOpenCustomizer}
            onQuickAddToCart={handleQuickAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onCheckoutSuccess={handleCheckoutSuccess}
            currency={currency}
          />
        )}

        {currentPage === 'book-table' && (
          <BookTablePage onBookingSuccess={handleTableBookingSuccess} />
        )}

        {currentPage === 'reviews' && <ReviewsPage />}

        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Product Customizer Modal */}
      <ProductCustomizerModal
        item={customizingItem}
        isOpen={isCustomizerOpen}
        onClose={() => {
          setIsCustomizerOpen(false);
          setCustomizingItem(null);
        }}
        onAddToCart={handleAddToCart}
        currency={currency}
      />

      {/* Sliding Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckoutSuccess={handleCheckoutSuccess}
        currency={currency}
      />

      {/* Order Confirmation Live Status Modal */}
      <OrderConfirmationModal
        isOpen={isOrderConfirmationOpen}
        onClose={() => setIsOrderConfirmationOpen(false)}
        orderData={orderConfirmationData}
        currency={currency}
      />

      {/* Table Booking Success Pass Modal */}
      <TableBookingSuccessModal
        isOpen={isTableBookingSuccessOpen}
        onClose={() => setIsTableBookingSuccessOpen(false)}
        booking={latestTableBooking}
      />

      {/* User Account & History Modal */}
      <UserAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onNavigateToOrder={() => handleNavigate('order')}
        onNavigateToBooking={() => handleNavigate('book-table')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ChaiCafeApp />
    </AuthProvider>
  );
}

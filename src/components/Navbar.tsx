import React, { useState } from 'react';
import { PageType } from '../types';
import { ChacheesLogo } from './ChacheesLogo';
import { Phone, ShoppingBag, Menu, X, Calendar, User, LogIn, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  cartCount: number;
  onOpenCart: () => void;
  currency: 'INR' | 'CAD';
  onToggleCurrency: () => void;
  onOpenAccount: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
  currency,
  onToggleCurrency,
  onOpenAccount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signInWithGoogle, loading: authLoading } = useAuth();

  const navLinks: { id: PageType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'order', label: 'Order Online' },
    { id: 'book-table', label: 'Book Table' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: PageType) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthClick = async () => {
    if (user) {
      onOpenAccount();
    } else {
      try {
        await signInWithGoogle();
      } catch (err) {
        console.error('Google sign-in popup error:', err);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FEF9F3]/95 backdrop-blur-md border-b border-[#E6E2DC] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer transition-transform hover:scale-[1.02] shrink-0"
        >
          <ChacheesLogo size="md" />
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-medium transition-colors relative py-1 whitespace-nowrap ${
                  isActive
                    ? 'text-[#C85A32] font-semibold'
                    : 'text-[#514440] hover:text-[#1D1B18]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C85A32] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Phone, Currency, Auth, Cart, Order Now) */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Direct Phone */}
          <a
            href="tel:760414533"
            className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-[#514440] hover:text-[#C85A32] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>760414533</span>
          </a>

          {/* Currency Toggle */}
          <button
            onClick={onToggleCurrency}
            title="Toggle Currency (INR / CAD)"
            className="hidden sm:inline-flex items-center text-xs font-semibold px-2 py-1 rounded bg-[#F2EDE7] text-[#514440] hover:bg-[#E6E2DC] transition-colors"
          >
            {currency === 'INR' ? '₹ INR' : '$ CAD'}
          </button>

          {/* Google Auth / Account Profile Button */}
          {user ? (
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full sm:rounded-xl bg-[#F2EDE7] hover:bg-[#E6E2DC] text-[#2D1B13] transition-colors border border-[#E6E2DC]"
              title="View account, orders, & reservations"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-[#C85A32]"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#C85A32] text-white flex items-center justify-center text-xs font-bold">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
              <span className="hidden sm:inline text-xs font-semibold max-w-[85px] truncate">
                {user.displayName?.split(' ')[0] || 'Account'}
              </span>
              <ChevronDown className="hidden sm:inline w-3 h-3 text-[#7D5447]" />
            </button>
          ) : (
            <button
              onClick={handleAuthClick}
              disabled={authLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F2EDE7] text-[#3D1E13] border border-[#D1C7BD] text-xs font-semibold shadow-2xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-[#C85A32]" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Cart Trigger with Badge */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-full text-[#3D1E13] hover:bg-[#F2EDE7] transition-colors focus-visible:outline-2 focus-visible:outline-[#C85A32]"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#3D1E13]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#C85A32] text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Primary CTA: Order Now */}
          <button
            onClick={() => handleNavClick('order')}
            className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#C85A32] hover:bg-[#A23E18] rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-[0.98]"
          >
            Order Now
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#3D1E13] hover:bg-[#F2EDE7] focus-visible:outline-2 focus-visible:outline-[#C85A32]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E6E2DC] bg-[#FEF9F3] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#C85A32]/10 text-[#C85A32] font-semibold'
                      : 'text-[#3D1E13] hover:bg-[#F2EDE7]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-[#E6E2DC]">
            {user ? (
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAccount();
                }}
                className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#E6E2DC] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-[#C85A32]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#C85A32] text-white flex items-center justify-center text-xs font-bold">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#1D1B18]">{user.displayName || 'Account'}</p>
                    <p className="text-[11px] text-[#7D5447]">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#C85A32]">My Profile →</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAuthClick();
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-[#D1C7BD] text-xs font-bold text-[#2D1B13]"
              >
                <LogIn className="w-4 h-4 text-[#C85A32]" />
                Sign In with Google
              </button>
            )}

            <div className="flex items-center justify-between text-xs text-[#514440] px-1 py-1">
              <span>Currency preference:</span>
              <button
                onClick={onToggleCurrency}
                className="font-bold px-2 py-0.5 rounded bg-[#F2EDE7] text-[#1D1B18]"
              >
                {currency === 'INR' ? '₹ Indian Rupee' : '$ Canadian Dollar'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => handleNavClick('book-table')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-[#3D1E13] text-[#3D1E13] text-sm font-semibold hover:bg-[#3D1E13] hover:text-white transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Book Table
              </button>
              <button
                onClick={() => handleNavClick('order')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#C85A32] text-white text-sm font-semibold hover:bg-[#A23E18] transition-colors shadow"
              >
                <ShoppingBag className="w-4 h-4" />
                Order Online
              </button>
            </div>

            <a
              href="tel:760414533"
              className="mt-2 flex items-center justify-center gap-2 text-xs font-medium text-[#7D5447] py-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#C85A32]" />
              Call Cafe Hotline: 760414533
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

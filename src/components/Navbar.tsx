import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Menu, X, Sun, Moon, Shield, Calendar, Sparkles, Heart, User, LogIn } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
  onOpenWelcome: () => void;
  onOpenLoyalty: () => void;
  onOpenCustomerAuth: () => void;
  onOpenCustomerDashboard: () => void;
  onSelectCategoryFilter?: (length: 'all' | 'short' | 'long') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onOpenTracker,
  onOpenWelcome,
  onOpenLoyalty,
  onOpenCustomerAuth,
  onOpenCustomerDashboard,
  onSelectCategoryFilter
}) => {
  const { siteData, theme, toggleTheme, isAdmin, currentCustomer } = useSite();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const { settings } = siteData;

  const scrollToCatalog = (length?: 'short' | 'long') => {
    if (onSelectCategoryFilter && length) {
      onSelectCategoryFilter(length);
    }
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">
      {/* Announcement Banner */}
      {settings.announcementBanner.enabled && !bannerDismissed && (
        <div className="bg-gradient-to-r from-pink-950 via-[#14141c] to-teal-950 border-b border-pink-500/20 px-4 py-2 text-center text-xs tracking-wider text-pink-200 flex items-center justify-between">
          <div className="w-6" />
          <button
            onClick={onOpenLoyalty}
            className="hover:underline flex items-center justify-center gap-2 font-medium mx-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>{settings.announcementBanner.text}</span>
            <span className="underline ml-1 font-bold">View Loyalty Rewards →</span>
          </button>
          <button
            onClick={() => setBannerDismissed(true)}
            className="w-6 text-gray-400 hover:text-white text-sm"
            aria-label="Dismiss banner"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="bg-[#0b0b0e]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Brand Wordmark & Magical Entrance trigger */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="text-xl sm:text-2xl font-serif tracking-widest text-white hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 font-bold"
            >
              <Sparkles className="w-5 h-5 text-pink-400" />
              <span>{settings.brandName || "LADY'S RENTAL"}</span>
            </a>

            {/* Quick Enchanted Entrance button */}
            <button
              onClick={onOpenWelcome}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 hover:bg-pink-500/20 border border-pink-400/30 text-pink-300 text-xs font-semibold transition-all cursor-pointer"
              title="Return to the Enchanted Garden & Teal Door"
            >
              <Sparkles className="w-3 h-3 text-teal-300" />
              <span>Enchanted Door</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs tracking-widest uppercase font-semibold text-gray-300">
            <a
              href="#catalog"
              onClick={() => scrollToCatalog()}
              className="hover:text-pink-300 transition-colors whitespace-nowrap"
            >
              All Dresses
            </a>
            <button
              onClick={() => scrollToCatalog('short')}
              className="hover:text-pink-300 transition-colors whitespace-nowrap uppercase cursor-pointer"
            >
              Short Dresses
            </button>
            <button
              onClick={() => scrollToCatalog('long')}
              className="hover:text-pink-300 transition-colors whitespace-nowrap uppercase cursor-pointer"
            >
              Long Dresses
            </button>
            <button
              onClick={onOpenLoyalty}
              className="hover:text-pink-300 transition-colors whitespace-nowrap uppercase flex items-center gap-1 cursor-pointer text-pink-300"
            >
              <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
              <span>Loyalty Card</span>
            </button>
            <a
              href="#how-it-works"
              className="hover:text-pink-300 transition-colors whitespace-nowrap"
            >
              How It Works
            </a>
            <a
              href="#contact"
              className="hover:text-pink-300 transition-colors whitespace-nowrap"
            >
              Showroom
            </a>
          </nav>

          {/* Right Action Controls: Customer Account & Admin */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Customer Account Button */}
            {currentCustomer ? (
              <button
                onClick={onOpenCustomerDashboard}
                className="flex items-center gap-2 p-1 pr-3 bg-pink-950/40 hover:bg-pink-900/50 border border-pink-400/40 rounded-full transition-all text-left cursor-pointer"
                title="Open customer account dashboard"
              >
                <img
                  src={currentCustomer.characterAvatar || '/src/assets/images/character_fairy_guide_1791999955704.jpg'}
                  alt={currentCustomer.name}
                  className="w-7 h-7 rounded-full object-cover border border-pink-400"
                />
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-white leading-none">{currentCustomer.name.split(' ')[0]}</p>
                  <p className="text-[9px] text-pink-300 font-mono flex items-center gap-0.5 leading-none mt-0.5">
                    <Heart className="w-2.5 h-2.5 fill-pink-400 text-pink-400" />
                    <span>{currentCustomer.completedRentalsCount || 0} Stamps</span>
                  </p>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenCustomerAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-md transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Join</span>
              </button>
            )}

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-pink-300 transition-colors rounded-xl border border-white/10"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-pink-400" />}
            </button>

            {/* Admin Atelier Portal */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider rounded-xl transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-sm'
                  : 'bg-white/5 text-gray-300 border border-white/15 hover:border-pink-400 hover:text-white'
              }`}
              title="Admin Boutique Management"
            >
              <Shield className="w-3.5 h-3.5 text-pink-300" />
              <span className="hidden sm:inline">{isAdmin ? 'Admin Portal' : 'Admin'}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-pink-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e0e14] border-b border-pink-500/20 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 pb-4 border-b border-white/10 text-sm tracking-wider uppercase font-semibold">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenWelcome(); }}
              className="text-left py-1 text-pink-300 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>Enchanted Door Entrance</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToCatalog(); }}
              className="text-left py-1 text-gray-300 hover:text-pink-300"
            >
              All Dresses
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToCatalog('short'); }}
              className="text-left py-1 text-gray-300 hover:text-pink-300"
            >
              Short Dresses
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToCatalog('long'); }}
              className="text-left py-1 text-gray-300 hover:text-pink-300"
            >
              Long Dresses
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenLoyalty(); }}
              className="text-left py-1 text-pink-400 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-pink-400" />
              <span>VIP Loyalty Card</span>
            </button>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-gray-300 hover:text-pink-300"
            >
              How It Works
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-gray-300 hover:text-pink-300"
            >
              Showroom & Fittings
            </a>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            {currentCustomer ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenCustomerDashboard(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold uppercase bg-pink-600 text-white rounded-xl"
              >
                <User className="w-4 h-4" />
                <span>My Account & Receipts</span>
              </button>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenCustomerAuth(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold uppercase bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenTracker(); }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs border border-white/10 text-gray-300 rounded-xl"
            >
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              <span>Track Existing Booking</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

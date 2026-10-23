import React, { useState, useEffect } from 'react';
import { FlyingThinkerbell } from './components/FlyingThinkerbell.tsx';
import { SiteProvider, useSite } from './context/SiteContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { FeaturedSection } from './components/FeaturedSection.tsx';
import { OccasionsSection } from './components/OccasionsSection.tsx';
import { HowItWorksSection } from './components/HowItWorksSection.tsx';
import { CatalogSection } from './components/CatalogSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { TestimonialsSection } from './components/TestimonialsSection.tsx';
import { FAQSection } from './components/FAQSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { DressDetailsModal } from './components/DressDetailsModal.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { OrderTrackerModal } from './components/OrderTrackerModal.tsx';
import { WelcomePageModal } from './components/WelcomePageModal.tsx';
import { CharacterSelectionModal } from './components/CharacterSelectionModal.tsx';
import { CustomerAuthModal } from './components/CustomerAuthModal.tsx';
import { LoyaltyCardModal } from './components/LoyaltyCardModal.tsx';
import { CustomerDashboardModal } from './components/CustomerDashboardModal.tsx';
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { Dress } from './types.ts';
import { Sparkles, Wand2, X as CloseIcon, Crown, Heart } from 'lucide-react';

type View = 'home' | 'catalog' | 'howitworks' | 'about' | 'contact';

const SECTION_TO_VIEW: Record<string, View> = {
  home: 'home',
  hero: 'home',
  featured: 'home',
  occasions: 'home',
  catalog: 'catalog',
  collection: 'catalog',
  'how-it-works': 'howitworks',
  howitworks: 'howitworks',
  process: 'howitworks',
  about: 'about',
  testimonials: 'about',
  faq: 'contact',
  contact: 'contact',
};

function MainApp() {
  const { siteData, isAdmin } = useSite();

  const [showWelcomePage, setShowWelcomePage] = useState<boolean>(() => {
    const hasSeenWelcome = sessionStorage.getItem('lr_seen_welcome');
    return siteData.welcomePage.enabled && !hasSeenWelcome;
  });

  const [view, setView] = useState<View>('home');

  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [bookingDress, setBookingDress] = useState<Dress | null>(null);
  const [bookingPrefill, setBookingPrefill] = useState<{ size?: string; duration?: number; startDate?: string }>({});

  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isCharacterSelectOpen, setIsCharacterSelectOpen] = useState(false);
  const [isCustomerDashboardOpen, setIsCustomerDashboardOpen] = useState(false);
  const [isLoyaltyCardOpen, setIsLoyaltyCardOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<string>('overview');
  const [isThinkerbellGuideOpen, setIsThinkerbellGuideOpen] = useState(false);

  const [catalogLengthFilter, setCatalogLengthFilter] = useState<'all' | 'short' | 'long'>('all');

  const goTo = (id: string) => {
    const target = SECTION_TO_VIEW[id];
    if (target) setView(target);
    window.scrollTo({ top: 0 });
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = (a.getAttribute('href') || '').slice(1);
      if (id && SECTION_TO_VIEW[id]) {
        e.preventDefault();
        goTo(id);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleEnterBoutique = (categoryFilter?: 'all' | 'short' | 'long' | 'featured') => {
    setShowWelcomePage(false);
    sessionStorage.setItem('lr_seen_welcome', 'true');

    if (categoryFilter === 'short' || categoryFilter === 'long') {
      setCatalogLengthFilter(categoryFilter);
      goTo('catalog');
    } else if (categoryFilter === 'featured') {
      goTo('featured');
    } else {
      goTo('catalog');
    }
  };

  const handleInspectDress = (dress: Dress) => {
    setSelectedDress(dress);
  };

  const handleStartBooking = (dress: Dress, size: string, duration: number, startDate?: string) => {
    setSelectedDress(null);
    setBookingDress(dress);
    setBookingPrefill({ size, duration, startDate });
  };

  const handleOpenAdmin = (tab = 'overview') => {
    setAdminInitialTab(tab);
    if (isAdmin) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  return (
      <div className="min-h-screen bg-[#09090d] text-[#f4f2ee] flex flex-col font-sans transition-colors duration-200">
        <FlyingThinkerbell mode={showWelcomePage ? 'wander' : 'follow'} />

        {showWelcomePage && (
            <WelcomePageModal
                onEnterBoutique={handleEnterBoutique}
                onOpenAuth={() => {
                  setShowWelcomePage(false);
                  sessionStorage.setItem('lr_seen_welcome', 'true');
                  setIsCustomerAuthOpen(true);
                }}
            />
        )}

        <Navbar
            onOpenAdmin={() => handleOpenAdmin('overview')}
            onOpenTracker={() => setIsTrackerOpen(true)}
            onOpenWelcome={() => setShowWelcomePage(true)}
            onOpenLoyalty={() => setIsLoyaltyCardOpen(true)}
            onOpenCustomerAuth={() => setIsCustomerAuthOpen(true)}
            onOpenCustomerDashboard={() => setIsCustomerDashboardOpen(true)}
            onSelectCategoryFilter={(length) => {
              setCatalogLengthFilter(length);
              goTo('catalog');
            }}
        />

        <div className="sticky top-0 z-30 bg-[#09090d]/90 backdrop-blur border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto text-sm">
            {([
              ['home', 'Home'],
              ['catalog', 'Collection'],
              ['howitworks', 'How It Works'],
              ['about', 'About'],
              ['contact', 'FAQ & Contact'],
            ] as [View, string][]).map(([key, label]) => (
                <button
                    key={key}
                    onClick={() => {
                      setView(key);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                        view === key
                            ? 'bg-teal-500/20 text-teal-200 border border-teal-400/60'
                            : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                  {label}
                </button>
            ))}
          </div>
        </div>

        <main className="flex-grow" key={view}>
          {view === 'home' && (
              <>
                <Hero
                    onExploreClick={() => goTo('catalog')}
                    onBookFittingClick={() => goTo('contact')}
                />
                <FeaturedSection
                    onSelectDress={handleInspectDress}
                    onOpenAdminFeatured={() => handleOpenAdmin('featured')}
                />
                <OccasionsSection onSelectCategory={() => goTo('catalog')} />
              </>
          )}

          {view === 'catalog' && (
              <CatalogSection
                  onSelectDress={handleInspectDress}
                  initialLengthFilter={catalogLengthFilter}
              />
          )}

          {view === 'howitworks' && <HowItWorksSection />}

          {view === 'about' && (
              <>
                <AboutSection />
                <TestimonialsSection />
              </>
          )}

          {view === 'contact' && (
              <>
                <FAQSection />
                <ContactSection />
              </>
          )}
        </main>

        <Footer
            onOpenAdmin={() => handleOpenAdmin('overview')}
            onOpenTracker={() => setIsTrackerOpen(true)}
        />

        {selectedDress && (
            <DressDetailsModal
                dress={selectedDress}
                onClose={() => setSelectedDress(null)}
                onBookNow={handleStartBooking}
                onSelectRelated={(rel) => setSelectedDress(rel)}
            />
        )}

        {bookingDress && (
            <BookingModal
                dress={bookingDress}
                initialSize={bookingPrefill.size}
                initialDuration={bookingPrefill.duration}
                initialStartDate={bookingPrefill.startDate}
                onClose={() => {
                  setBookingDress(null);
                  setBookingPrefill({});
                }}
                onSuccess={() => {}}
            />
        )}

        {isLoyaltyCardOpen && (
            <LoyaltyCardModal
                onClose={() => setIsLoyaltyCardOpen(false)}
                onApplyVoucherToBooking={() => {
                  setIsLoyaltyCardOpen(false);
                  goTo('catalog');
                }}
            />
        )}

        {isCustomerAuthOpen && (
            <CustomerAuthModal
                onClose={() => setIsCustomerAuthOpen(false)}
                onSuccessRegister={() => {
                  setIsCustomerAuthOpen(false);
                  setIsCharacterSelectOpen(true);
                }}
            />
        )}

        {isCharacterSelectOpen && (
            <CharacterSelectionModal
                onClose={() => setIsCharacterSelectOpen(false)}
                onSelectSuccess={() => setIsCharacterSelectOpen(false)}
            />
        )}

        {isCustomerDashboardOpen && (
            <CustomerDashboardModal
                onClose={() => setIsCustomerDashboardOpen(false)}
                onOpenCharacterSelect={() => {
                  setIsCustomerDashboardOpen(false);
                  setIsCharacterSelectOpen(true);
                }}
                onOpenLoyaltyCard={() => {
                  setIsCustomerDashboardOpen(false);
                  setIsLoyaltyCardOpen(true);
                }}
                onSelectDress={handleInspectDress}
            />
        )}

        {isTrackerOpen && <OrderTrackerModal onClose={() => setIsTrackerOpen(false)} />}

        {isAdminLoginOpen && (
            <AdminLogin
                onClose={() => setIsAdminLoginOpen(false)}
                onSuccess={() => {
                  setIsAdminLoginOpen(false);
                  setIsAdminDashboardOpen(true);
                }}
            />
        )}

        {isAdminDashboardOpen && (
            <AdminDashboard
                onClose={() => setIsAdminDashboardOpen(false)}
                initialTab={adminInitialTab}
            />
        )}

        {!showWelcomePage && (
            <div className="fixed bottom-5 right-5 z-40 select-none">
              {isThinkerbellGuideOpen && (
                  <div className="mb-3 w-80 max-w-[calc(100vw-40px)] bg-[#0d121a]/95 backdrop-blur-xl border border-teal-400/50 rounded-2xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.85)] text-white text-left animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                        <span>Thinkerbell Guide</span>
                      </div>
                      <button
                          onClick={() => setIsThinkerbellGuideOpen(false)}
                          className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
                          title="Close guide"
                      >
                        <CloseIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="font-serif italic text-pink-100 text-sm mb-3">
                      "Hello! I'm Thinkerbell. I'm here to assist you."
                    </p>

                    <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
                      <button
                          onClick={() => {
                            setCatalogLengthFilter('short');
                            setIsThinkerbellGuideOpen(false);
                            goTo('catalog');
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-pink-600/30 border border-pink-400/30 text-pink-200 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-pink-400" />
                        <span>Short Dresses</span>
                      </button>

                      <button
                          onClick={() => {
                            setCatalogLengthFilter('long');
                            setIsThinkerbellGuideOpen(false);
                            goTo('catalog');
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-pink-600/30 border border-pink-400/30 text-pink-200 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Crown className="w-3 h-3 text-amber-400" />
                        <span>Long Dresses</span>
                      </button>

                      <button
                          onClick={() => {
                            setIsThinkerbellGuideOpen(false);
                            setIsLoyaltyCardOpen(true);
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-teal-600/30 border border-teal-400/30 text-teal-200 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                        <span>VIP Rewards</span>
                      </button>

                      <button
                          onClick={() => {
                            setIsThinkerbellGuideOpen(false);
                            setShowWelcomePage(true);
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-teal-600/30 border border-teal-400/30 text-teal-200 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Wand2 className="w-3 h-3 text-teal-300" />
                        <span>Enchanted Door</span>
                      </button>
                    </div>
                  </div>
              )}

              <button
                  onClick={() => setIsThinkerbellGuideOpen(!isThinkerbellGuideOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0b0f14]/90 hover:bg-[#121922] border border-teal-400/60 shadow-[0_5px_25px_rgba(20,184,166,0.4)] transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Thinkerbell Guide"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold text-white">Ask Thinkerbell</span>
              </button>
            </div>
        )}
      </div>
  );
}

export default function App() {
  return (
      <SiteProvider>
        <MainApp />
      </SiteProvider>
  );
}
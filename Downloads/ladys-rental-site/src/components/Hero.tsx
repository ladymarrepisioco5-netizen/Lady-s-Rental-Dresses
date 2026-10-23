import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onBookFittingClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onBookFittingClick }) => {
  const { siteData } = useSite();
  const { hero } = siteData.homepage;

  if (!hero.enabled) return null;

  return (
    <section className="relative w-full overflow-hidden border-b border-white/10 bg-[#09090d]">
      {/* Background Ambience Scrim */}
      <div className="absolute inset-0 bg-radial from-pink-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 z-10 text-left">
            {/* Fairy Garden & Boutique Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Magical Fairy Garden & Luxury Dress Boutique</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.12] tracking-tight [text-wrap:balance]">
              {hero.headline}
            </h1>

            {/* Editorial Body Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed max-w-xl">
              {hero.subtitle}
            </p>

            {/* CTA Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 bg-gradient-to-r from-pink-600 via-rose-500 to-teal-500 hover:from-pink-500 hover:to-teal-400 text-white font-bold text-xs tracking-widest uppercase rounded-full transition-all flex items-center gap-2 shadow-lg shadow-pink-500/25 cursor-pointer transform hover:scale-105"
              >
                <span>{hero.ctaText || "Explore Collection"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onBookFittingClick}
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-pink-200 border border-pink-400/30 hover:border-pink-300 font-semibold text-xs tracking-widest uppercase rounded-full transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-pink-400" />
                <span>Fitting Showroom (BGC)</span>
              </button>
            </div>

            {/* Trust Assurance Strip */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Standard 3-Day Rental Duration</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Tracked White-Glove Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 shrink-0 fill-rose-400/30" />
                <span>VIP 10-Heart Loyalty Rewards</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden border border-pink-500/30 bg-[#13131b] shadow-2xl">
              {hero.mediaType === 'video' ? (
                <video
                  src={hero.mediaUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={hero.mediaUrl || "/src/assets/images/enchanted_teal_door_garden_1791999912250.jpg"}
                  alt="Lady's Rental Enchanted Boutique"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-700"
                />
              )}

              {/* Magical Float Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md p-3 rounded-2xl border border-pink-400/30 text-xs text-center">
                <p className="font-serif font-bold text-white flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                  <span>Lady's Rental Atelier Philippines</span>
                </p>
                <p className="text-[11px] text-pink-300 mt-0.5">Where Fairy Garden Whimsy Meets Luxury Fashion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

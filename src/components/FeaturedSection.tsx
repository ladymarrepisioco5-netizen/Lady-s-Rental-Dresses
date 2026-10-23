import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Dress } from '../types.ts';
import { DressCard } from './DressCard.tsx';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

interface FeaturedSectionProps {
  onSelectDress: (dress: Dress) => void;
  onOpenAdminFeatured?: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onSelectDress, onOpenAdminFeatured }) => {
  const { siteData, isAdmin } = useSite();
  const config = siteData.homepage.featuredSection;

  if (!config.enabled) return null;

  // Resolve dresses based on mode: 'manual' vs 'latest'
  let displayedDresses: Dress[] = [];

  if (config.mode === 'manual' && config.selectedDressIds && config.selectedDressIds.length > 0) {
    // Preserve EXACT user order as specified in admin
    config.selectedDressIds.forEach(id => {
      const match = siteData.dresses.find(d => d.id === id && d.isVisible);
      if (match) displayedDresses.push(match);
    });
  } else {
    // Automatic fallback to latest or featured flag
    displayedDresses = siteData.dresses
      .filter(d => d.isVisible)
      .slice(0, config.limit || 4);
  }

  // Apply card limit
  if (config.limit && config.limit > 0) {
    displayedDresses = displayedDresses.slice(0, config.limit);
  }

  // Column grid layout classes for desktop & mobile
  const desktopColsClass = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  }[config.desktopColumns || 4] || 'lg:grid-cols-4';

  const mobileColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
  }[config.mobileColumns || 1] || 'grid-cols-1';

  return (
    <section id="featured" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/10 bg-[#0e0e13]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-white/5 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c9a86a] font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#c9a86a]" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f0ea]">
              {config.title || "The Featured Collection"}
            </h2>
            {config.subtitle && (
              <p className="mt-2 text-sm text-neutral-400 max-w-xl">
                {config.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && onOpenAdminFeatured && (
              <button
                onClick={onOpenAdminFeatured}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider text-[#c9a86a] border border-[#c9a86a]/40 rounded hover:bg-[#c9a86a]/10 transition-colors"
                title="Quickly customize featured dresses order & display"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize Featured ({displayedDresses.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Featured Dresses Grid */}
        {displayedDresses.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/10 rounded-lg">
            <p className="text-sm text-neutral-400">No featured dresses currently selected.</p>
            {isAdmin && onOpenAdminFeatured && (
              <button
                onClick={onOpenAdminFeatured}
                className="mt-3 text-xs uppercase tracking-widest text-[#c9a86a] underline"
              >
                Select Dresses in Featured Customizer
              </button>
            )}
          </div>
        ) : (
          <div className={`grid ${mobileColsClass} sm:grid-cols-2 ${desktopColsClass} gap-6 sm:gap-8`}>
            {displayedDresses.map(dress => (
              <DressCard
                key={dress.id}
                dress={dress}
                onSelect={onSelectDress}
                showPrice={config.showPrice}
                showBadges={config.showBadges}
                showSizes={config.showSizes}
                showAvailability={config.showAvailability}
                cardStyle={config.cardStyle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

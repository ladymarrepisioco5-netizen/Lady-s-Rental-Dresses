import React, { useState, useMemo } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Dress } from '../types.ts';
import { DressCard } from './DressCard.tsx';
import { Search, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface CatalogSectionProps {
  onSelectDress: (dress: Dress) => void;
  selectedCategorySlug?: string;
  initialLengthFilter?: 'all' | 'short' | 'long';
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  onSelectDress,
  selectedCategorySlug,
  initialLengthFilter = 'all'
}) => {
  const { siteData } = useSite();

  // Primary Category Buttons: All Dresses, Short Dresses, Long Dresses
  const [lengthFilter, setLengthFilter] = useState<'all' | 'short' | 'long'>(initialLengthFilter);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [availabilityOnly, setAvailabilityOnly] = useState<boolean>(false);
  const [newArrivalsOnly, setNewArrivalsOnly] = useState<boolean>(false);
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  // Extract unique filters from actual dresses
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    (siteData.dresses || []).forEach(d => {
      if (d.color) set.add(d.color);
    });
    return Array.from(set);
  }, [siteData.dresses]);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    (siteData.dresses || []).forEach(d => {
      (d.sizes || []).forEach(s => set.add(s.size));
    });
    return Array.from(set);
  }, [siteData.dresses]);

  const availableOccasions = useMemo(() => {
    const set = new Set<string>(siteData.occasionsList || []);
    (siteData.dresses || []).forEach(d => {
      (d.occasions || []).forEach(o => set.add(o));
    });
    return Array.from(set);
  }, [siteData.dresses, siteData.occasionsList]);

  // Dynamic filtering engine
  const filteredDresses = useMemo(() => {
    return (siteData.dresses || [])
      .filter(d => {
        if (!d.isVisible) return false;

        // 1. Length Category (Short Dresses vs Long Dresses)
        if (lengthFilter === 'short' && d.lengthCategory !== 'short') return false;
        if (lengthFilter === 'long' && d.lengthCategory !== 'long') return false;

        // 2. Occasion Filter
        if (selectedOccasion !== 'all') {
          const matchOccasion = d.occasions && d.occasions.includes(selectedOccasion);
          if (!matchOccasion) return false;
        }

        // 3. Size Filter
        if (selectedSize !== 'all') {
          const hasSize = d.sizes && d.sizes.some(s => s.size === selectedSize && s.inStock);
          if (!hasSize) return false;
        }

        // 4. Color Filter
        if (selectedColor !== 'all' && d.color !== selectedColor) return false;

        // 5. Availability Only
        if (availabilityOnly && !d.isAvailable) return false;

        // 6. New Arrivals & Featured toggles
        if (newArrivalsOnly && !d.isNewArrival) return false;
        if (featuredOnly && !d.isFeatured) return false;

        // 7. Price Range Filter (in Philippine Pesos ₱)
        if (priceRange === 'under-2000' && d.rentalPrice3Day > 2000) return false;
        if (priceRange === '2000-2500' && (d.rentalPrice3Day < 2000 || d.rentalPrice3Day > 2500)) return false;
        if (priceRange === 'above-2500' && d.rentalPrice3Day <= 2500) return false;

        // 8. Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = d.name.toLowerCase().includes(q);
          const matchesDesigner = d.designer.toLowerCase().includes(q);
          const matchesDesc = d.description.toLowerCase().includes(q);
          const matchesOccasion = d.occasions?.some(o => o.toLowerCase().includes(q));
          const matchesTags = d.tags?.some(t => t.toLowerCase().includes(q));
          if (!matchesName && !matchesDesigner && !matchesDesc && !matchesOccasion && !matchesTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.rentalPrice3Day - b.rentalPrice3Day;
        if (sortBy === 'price-desc') return b.rentalPrice3Day - a.rentalPrice3Day;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [
    siteData.dresses,
    lengthFilter,
    selectedOccasion,
    selectedSize,
    selectedColor,
    availabilityOnly,
    newArrivalsOnly,
    featuredOnly,
    priceRange,
    searchQuery,
    sortBy
  ]);

  const handleResetFilters = () => {
    setLengthFilter('all');
    setSelectedOccasion('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setAvailabilityOnly(false);
    setNewArrivalsOnly(false);
    setFeaturedOnly(false);
    setPriceRange('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    lengthFilter !== 'all' ||
    selectedOccasion !== 'all' ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    availabilityOnly ||
    newArrivalsOnly ||
    featuredOnly ||
    priceRange !== 'all' ||
    searchQuery.trim() !== '';

  return (
    <section id="catalog" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#09090d] border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Standard 3-Day Rental Boutique</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            The Lady's Rental Dress Collection
          </h2>
          <p className="mt-2 text-sm text-gray-400 max-w-2xl leading-relaxed">
            All dresses are available for our standard 3-day rental duration with island-wide delivery and fitting reservations. Filter by dress length, occasion, and measurements.
          </p>
        </div>

        {/* 1. MANDATORY CLEARLY VISIBLE PRIMARY CATEGORY BUTTONS: All Dresses / Short Dresses / Long Dresses */}
        <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-3 p-2 bg-[#121218] border border-pink-500/20 rounded-2xl">
          <button
            onClick={() => setLengthFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
              lengthFilter === 'all'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_0_15px_rgba(244,114,182,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All Dresses ({siteData.dresses?.length || 0})
          </button>

          <button
            onClick={() => setLengthFilter('short')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
              lengthFilter === 'short'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_0_15px_rgba(244,114,182,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Short Dresses ({(siteData.dresses || []).filter(d => d.lengthCategory === 'short').length})
          </button>

          <button
            onClick={() => setLengthFilter('long')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
              lengthFilter === 'long'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_0_15px_rgba(244,114,182,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Long Dresses ({(siteData.dresses || []).filter(d => d.lengthCategory === 'long').length})
          </button>

          {/* Quick Toggle Checkboxes: In Stock & New Arrivals */}
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setAvailabilityOnly(!availabilityOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                availabilityOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              In Stock Only
            </button>
            <button
              onClick={() => setNewArrivalsOnly(!newArrivalsOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                newArrivalsOnly
                  ? 'bg-pink-500/20 text-pink-300 border-pink-500/50'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                featuredOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              Featured Gowns
            </button>
          </div>
        </div>

        {/* 2. SEARCH & ATTRIBUTE FILTER BAR */}
        <div className="mb-8 p-4 bg-[#121218] border border-white/10 rounded-2xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dress name, designer, occasion (Debut, Wedding...)"
              className="w-full pl-10 pr-4 py-2.5 bg-[#181822] text-xs sm:text-sm text-white placeholder-gray-500 border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Occasion Dropdown */}
          <select
            value={selectedOccasion}
            onChange={(e) => setSelectedOccasion(e.target.value)}
            className="px-3 py-2.5 bg-[#181822] text-xs text-white border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 cursor-pointer"
          >
            <option value="all">All Occasions</option>
            {availableOccasions.map(occ => (
              <option key={occ} value={occ}>{occ}</option>
            ))}
          </select>

          {/* Size Dropdown */}
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="px-3 py-2.5 bg-[#181822] text-xs text-white border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 cursor-pointer"
          >
            <option value="all">All Sizes</option>
            {availableSizes.map(sz => (
              <option key={sz} value={sz}>{sz}</option>
            ))}
          </select>

          {/* Color Dropdown */}
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="px-3 py-2.5 bg-[#181822] text-xs text-white border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 cursor-pointer"
          >
            <option value="all">All Colors</option>
            {availableColors.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Price Range in Philippine Pesos (₱) */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-3 py-2.5 bg-[#181822] text-xs text-white border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 cursor-pointer"
          >
            <option value="all">All 3-Day Rental Prices</option>
            <option value="under-2000">Under ₱2,000</option>
            <option value="2000-2500">₱2,000 – ₱2,500</option>
            <option value="above-2500">Above ₱2,500</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2.5 bg-[#181822] text-xs text-white border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 cursor-pointer"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High (₱)</option>
            <option value="price-desc">Price: High to Low (₱)</option>
            <option value="newest">New Acquisitions</option>
          </select>
        </div>

        {/* Results Counter & Reset Filter Link */}
        <div className="mb-6 flex items-center justify-between text-xs text-gray-400">
          <span>
            Showing <b className="text-white">{filteredDresses.length}</b> of {siteData.dresses?.length || 0} dress silhouettes
            {lengthFilter !== 'all' && ` • Filtered to ${lengthFilter === 'short' ? 'Short Dresses' : 'Long Dresses'}`}
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-pink-400 hover:text-pink-300 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Dresses Product Grid */}
        {filteredDresses.length === 0 ? (
          <div className="py-20 text-center bg-[#121218] border border-white/10 rounded-3xl p-8">
            <Sparkles className="w-10 h-10 text-pink-400/40 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-white">No Dresses Found</h3>
            <p className="mt-1 text-xs text-gray-400 max-w-sm mx-auto">
              No dresses match your current filter selections. Try clearing your search query or switching categories.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDresses.map(dress => (
              <DressCard
                key={dress.id}
                dress={dress}
                onSelect={onSelectDress}
                showPrice={true}
                showBadges={true}
                showSizes={true}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

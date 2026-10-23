import React, { useState } from 'react';
import { Dress } from '../types.ts';
import { useSite } from '../context/SiteContext.tsx';
import { Play, Eye, Heart, Sparkles } from 'lucide-react';

interface DressCardProps {
  dress: Dress;
  onSelect: (dress: Dress) => void;
  showPrice?: boolean;
  showBadges?: boolean;
  showSizes?: boolean;
  showAvailability?: boolean;
  cardStyle?: 'bordered' | 'minimal' | 'elevated' | 'refined';
}

export const DressCard: React.FC<DressCardProps> = ({
  dress,
  onSelect,
  showPrice = true,
  showBadges = true,
  showSizes = true,
  cardStyle = 'refined'
}) => {
  const { currentCustomer, toggleFavorite } = useSite();
  const [hovered, setHovered] = useState(false);
  const hasSecondaryImage = dress.photos && dress.photos.length > 1;
  const currentPhoto = hovered && hasSecondaryImage ? dress.photos[1] : dress.coverPhoto || dress.photos[0];
  const hasVideo = dress.videos && dress.videos.length > 0;

  const isFavorited = currentCustomer?.favorites?.includes(dress.id) || false;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCustomer) {
      onSelect(dress); // prompts sign in / view
      return;
    }
    await toggleFavorite(dress.id);
  };

  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 bg-[#121217] border border-white/10 hover:border-pink-500/40 shadow-md hover:shadow-[0_10px_30px_rgba(244,114,182,0.15)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Visual Asset Container (Aspect Ratio 3:4) */}
      <div
        onClick={() => onSelect(dress)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#181820] cursor-pointer"
      >
        <img
          src={currentPhoto}
          alt={dress.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Wishlist Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorited
              ? 'bg-pink-600 text-white shadow-[0_0_12px_rgba(244,114,182,0.8)]'
              : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/90 border border-white/10'
          }`}
          title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Video Availability Pill/Indicator */}
        {hasVideo && (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white flex items-center gap-1.5 border border-pink-400/30">
            <Play className="w-2.5 h-2.5 text-pink-400 fill-current" />
            <span>Video Preview</span>
          </div>
        )}

        {/* Short / Long Dress Badge */}
        <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold text-pink-300 border border-pink-500/30 rounded-full">
          {dress.lengthCategory === 'short' ? 'Short Dress' : 'Long Dress'}
        </div>

        {/* New Arrival / Feature Badge */}
        {showBadges && (dress.isNewArrival || dress.isFeatured) && (
          <div className="absolute bottom-3 right-3 bg-gradient-to-r from-pink-600/90 to-rose-600/90 backdrop-blur-md px-2 py-0.5 text-[9px] tracking-wider uppercase text-white font-bold rounded-full shadow-sm">
            {dress.isNewArrival ? 'New Arrival' : 'Featured'}
          </div>
        )}

        {/* Quick View Overlay Button on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(dress);
            }}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs uppercase tracking-widest font-semibold rounded-full hover:scale-105 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Dress</span>
          </button>
        </div>
      </div>

      {/* Dress Content Information */}
      <div className="p-4 flex flex-col flex-grow justify-between text-left space-y-2.5">
        <div>
          {/* Metadata line: Designer & Color */}
          <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-gray-400 font-medium mb-1">
            <span>{dress.designer}</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span>{dress.color}</span>
          </div>

          {/* Dress Title */}
          <h3
            onClick={() => onSelect(dress)}
            className="text-sm sm:text-base font-serif font-bold text-white group-hover:text-pink-300 transition-colors cursor-pointer line-clamp-1"
          >
            {dress.name}
          </h3>

          {/* Available Sizes Tag Line */}
          {showSizes && dress.sizes && (
            <div className="mt-1 text-[11px] text-gray-400 line-clamp-1">
              Sizes: {dress.sizes.filter(s => s.inStock).map(s => s.size).join(', ')}
            </div>
          )}

          {/* Occasion Tags (first 2) */}
          {dress.occasions && dress.occasions.length > 0 && (
            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              {dress.occasions.slice(0, 2).map((occ, i) => (
                <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                  {occ}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Standard 3-Day Rental Pricing in Philippine Pesos (₱) */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          {showPrice ? (
            <div>
              <div className="text-sm sm:text-base font-bold text-white font-mono">
                ₱{dress.rentalPrice3Day.toLocaleString()}
                <span className="text-[11px] text-pink-300 font-sans font-normal ml-1">/ 3-Day Rental</span>
              </div>
              <div className="text-[10px] text-gray-400">
                Deposit: ₱{(dress.securityDeposit || 0).toLocaleString()} (Refundable)
              </div>
            </div>
          ) : <div />}

          <button
            onClick={() => onSelect(dress)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-pink-300 hover:text-white bg-pink-500/10 hover:bg-pink-600 border border-pink-400/30 transition-all cursor-pointer"
          >
            Rent →
          </button>
        </div>
      </div>
    </div>
  );
};

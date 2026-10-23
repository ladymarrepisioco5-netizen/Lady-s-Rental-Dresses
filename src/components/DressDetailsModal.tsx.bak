import React, { useState } from 'react';
import { Dress, AccessoryItem } from '../types.ts';
import { useSite } from '../context/SiteContext.tsx';
import {
  X,
  Play,
  Image as ImageIcon,
  Check,
  Calendar as CalendarIcon,
  Ruler,
  ShieldCheck,
  Sparkles,
  Info,
  ChevronRight,
  Truck,
  Heart,
  Palette,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface DressDetailsModalProps {
  dress: Dress | null;
  onClose: () => void;
  onBookNow: (dress: Dress, selectedSize: string, durationDays: number, startDate?: string) => void;
  onSelectRelated: (dress: Dress) => void;
}

export const DressDetailsModal: React.FC<DressDetailsModalProps> = ({
  dress,
  onClose,
  onBookNow,
  onSelectRelated
}) => {
  const { siteData, currentCustomer, toggleFavorite } = useSite();
  if (!dress) return null;

  const [activeMediaTab, setActiveMediaTab] = useState<'photo' | 'video'>('photo');
  const [activeAngleView, setActiveAngleView] = useState<'all' | 'front' | 'back' | 'side'>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    dress.sizes.find(s => s.inStock)?.size || dress.sizes[0]?.size || 'US 4 / M'
  );
  const [duration, setDuration] = useState<number>(3); // Standard 3-Day Rental
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [bookingStartDate, setBookingStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const isFavorited = currentCustomer?.favorites?.includes(dress.id) || false;

  const photos = dress.photos && dress.photos.length > 0 ? dress.photos : [dress.coverPhoto];
  
  // Angle view selector logic
  let displayedPhoto = photos[selectedPhotoIndex] || dress.coverPhoto;
  if (activeAngleView === 'front' && dress.views?.front) displayedPhoto = dress.views.front;
  if (activeAngleView === 'back' && dress.views?.back) displayedPhoto = dress.views.back;
  if (activeAngleView === 'side' && dress.views?.side) displayedPhoto = dress.views.side;

  const hasVideos = dress.videos && dress.videos.length > 0;
  const activeVideo = hasVideos ? dress.videos[0] : null;

  // Rental price in Philippine Pesos (₱)
  const rentalPrice = duration === 3
    ? dress.rentalPrice3Day
    : duration === 5
    ? (dress.rentalPrice5Day || Math.round(dress.rentalPrice3Day * 1.35))
    : (dress.rentalPrice7Day || Math.round(dress.rentalPrice3Day * 1.65));

  const deposit = dress.securityDeposit || 1000;
  const cleaning = dress.cleaningFee || 0;
  const totalEstimated = rentalPrice + deposit + cleaning;

  // Calculate return date (standard 3 days: start date is Day 1, return is Day 3)
  const returnDate = (() => {
    if (!bookingStartDate) return '';
    const d = new Date(bookingStartDate);
    d.setDate(d.getDate() + duration - 1);
    return d.toISOString().split('T')[0];
  })();

  // Overlap conflict check with physical inventory count
  const isDateBooked = (() => {
    if (!bookingStartDate || !returnDate) return false;
    const reqStart = new Date(bookingStartDate).getTime();
    const reqEnd = new Date(returnDate).getTime();
    const conflicting = siteData.bookings.filter(b => {
      if (b.dressId !== dress.id) return false;
      const ignored = ['Cancelled', 'cancelled', 'Rejected', 'Returned', 'returned'];
      if (ignored.includes(b.status)) return false;
      const bStart = new Date(b.startDate).getTime();
      const bEnd = new Date(b.endDate).getTime();
      return reqStart <= bEnd && reqEnd >= bStart;
    });
    return conflicting.length >= (dress.inventoryCount || 1);
  })();

  // Related dresses
  const relatedDresses = (siteData.dresses || [])
    .filter(d => d.id !== dress.id && (d.category === dress.category || d.lengthCategory === dress.lengthCategory))
    .slice(0, 3);

  // Recommended accessories
  const accessories = dress.recommendedAccessories || siteData.accessoriesCatalog?.slice(0, 3) || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0e0e14] border border-pink-500/30 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden my-auto text-left text-[#f5f0ea]">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-black/70 hover:bg-black text-gray-300 hover:text-white rounded-full border border-pink-400/30 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* LEFT COLUMN: Photos, Views & Video Player */}
          <div className="lg:col-span-7 bg-[#13131b] p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
            <div>
              {/* Media Switcher & Angle Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setActiveMediaTab('photo'); setActiveAngleView('all'); }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeMediaTab === 'photo'
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Photo Gallery ({photos.length})</span>
                  </button>

                  {hasVideos && (
                    <button
                      onClick={() => setActiveMediaTab('video')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeMediaTab === 'video'
                          ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Dress Video</span>
                    </button>
                  )}
                </div>

                {/* Wishlist Heart Toggle */}
                <button
                  onClick={() => toggleFavorite(dress.id)}
                  className={`p-2 rounded-full border transition-all ${
                    isFavorited
                      ? 'bg-pink-600 text-white border-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.8)]'
                      : 'bg-white/5 text-gray-400 hover:text-white border-white/10'
                  }`}
                  title={isFavorited ? 'Saved in wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Angle View Selector (Front, Back, Side) */}
              {activeMediaTab === 'photo' && dress.views && (
                <div className="flex items-center gap-1.5 mb-3 text-[11px]">
                  <span className="text-gray-400 mr-1">Views:</span>
                  <button
                    onClick={() => setActiveAngleView('all')}
                    className={`px-2.5 py-1 rounded-lg border transition-all ${
                      activeAngleView === 'all'
                        ? 'bg-pink-500/20 text-pink-300 border-pink-400/50'
                        : 'bg-white/5 text-gray-400 border-transparent hover:text-white'
                    }`}
                  >
                    Full
                  </button>
                  {dress.views.front && (
                    <button
                      onClick={() => setActiveAngleView('front')}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        activeAngleView === 'front'
                          ? 'bg-pink-500/20 text-pink-300 border-pink-400/50'
                          : 'bg-white/5 text-gray-400 border-transparent hover:text-white'
                      }`}
                    >
                      Front View
                    </button>
                  )}
                  {dress.views.back && (
                    <button
                      onClick={() => setActiveAngleView('back')}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        activeAngleView === 'back'
                          ? 'bg-pink-500/20 text-pink-300 border-pink-400/50'
                          : 'bg-white/5 text-gray-400 border-transparent hover:text-white'
                      }`}
                    >
                      Back View
                    </button>
                  )}
                  {dress.views.side && (
                    <button
                      onClick={() => setActiveAngleView('side')}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        activeAngleView === 'side'
                          ? 'bg-pink-500/20 text-pink-300 border-pink-400/50'
                          : 'bg-white/5 text-gray-400 border-transparent hover:text-white'
                      }`}
                    >
                      Side View
                    </button>
                  )}
                </div>
              )}

              {/* Main Media Viewer */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] max-h-[500px] w-full mx-auto rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center shadow-lg">
                {activeMediaTab === 'video' && activeVideo ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                    <video
                      src={activeVideo.url}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <img
                    src={displayedPhoto}
                    alt={dress.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                )}

                {/* Length Category Floating Pill */}
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-pink-300 border border-pink-400/30">
                  {dress.lengthCategory === 'short' ? 'Short Dress' : 'Long Dress'}
                </div>
              </div>
            </div>

            {/* Clickable Photo Thumbnails */}
            {photos.length > 1 && (
              <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1">
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedPhotoIndex(idx);
                      setActiveAngleView('all');
                      setActiveMediaTab('photo');
                    }}
                    className={`relative w-14 h-18 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedPhotoIndex === idx && activeMediaTab === 'photo' && activeAngleView === 'all'
                        ? 'border-pink-400 scale-105 shadow-md'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Details, 3-Day Pricing, Sizing, Styling Advice & Booking */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
            <div className="space-y-5">
              {/* Header Title & ID */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-pink-300 font-semibold mb-1">
                  <span>ID: {dress.id}</span>
                  <span>•</span>
                  <span>{dress.designer}</span>
                  <span>•</span>
                  <span className="uppercase text-amber-200">{dress.color}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  {dress.name}
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                  {dress.description}
                </p>
              </div>

              {/* Occasion Recommendation Badges */}
              {dress.occasions && dress.occasions.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Recommended Occasions
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {dress.occasions.map((occ, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/15 border border-pink-400/30 text-pink-200"
                      >
                        {occ}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* THREE-DAY RENTAL PRICING IN PHILIPPINE PESOS (₱) */}
              <div className="p-4 rounded-2xl bg-[#14141d] border border-pink-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
                      Standard Rental Duration
                    </span>
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
                      ₱{rentalPrice.toLocaleString()}
                      <span className="text-xs sm:text-sm font-sans font-normal text-pink-300 ml-1.5">
                        / {duration}-Day Rental
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-gray-400">
                    <p>Deposit: ₱{deposit.toLocaleString()} (Refundable)</p>
                    <p className="text-emerald-400 font-semibold">Eco-Sanitization: Free</p>
                  </div>
                </div>

                {/* Duration Picker: Default is 3-Day Rental */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                  <span className="text-xs text-gray-400">Duration:</span>
                  <div className="grid grid-cols-3 gap-1.5 flex-grow">
                    {[
                      { days: 3, label: '3-Day Standard' },
                      { days: 5, label: '5-Day Extended' },
                      { days: 7, label: '7-Day Gala Week' }
                    ].map(opt => (
                      <button
                        key={opt.days}
                        onClick={() => setDuration(opt.days)}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          duration === opt.days
                            ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Size Selector with Measurements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Select Size
                  </label>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{showSizeGuide ? 'Hide Measurements' : 'Size Measurements'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dress.sizes.map(s => (
                    <button
                      key={s.size}
                      disabled={!s.inStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                        selectedSize === s.size
                          ? 'bg-pink-500/20 text-pink-300 border-pink-400 shadow-sm'
                          : s.inStock
                          ? 'bg-white/5 text-white border-white/10 hover:border-pink-500/40'
                          : 'bg-black/40 text-gray-600 border-white/5 cursor-not-allowed line-through'
                      }`}
                    >
                      {s.size}
                      {!s.inStock && <span className="block text-[9px] text-gray-500 font-normal">Out</span>}
                    </button>
                  ))}
                </div>

                {/* Expandable Measurement Table */}
                {showSizeGuide && (
                  <div className="mt-3 p-3 bg-black/60 rounded-xl border border-white/10 text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-gray-400 border-b border-white/10 text-[10px] uppercase">
                          <th className="pb-1">Size</th>
                          <th className="pb-1">Bust</th>
                          <th className="pb-1">Waist</th>
                          <th className="pb-1">Hips</th>
                          <th className="pb-1">Length</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                        {dress.sizes.map(s => (
                          <tr key={s.size} className={selectedSize === s.size ? 'text-pink-300 font-bold' : ''}>
                            <td className="py-1">{s.size}</td>
                            <td>{s.bust}</td>
                            <td>{s.waist}</td>
                            <td>{s.hips}</td>
                            <td>{s.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Rental Dates & Availability Calendar */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 block">
                  Rental Start Date ({duration}-Day Rental)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-0.5">Start / Delivery</span>
                    <input
                      type="date"
                      value={bookingStartDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setBookingStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-0.5">Scheduled Return</span>
                    <input
                      type="text"
                      disabled
                      value={returnDate}
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-xl text-xs text-pink-300 font-mono font-semibold"
                    />
                  </div>
                </div>

                {isDateBooked ? (
                  <div className="mt-2 p-2 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>This dress is reserved for these dates. Please choose alternate dates.</span>
                  </div>
                ) : (
                  <p className="mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Available for reservation on selected dates!</span>
                  </p>
                )}
              </div>

              {/* ACCESSORIES & STYLING RECOMMENDATIONS */}
              {dress.stylingAdvice && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-pink-400/20 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-pink-300 font-bold">
                    <Palette className="w-3.5 h-3.5" />
                    <span>Stylist & Makeup Recommendations</span>
                  </div>
                  <p className="text-gray-300"><b className="text-white">Makeup:</b> {dress.stylingAdvice.makeupStyle}</p>
                  <p className="text-gray-300"><b className="text-white">Lip Color:</b> {dress.stylingAdvice.lipColor}</p>
                  <p className="text-gray-300"><b className="text-white">Hair:</b> {dress.stylingAdvice.hairstyle}</p>
                  <p className="text-pink-300/90 italic font-serif mt-1">"{dress.stylingAdvice.tip}"</p>
                </div>
              )}

              {/* RECOMMENDED ACCESSORIES (Optional Rentals) */}
              {accessories.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Recommended Accessories (Optional Rental)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {accessories.slice(0, 2).map(acc => (
                      <div key={acc.id} className="p-2 bg-black/40 rounded-xl border border-white/10 flex items-center gap-2">
                        <img src={acc.photo} alt={acc.name} className="w-10 h-10 object-cover rounded-lg" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{acc.name}</p>
                          <p className="text-[10px] text-pink-300 font-semibold">+₱{acc.price || 350}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Total Estimated & Primary Rent Button */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-gray-400">Estimated Total at Checkout:</span>
                <span className="text-base font-bold text-white font-mono">
                  ₱{totalEstimated.toLocaleString()}
                  <span className="text-[10px] text-gray-400 font-normal ml-1">(inc. refundable deposit)</span>
                </span>
              </div>

              <button
                disabled={isDateBooked}
                onClick={() => onBookNow(dress, selectedSize, duration, bookingStartDate)}
                className={`w-full py-3.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  isDateBooked
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/10'
                    : 'bg-gradient-to-r from-pink-500 via-rose-500 to-teal-500 hover:from-pink-400 hover:to-teal-400 text-white shadow-[0_0_25px_rgba(244,114,182,0.5)] transform hover:scale-[1.02]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Rent This Dress (3-Day Duration)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

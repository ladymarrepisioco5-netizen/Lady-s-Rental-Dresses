import React, { useRef } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Sparkles, Heart, Crown, Gift, Download, X, Copy, Check, ShieldCheck } from 'lucide-react';

interface LoyaltyCardModalProps {
  onClose: () => void;
  onApplyVoucherToBooking?: (voucherCode: string) => void;
}

export const LoyaltyCardModal: React.FC<LoyaltyCardModalProps> = ({
  onClose,
  onApplyVoucherToBooking
}) => {
  const { currentCustomer, siteData } = useSite();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Determine completed rentals count (strictly verified and returned)
  const completedCount = currentCustomer?.completedRentalsCount || 0;
  const totalStamps = 10;

  // Milestone logic
  const hasFiveReward = completedCount >= 5;
  const hasTenReward = completedCount >= 10;

  // Unlocked vouchers
  const availableVouchers = currentCustomer?.availableVouchers || [];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDownloadCard = () => {
    // Generate a printable / downloadable version of the card
    window.print();
  };

  const glitterBg = '/src/assets/images/glitter_loyalty_card_bg_1791999931303.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0f0f14] border border-pink-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(244,114,182,0.3)] text-[#f4f2ee] max-h-[90vh] overflow-y-auto">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>VIP Rewards Club</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Lady's Rental Loyalty Card
          </h2>
          <p className="mt-1 text-xs text-gray-400 max-w-md mx-auto">
            Collect 10 heart stamps with every completed and returned dress rental to unlock exclusive couture privileges!
          </p>
        </div>

        {/* THE PHYSICAL-STYLE BLACK & PINK GLITTER CARD */}
        <div
          ref={cardRef}
          className="relative w-full rounded-3xl overflow-hidden shadow-[0_15px_50px_rgba(244,114,182,0.35)] border-2 border-pink-400/60 transition-transform duration-300 hover:scale-[1.01]"
          style={{
            backgroundImage: `url(${glitterBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '320px'
          }}
        >
          {/* Card Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />

          {/* Rose Gold Metallic Border Frame */}
          <div className="absolute inset-3 border border-pink-300/40 rounded-2xl pointer-events-none" />

          {/* Card Interior Content */}
          <div className="relative p-6 sm:p-7 flex flex-col justify-between h-full min-h-[320px]">
            {/* Top Brand & Customer Info */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-pink-300/80">
                  Exclusive Atelier Membership
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-amber-200 tracking-wide">
                  LADY'S RENTAL
                </h3>
                <p className="text-[11px] text-pink-300/90 font-serif italic">
                  Fairy Garden & Haute Couture Boutique
                </p>
              </div>

              {/* Customer Avatar & Name Badge */}
              <div className="text-right flex items-center gap-2.5">
                {currentCustomer?.characterAvatar && (
                  <img
                    src={currentCustomer.characterAvatar}
                    alt={currentCustomer.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-pink-400/80 shadow-md"
                  />
                )}
                <div>
                  <p className="text-xs font-bold text-white tracking-wide">
                    {currentCustomer ? currentCustomer.name : 'Guest Patron'}
                  </p>
                  <p className="text-[10px] font-mono text-pink-300">
                    ID: {currentCustomer ? currentCustomer.id.replace('cust-', 'LR-VIP-') : 'LR-VIP-GUEST'}
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Section: 10 HEART LOYALTY STAMPS (2 rows of 5) */}
            <div className="my-5 py-3 px-4 rounded-2xl bg-black/60 backdrop-blur-md border border-pink-400/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-pink-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Rental Heart Stamps</span>
                </span>
                <span className="text-xs font-mono font-bold text-pink-300">
                  {completedCount} / 10 Completed
                </span>
              </div>

              {/* Heart Stamp Grid */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3 py-1">
                {[...Array(totalStamps)].map((_, idx) => {
                  const stampNum = idx + 1;
                  const isFilled = completedCount >= stampNum;
                  const isFiveMilestone = stampNum === 5;
                  const isTenMilestone = stampNum === 10;

                  return (
                    <div
                      key={idx}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                        isFilled
                          ? 'bg-gradient-to-tr from-pink-900/60 via-pink-600/40 to-rose-900/60 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.6)]'
                          : 'bg-black/40 border-pink-500/20 text-gray-500'
                      }`}
                    >
                      {/* Heart Icon */}
                      <Heart
                        className={`w-6 h-6 sm:w-7 sm:h-7 transition-all ${
                          isFilled
                            ? 'text-pink-400 fill-pink-500 filter drop-shadow-[0_0_8px_rgba(244,114,182,0.9)] animate-pulse'
                            : 'text-gray-600'
                        }`}
                      />
                      
                      {/* Stamp Number or Milestone Badge */}
                      <span className={`text-[9px] font-mono font-bold mt-1 ${
                        isFilled ? 'text-pink-200' : 'text-gray-500'
                      }`}>
                        #{stampNum}
                      </span>

                      {/* Milestone Badge Overlays */}
                      {isFiveMilestone && (
                        <div className="absolute -top-2 -right-1 px-1 py-0.2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-[8px] font-bold text-white shadow-sm">
                          50%
                        </div>
                      )}
                      {isTenMilestone && (
                        <div className="absolute -top-2 -right-1 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-[8px] font-bold text-black shadow-sm flex items-center gap-0.5">
                          <Crown className="w-2.5 h-2.5" />
                          <span>FREE</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Reward Progress Status */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-pink-200/90 pt-1">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-pink-400 shrink-0" />
                <span>
                  {completedCount < 5 && (
                    <><b>{5 - completedCount} more</b> rentals needed to unlock <b>50% OFF</b> reward.</>
                  )}
                  {completedCount >= 5 && completedCount < 10 && (
                    <>🎉 <b>50% OFF UNLOCKED!</b> <b>{10 - completedCount} more</b> rentals until <b>ONE FREE RENTAL</b>.</>
                  )}
                  {completedCount >= 10 && (
                    <>👑 <b>ROYAL STATUS:</b> <b>ONE FREE 3-DAY RENTAL</b> Milestone Unlocked!</>
                  )}
                </span>
              </div>
              <span className="text-[10px] text-pink-300 font-mono">
                Standard 3-Day Rental Policy
              </span>
            </div>
          </div>
        </div>

        {/* REWARD VOUCHERS UNLOCKED */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
            <Gift className="w-4 h-4 text-pink-400" />
            <span>Your Earned Reward Vouchers</span>
          </h4>

          {/* Milestone 1: 5 Rentals -> 50% Voucher */}
          <div className={`p-4 rounded-2xl border transition-all ${
            hasFiveReward
              ? 'bg-gradient-to-r from-pink-950/40 to-[#14141c] border-pink-400/60'
              : 'bg-[#121218] border-white/10 opacity-70'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    hasFiveReward ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40' : 'bg-gray-800 text-gray-400'
                  }`}>
                    5-RENTAL MILESTONE
                  </span>
                  <span className="text-sm font-bold text-white">50% OFF Next 3-Day Rental</span>
                </div>
                <p className="mt-1 text-xs text-gray-300">
                  {hasFiveReward
                    ? 'Congratulations! You have completed 5 eligible dress rentals. Use your voucher code at checkout.'
                    : `Complete ${Math.max(0, 5 - completedCount)} more rentals to unlock this 50% discount voucher.`}
                </p>
              </div>

              {hasFiveReward && (
                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/60 border border-pink-400/50 rounded-xl font-mono text-xs text-pink-300 font-bold">
                    <span>{availableVouchers.find(v => v.type === '50_percent_discount')?.code || 'MAGIC50-VIP'}</span>
                    <button
                      onClick={() => handleCopy(availableVouchers.find(v => v.type === '50_percent_discount')?.code || 'MAGIC50-VIP')}
                      className="text-gray-400 hover:text-white"
                      title="Copy code"
                    >
                      {copiedCode === (availableVouchers.find(v => v.type === '50_percent_discount')?.code || 'MAGIC50-VIP') ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  {onApplyVoucherToBooking && (
                    <button
                      onClick={() => onApplyVoucherToBooking(availableVouchers.find(v => v.type === '50_percent_discount')?.code || 'MAGIC50-VIP')}
                      className="mt-1 block text-[11px] text-pink-400 hover:underline"
                    >
                      Apply to Booking
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Milestone 2: 10 Rentals -> ONE FREE 3-DAY RENTAL Voucher */}
          <div className={`p-4 rounded-2xl border transition-all ${
            hasTenReward
              ? 'bg-gradient-to-r from-amber-950/40 via-pink-950/40 to-[#14141c] border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
              : 'bg-[#121218] border-white/10 opacity-70'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    hasTenReward ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-gray-800 text-gray-400'
                  }`}>
                    10-RENTAL MILESTONE
                  </span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>ONE FREE 3-DAY DRESS RENTAL</span>
                    <Crown className="w-4 h-4 text-amber-400" />
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-300">
                  {hasTenReward
                    ? 'Magical achievement! Enjoy 1 complimentary 3-day dress rental of your choice.'
                    : `Complete ${Math.max(0, 10 - completedCount)} more rentals to unlock a free 3-day rental!`}
                </p>
              </div>

              {hasTenReward && (
                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/60 border border-amber-400/50 rounded-xl font-mono text-xs text-amber-300 font-bold">
                    <span>{availableVouchers.find(v => v.type === 'free_rental')?.code || 'FREE3DAY-VIP'}</span>
                    <button
                      onClick={() => handleCopy(availableVouchers.find(v => v.type === 'free_rental')?.code || 'FREE3DAY-VIP')}
                      className="text-gray-400 hover:text-white"
                      title="Copy code"
                    >
                      {copiedCode === (availableVouchers.find(v => v.type === 'free_rental')?.code || 'FREE3DAY-VIP') ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  {onApplyVoucherToBooking && (
                    <button
                      onClick={() => onApplyVoucherToBooking(availableVouchers.find(v => v.type === 'free_rental')?.code || 'FREE3DAY-VIP')}
                      className="mt-1 block text-[11px] text-amber-400 hover:underline"
                    >
                      Apply to Booking
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Only completed & returned rentals verified by boutique admin earn stamps.</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCard}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-pink-200 bg-white/5 hover:bg-white/10 border border-pink-400/30 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-pink-400" />
              <span>Print / Save Card</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

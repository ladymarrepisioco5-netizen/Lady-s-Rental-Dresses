import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Booking, Dress } from '../types.ts';
import { generateReceiptPdf } from '../utils/receiptPdf.ts';
import {
  Sparkles,
  User,
  Heart,
  Calendar,
  Download,
  X,
  LogOut,
  MapPin,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Wand2,
  AlertCircle
} from 'lucide-react';

interface CustomerDashboardModalProps {
  onClose: () => void;
  onOpenCharacterSelect: () => void;
  onOpenLoyaltyCard: () => void;
  onSelectDress: (dress: Dress) => void;
}

export const CustomerDashboardModal: React.FC<CustomerDashboardModalProps> = ({
  onClose,
  onOpenCharacterSelect,
  onOpenLoyaltyCard,
  onSelectDress
}) => {
  const { currentCustomer, customerLogout, siteData } = useSite();
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites' | 'profile'>('bookings');

  if (!currentCustomer) {
    onClose();
    return null;
  }

  // Bookings of current customer
  const customerBookings = (siteData.bookings || []).filter(
    b => b.customerEmail.toLowerCase() === currentCustomer.email.toLowerCase()
  );

  // Favorite dresses
  const favoriteDresses = (siteData.dresses || []).filter(d =>
    (currentCustomer.favorites || []).includes(d.id)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Payment Verified':
      case 'Confirmed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Payment Under Review':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Returned':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0f0f15] border border-pink-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(244,114,182,0.25)] text-[#f4f2ee] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Customer Profile Header Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="relative group cursor-pointer" onClick={onOpenCharacterSelect} title="Click to change magical character avatar">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-teal-400 to-amber-200 shadow-lg">
                <img
                  src={currentCustomer.characterAvatar || '/src/assets/images/character_fairy_guide_1791999955704.jpg'}
                  alt={currentCustomer.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-pink-600 text-white shadow-md">
                <Wand2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {currentCustomer.name}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30">
                  {currentCustomer.characterName || 'Atelier Patron'}
                </span>
              </div>
              <p className="text-xs text-gray-400">{currentCustomer.email} • {currentCustomer.phone || 'No phone set'}</p>
              
              {/* Completed Rentals Heart Counter */}
              <div className="mt-1 flex items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={onOpenLoyaltyCard}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/40 text-pink-300 text-xs font-semibold hover:border-pink-300 transition-all cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                  <span>{currentCustomer.completedRentalsCount || 0} / 10 Heart Stamps</span>
                  <span className="text-[10px] underline ml-1">View Card</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCharacterSelect}
              className="px-3.5 py-2 text-xs font-medium text-pink-200 bg-white/5 hover:bg-white/10 border border-pink-400/30 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Change Avatar</span>
            </button>
            <button
              onClick={() => { customerLogout(); onClose(); }}
              className="px-3.5 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-red-950/40 border border-white/10 rounded-xl transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 mb-4 border-b border-white/10 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Bookings ({customerBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Saved Favorites ({favoriteDresses.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Delivery Address & Details
          </button>
        </div>

        {/* Tab 1: Bookings */}
        {activeTab === 'bookings' && (
          <div className="flex-grow overflow-y-auto pr-1 space-y-3">
            {customerBookings.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                <ShoppingBag className="w-10 h-10 text-pink-400/50 mx-auto mb-2" />
                <h4 className="font-serif font-bold text-white text-base">No Dress Bookings Yet</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                  Browse our fairy-tale collection of short and long dresses, and submit your reservation today.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500"
                >
                  Explore Dress Catalog
                </button>
              </div>
            ) : (
              customerBookings.map(b => {
                const isPaid = b.status === 'Payment Verified' || b.status === 'Confirmed' || b.status === 'Returned';
                return (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-[#14141c] border border-white/10 hover:border-pink-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={b.dressCover || '/src/assets/images/hero_luxury_evening_gown_1791965010105.jpg'}
                        alt={b.dressName}
                        className="w-16 h-20 object-cover rounded-xl border border-white/10 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] text-pink-300 font-bold">{b.id}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(b.status)}`}>
                            {b.status}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-white mt-0.5">
                          {b.dressName}
                        </h4>
                        <p className="text-xs text-gray-300 flex items-center gap-2 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-pink-400" />
                          <span>{b.startDate} to {b.endDate} ({b.durationDays || 3}-Day Rental)</span>
                          <span className="text-pink-300 font-bold">• Size {b.size}</span>
                        </p>
                        <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-amber-200 mt-0.5">
                          Total: ₱{(b.totalAmount || 0).toLocaleString()} (Rental ₱{(b.rentalPrice || 0).toLocaleString()} + Deposit ₱{(b.depositAmount || 0).toLocaleString()})
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                      {/* PDF Receipt Download Button */}
                      <button
                        onClick={() => generateReceiptPdf(b, isPaid)}
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          isPaid
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md'
                            : 'bg-white/10 hover:bg-white/15 text-pink-200 border border-pink-400/30'
                        }`}
                        title={isPaid ? 'Download official paid rental receipt' : 'Download booking summary'}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isPaid ? 'Download Official PDF Receipt' : 'Download Booking Summary'}</span>
                      </button>

                      {b.paymentProofUrl && (
                        <span className="text-[10px] text-teal-300 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-teal-400" />
                          <span>Payment Proof Uploaded (Method: {b.paymentMethod || 'GCash'})</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Favorites */}
        {activeTab === 'favorites' && (
          <div className="flex-grow overflow-y-auto pr-1">
            {favoriteDresses.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                <Heart className="w-10 h-10 text-pink-400/40 mx-auto mb-2" />
                <h4 className="font-serif font-bold text-white text-base">No Saved Favorites</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                  Click the heart icon on any dress in the catalog to save it to your private dressing wishlist.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {favoriteDresses.map(d => (
                  <div
                    key={d.id}
                    onClick={() => { onSelectDress(d); onClose(); }}
                    className="p-3 bg-[#14141c] rounded-2xl border border-white/10 hover:border-pink-500/40 cursor-pointer transition-all flex items-center gap-3 group"
                  >
                    <img
                      src={d.coverPhoto}
                      alt={d.name}
                      className="w-14 h-18 object-cover rounded-xl"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-pink-400">
                        {d.lengthCategory === 'short' ? 'Short Dress' : 'Long Dress'}
                      </span>
                      <h4 className="text-xs font-serif font-bold text-white group-hover:text-pink-300">
                        {d.name}
                      </h4>
                      <p className="text-xs font-bold text-amber-200 mt-1">
                        ₱{d.rentalPrice3Day.toLocaleString()} / 3-Day Rental
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile & Delivery Address */}
        {activeTab === 'profile' && (
          <div className="flex-grow overflow-y-auto pr-1">
            <div className="max-w-md mx-auto space-y-4 bg-white/5 p-5 rounded-2xl border border-white/10">
              <h4 className="font-serif font-bold text-white text-sm">Delivery Information</h4>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Full Name</label>
                <p className="text-xs font-bold text-white">{currentCustomer.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Email</label>
                <p className="text-xs font-mono text-pink-300">{currentCustomer.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Contact Phone</label>
                <p className="text-xs text-white">{currentCustomer.phone || 'None provided'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Saved Delivery Address</label>
                <p className="text-xs text-white leading-relaxed">
                  {currentCustomer.deliveryAddress ? `${currentCustomer.deliveryAddress}${currentCustomer.cityMunicipality ? ', ' + currentCustomer.cityMunicipality : ''}` : 'No address saved yet. Can be provided during rental checkout.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

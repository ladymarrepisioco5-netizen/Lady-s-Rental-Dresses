import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { X, Search, Calendar, CheckCircle2, Clock, Truck, Shield, AlertCircle } from 'lucide-react';
import { Booking } from '../types.ts';

interface OrderTrackerModalProps {
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ onClose }) => {
  const { siteData } = useSite();
  const [query, setQuery] = useState('');
  const [matchedBookings, setMatchedBookings] = useState<Booking[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const cleanQ = query.trim().toLowerCase();
    const results = siteData.bookings.filter(b =>
      b.id.toLowerCase().includes(cleanQ) ||
      b.customerEmail.toLowerCase().includes(cleanQ) ||
      b.customerPhone.includes(cleanQ)
    );

    setMatchedBookings(results);
    setHasSearched(true);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-emerald-400 font-medium">Confirmed / Reserved</span>;
      case 'picked_up':
        return <span className="text-sky-400 font-medium">Dispatched / With Client</span>;
      case 'returned':
        return <span className="text-neutral-400 font-medium">Returned & Inspected</span>;
      case 'overdue':
        return <span className="text-rose-400 font-medium">Overdue for Return</span>;
      case 'cancelled':
        return <span className="text-neutral-500 line-through">Cancelled</span>;
      default:
        return <span className="text-amber-400 font-medium">Pending Atelier Approval</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 text-left">
      <div className="relative w-full max-w-xl bg-[#0f0f15] border border-white/15 rounded-lg shadow-2xl overflow-hidden my-auto text-[#f5f0ea]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-medium">Patron Concierge</p>
            <h2 className="text-2xl font-serif text-white mt-1">Track Your Dress Reservation</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Enter your Booking Reference (e.g. <span className="text-[#c9a86a] font-mono">LR-BK-7821</span>) or email address.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="LR-BK-... or your email"
                className="w-full pl-10 pr-4 py-2.5 bg-[#181820] text-xs text-white placeholder-neutral-500 border border-white/10 rounded focus:border-[#c9a86a] focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#c9a86a] text-black text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#dfb15b] transition-colors"
            >
              Lookup
            </button>
          </form>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-4 pt-2">
              {matchedBookings && matchedBookings.length > 0 ? (
                matchedBookings.map(b => (
                  <div key={b.id} className="p-4 bg-[#15151e] border border-white/10 rounded-lg space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="font-mono text-[#c9a86a] font-bold text-xs">{b.id}</span>
                      <span className="text-xs">{getStatusBadge(b.status)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={b.dressCover}
                        alt={b.dressName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-16 object-cover rounded border border-white/10 shrink-0"
                      />
                      <div className="text-xs space-y-0.5">
                        <p className="font-serif text-white font-medium text-sm">{b.dressName}</p>
                        <p className="text-neutral-400">Size: {b.size} · Patron: {b.customerName}</p>
                        <p className="text-neutral-400 font-mono">
                          Period: {b.startDate} to {b.endDate} ({b.durationDays} days)
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/5 text-neutral-400">
                      <div>
                        <span>Deposit: </span>
                        <span className="text-white">${b.depositAmount} ({b.depositStatus})</span>
                      </div>
                      <div>
                        <span>Total Paid: </span>
                        <span className="text-[#c9a86a] font-mono font-medium">${b.totalAmount}</span>
                      </div>
                      <div className="col-span-2">
                        <span>Fulfillment: </span>
                        <span className="text-neutral-200">
                          {b.deliveryOption === 'boutique_fitting_pickup' ? 'Private Showroom Fitting' : `Courier to: ${b.deliveryAddress || 'Address on file'}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center border border-white/10 rounded bg-[#15151e]">
                  <p className="text-xs text-neutral-300">No active bookings found for "{query}".</p>
                  <p className="text-[11px] text-neutral-500 mt-1">Please verify the reference code or contact our atelier concierge.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

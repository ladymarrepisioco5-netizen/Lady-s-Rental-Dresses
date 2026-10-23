import React, { useState, useEffect } from 'react';
import { Dress, Booking } from '../types.ts';
import { useSite } from '../context/SiteContext.tsx';
import { generateReceiptPdf } from '../utils/receiptPdf.ts';
import {
  X,
  CheckCircle,
  Calendar,
  Shield,
  AlertTriangle,
  Truck,
  MapPin,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Gift,
  Download,
  CreditCard,
  FileCheck,
  Check
} from 'lucide-react';

interface BookingModalProps {
  dress: Dress | null;
  initialSize?: string;
  initialDuration?: number;
  initialStartDate?: string;
  onClose: () => void;
  onSuccess?: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  dress,
  initialSize,
  initialDuration = 3,
  initialStartDate,
  onClose,
  onSuccess
}) => {
  const { currentCustomer, createBooking, uploadMediaFiles, validateLoyaltyVoucher, siteData } = useSite();
  if (!dress) return null;

  // Prefill from current logged-in customer if available
  const [customerName, setCustomerName] = useState(currentCustomer?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentCustomer?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentCustomer?.phone || '');
  const [size, setSize] = useState(initialSize || dress.sizes[0]?.size || 'US 4 / M');
  const [duration, setDuration] = useState(initialDuration || 3);
  const [startDate, setStartDate] = useState(initialStartDate || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  })());

  const [deliveryOption, setDeliveryOption] = useState<'boutique_fitting_pickup' | 'courier_delivery'>('courier_delivery');
  const [deliveryAddress, setDeliveryAddress] = useState(currentCustomer?.deliveryAddress || '');
  const [cityMunicipality, setCityMunicipality] = useState(currentCustomer?.cityMunicipality || 'Taguig');
  const [province, setProvince] = useState(currentCustomer?.province || 'Metro Manila');
  const [postalCode, setPostalCode] = useState(currentCustomer?.postalCode || '1634');
  const [notes, setNotes] = useState('');

  // Payment proof details
  const [paymentMethod, setPaymentMethod] = useState<string>('GCash');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [uploadedProofUrl, setUploadedProofUrl] = useState<string | null>(null);

  // Voucher / Loyalty discount
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discountAmount: number;
    description: string;
  } | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Standard return date
  const endDate = (() => {
    if (!startDate) return '';
    const d = new Date(startDate);
    d.setDate(d.getDate() + duration - 1);
    return d.toISOString().split('T')[0];
  })();

  // Pricing calculations in Philippine Pesos (₱)
  const baseRentalPrice = duration === 3
    ? dress.rentalPrice3Day
    : duration === 5
    ? (dress.rentalPrice5Day || Math.round(dress.rentalPrice3Day * 1.35))
    : (dress.rentalPrice7Day || Math.round(dress.rentalPrice3Day * 1.65));

  const depositAmount = dress.securityDeposit || 1000;
  const cleaningFee = dress.cleaningFee || 0;
  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const totalAmount = Math.max(0, (baseRentalPrice - discountAmount) + depositAmount + cleaningFee);

  // Auto-apply customer voucher if they have one unlocked
  useEffect(() => {
    if (currentCustomer?.availableVouchers && currentCustomer.availableVouchers.length > 0 && !appliedVoucher) {
      const firstVoucher = currentCustomer.availableVouchers[0];
      setVoucherCodeInput(firstVoucher.code);
    }
  }, [currentCustomer]);

  const handleApplyVoucher = async () => {
    setVoucherError(null);
    if (!voucherCodeInput.trim()) return;
    const res = await validateLoyaltyVoucher(voucherCodeInput, baseRentalPrice, duration);
    if (res.valid) {
      setAppliedVoucher({
        code: voucherCodeInput.trim().toUpperCase(),
        discountAmount: res.discountAmount,
        description: res.description
      });
    } else {
      setVoucherError(res.error || 'Invalid or expired voucher code.');
    }
  };

  const handleProofImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentProofFile(file);
      setPaymentProofPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName || !customerEmail || !customerPhone || !startDate) {
      setErrorMessage('Please fill in all customer contact details and rental dates.');
      return;
    }

    if (deliveryOption === 'courier_delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Please provide your complete delivery address for courier dispatch.');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalProofUrl = uploadedProofUrl || '';

      // Upload payment screenshot if provided
      if (paymentProofFile && !finalProofUrl) {
        const uploadRes = await uploadMediaFiles([paymentProofFile]);
        if (uploadRes.success && uploadRes.urls.length > 0) {
          finalProofUrl = uploadRes.urls[0];
          setUploadedProofUrl(finalProofUrl);
        }
      }

      const result = await createBooking({
        dressId: dress.id,
        dressName: dress.name,
        dressCover: dress.coverPhoto,
        customerName,
        customerEmail: customerEmail.toLowerCase(),
        customerPhone,
        size,
        startDate,
        endDate,
        durationDays: duration,
        rentalPrice: baseRentalPrice,
        depositAmount,
        cleaningFee,
        discountAmount,
        loyaltyRewardApplied: appliedVoucher ? appliedVoucher.code : undefined,
        totalAmount,
        deliveryOption,
        deliveryAddress: deliveryOption === 'courier_delivery' ? deliveryAddress : undefined,
        cityMunicipality,
        province,
        postalCode,
        paymentMethod,
        paymentReference,
        paymentDate,
        paymentAmount: totalAmount,
        paymentProofUrl: finalProofUrl || undefined,
        notes,
        characterAvatar: currentCustomer?.characterAvatar
      });

      if (result.success && result.booking) {
        setConfirmedBooking(result.booking);
        if (onSuccess) onSuccess(result.booking);
      } else {
        setErrorMessage(result.error || 'Failed to complete reservation. Date overlap or inventory limit reached.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting booking request';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 text-left animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0f0f15] border border-pink-500/30 rounded-3xl shadow-[0_25px_80px_rgba(244,114,182,0.25)] overflow-hidden my-auto text-[#f5f0ea] max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Confirmation Success State */
          <div className="p-8 sm:p-10 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/40 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-pink-400 font-bold">Booking Request Submitted</p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Your Rental is Under Review
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-md mx-auto leading-relaxed">
                Thank you, <b className="text-white">{confirmedBooking.customerName}</b>! Your reservation request (Ref: <span className="font-mono text-pink-300 font-bold">{confirmedBooking.id}</span>) and payment proof have been received.
              </p>
            </div>

            {/* Status explanation notice */}
            <div className="p-4 rounded-2xl bg-[#14141d] border border-pink-400/30 text-xs text-left space-y-2">
              <div className="flex items-center gap-2 text-pink-300 font-bold">
                <Shield className="w-4 h-4 text-teal-400" />
                <span>Next Step: Boutique Payment Verification</span>
              </div>
              <p className="text-gray-300 text-xs">
                Our boutique administrator will inspect your uploaded payment screenshot and confirm your booking. Once verified, your status will update to <b>Payment Verified</b> and your official paid receipt will be unlocked.
              </p>
              <p className="text-[11px] text-gray-400 font-mono">
                Status: <span className="text-amber-300 font-bold">{confirmedBooking.status}</span> • Duration: {confirmedBooking.durationDays}-Day Rental • Total: ₱{(confirmedBooking.totalAmount || 0).toLocaleString()}
              </p>
            </div>

            {/* Download summary button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => generateReceiptPdf(confirmedBooking, false)}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Booking Confirmation PDF</span>
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10"
              >
                Return to Boutique
              </button>
            </div>
          </div>
        ) : (
          /* STEP-BY-STEP RENTAL & PAYMENT PROOF FORM */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Header */}
            <div className="pb-4 border-b border-white/10 flex items-center gap-3">
              <img
                src={dress.coverPhoto}
                alt={dress.name}
                className="w-16 h-20 object-cover rounded-xl border border-pink-400/30 shrink-0"
              />
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30">
                  {dress.lengthCategory === 'short' ? 'Short Dress' : 'Long Dress'} • ID: {dress.id}
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
                  Rent: {dress.name}
                </h3>
                <p className="text-xs text-gray-400">
                  Standard 3-Day Rental with Island-Wide Delivery & Sanitization
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SECTION 1: Rental Configuration */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-pink-300 mb-3 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>1. Rental Duration & Dates</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Size */}
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Selected Size</label>
                  <select
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    {dress.sizes.map(s => (
                      <option key={s.size} value={s.size} disabled={!s.inStock}>
                        {s.size} {!s.inStock ? '(Out of Stock)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Rental Duration</label>
                  <select
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value={3}>3-Day Rental (Standard)</option>
                    <option value={5}>5-Day Rental (Extended)</option>
                    <option value={7}>7-Day Rental (Gala Week)</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Start Date (Delivery)</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <p className="mt-2 text-[11px] text-pink-300">
                Scheduled Return Date: <b className="text-white font-mono">{endDate}</b> (Return on Day 3)
              </p>
            </div>

            {/* SECTION 2: Customer Contact & Delivery Details */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-pink-300 mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>2. Customer & Delivery Information</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Maria Santos"
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="maria@example.com"
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="+63 917 123 4567"
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Delivery Option */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <label
                  onClick={() => setDeliveryOption('courier_delivery')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    deliveryOption === 'courier_delivery'
                      ? 'bg-pink-950/40 border-pink-400 text-white'
                      : 'bg-black/40 border-white/10 text-gray-400'
                  }`}
                >
                  <Truck className="w-4 h-4 text-pink-400" />
                  <div>
                    <p className="text-xs font-bold text-white">White-Glove Courier Delivery</p>
                    <p className="text-[10px] text-gray-400">Delivered directly to your door</p>
                  </div>
                </label>

                <label
                  onClick={() => setDeliveryOption('boutique_fitting_pickup')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    deliveryOption === 'boutique_fitting_pickup'
                      ? 'bg-pink-950/40 border-pink-400 text-white'
                      : 'bg-black/40 border-white/10 text-gray-400'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <div>
                    <p className="text-xs font-bold text-white">Showroom Fitting Pickup</p>
                    <p className="text-[10px] text-gray-400">BGC High Street Showroom</p>
                  </div>
                </label>
              </div>

              {deliveryOption === 'courier_delivery' && (
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Complete Delivery Address *</label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      placeholder="Unit Number, Street, Building, Barangay"
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">City / Municipality</label>
                      <input
                        type="text"
                        value={cityMunicipality}
                        onChange={e => setCityMunicipality(e.target.value)}
                        placeholder="Taguig / Makati"
                        className="w-full px-2.5 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">Province</label>
                      <input
                        type="text"
                        value={province}
                        onChange={e => setProvince(e.target.value)}
                        placeholder="Metro Manila"
                        className="w-full px-2.5 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={e => setPostalCode(e.target.value)}
                        placeholder="1634"
                        className="w-full px-2.5 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: Loyalty Voucher Code */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-pink-400/20">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-pink-300 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" />
                  <span>VIP Loyalty Voucher (50% Off or Free Rental)</span>
                </span>
                {appliedVoucher && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Applied: -₱{appliedVoucher.discountAmount.toLocaleString()}</span>
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherCodeInput}
                  onChange={e => setVoucherCodeInput(e.target.value)}
                  placeholder="Enter code (e.g. MAGIC50-BIANCA, FREE3DAY)"
                  className="flex-grow px-3 py-1.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyVoucher}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500"
                >
                  Apply
                </button>
              </div>
              {voucherError && <p className="text-[11px] text-red-400 mt-1">{voucherError}</p>}
            </div>

            {/* SECTION 4: Payment Method & Payment Proof Upload */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-pink-300 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span>3. Payment Information & Proof Upload</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="GCash">GCash (0917-842-5239 / Lady's Rental)</option>
                    <option value="Maya">Maya (0917-842-5239)</option>
                    <option value="Bank Transfer (BDO)">BDO Bank Transfer (Acct: 00482910492)</option>
                    <option value="Bank Transfer (BPI)">BPI Bank Transfer (Acct: 2849102849)</option>
                    <option value="Cash on Showroom Pickup">Cash on Fitting Showroom Pickup</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Payment Reference No. (Optional if cash)</label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={e => setPaymentReference(e.target.value)}
                    placeholder="e.g. GCASH-1948201948"
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                  />
                </div>
              </div>

              {/* Dedicated Payment Proof Screenshot Upload Button */}
              <div className="p-4 rounded-2xl bg-black/40 border-2 border-dashed border-pink-400/40 text-center">
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProofImageChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="w-6 h-6 text-pink-400" />
                    <div>
                      <p className="text-xs font-semibold text-white">
                        Upload Payment Proof Screenshot (GCash / Maya / Bank)
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Supports JPG, PNG, WEBP (Max 15MB)
                      </p>
                    </div>
                  </div>
                </label>

                {/* Proof image preview */}
                {paymentProofPreview && (
                  <div className="mt-3 flex items-center justify-center gap-3 p-2 bg-white/5 rounded-xl border border-white/10 max-w-sm mx-auto">
                    <img
                      src={paymentProofPreview}
                      alt="Payment Proof"
                      className="w-16 h-16 object-cover rounded-lg border border-pink-400/50"
                    />
                    <div className="text-left text-xs">
                      <p className="font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Screenshot Selected</span>
                      </p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[180px]">
                        {paymentProofFile?.name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Important Verification Notice */}
                <p className="mt-3 text-[10px] text-amber-300/90 leading-tight">
                  ⚠️ Note: Uploading a payment screenshot does not automatically mark payment as verified. Our boutique team inspects every transaction before issuing your official receipt.
                </p>
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="p-4 rounded-2xl bg-[#14141d] border border-white/10 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>{dress.name} ({duration}-Day Rental):</span>
                <span>₱{baseRentalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Refundable Security Deposit:</span>
                <span>₱{depositAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Sanitization & Garment Care:</span>
                <span>Complimentary (₱0)</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-pink-400 font-bold">
                  <span>Loyalty Privilege Discount:</span>
                  <span>-₱{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm sm:text-base font-bold text-white font-mono">
                <span>Total Amount Due:</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-amber-200">
                  ₱{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-teal-500 hover:from-pink-400 hover:to-teal-400 shadow-[0_0_25px_rgba(244,114,182,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting & Uploading Proof...' : 'Confirm Rental & Submit Payment Proof'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

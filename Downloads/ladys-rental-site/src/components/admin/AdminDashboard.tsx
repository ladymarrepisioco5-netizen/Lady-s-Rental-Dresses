import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import {
  Dress,
  Booking,
  Category,
  HomepageConfig,
  AppearanceSettings,
  RentalPolicies,
  SEOSettings,
  WelcomePageConfig,
  CharacterOption,
  LoyaltyConfig,
  AccessoryItem,
  BookingStatus
} from '../../types.ts';
import { FeaturedEditor } from './FeaturedEditor.tsx';
import { MediaLibrary } from './MediaLibrary.tsx';
import { DressEditorModal } from './DressEditorModal.tsx';
import { generateReceiptPdf } from '../../utils/receiptPdf.ts';
import {
  LayoutDashboard,
  Home,
  Palette,
  ShoppingBag,
  FolderTree,
  Sparkles,
  CalendarCheck,
  Users,
  Boxes,
  BadgePercent,
  PhoneCall,
  Image as ImageIcon,
  Globe,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Check,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Menu,
  X,
  CreditCard,
  FileCheck,
  ShieldCheck,
  Wand2,
  Heart,
  Crown,
  Download,
  Upload
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  initialTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, initialTab = 'overview' }) => {
  const {
    siteData,
    adminLogout,
    updateSettings,
    updateHomepage,
    updateWelcomeConfig,
    updateLoyaltyConfig,
    saveDress,
    deleteDress,
    duplicateDress,
    saveCategories,
    saveCharacter,
    deleteCharacter,
    saveAccessory,
    deleteAccessory,
    updateOccasions,
    verifyBookingPayment,
    updateBookingStatus,
    adjustCustomerLoyalty,
    resetDemoData
  } = useSite();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingDress, setEditingDress] = useState<Dress | null>(null);
  const [isDressModalOpen, setIsDressModalOpen] = useState(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // Verification & Payment Review Modal State
  const [inspectingBooking, setInspectingBooking] = useState<Booking | null>(null);
  const [verifyAmountInput, setVerifyAmountInput] = useState<number>(0);
  const [adminNoteInput, setAdminNoteInput] = useState<string>('');
  const [rejectReasonInput, setRejectReasonInput] = useState<string>('');
  const [zoomedProofUrl, setZoomedProofUrl] = useState<string | null>(null);

  // Forms
  const [welcomeForm, setWelcomeForm] = useState<WelcomePageConfig>({ ...siteData.welcomePage });
  const [loyaltyForm, setLoyaltyForm] = useState<LoyaltyConfig>({ ...siteData.loyaltyConfig });
  const [appearanceForm, setAppearanceForm] = useState<AppearanceSettings>({ ...siteData.settings });
  const [homepageForm, setHomepageForm] = useState<HomepageConfig>({ ...siteData.homepage });
  const [policiesForm, setPoliciesForm] = useState<RentalPolicies>({ ...siteData.policies });
  const [seoForm, setSeoForm] = useState<SEOSettings>({ ...siteData.seo });
  const [occasionsInput, setOccasionsInput] = useState<string>(siteData.occasionsList?.join(', ') || '');

  // Character Editor
  const [editingCharacter, setEditingCharacter] = useState<CharacterOption | null>(null);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);

  // Accessory Editor
  const [editingAccessory, setEditingAccessory] = useState<AccessoryItem | null>(null);
  const [isAccessoryModalOpen, setIsAccessoryModalOpen] = useState(false);

  // Manual Customer Adjustment Modal
  const [adjustingCustomer, setAdjustingCustomer] = useState<{ id: string; name: string; currentCount: number } | null>(null);
  const [newCountInput, setNewCountInput] = useState<number>(0);
  const [adjustNoteInput, setAdjustNoteInput] = useState<string>('');

  // Booking Filter State
  const [bookingFilter, setBookingFilter] = useState<string>('all');

  const flashSave = (msg = 'Changes saved successfully to persistent database.') => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(null), 3000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Payment Verification & Bookings', icon: FileCheck },
    { id: 'welcome', label: 'Enchanted Door & Fairy', icon: Wand2 },
    { id: 'characters', label: 'Character Library', icon: Sparkles },
    { id: 'loyalty', label: 'VIP Loyalty Program', icon: Heart },
    { id: 'catalog', label: 'Dress Catalog', icon: ShoppingBag },
    { id: 'occasions_accessories', label: 'Occasions & Accessories', icon: Palette },
    { id: 'featured', label: 'Featured Dresses', icon: Crown },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'customers', label: 'Customer Accounts', icon: Users },
    { id: 'inventory', label: 'Physical Inventory', icon: Boxes },
    { id: 'policies', label: '3-Day Pricing & Policies', icon: BadgePercent },
    { id: 'homepage', label: 'Homepage Editor', icon: Home },
    { id: 'appearance', label: 'Website Appearance', icon: Settings },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'general', label: 'General & Reset', icon: RotateCcw }
  ];

  // Save Handlers
  const handleSaveWelcome = async () => {
    await updateWelcomeConfig(welcomeForm);
    flashSave('Enchanted Door and Fairy settings saved.');
  };

  const handleSaveLoyalty = async () => {
    await updateLoyaltyConfig(loyaltyForm);
    flashSave('Loyalty configuration updated.');
  };

  const handleSaveAppearance = async () => {
    await updateSettings(appearanceForm);
    flashSave('Website appearance saved.');
  };

  const handleSaveHomepage = async () => {
    await updateHomepage(homepageForm);
    flashSave('Homepage sections updated.');
  };

  const handleSavePolicies = async () => {
    await fetch('/api/policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policiesForm)
    });
    flashSave('Rental policies updated.');
  };

  const handleSaveOccasions = async () => {
    const list = occasionsInput.split(',').map(s => s.trim()).filter(Boolean);
    await updateOccasions(list);
    flashSave('Occasions list updated.');
  };

  // Payment Verification Handler
  const handleVerifyPaymentSubmit = async (action: 'approve' | 'reject') => {
    if (!inspectingBooking) return;
    const res = await verifyBookingPayment(
      inspectingBooking.id,
      verifyAmountInput,
      adminNoteInput,
      action,
      rejectReasonInput
    );
    if (res.success && res.booking) {
      setInspectingBooking(res.booking);
      flashSave(action === 'approve' ? `Payment for ${res.booking.id} verified!` : `Payment rejected.`);
    } else {
      alert(`Verification error: ${res.error}`);
    }
  };

  // Status update
  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    const res = await updateBookingStatus(bookingId, newStatus);
    if (res.success) {
      flashSave(`Booking ${bookingId} status changed to ${newStatus}. Customer loyalty updated if returned.`);
    } else {
      alert(`Status update error: ${res.error}`);
    }
  };

  // Save Character
  const handleSaveCharacterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCharacter) return;
    await saveCharacter(editingCharacter);
    setIsCharacterModalOpen(false);
    setEditingCharacter(null);
    flashSave(`Character ${editingCharacter.name} saved.`);
  };

  // Save Accessory
  const handleSaveAccessorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccessory) return;
    await saveAccessory(editingAccessory);
    setIsAccessoryModalOpen(false);
    setEditingAccessory(null);
    flashSave(`Accessory ${editingAccessory.name} saved.`);
  };

  // Adjust Customer Completed Rentals
  const handleAdjustCustomerSubmit = async () => {
    if (!adjustingCustomer) return;
    await adjustCustomerLoyalty(adjustingCustomer.id, newCountInput, adjustNoteInput);
    setAdjustingCustomer(null);
    flashSave(`Adjusted completed rentals for ${adjustingCustomer.name} to ${newCountInput}.`);
  };

  // Dress save
  const handleSaveDressSubmit = async (dress: Dress) => {
    const res = await saveDress(dress);
    if (res.success) {
      setIsDressModalOpen(false);
      setEditingDress(null);
      flashSave(`Dress ${dress.name} saved successfully.`);
    } else {
      alert(`Error saving dress: ${res.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#09090d] text-[#f5f0ea] flex flex-col font-sans select-none">
      {/* Top Header Bar */}
      <div className="h-16 px-4 sm:px-6 bg-[#111117] border-b border-pink-500/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span className="font-serif text-lg text-white font-bold tracking-wide">Lady's Rental</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-pink-300 font-semibold bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/25">
            Admin Atelier Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          {saveBanner && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs rounded-full animate-pulse">
              <Check className="w-3.5 h-3.5" />
              <span>{saveBanner}</span>
            </div>
          )}

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-pink-400" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={() => {
              adminLogout();
              onClose();
            }}
            className="p-2 text-gray-400 hover:text-red-400 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            title="Sign out of Admin Atelier"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? 'block absolute inset-y-16 left-0 z-30 w-64 bg-[#111117]' : 'hidden'
          } md:block w-64 shrink-0 bg-[#0e0e14] border-r border-white/10 overflow-y-auto p-3 space-y-1 text-xs`}
        >
          <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-pink-400/80 font-bold">
            Atelier Modules
          </div>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all font-semibold cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-pink-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Scrollable Content Pane */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#09090d]">
          <div className="max-w-6xl mx-auto space-y-8 pb-12">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-2xl font-serif text-white font-bold">Atelier Performance Overview</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Live operational metrics for Lady's Rental dress boutique, payment verifications, and customer loyalty.
                  </p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#13131b] border border-pink-500/20 rounded-2xl">
                    <p className="text-xs text-gray-400">Total Dresses</p>
                    <p className="text-2xl font-serif text-white font-bold mt-1">
                      {siteData.dresses.length}
                    </p>
                    <p className="text-[10px] text-pink-300 mt-1">
                      {(siteData.dresses || []).filter(d => d.lengthCategory === 'short').length} Short • {(siteData.dresses || []).filter(d => d.lengthCategory === 'long').length} Long
                    </p>
                  </div>

                  <div className="p-4 bg-[#13131b] border border-amber-500/30 rounded-2xl">
                    <p className="text-xs text-gray-400">Pending Payment Review</p>
                    <p className="text-2xl font-serif text-amber-300 font-bold mt-1">
                      {(siteData.bookings || []).filter(b => b.status === 'Payment Under Review' || b.status === 'pending').length}
                    </p>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-[10px] text-amber-400 hover:underline mt-1 block"
                    >
                      Review payment proofs →
                    </button>
                  </div>

                  <div className="p-4 bg-[#13131b] border border-emerald-500/30 rounded-2xl">
                    <p className="text-xs text-gray-400">Verified Bookings</p>
                    <p className="text-2xl font-serif text-emerald-300 font-bold mt-1">
                      {(siteData.bookings || []).filter(b => b.status === 'Payment Verified' || b.status === 'Confirmed' || b.status === 'Returned').length}
                    </p>
                    <p className="text-[10px] text-emerald-400/80 mt-1">Official receipts issued</p>
                  </div>

                  <div className="p-4 bg-[#13131b] border border-pink-500/20 rounded-2xl">
                    <p className="text-xs text-gray-400">Total Rental Revenue</p>
                    <p className="text-2xl font-serif text-pink-300 font-bold mt-1">
                      ₱{(siteData.bookings || [])
                        .reduce((sum, b) => sum + (b.verifiedPaymentAmount || b.paymentAmount || b.totalAmount || 0), 0)
                        .toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">Philippine Pesos</p>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="p-5 bg-[#13131b] border border-white/10 rounded-2xl space-y-3">
                  <h3 className="text-sm font-serif font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>Quick Administration Actions</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => { setEditingDress(null); setIsDressModalOpen(true); }}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-pink-400/30 rounded-xl text-left text-xs text-white"
                    >
                      <Plus className="w-4 h-4 text-pink-400 mb-1" />
                      <p className="font-bold">Add New Dress</p>
                      <p className="text-[10px] text-gray-400">Upload photos & video</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-teal-400/30 rounded-xl text-left text-xs text-white"
                    >
                      <FileCheck className="w-4 h-4 text-teal-400 mb-1" />
                      <p className="font-bold">Verify Payments</p>
                      <p className="text-[10px] text-gray-400">Inspect screenshots</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('welcome')}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-pink-400/30 rounded-xl text-left text-xs text-white"
                    >
                      <Wand2 className="w-4 h-4 text-pink-400 mb-1" />
                      <p className="font-bold">Enchanted Door</p>
                      <p className="text-[10px] text-gray-400">Edit garden & fairy</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('loyalty')}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-amber-400/30 rounded-xl text-left text-xs text-white"
                    >
                      <Heart className="w-4 h-4 text-amber-400 mb-1" />
                      <p className="font-bold">VIP Loyalty Club</p>
                      <p className="text-[10px] text-gray-400">Adjust stamps & rules</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PAYMENT VERIFICATION & BOOKINGS TAB (SECTION 13 REQUIREMENT) */}
            {activeTab === 'bookings' && (
              <div className="space-y-6 text-left text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
                  <div>
                    <h2 className="text-xl font-serif text-white font-bold flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-pink-400" />
                      <span>Payment Verification & Booking Management</span>
                    </h2>
                    <p className="text-gray-400 mt-1">
                      Inspect uploaded payment screenshots, approve/reject transactions, issue PDF receipts, and mark returns.
                    </p>
                  </div>

                  {/* Status Filters */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {['all', 'Payment Under Review', 'Payment Verified', 'Confirmed', 'Returned', 'Rejected', 'Cancelled'].map(st => (
                      <button
                        key={st}
                        onClick={() => setBookingFilter(st)}
                        className={`px-3 py-1.5 rounded-xl uppercase tracking-wider text-[10px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                          bookingFilter === st
                            ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                  {siteData.bookings
                    .filter(b => bookingFilter === 'all' || b.status === bookingFilter)
                    .map((booking) => {
                      const isPaid = booking.status === 'Payment Verified' || booking.status === 'Confirmed' || booking.status === 'Returned';
                      return (
                        <div
                          key={booking.id}
                          className="p-5 bg-[#13131b] border border-white/10 hover:border-pink-500/30 rounded-2xl space-y-4 transition-all"
                        >
                          {/* Top Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-2">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-pink-300 font-bold text-sm">{booking.id}</span>
                              <span className="text-gray-400">· Placed on {new Date(booking.createdAt).toLocaleDateString()}</span>
                              {booking.receiptNumber && (
                                <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                                  Receipt: {booking.receiptNumber}
                                </span>
                              )}
                            </div>

                            {/* Status Selector Dropdown */}
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Booking Status:</span>
                              <select
                                value={booking.status}
                                onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                                className="px-3 py-1 bg-black/60 text-xs font-semibold text-white border border-pink-400/40 rounded-xl focus:outline-none cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Awaiting Payment">Awaiting Payment</option>
                                <option value="Payment Under Review">Payment Under Review</option>
                                <option value="Payment Verified">Payment Verified</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Ready for Pickup">Ready for Pickup</option>
                                <option value="Rented Out">Rented Out</option>
                                <option value="Returned">Returned (Completes Rental & Grants Stamp)</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {/* Grid info */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Dress info */}
                            <div className="flex items-center gap-3">
                              <img
                                src={booking.dressCover}
                                alt={booking.dressName}
                                className="w-14 h-18 object-cover rounded-xl border border-white/10"
                              />
                              <div>
                                <p className="font-serif text-white font-bold">{booking.dressName}</p>
                                <p className="text-gray-400">Size: {booking.size} · ID: {booking.dressId}</p>
                                <p className="text-pink-300 font-mono mt-0.5">
                                  {booking.startDate} to {booking.endDate} ({booking.durationDays || 3} Days)
                                </p>
                              </div>
                            </div>

                            {/* Customer info */}
                            <div>
                              <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Patron Details</p>
                              <p className="text-white font-semibold mt-1">{booking.customerName}</p>
                              <p className="text-gray-300">{booking.customerEmail}</p>
                              <p className="text-gray-300">{booking.customerPhone}</p>
                            </div>

                            {/* Payment and Screenshot */}
                            <div>
                              <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Payment Proof</p>
                              <p className="text-white mt-1">Method: <b className="text-pink-300">{booking.paymentMethod || 'GCash'}</b></p>
                              <p className="text-gray-300 font-mono text-[11px]">Ref: {booking.paymentReference || 'None'}</p>

                              {booking.paymentProofUrl ? (
                                <button
                                  type="button"
                                  onClick={() => setZoomedProofUrl(booking.paymentProofUrl!)}
                                  className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-teal-300 hover:text-teal-200 underline cursor-pointer"
                                >
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>Inspect Proof Screenshot</span>
                                </button>
                              ) : (
                                <p className="text-[10px] text-gray-500 italic mt-1">No screenshot uploaded</p>
                              )}
                            </div>

                            {/* Financial Amount & Verification Action */}
                            <div className="flex flex-col justify-between">
                              <div>
                                <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Financial Summary</p>
                                <p className="text-white font-mono font-bold text-base mt-1">
                                  Total: ₱{(booking.totalAmount || 0).toLocaleString()}
                                </p>
                                <p className="text-[11px] text-emerald-400">
                                  Verified: ₱{(booking.verifiedPaymentAmount || (isPaid ? booking.paymentAmount || booking.totalAmount : 0)).toLocaleString()}
                                </p>
                              </div>

                              <div className="pt-2 flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setInspectingBooking(booking);
                                    setVerifyAmountInput(booking.paymentAmount || booking.totalAmount || 0);
                                    setAdminNoteInput(booking.adminNotes || '');
                                  }}
                                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 cursor-pointer shadow-sm"
                                >
                                  Verify / Audit Payment
                                </button>
                                <button
                                  onClick={() => generateReceiptPdf(booking, isPaid)}
                                  className="p-1.5 rounded-xl text-pink-300 bg-white/5 hover:bg-white/10 border border-white/10"
                                  title="Download PDF Receipt"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Address & Notes */}
                          {booking.deliveryAddress && (
                            <div className="pt-2 text-gray-400 border-t border-white/5 flex items-center justify-between text-[11px]">
                              <span><b>Courier Destination:</b> {booking.deliveryAddress} ({booking.cityMunicipality || ''}, {booking.province || ''})</span>
                              {booking.adminNotes && <span className="text-pink-300 italic">Note: {booking.adminNotes}</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 3. WELCOME PAGE & ENCHANTED DOOR EDITOR (SECTION 2 REQUIREMENT) */}
            {activeTab === 'welcome' && (
              <div className="space-y-6 text-left text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-serif text-white font-bold flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-pink-400" />
                      <span>Enchanted Garden & Teal Door Welcome Editor</span>
                    </h2>
                    <p className="text-gray-400 mt-1">
                      Customize the full-screen entrance experience, enchanted door artwork, fairy guide Flora, and text.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveWelcome}
                    className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 shadow-md cursor-pointer"
                  >
                    Save Entrance Settings
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Settings Form */}
                  <div className="space-y-4 p-5 bg-[#13131b] border border-white/10 rounded-2xl">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                      <input
                        type="checkbox"
                        checked={welcomeForm.enabled}
                        onChange={e => setWelcomeForm({ ...welcomeForm, enabled: e.target.checked })}
                        className="accent-pink-500 rounded"
                      />
                      <span>Enable Full-Screen Enchanted Door Entrance</span>
                    </label>

                    <div>
                      <label className="text-gray-400 block mb-1">Entrance Title</label>
                      <input
                        type="text"
                        value={welcomeForm.title}
                        onChange={e => setWelcomeForm({ ...welcomeForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Welcome Subtitle Message</label>
                      <input
                        type="text"
                        value={welcomeForm.subtitle}
                        onChange={e => setWelcomeForm({ ...welcomeForm, subtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Enter Button Text</label>
                      <input
                        type="text"
                        value={welcomeForm.buttonText}
                        onChange={e => setWelcomeForm({ ...welcomeForm, buttonText: e.target.value })}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Fairy Guide Name</label>
                      <input
                        type="text"
                        value={welcomeForm.fairyName}
                        onChange={e => setWelcomeForm({ ...welcomeForm, fairyName: e.target.value })}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Fairy Speech Bubble Message</label>
                      <textarea
                        rows={2}
                        value={welcomeForm.fairyMessage}
                        onChange={e => setWelcomeForm({ ...welcomeForm, fairyMessage: e.target.value })}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Animation Speed</label>
                      <select
                        value={welcomeForm.animationSpeed}
                        onChange={e => setWelcomeForm({ ...welcomeForm, animationSpeed: e.target.value as any })}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                      >
                        <option value="gentle">Gentle Floating</option>
                        <option value="normal">Normal Flight</option>
                        <option value="lively">Lively Flutter</option>
                      </select>
                    </div>
                  </div>

                  {/* Right: Media Previews */}
                  <div className="space-y-4 p-5 bg-[#13131b] border border-white/10 rounded-2xl">
                    <h3 className="font-bold text-white text-sm">Artwork & Visual Assets</h3>
                    
                    <div>
                      <label className="text-gray-400 block mb-1">Enchanted Garden Teal Door Background Image</label>
                      <input
                        type="text"
                        value={welcomeForm.bgImageUrl}
                        onChange={e => setWelcomeForm({ ...welcomeForm, bgImageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-mono mb-2"
                      />
                      <img
                        src={welcomeForm.bgImageUrl}
                        alt="Enchanted Door"
                        className="w-full h-44 object-cover rounded-xl border border-white/10"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Fairy Guide Avatar Image</label>
                      <input
                        type="text"
                        value={welcomeForm.fairyImageUrl}
                        onChange={e => setWelcomeForm({ ...welcomeForm, fairyImageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-mono mb-2"
                      />
                      <div className="flex items-center gap-3">
                        <img
                          src={welcomeForm.fairyImageUrl}
                          alt="Fairy Guide"
                          className="w-16 h-16 rounded-full object-cover border-2 border-pink-400 shadow-md"
                        />
                        <p className="text-gray-400 text-[11px]">
                          Fairy Flora guides visitors to the teal door with animated flying trail.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. CHARACTER LIBRARY (SECTION 4 REQUIREMENT) */}
            {activeTab === 'characters' && (
              <div className="space-y-6 text-left text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-serif text-white font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-pink-400" />
                      <span>Customer Character & Avatar Library</span>
                    </h2>
                    <p className="text-gray-400 mt-1">
                      Manage avatar options presented to customers upon registration or in their profile.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCharacter({
                        id: `char-${Date.now()}`,
                        name: 'New Muse',
                        title: 'Fashion Muse',
                        description: 'A stylish muse who inspires couture choices.',
                        avatarUrl: '/src/assets/images/character_fairy_guide_1791999955704.jpg',
                        category: 'muse',
                        isAvailable: true
                      });
                      setIsCharacterModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Character</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {siteData.characters.map((char) => (
                    <div key={char.id} className="p-4 bg-[#13131b] border border-white/10 rounded-2xl space-y-3 text-center">
                      <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-pink-500 via-teal-400 to-amber-200 shadow-md overflow-hidden">
                        <img src={char.avatarUrl} alt={char.name} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-white">{char.name}</h4>
                        <p className="text-[11px] text-pink-400 font-medium">{char.title}</p>
                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{char.description}</p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          char.isAvailable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-800 text-gray-500'
                        }`}>
                          {char.isAvailable ? 'Available' : 'Hidden'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingCharacter(char);
                              setIsCharacterModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteCharacter(char.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. VIP LOYALTY PROGRAM TAB (SECTION 15 REQUIREMENT) */}
            {activeTab === 'loyalty' && (
              <div className="space-y-6 text-left text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-serif text-white font-bold flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                      <span>VIP Loyalty Card & Reward Rules Management</span>
                    </h2>
                    <p className="text-gray-400 mt-1">
                      Configure reward thresholds: 5 completed rentals = 50% discount, 10 completed rentals = One Free 3-Day Rental.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveLoyalty}
                    className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 shadow-md cursor-pointer"
                  >
                    Save Loyalty Rules
                  </button>
                </div>

                {/* Loyalty Rules Config */}
                <div className="p-5 bg-[#13131b] border border-pink-400/20 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">Milestone 1: 5 Rentals Discount</label>
                    <input
                      type="number"
                      value={loyaltyForm.fiveRentalDiscountPercent}
                      onChange={e => setLoyaltyForm({ ...loyaltyForm, fiveRentalDiscountPercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-bold"
                    />
                    <p className="text-[10px] text-pink-300 mt-1">50% discount on next 3-day rental</p>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Milestone 2: 10 Rentals Reward</label>
                    <input
                      type="text"
                      value={loyaltyForm.tenRentalRewardDescription}
                      onChange={e => setLoyaltyForm({ ...loyaltyForm, tenRentalRewardDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-bold"
                    />
                    <p className="text-[10px] text-amber-300 mt-1">ONE FREE 3-DAY DRESS RENTAL</p>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Heart Stamp Target Count</label>
                    <input
                      type="number"
                      value={loyaltyForm.heartStampCount}
                      onChange={e => setLoyaltyForm({ ...loyaltyForm, heartStampCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-bold"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">10 Heart-shaped stamps layout</p>
                  </div>
                </div>

                {/* Customer Loyalty Progress Table */}
                <div className="bg-[#13131b] border border-white/10 rounded-2xl overflow-x-auto">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="font-serif font-bold text-white text-sm">Customer Heart Stamps & Vouchers</h3>
                    <span className="text-[11px] text-gray-400">Total registered patrons: {siteData.customers.length}</span>
                  </div>

                  <table className="w-full text-left">
                    <thead className="bg-[#181824] text-gray-400 text-[10px] uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Avatar Persona</th>
                        <th className="p-3">Completed & Returned Rentals</th>
                        <th className="p-3">Earned Vouchers</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-200">
                      {siteData.customers.map(c => (
                        <tr key={c.id}>
                          <td className="p-3">
                            <p className="font-bold text-white">{c.name}</p>
                            <p className="text-[10px] text-gray-400">{c.email}</p>
                          </td>
                          <td className="p-3">
                            <span className="text-pink-300 font-semibold">{c.characterName || 'Atelier Patron'}</span>
                          </td>
                          <td className="p-3 font-mono font-bold text-pink-400 flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                            <span>{c.completedRentalsCount || 0} / 10 Stamps</span>
                            {c.completedRentalsCount >= 5 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300">50% Qualified</span>}
                            {c.completedRentalsCount >= 10 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Free Rental Qualified</span>}
                          </td>
                          <td className="p-3 text-xs">
                            {c.availableVouchers && c.availableVouchers.length > 0 ? (
                              c.availableVouchers.map((v, i) => (
                                <span key={i} className="inline-block mr-1.5 mb-1 px-2 py-0.5 rounded-lg bg-pink-950/60 border border-pink-400/40 text-[10px] font-mono text-pink-200">
                                  {v.code} ({v.type})
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 italic">None yet</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setAdjustingCustomer({ id: c.id, name: c.name, currentCount: c.completedRentalsCount || 0 });
                                setNewCountInput(c.completedRentalsCount || 0);
                                setAdjustNoteInput('');
                              }}
                              className="px-3 py-1 rounded-lg text-xs font-semibold text-pink-300 bg-white/5 hover:bg-white/10 border border-pink-400/30"
                            >
                              Adjust Stamps
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. DRESS CATALOG TAB */}
            {activeTab === 'catalog' && (
              <div className="space-y-6 text-left text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-serif text-white font-bold">Haute Couture Dress Inventory</h2>
                    <p className="text-gray-400 mt-1">
                      Manage short & long dresses, real phone photos, runway videos, and 3-day Philippine Peso (₱) pricing.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingDress(null);
                      setIsDressModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Dress</span>
                  </button>
                </div>

                {/* Dress Table */}
                <div className="bg-[#13131b] border border-white/10 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#181824] text-gray-400 text-[10px] uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-3">Gown</th>
                        <th className="p-3">Length Category</th>
                        <th className="p-3">3-Day Rental Price (₱)</th>
                        <th className="p-3">Deposit</th>
                        <th className="p-3">Stock Units</th>
                        <th className="p-3">Media</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-200">
                      {siteData.dresses.map((dress) => (
                        <tr key={dress.id}>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img src={dress.coverPhoto} alt="" className="w-10 h-14 object-cover rounded-lg border border-white/10" />
                              <div>
                                <p className="font-serif font-bold text-white text-sm">{dress.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono">ID: {dress.id} • {dress.designer}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              dress.lengthCategory === 'short'
                                ? 'bg-pink-500/20 text-pink-300 border border-pink-400/30'
                                : 'bg-teal-500/20 text-teal-300 border border-teal-400/30'
                            }`}>
                              {dress.lengthCategory === 'short' ? 'Short Dress' : 'Long Dress'}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-white">
                            ₱{dress.rentalPrice3Day.toLocaleString()}
                          </td>
                          <td className="p-3 font-mono text-gray-400">
                            ₱{(dress.securityDeposit || 0).toLocaleString()}
                          </td>
                          <td className="p-3 font-mono text-pink-300 font-bold">
                            {dress.inventoryCount || 1}
                          </td>
                          <td className="p-3 text-[10px] text-gray-400">
                            {dress.photos.length} photos {dress.videos?.length > 0 && `• ${dress.videos.length} video`}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingDress(dress);
                                  setIsDressModalOpen(true);
                                }}
                                className="p-1.5 text-gray-300 hover:text-pink-300 rounded-lg hover:bg-white/5"
                                title="Edit dress"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => duplicateDress(dress.id)}
                                className="p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
                                title="Duplicate dress"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete ${dress.name}?`)) deleteDress(dress.id);
                                }}
                                className="p-1.5 text-gray-300 hover:text-red-400 rounded-lg hover:bg-white/5"
                                title="Delete dress"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. OCCASIONS & ACCESSORIES TAB */}
            {activeTab === 'occasions_accessories' && (
              <div className="space-y-6 text-left text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-serif text-white font-bold flex items-center gap-2">
                      <Palette className="w-5 h-5 text-pink-400" />
                      <span>Occasion Recommendations & Rentable Accessories</span>
                    </h2>
                    <p className="text-gray-400 mt-1">
                      Manage the occasions filter list and styling accessories (earrings, clutches, heels).
                    </p>
                  </div>
                </div>

                {/* Occasions List Editor */}
                <div className="p-5 bg-[#13131b] border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-white text-sm">Occasion Filter Tags</h3>
                    <button
                      onClick={handleSaveOccasions}
                      className="px-4 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-semibold"
                    >
                      Save Occasions
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs">
                    Comma-separated list of occasions shown in filters and dress tags:
                  </p>
                  <input
                    type="text"
                    value={occasionsInput}
                    onChange={e => setOccasionsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>

                {/* Accessories Catalog */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-white text-sm">Rentable Styling Accessories</h3>
                    <button
                      onClick={() => {
                        setEditingAccessory({
                          id: `acc-${Date.now()}`,
                          name: 'New Statement Piece',
                          category: 'earrings',
                          price: 350,
                          photo: '/src/assets/images/hero_luxury_evening_gown_1791965010105.jpg',
                          description: 'Elegant jewelry to complete the couture look.',
                          isAvailable: true,
                          isRentable: true
                        });
                        setIsAccessoryModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Accessory</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(siteData.accessoriesCatalog || []).map(acc => (
                      <div key={acc.id} className="p-4 bg-[#13131b] border border-white/10 rounded-2xl space-y-2">
                        <img src={acc.photo} alt={acc.name} className="w-full h-32 object-cover rounded-xl" />
                        <h4 className="font-serif font-bold text-sm text-white">{acc.name}</h4>
                        <p className="text-[11px] text-pink-300 font-bold">₱{acc.price || 350} / 3-Day Rental</p>
                        <p className="text-[10px] text-gray-400 line-clamp-2">{acc.description}</p>
                        <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingAccessory(acc);
                              setIsAccessoryModalOpen(true);
                            }}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteAccessory(acc.id)}
                            className="p-1 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 8. FEATURED DRESSES TAB */}
            {activeTab === 'featured' && <FeaturedEditor />}

            {/* 9. CATEGORIES TAB */}
            {activeTab === 'categories' && (
              <div className="space-y-6 text-left text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h2 className="text-xl font-serif text-white font-bold">Categories & Occasions</h2>
                  <button
                    onClick={() => {
                      const newCat: Category = {
                        id: `cat-${Date.now()}`,
                        slug: `occasion-${Math.floor(Math.random() * 100)}`,
                        name: 'New Curated Occasion',
                        description: 'Curated gowns for special occasions.',
                        coverImage: siteData.dresses[0]?.coverPhoto || '',
                        displayOrder: siteData.categories.length + 1
                      };
                      saveCategories([...siteData.categories, newCat]);
                    }}
                    className="px-4 py-2 bg-pink-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Add Category
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {siteData.categories.map((cat, idx) => (
                    <div key={cat.id} className="p-4 bg-[#13131b] border border-white/10 rounded-2xl space-y-2">
                      <div className="flex items-center gap-3">
                        <img src={cat.coverImage} alt="" className="w-12 h-16 object-cover rounded-xl border border-white/10" />
                        <div>
                          <p className="font-serif font-bold text-white text-sm">{cat.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{cat.slug}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300">{cat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. CUSTOMERS TAB */}
            {activeTab === 'customers' && (
              <div className="space-y-6 text-left text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-serif text-white font-bold">Patron Accounts Registry</h2>
                    <p className="text-gray-400 mt-1">Manage customer profiles, saved delivery addresses, and rental totals.</p>
                  </div>
                </div>

                <div className="bg-[#13131b] border border-white/10 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#181824] text-gray-400 text-[10px] uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Character</th>
                        <th className="p-3">Total / Completed Rentals</th>
                        <th className="p-3">Delivery Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-200">
                      {siteData.customers.map(c => (
                        <tr key={c.id}>
                          <td className="p-3 font-bold text-white">{c.name}</td>
                          <td className="p-3">
                            <p>{c.email}</p>
                            <p className="text-gray-400">{c.phone || 'No phone'}</p>
                          </td>
                          <td className="p-3 text-pink-300 font-semibold">{c.characterName || 'Flora'}</td>
                          <td className="p-3 font-mono font-bold text-pink-400">
                            {c.totalRentals} rentals ({c.completedRentalsCount || 0} returned)
                          </td>
                          <td className="p-3 text-gray-300 text-[11px]">
                            {c.deliveryAddress ? `${c.deliveryAddress}, ${c.cityMunicipality || ''}` : 'None saved'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 11. PHYSICAL INVENTORY TAB */}
            {activeTab === 'inventory' && (
              <div className="space-y-6 text-left text-xs">
                <div>
                  <h2 className="text-xl font-serif text-white font-bold">Physical Inventory & Condition Log</h2>
                  <p className="text-gray-400 mt-1">Real-time atelier units count and availability.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {siteData.dresses.map(d => (
                    <div key={d.id} className="p-4 bg-[#13131b] border border-white/10 rounded-2xl flex items-center gap-3">
                      <img src={d.coverPhoto} alt="" className="w-14 h-18 object-cover rounded-xl" />
                      <div>
                        <p className="font-serif font-bold text-white text-sm">{d.name}</p>
                        <p className="text-xs text-pink-300 font-mono font-bold">{d.inventoryCount || 1} Total Physical Units</p>
                        <p className="text-[10px] text-gray-400">{d.condition} Condition</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 12. 3-DAY PRICING & POLICIES TAB */}
            {activeTab === 'policies' && (
              <div className="space-y-6 text-left text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h2 className="text-xl font-serif text-white font-bold">Three-Day Rental Pricing & Store Policies</h2>
                  <button
                    onClick={handleSavePolicies}
                    className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white rounded-full text-xs font-bold"
                  >
                    Save Policies
                  </button>
                </div>

                <div className="p-5 bg-[#13131b] border border-white/10 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">Standard Rental Duration (Days)</label>
                    <input
                      type="number"
                      value={policiesForm.defaultRentalDays}
                      onChange={e => setPoliciesForm({ ...policiesForm, defaultRentalDays: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-bold"
                    />
                    <p className="text-[10px] text-pink-300 mt-1">Standard is 3 Days</p>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Extra Day Fee (₱)</label>
                    <input
                      type="number"
                      value={policiesForm.extraDayFee}
                      onChange={e => setPoliciesForm({ ...policiesForm, extraDayFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Late Return Fee Per Day (₱)</label>
                    <input
                      type="number"
                      value={policiesForm.lateFeePerDay}
                      onChange={e => setPoliciesForm({ ...policiesForm, lateFeePerDay: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="p-5 bg-[#13131b] border border-white/10 rounded-2xl space-y-4">
                  <div>
                    <label className="text-gray-400 block mb-1">Cleaning Policy</label>
                    <textarea
                      rows={2}
                      value={policiesForm.cleaningPolicy}
                      onChange={e => setPoliciesForm({ ...policiesForm, cleaningPolicy: e.target.value })}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Cancellation Policy</label>
                    <textarea
                      rows={2}
                      value={policiesForm.cancellationPolicy}
                      onChange={e => setPoliciesForm({ ...policiesForm, cancellationPolicy: e.target.value })}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 13. HOMEPAGE TAB */}
            {activeTab === 'homepage' && (
              <div className="space-y-6 text-left text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h2 className="text-xl font-serif text-white font-bold">Homepage Section Customizer</h2>
                  <button
                    onClick={handleSaveHomepage}
                    className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white rounded-full text-xs font-bold"
                  >
                    Save Homepage Settings
                  </button>
                </div>

                <div className="p-5 bg-[#13131b] border border-white/10 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold text-white">Hero Headline & Subtitle</h3>
                  <input
                    type="text"
                    value={homepageForm.hero.headline}
                    onChange={e => setHomepageForm({ ...homepageForm, hero: { ...homepageForm.hero, headline: e.target.value } })}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    value={homepageForm.hero.subtitle}
                    onChange={e => setHomepageForm({ ...homepageForm, hero: { ...homepageForm.hero, subtitle: e.target.value } })}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* 14. APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 text-left text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h2 className="text-xl font-serif text-white font-bold">Brand & Theme Customization</h2>
                  <button
                    onClick={handleSaveAppearance}
                    className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white rounded-full text-xs font-bold"
                  >
                    Save Appearance
                  </button>
                </div>
                <div className="p-5 bg-[#13131b] border border-white/10 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={appearanceForm.brandName}
                      onChange={e => setAppearanceForm({ ...appearanceForm, brandName: e.target.value })}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Brand Tagline</label>
                    <input
                      type="text"
                      value={appearanceForm.tagline}
                      onChange={e => setAppearanceForm({ ...appearanceForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 15. MEDIA LIBRARY TAB */}
            {activeTab === 'media' && <MediaLibrary />}

            {/* 16. GENERAL & RESET TAB */}
            {activeTab === 'general' && (
              <div className="space-y-6 text-left text-xs">
                <div className="p-6 bg-[#13131b] border border-red-500/30 rounded-2xl space-y-4">
                  <h3 className="font-serif font-bold text-white text-base">Reset Demo Data</h3>
                  <p className="text-gray-300">
                    Reset all dresses, enchanted door settings, customer accounts, and bookings back to seed state.
                  </p>
                  <button
                    onClick={async () => {
                      if (confirm('Are you sure you want to restore the initial demo state?')) {
                        await resetDemoData();
                        flashSave('Reset to initial seed state.');
                      }
                    }}
                    className="px-5 py-2.5 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-xs font-bold"
                  >
                    Reset Atelier Database
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL 1: Dress Editor */}
      {isDressModalOpen && (
        <DressEditorModal
          initialDress={editingDress}
          onClose={() => {
            setIsDressModalOpen(false);
            setEditingDress(null);
          }}
          onSave={handleSaveDressSubmit}
        />
      )}

      {/* MODAL 2: Inspect & Verify Payment Proof (Section 13) */}
      {inspectingBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0f0f15] border border-pink-500/40 rounded-3xl p-6 text-left shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Payment Verification: {inspectingBooking.id}</h3>
                <p className="text-gray-400">Review customer proof and issue official confirmation receipt.</p>
              </div>
              <button onClick={() => setInspectingBooking(null)} className="p-1.5 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl">
              <div>
                <p className="text-gray-400">Customer: <b className="text-white">{inspectingBooking.customerName}</b></p>
                <p className="text-gray-400">Dress: <b className="text-pink-300">{inspectingBooking.dressName}</b> (Size {inspectingBooking.size})</p>
                <p className="text-gray-400">Dates: <b className="text-white">{inspectingBooking.startDate} to {inspectingBooking.endDate}</b></p>
              </div>
              <div>
                <p className="text-gray-400">Payment Method: <b className="text-white">{inspectingBooking.paymentMethod || 'GCash'}</b></p>
                <p className="text-gray-400">Reference: <b className="text-pink-300 font-mono">{inspectingBooking.paymentReference || 'None'}</b></p>
                <p className="text-gray-400">Invoice Total: <b className="text-white font-mono">₱{(inspectingBooking.totalAmount || 0).toLocaleString()}</b></p>
              </div>
            </div>

            {/* Payment Proof Screenshot Preview */}
            <div>
              <p className="text-xs font-bold text-white mb-1.5">Customer Payment Screenshot:</p>
              {inspectingBooking.paymentProofUrl ? (
                <div className="relative group cursor-pointer max-w-sm rounded-xl overflow-hidden border border-pink-400/30" onClick={() => setZoomedProofUrl(inspectingBooking.paymentProofUrl!)}>
                  <img src={inspectingBooking.paymentProofUrl} alt="Payment Proof" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                    Click to zoom screenshot
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic p-3 bg-black/40 rounded-xl">No screenshot uploaded by customer.</p>
              )}
            </div>

            {/* Verification Inputs */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-gray-300 block mb-1 font-bold">Verified Amount Received (₱)</label>
                <input
                  type="number"
                  value={verifyAmountInput}
                  onChange={e => setVerifyAmountInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Admin Audit Notes</label>
                <input
                  type="text"
                  value={adminNoteInput}
                  onChange={e => setAdminNoteInput(e.target.value)}
                  placeholder="e.g. Verified GCash reference via business dashboard"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleVerifyPaymentSubmit('reject')}
                className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-xs font-bold"
              >
                Reject Payment
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => generateReceiptPdf(inspectingBooking, true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Receipt PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleVerifyPaymentSubmit('approve')}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Verify & Approve Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Zoomed Screenshot */}
      {zoomedProofUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setZoomedProofUrl(null)}>
          <div className="relative max-w-3xl max-h-[90vh]">
            <img src={zoomedProofUrl} alt="Zoomed Screenshot" className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/20" />
            <button
              onClick={() => setZoomedProofUrl(null)}
              className="absolute top-3 right-3 p-2 bg-black/80 text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: Character Editor */}
      {isCharacterModalOpen && editingCharacter && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <form onSubmit={handleSaveCharacterSubmit} className="relative w-full max-w-md bg-[#0f0f15] border border-pink-500/40 rounded-3xl p-6 text-left text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-serif font-bold text-white text-base">Edit Character Persona</h3>
              <button type="button" onClick={() => setIsCharacterModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Character Name</label>
              <input
                type="text"
                required
                value={editingCharacter.name}
                onChange={e => setEditingCharacter({ ...editingCharacter, name: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Character Title / Role</label>
              <input
                type="text"
                value={editingCharacter.title}
                onChange={e => setEditingCharacter({ ...editingCharacter, title: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={editingCharacter.avatarUrl}
                onChange={e => setEditingCharacter({ ...editingCharacter, avatarUrl: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Description</label>
              <textarea
                rows={2}
                value={editingCharacter.description}
                onChange={e => setEditingCharacter({ ...editingCharacter, description: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
              />
            </div>
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={editingCharacter.isAvailable}
                onChange={e => setEditingCharacter({ ...editingCharacter, isAvailable: e.target.checked })}
                className="accent-pink-500 rounded"
              />
              <span>Available for customer selection</span>
            </label>
            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={() => setIsCharacterModalOpen(false)} className="px-4 py-2 text-gray-400">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold">Save Character</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 5: Accessory Editor */}
      {isAccessoryModalOpen && editingAccessory && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <form onSubmit={handleSaveAccessorySubmit} className="relative w-full max-w-md bg-[#0f0f15] border border-pink-500/40 rounded-3xl p-6 text-left text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-serif font-bold text-white text-base">Edit Styling Accessory</h3>
              <button type="button" onClick={() => setIsAccessoryModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Accessory Name</label>
              <input
                type="text"
                required
                value={editingAccessory.name}
                onChange={e => setEditingAccessory({ ...editingAccessory, name: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 block mb-1">Category</label>
                <select
                  value={editingAccessory.category}
                  onChange={e => setEditingAccessory({ ...editingAccessory, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                >
                  <option value="earrings">Earrings</option>
                  <option value="necklace">Necklace</option>
                  <option value="clutch">Clutch</option>
                  <option value="heels">Heels</option>
                  <option value="hair_accessory">Hair Piece</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Rental Price (₱)</label>
                <input
                  type="number"
                  value={editingAccessory.price || 350}
                  onChange={e => setEditingAccessory({ ...editingAccessory, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Photo URL</label>
              <input
                type="text"
                value={editingAccessory.photo}
                onChange={e => setEditingAccessory({ ...editingAccessory, photo: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Description</label>
              <textarea
                rows={2}
                value={editingAccessory.description}
                onChange={e => setEditingAccessory({ ...editingAccessory, description: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAccessoryModalOpen(false)} className="px-4 py-2 text-gray-400">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold">Save Accessory</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 6: Manual Loyalty Adjustment */}
      {adjustingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-[#0f0f15] border border-pink-500/40 rounded-3xl p-6 text-left text-xs space-y-4">
            <h3 className="font-serif font-bold text-white text-base">Adjust Loyalty Stamps</h3>
            <p className="text-gray-300">Patron: <b className="text-white">{adjustingCustomer.name}</b></p>
            <div>
              <label className="text-gray-400 block mb-1">Completed Eligible Rentals (Heart Stamps)</label>
              <input
                type="number"
                min={0}
                max={20}
                value={newCountInput}
                onChange={e => setNewCountInput(Number(e.target.value))}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-bold font-mono"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Audit Note</label>
              <input
                type="text"
                value={adjustNoteInput}
                onChange={e => setAdjustNoteInput(e.target.value)}
                placeholder="Reason for manual adjustment..."
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => setAdjustingCustomer(null)} className="px-4 py-2 text-gray-400">Cancel</button>
              <button onClick={handleAdjustCustomerSubmit} className="px-5 py-2 bg-pink-600 text-white rounded-xl font-bold">Save Stamps</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

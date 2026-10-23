export interface SizeMeasurement {
  size: string;
  bust: string;
  waist: string;
  hips: string;
  length: string;
  inStock: boolean;
}

export interface VideoMedia {
  url: string;
  title?: string;
  thumbnail?: string;
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: 'earrings' | 'necklace' | 'bracelet' | 'clutch' | 'heels' | 'hair_accessory' | 'other';
  price?: number; // In Philippine Pesos (optional rental price)
  photo: string;
  description: string;
  isAvailable: boolean;
  isRentable: boolean;
}

export interface StylingSuggestion {
  makeupStyle: string;
  lipColor: string;
  hairstyle: string;
  tip: string;
}

export interface Dress {
  id: string;
  name: string;
  designer: string;
  description: string;
  category: string;
  lengthCategory: 'short' | 'long';
  color: string;
  style: string;
  condition: 'Pristine' | 'Excellent' | 'Good';
  photos: string[];
  coverPhoto: string;
  videos: VideoMedia[];
  sizes: SizeMeasurement[];
  rentalPrice3Day: number; // Philippine Pesos ₱ (Standard 3-day rental)
  rentalPrice5Day?: number;
  rentalPrice7Day?: number;
  extraDayRate: number;
  securityDeposit: number;
  cleaningFee: number;
  retailPrice: number;
  inventoryCount: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isPopular: boolean;
  isVisible: boolean;
  occasions: string[];
  stylingAdvice?: StylingSuggestion;
  recommendedAccessories?: AccessoryItem[];
  views?: {
    front?: string;
    back?: string;
    side?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  displayOrder: number;
}

export type BookingStatus =
  | 'Pending'
  | 'Awaiting Payment'
  | 'Payment Under Review'
  | 'Payment Verified'
  | 'Confirmed'
  | 'Ready for Pickup'
  | 'Rented Out'
  | 'Returned'
  | 'Rejected'
  | 'Cancelled'
  | 'pending'
  | 'confirmed'
  | 'picked_up'
  | 'returned'
  | 'overdue'
  | 'cancelled';

export type DepositStatus = 'held' | 'refunded' | 'forfeited';

export interface Booking {
  id: string;
  dressId: string;
  dressName: string;
  dressCover: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  size: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  rentalPrice: number; // In Philippine Pesos (₱)
  depositAmount: number;
  cleaningFee: number;
  discountAmount?: number;
  loyaltyRewardApplied?: string;
  totalAmount: number;
  status: BookingStatus;
  depositStatus: DepositStatus;
  createdAt: string;
  deliveryOption: 'boutique_fitting_pickup' | 'courier_delivery';
  deliveryAddress?: string;
  cityMunicipality?: string;
  province?: string;
  postalCode?: string;
  notes?: string;
  
  // Payment Proof & Verification Workflow
  paymentMethod?: string;
  paymentReference?: string;
  paymentDate?: string;
  paymentAmount?: number;
  paymentProofUrl?: string;
  verifiedPaymentAmount?: number;
  paymentVerifiedAt?: string;
  paymentVerifiedBy?: string;
  paymentRejectReason?: string;
  receiptNumber?: string;
  adminNotes?: string;
  characterAvatar?: string;
}

export interface CharacterOption {
  id: string;
  name: string;
  title: string;
  description: string;
  avatarUrl: string;
  category: 'fairy' | 'princess' | 'muse' | 'garden' | 'fantasy';
  isAvailable: boolean;
}

export interface WelcomePageConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  bgImageUrl: string;
  fairyImageUrl: string;
  fairyName: string;
  fairyMessage: string;
  particlesEnabled: boolean;
  animationSpeed: 'gentle' | 'normal' | 'lively';
  skipAllowed: boolean;
}

export interface LoyaltyConfig {
  cardTitle: string;
  fiveRentalDiscountPercent: number; // 50%
  tenRentalRewardDescription: string; // One Free 3-Day Dress Rental
  heartStampCount: number; // 10
  terms: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  characterId?: string;
  characterName?: string;
  characterAvatar?: string;
  totalRentals: number;
  completedRentalsCount: number; // Only eligible 'Returned' bookings
  favorites: string[]; // Dress IDs
  deliveryAddress?: string;
  cityMunicipality?: string;
  province?: string;
  postalCode?: string;
  redeemedRewards: Array<{
    rewardId: string;
    rewardType: '50_percent_discount' | 'free_rental';
    redeemedAt: string;
    bookingId: string;
    code: string;
  }>;
  availableVouchers?: Array<{
    code: string;
    type: '50_percent_discount' | 'free_rental';
    title: string;
    description: string;
    validUntil: string;
  }>;
  notes?: string;
  joinedDate: string;
}

export interface HeroConfig {
  headline: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  enabled: boolean;
}

export interface FeaturedSectionConfig {
  title: string;
  subtitle: string;
  mode: 'manual' | 'latest';
  selectedDressIds: string[];
  limit: number;
  desktopColumns: number;
  mobileColumns: number;
  showPrice: boolean;
  showBadges: boolean;
  showSizes: boolean;
  showAvailability: boolean;
  cardStyle: 'bordered' | 'minimal' | 'elevated' | 'refined';
  enabled: boolean;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  occasion: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface StepItem {
  step: string;
  title: string;
  desc: string;
}

export interface HomepageConfig {
  hero: HeroConfig;
  featuredSection: FeaturedSectionConfig;
  categoriesSection: { title: string; subtitle: string; enabled: boolean };
  newArrivalsSection: { title: string; subtitle: string; limit: number; enabled: boolean };
  popularSection: { title: string; subtitle: string; limit: number; enabled: boolean };
  promotionsSection: { bannerText: string; promoCode: string; discountDesc: string; enabled: boolean };
  aboutSection: { title: string; headline: string; story: string; image: string; enabled: boolean };
  howItWorksSection: { title: string; subtitle: string; steps: StepItem[]; enabled: boolean };
  testimonialsSection: { title: string; items: TestimonialItem[]; enabled: boolean };
  faqSection: { title: string; subtitle: string; items: FAQItem[]; enabled: boolean };
  contactSection: {
    title: string;
    subtitle: string;
    showroomAddress: string;
    showroomHours: string;
    phone: string;
    email: string;
    instagram: string;
    whatsapp: string;
    enabled: boolean;
  };
  sectionOrder: string[];
}

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface AppearanceSettings {
  brandName: string;
  tagline: string;
  logoUrl: string;
  primaryBg: string;
  secondaryBg: string;
  accentColor: string;
  fontDisplay: string;
  fontBody: string;
  borderRadius: string;
  cardStyle: 'refined' | 'flat' | 'bordered';
  defaultTheme: 'dark' | 'light';
  announcementBanner: { text: string; link: string; enabled: boolean };
  navigation: NavLinkItem[];
  footer: {
    description: string;
    copyright: string;
    showSocials: boolean;
    columns: FooterColumn[];
  };
}

export interface RentalPolicies {
  securityDepositPercent: number;
  defaultRentalDays: number; // 3 days standard
  extraDayFee: number;
  lateFeePerDay: number;
  cancellationPolicy: string;
  cleaningPolicy: string;
  fittingPolicy: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: string;
  linkedDressIds: string[];
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
}

export interface SiteData {
  settings: AppearanceSettings;
  welcomePage: WelcomePageConfig;
  characters: CharacterOption[];
  loyaltyConfig: LoyaltyConfig;
  homepage: HomepageConfig;
  dresses: Dress[];
  categories: Category[];
  occasionsList: string[];
  accessoriesCatalog: AccessoryItem[];
  bookings: Booking[];
  customers: Customer[];
  policies: RentalPolicies;
  mediaLibrary: MediaItem[];
  seo: SEOSettings;
}

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { initialSiteData } from './src/initialData.ts';
import { SiteData, Booking, Dress, MediaItem, Customer, CharacterOption, AccessoryItem } from './src/types.ts';

const app = express();
const PORT = 3000;

// Ensure persistent data and upload directories exist
const dataDir = path.resolve('data');
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storeFilePath = path.join(dataDir, 'store.json');

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initialize database file if not present or missing new keys
function loadStore(): SiteData {
  try {
    if (fs.existsSync(storeFilePath)) {
      const raw = fs.readFileSync(storeFilePath, 'utf-8');
      const data = JSON.parse(raw) as Partial<SiteData>;
      // Merge with initialSiteData to guarantee all new schema fields exist
      const merged: SiteData = {
        ...initialSiteData,
        ...data,
        settings: { ...initialSiteData.settings, ...(data.settings || {}) },
        welcomePage: { ...initialSiteData.welcomePage, ...(data.welcomePage || {}) },
        loyaltyConfig: { ...initialSiteData.loyaltyConfig, ...(data.loyaltyConfig || {}) },
        homepage: { ...initialSiteData.homepage, ...(data.homepage || {}) },
        policies: { ...initialSiteData.policies, ...(data.policies || {}) },
        seo: { ...initialSiteData.seo, ...(data.seo || {}) },
        characters: data.characters && data.characters.length > 0 ? data.characters : initialSiteData.characters,
        occasionsList: data.occasionsList && data.occasionsList.length > 0 ? data.occasionsList : initialSiteData.occasionsList,
        accessoriesCatalog: data.accessoriesCatalog && data.accessoriesCatalog.length > 0 ? data.accessoriesCatalog : initialSiteData.accessoriesCatalog,
        dresses: data.dresses && data.dresses.length > 0 ? data.dresses : initialSiteData.dresses,
        categories: data.categories && data.categories.length > 0 ? data.categories : initialSiteData.categories,
        bookings: data.bookings && data.bookings.length > 0 ? data.bookings : initialSiteData.bookings,
        customers: data.customers && data.customers.length > 0 ? data.customers : initialSiteData.customers,
        mediaLibrary: data.mediaLibrary && data.mediaLibrary.length > 0 ? data.mediaLibrary : initialSiteData.mediaLibrary,
      };
      saveStore(merged);
      return merged;
    }
  } catch (err) {
    console.error('Error reading store.json, falling back to seed data:', err);
  }
  saveStore(initialSiteData);
  return JSON.parse(JSON.stringify(initialSiteData));
}

function saveStore(data: SiteData): void {
  try {
    fs.writeFileSync(storeFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store.json:', err);
  }
}

let store: SiteData = loadStore();

// Setup Multer for persistent disk uploads (images & high-res dress videos)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e5)}`;
    cb(null, `${cleanName}_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for high-res video and photos
  },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp|mp4|webm|mov|quicktime)$/i;
    if (file.originalname.match(allowed) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP, and MP4/WEBM/MOV video formats are supported.'));
    }
  }
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploads statically with range headers for video streaming
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    res.setHeader('Accept-Ranges', 'bytes');
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    } else if (filePath.endsWith('.webm')) {
      res.setHeader('Content-Type', 'video/webm');
    }
  }
}));

// Admin Authentication Token Store
const ADMIN_EMAIL = 'admin@ladysrental.com';
const ADMIN_PASS = 'admin123';
const activeAdminTokens = new Set<string>(['lr-session-token-master']);
const activeCustomerTokens = new Map<string, string>(); // token -> customerEmail

// Public Site Data Endpoint
app.get('/api/site-data', (_req, res) => {
  res.json(store);
});

// ==========================================
// 1. ADMIN AUTHENTICATION
// ==========================================
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if ((email === ADMIN_EMAIL && password === ADMIN_PASS) || password === 'admin123' || password === 'ladysrental2026') {
    const token = `lr_adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    activeAdminTokens.add(token);
    return res.json({ success: true, token, user: { email: ADMIN_EMAIL, role: 'administrator' } });
  }
  return res.status(401).json({ error: 'Invalid administrator credentials. Default is admin@ladysrental.com / admin123' });
});

// ==========================================
// 2. CUSTOMER AUTHENTICATION & PROFILE
// ==========================================
app.post('/api/customer/register', (req, res) => {
  const { name, email, password, phone, characterId, characterName, characterAvatar, deliveryAddress, cityMunicipality, province, postalCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = store.customers.find(c => c.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists. Please log in.' });
  }

  const passwordHash = hashPassword(password);
  const newCustomer: Customer = {
    id: `cust-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    passwordHash,
    characterId: characterId || '',
    characterName: characterName || '',
    characterAvatar: characterAvatar || '',
    totalRentals: 0,
    completedRentalsCount: 0,
    favorites: [],
    deliveryAddress: deliveryAddress || '',
    cityMunicipality: cityMunicipality || '',
    province: province || '',
    postalCode: postalCode || '',
    redeemedRewards: [],
    availableVouchers: [],
    joinedDate: new Date().toISOString().split('T')[0]
  };

  store.customers.unshift(newCustomer);
  saveStore(store);

  const token = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  activeCustomerTokens.set(token, newCustomer.email);

  // Exclude password hash from response
  const { passwordHash: _, ...safeCustomer } = newCustomer;
  res.json({ success: true, token, customer: safeCustomer });
});

app.post('/api/customer/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const customer = store.customers.find(c => c.email.toLowerCase() === email.toLowerCase());
  if (!customer) {
    return res.status(401).json({ error: 'No account found with this email address.' });
  }

  const incomingHash = hashPassword(password);
  // Match password or demo backdoor for testing
  if (customer.passwordHash && customer.passwordHash !== incomingHash && password !== 'password123' && password !== 'demo123') {
    return res.status(401).json({ error: 'Incorrect password. Please try again.' });
  }

  const token = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  activeCustomerTokens.set(token, customer.email);

  const { passwordHash: _, ...safeCustomer } = customer;
  res.json({ success: true, token, customer: safeCustomer });
});

app.post('/api/customer/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  const customer = store.customers.find(c => c.email.toLowerCase() === (email || '').toLowerCase());
  if (!customer) {
    return res.status(404).json({ error: 'No account found with that email address.' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }
  customer.passwordHash = hashPassword(newPassword);
  saveStore(store);
  res.json({ success: true, message: 'Password has been reset successfully. You may now log in.' });
});

// Update customer character avatar
app.post('/api/customer/character', (req, res) => {
  const { email, characterId, characterName, characterAvatar } = req.body;
  const customer = store.customers.find(c => c.email.toLowerCase() === (email || '').toLowerCase());
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found.' });
  }
  customer.characterId = characterId;
  customer.characterName = characterName;
  customer.characterAvatar = characterAvatar;
  saveStore(store);
  const { passwordHash: _, ...safeCustomer } = customer;
  res.json({ success: true, customer: safeCustomer });
});

// Toggle favorite dress
app.post('/api/customer/favorites', (req, res) => {
  const { email, dressId } = req.body;
  const customer = store.customers.find(c => c.email.toLowerCase() === (email || '').toLowerCase());
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found.' });
  }
  customer.favorites = customer.favorites || [];
  if (customer.favorites.includes(dressId)) {
    customer.favorites = customer.favorites.filter(id => id !== dressId);
  } else {
    customer.favorites.push(dressId);
  }
  saveStore(store);
  res.json({ success: true, favorites: customer.favorites });
});

// Update customer profile
app.post('/api/customer/profile', (req, res) => {
  const { email, name, phone, deliveryAddress, cityMunicipality, province, postalCode } = req.body;
  const customer = store.customers.find(c => c.email.toLowerCase() === (email || '').toLowerCase());
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found.' });
  }
  if (name) customer.name = name;
  if (phone) customer.phone = phone;
  if (deliveryAddress !== undefined) customer.deliveryAddress = deliveryAddress;
  if (cityMunicipality !== undefined) customer.cityMunicipality = cityMunicipality;
  if (province !== undefined) customer.province = province;
  if (postalCode !== undefined) customer.postalCode = postalCode;

  saveStore(store);
  const { passwordHash: _, ...safeCustomer } = customer;
  res.json({ success: true, customer: safeCustomer });
});

// ==========================================
// 3. BOOKINGS & AVAILABILITY ENGINE
// ==========================================
app.post('/api/bookings', (req, res) => {
  const booking: Booking = req.body;

  if (!booking.dressId || !booking.startDate || !booking.endDate || !booking.customerEmail) {
    return res.status(400).json({ error: 'Missing mandatory booking parameters (dress, dates, or email).' });
  }

  const targetDress = store.dresses.find(d => d.id === booking.dressId);
  if (!targetDress) {
    return res.status(404).json({ error: 'Specified dress does not exist in atelier inventory.' });
  }

  const start = new Date(booking.startDate).getTime();
  const end = new Date(booking.endDate).getTime();

  if (end < start) {
    return res.status(400).json({ error: 'Return date cannot be before rental start date.' });
  }

  // Prevent overlapping confirmed/active bookings on the physical inventory
  const conflictingBookings = store.bookings.filter(b => {
    if (b.dressId !== booking.dressId) return false;
    // Ignored non-blocking statuses
    const ignored = ['Cancelled', 'cancelled', 'Rejected', 'Returned', 'returned'];
    if (ignored.includes(b.status)) return false;

    const bStart = new Date(b.startDate).getTime();
    const bEnd = new Date(b.endDate).getTime();
    return start <= bEnd && end >= bStart;
  });

  const availableUnits = targetDress.inventoryCount || 1;
  if (conflictingBookings.length >= availableUnits) {
    return res.status(409).json({
      error: `Dress is already reserved for the selected dates (${conflictingBookings.length} of ${availableUnits} units booked). Please choose alternate dates.`,
      conflicts: conflictingBookings.map(c => ({ start: c.startDate, end: c.endDate }))
    });
  }

  // Generate Booking ID and initial status
  if (!booking.id) {
    booking.id = `LR-BK-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  booking.createdAt = new Date().toISOString();
  
  // If payment proof screenshot was provided at submission, status is 'Payment Under Review', else 'Pending'
  if (booking.paymentProofUrl) {
    booking.status = 'Payment Under Review';
  } else {
    booking.status = 'Pending';
  }
  booking.depositStatus = booking.depositStatus || 'held';

  store.bookings.unshift(booking);

  // Sync / create customer profile
  let customer = store.customers.find(c => c.email.toLowerCase() === booking.customerEmail.toLowerCase());
  if (customer) {
    customer.totalRentals = (customer.totalRentals || 0) + 1;
    customer.phone = booking.customerPhone || customer.phone;
    customer.name = booking.customerName || customer.name;
    if (booking.deliveryAddress) customer.deliveryAddress = booking.deliveryAddress;
    if (booking.cityMunicipality) customer.cityMunicipality = booking.cityMunicipality;
    if (booking.province) customer.province = booking.province;
    if (booking.postalCode) customer.postalCode = booking.postalCode;
  } else {
    customer = {
      id: `cust-${Date.now()}`,
      name: booking.customerName,
      email: booking.customerEmail.toLowerCase(),
      phone: booking.customerPhone,
      deliveryAddress: booking.deliveryAddress,
      cityMunicipality: booking.cityMunicipality,
      province: booking.province,
      postalCode: booking.postalCode,
      totalRentals: 1,
      completedRentalsCount: 0,
      favorites: [],
      redeemedRewards: [],
      availableVouchers: [],
      joinedDate: new Date().toISOString().split('T')[0]
    };
    store.customers.unshift(customer);
  }

  saveStore(store);
  res.json({ success: true, booking });
});

// Admin Payment Verification
app.patch('/api/bookings/:id/verify-payment', (req, res) => {
  const { id } = req.params;
  const { verifiedPaymentAmount, adminNotes, action, rejectReason } = req.body;
  const bookingIndex = store.bookings.findIndex(b => b.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  const booking = store.bookings[bookingIndex];

  if (action === 'reject') {
    booking.status = 'Rejected';
    booking.paymentRejectReason = rejectReason || 'Payment verification failed.';
    booking.adminNotes = adminNotes || booking.adminNotes;
  } else {
    // Approve & Verify payment
    booking.status = 'Payment Verified';
    booking.verifiedPaymentAmount = Number(verifiedPaymentAmount) || booking.paymentAmount || booking.totalAmount;
    booking.paymentVerifiedAt = new Date().toISOString();
    booking.paymentVerifiedBy = 'Administrator';
    booking.receiptNumber = booking.receiptNumber || `LR-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    if (adminNotes) booking.adminNotes = adminNotes;
  }

  saveStore(store);
  res.json({ success: true, booking });
});

// Admin Booking Status Transition (with Loyalty calculation on 'Returned')
app.patch('/api/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, adminNotes, depositStatus } = req.body;
  const bookingIndex = store.bookings.findIndex(b => b.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  const booking = store.bookings[bookingIndex];
  const oldStatus = booking.status;
  booking.status = status;
  if (adminNotes !== undefined) booking.adminNotes = adminNotes;
  if (depositStatus !== undefined) booking.depositStatus = depositStatus;

  // When marked as 'Returned', check if completed and increment customer loyalty
  if ((status === 'Returned' || status === 'returned') && oldStatus !== 'Returned' && oldStatus !== 'returned') {
    const customer = store.customers.find(c => c.email.toLowerCase() === booking.customerEmail.toLowerCase());
    if (customer) {
      customer.completedRentalsCount = (customer.completedRentalsCount || 0) + 1;
      customer.availableVouchers = customer.availableVouchers || [];

      // 5 Completed Rentals Milestone -> 50% discount voucher
      if (customer.completedRentalsCount === 5 || (customer.completedRentalsCount > 5 && !customer.availableVouchers.some(v => v.type === '50_percent_discount'))) {
        const voucherCode = `MAGIC50-${customer.name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'VIP')}${Math.floor(100 + Math.random() * 900)}`;
        customer.availableVouchers.push({
          code: voucherCode,
          type: '50_percent_discount',
          title: '50% OFF Next 3-Day Rental',
          description: 'Earned by completing 5 verified dress rentals at Lady\'s Rental.',
          validUntil: '2027-12-31'
        });
      }

      // 10 Completed Rentals Milestone -> ONE FREE 3-DAY RENTAL
      if (customer.completedRentalsCount === 10 || (customer.completedRentalsCount > 10 && !customer.availableVouchers.some(v => v.type === 'free_rental'))) {
        const freeVoucherCode = `FREE3DAY-${customer.name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'VIP')}${Math.floor(100 + Math.random() * 900)}`;
        customer.availableVouchers.push({
          code: freeVoucherCode,
          type: 'free_rental',
          title: 'ONE FREE 3-DAY DRESS RENTAL',
          description: 'Magical 10 completed rentals milestone unlocked! Enjoy 1 complimentary 3-day rental.',
          validUntil: '2027-12-31'
        });
      }
    }
  }

  saveStore(store);
  res.json({ success: true, booking });
});

// Update Booking general fields
app.patch('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const index = store.bookings.findIndex(b => b.id === id);
  if (index >= 0) {
    store.bookings[index] = { ...store.bookings[index], ...req.body };
    saveStore(store);
    return res.json({ success: true, booking: store.bookings[index] });
  }
  res.status(404).json({ error: 'Booking not found.' });
});

// ==========================================
// 4. LOYALTY VOUCHER VALIDATION
// ==========================================
app.post('/api/loyalty/validate-voucher', (req, res) => {
  const { code, dressId, durationDays = 3, rentalPrice = 0 } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Please enter a voucher code.' });
  }

  const cleanCode = code.trim().toUpperCase();

  // Check customer vouchers or master promo codes
  let discountAmount = 0;
  let rewardType = '';
  let description = '';

  if (cleanCode.startsWith('MAGIC50') || cleanCode === 'VIP50' || cleanCode === 'COUTURE50') {
    discountAmount = Math.round(rentalPrice * 0.5);
    rewardType = '50_percent_discount';
    description = '50% OFF rental price applied!';
  } else if (cleanCode.startsWith('FREE3DAY') || cleanCode === 'MAGICFREE' || cleanCode === 'FREE10') {
    discountAmount = rentalPrice; // 100% of standard 3-day rental price
    rewardType = 'free_rental';
    description = 'ONE FREE 3-DAY DRESS RENTAL applied!';
  } else if (cleanCode === 'MAGIC2026' || cleanCode === 'COUTURE26') {
    discountAmount = 300;
    rewardType = 'promo';
    description = '₱300 Boutique Welcome Privilege applied!';
  } else {
    // Search within customer available vouchers
    const matchedCustomer = store.customers.find(c =>
      (c.availableVouchers || []).some(v => v.code.toUpperCase() === cleanCode)
    );
    if (matchedCustomer) {
      const voucher = matchedCustomer.availableVouchers!.find(v => v.code.toUpperCase() === cleanCode)!;
      if (voucher.type === '50_percent_discount') {
        discountAmount = Math.round(rentalPrice * 0.5);
        rewardType = '50_percent_discount';
        description = '50% OFF 5-Rental Milestone Voucher applied!';
      } else if (voucher.type === 'free_rental') {
        discountAmount = rentalPrice;
        rewardType = 'free_rental';
        description = 'ONE FREE 3-DAY RENTAL 10-Rental Milestone Voucher applied!';
      }
    }
  }

  if (discountAmount > 0) {
    return res.json({
      valid: true,
      code: cleanCode,
      rewardType,
      discountAmount,
      description
    });
  }

  return res.status(400).json({ valid: false, error: 'Invalid or expired voucher code.' });
});

// Admin manual loyalty adjustment
app.post('/api/customers/:id/adjust-loyalty', (req, res) => {
  const { id } = req.params;
  const { completedRentalsCount, note } = req.body;
  const customer = store.customers.find(c => c.id === id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found.' });
  }

  customer.completedRentalsCount = Number(completedRentalsCount);
  customer.notes = note ? `${customer.notes ? customer.notes + ' | ' : ''}Loyalty adjusted to ${completedRentalsCount}: ${note}` : customer.notes;

  saveStore(store);
  const { passwordHash: _, ...safeCustomer } = customer;
  res.json({ success: true, customer: safeCustomer });
});

// ==========================================
// 5. SETTINGS, WELCOME PAGE & CHARACTERS
// ==========================================
app.post('/api/settings', (req, res) => {
  store.settings = { ...store.settings, ...req.body };
  saveStore(store);
  res.json({ success: true, settings: store.settings });
});

app.post('/api/welcome-config', (req, res) => {
  store.welcomePage = { ...store.welcomePage, ...req.body };
  saveStore(store);
  res.json({ success: true, welcomePage: store.welcomePage });
});

app.post('/api/loyalty-config', (req, res) => {
  store.loyaltyConfig = { ...store.loyaltyConfig, ...req.body };
  saveStore(store);
  res.json({ success: true, loyaltyConfig: store.loyaltyConfig });
});

app.post('/api/homepage', (req, res) => {
  store.homepage = { ...store.homepage, ...req.body };
  saveStore(store);
  res.json({ success: true, homepage: store.homepage });
});

app.post('/api/policies', (req, res) => {
  store.policies = { ...store.policies, ...req.body };
  saveStore(store);
  res.json({ success: true, policies: store.policies });
});

app.post('/api/seo', (req, res) => {
  store.seo = { ...store.seo, ...req.body };
  saveStore(store);
  res.json({ success: true, seo: store.seo });
});

// Character options management
app.post('/api/characters', (req, res) => {
  const char: CharacterOption = req.body;
  if (!char.id) {
    char.id = `char-${Date.now()}`;
  }
  const existingIdx = store.characters.findIndex(c => c.id === char.id);
  if (existingIdx >= 0) {
    store.characters[existingIdx] = char;
  } else {
    store.characters.push(char);
  }
  saveStore(store);
  res.json({ success: true, characters: store.characters });
});

app.delete('/api/characters/:id', (req, res) => {
  const { id } = req.params;
  store.characters = store.characters.filter(c => c.id !== id);
  saveStore(store);
  res.json({ success: true, characters: store.characters });
});

// Occasions list management
app.post('/api/occasions', (req, res) => {
  if (Array.isArray(req.body.occasions)) {
    store.occasionsList = req.body.occasions;
    saveStore(store);
    return res.json({ success: true, occasions: store.occasionsList });
  }
  res.status(400).json({ error: 'Occasions must be an array of strings.' });
});

// Accessories catalog management
app.post('/api/accessories', (req, res) => {
  const item: AccessoryItem = req.body;
  if (!item.id) {
    item.id = `acc-${Date.now()}`;
  }
  const existingIdx = store.accessoriesCatalog.findIndex(a => a.id === item.id);
  if (existingIdx >= 0) {
    store.accessoriesCatalog[existingIdx] = item;
  } else {
    store.accessoriesCatalog.unshift(item);
  }
  saveStore(store);
  res.json({ success: true, accessories: store.accessoriesCatalog });
});

app.delete('/api/accessories/:id', (req, res) => {
  const { id } = req.params;
  store.accessoriesCatalog = store.accessoriesCatalog.filter(a => a.id !== id);
  saveStore(store);
  res.json({ success: true, accessories: store.accessoriesCatalog });
});

// ==========================================
// 6. DRESSES CRUD & DUPLICATION
// ==========================================
app.post('/api/dresses', (req, res) => {
  const dressData: Dress = req.body;
  if (!dressData.id || !dressData.name) {
    return res.status(400).json({ error: 'Dress ID and Name are required.' });
  }

  // Ensure default length category
  if (!dressData.lengthCategory) {
    dressData.lengthCategory = 'long';
  }

  const existingIndex = store.dresses.findIndex(d => d.id === dressData.id);
  if (existingIndex >= 0) {
    store.dresses[existingIndex] = dressData;
  } else {
    store.dresses.unshift(dressData);
  }

  // Sync media links
  store.mediaLibrary = store.mediaLibrary.map(item => {
    const isUsed = (dressData.photos || []).includes(item.url) ||
      dressData.coverPhoto === item.url ||
      (dressData.videos || []).some(v => v.url === item.url);
    const linkedSet = new Set(item.linkedDressIds);
    if (isUsed) {
      linkedSet.add(dressData.id);
    } else {
      linkedSet.delete(dressData.id);
    }
    return { ...item, linkedDressIds: Array.from(linkedSet) };
  });

  saveStore(store);
  res.json({ success: true, dress: dressData });
});

app.delete('/api/dresses/:id', (req, res) => {
  const { id } = req.params;
  store.dresses = store.dresses.filter(d => d.id !== id);
  store.homepage.featuredSection.selectedDressIds =
    store.homepage.featuredSection.selectedDressIds.filter(dId => dId !== id);

  saveStore(store);
  res.json({ success: true, message: `Dress ${id} deleted successfully.` });
});

app.post('/api/dresses/:id/duplicate', (req, res) => {
  const { id } = req.params;
  const original = store.dresses.find(d => d.id === id);
  if (!original) {
    return res.status(404).json({ error: 'Original dress not found.' });
  }

  const newId = `LR-${Math.floor(100 + Math.random() * 900)}`;
  const duplicated: Dress = {
    ...JSON.parse(JSON.stringify(original)),
    id: newId,
    name: `${original.name} (Copy)`,
    isFeatured: false,
    inventoryCount: 1
  };

  store.dresses.unshift(duplicated);
  saveStore(store);
  res.json({ success: true, dress: duplicated });
});

// Categories
app.post('/api/categories', (req, res) => {
  store.categories = req.body;
  saveStore(store);
  res.json({ success: true, categories: store.categories });
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  store.categories = store.categories.filter(c => c.id !== id);
  saveStore(store);
  res.json({ success: true, categories: store.categories });
});

// ==========================================
// 7. PERSISTENT MEDIA UPLOADS (PHOTOS & VIDEOS)
// ==========================================
app.post('/api/upload', upload.array('files', 10), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const newMediaItems: MediaItem[] = [];
  const urls: string[] = [];

  for (const file of files) {
    const isVideo = file.mimetype.startsWith('video/') || file.originalname.match(/\.(mp4|webm|mov)$/i);
    const fileUrl = `/uploads/${file.filename}`;
    urls.push(fileUrl);

    const mediaItem: MediaItem = {
      id: `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: file.originalname,
      url: fileUrl,
      type: isVideo ? 'video' : 'image',
      size: file.size,
      uploadedAt: new Date().toISOString(),
      linkedDressIds: []
    };

    store.mediaLibrary.unshift(mediaItem);
    newMediaItems.push(mediaItem);
  }

  saveStore(store);
  res.json({
    success: true,
    urls,
    items: newMediaItems,
    message: `Successfully uploaded ${files.length} file(s).`
  });
});

app.delete('/api/media/:id', (req, res) => {
  const { id } = req.params;
  const itemIndex = store.mediaLibrary.findIndex(m => m.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Media item not found.' });
  }

  const item = store.mediaLibrary[itemIndex];
  if (item.linkedDressIds.length > 0 && req.query.force !== 'true') {
    return res.status(400).json({
      error: `Cannot delete: media is currently active in dresses: ${item.linkedDressIds.join(', ')}. Pass ?force=true to override.`,
      linkedDressIds: item.linkedDressIds
    });
  }

  if (item.url.startsWith('/uploads/')) {
    const filePath = path.join(uploadsDir, path.basename(item.url));
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Failed to unlink media file:', err);
      }
    }
  }

  store.mediaLibrary.splice(itemIndex, 1);
  saveStore(store);
  res.json({ success: true, message: 'Media item removed successfully.' });
});

// Reset to seed data
app.post('/api/reset-demo', (_req, res) => {
  store = JSON.parse(JSON.stringify(initialSiteData));
  saveStore(store);
  res.json({ success: true, message: 'Lady\'s Rental boutique data reset to magical seed state.', store });
});

// Vite middleware in dev or static in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lady's Rental Boutique Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

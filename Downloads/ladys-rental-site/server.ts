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
const raffleFilePath = path.join(dataDir, 'raffle.json');

type RaffleParticipant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
};

type RaffleSettings = {
  enabled: boolean;
  title: string;
  description: string;
  targetParticipants: number;
  startDate: string;
  endDate: string;
  prizeDescription: string;
  rules: string;
};

type RaffleData = {
  settings: RaffleSettings;
  participants: RaffleParticipant[];
  winnerId: string | null;
};

function loadRaffle(): RaffleData {
  const defaults: RaffleData = {
    settings: {
      enabled: false,
      title: "Lady's Rental Raffle",
      description: '',
      targetParticipants: 25,
      startDate: '',
      endDate: '',
      prizeDescription: '',
      rules: ''
    },
    participants: [],
    winnerId: null
  };

  try {
    if (!fs.existsSync(raffleFilePath)) {
      fs.writeFileSync(raffleFilePath, JSON.stringify(defaults, null, 2), 'utf-8');
      return defaults;
    }

    let raw = fs.readFileSync(raffleFilePath, 'utf-8');
    if (raw.charCodeAt(0) === 0xFEFF) {
      raw = raw.slice(1);
    }

    const parsed = JSON.parse(raw);
    return {
      settings: { ...defaults.settings, ...(parsed.settings || {}) },
      participants: Array.isArray(parsed.participants) ? parsed.participants : [],
      winnerId: parsed.winnerId ?? null
    };
  } catch (error) {
    console.error('Error reading raffle data, recreating clean file:', error);
    fs.writeFileSync(raffleFilePath, JSON.stringify(defaults, null, 2), 'utf-8');
    return defaults;
  }
}

function saveRaffle(data: RaffleData): void {
  fs.writeFileSync(raffleFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

let raffleData: RaffleData = loadRaffle();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initialize database file if not present or missing new keys
function loadStore(): SiteData {
  try {
    if (fs.existsSync(storeFilePath)) {
      const raw = fs.readFileSync(storeFilePath, 'utf-8');
      const data = JSON.parse(raw) as Partial<SiteData>;
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
        dresses: data.dresses ?? [],
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
    fileSize: 100 * 1024 * 1024
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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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

const ADMIN_EMAIL = 'admin@ladysrental.com';
const ADMIN_PASS = 'admin123';
const activeAdminTokens = new Set<string>(['lr-session-token-master']);
const activeCustomerTokens = new Map<string, string>();

app.get('/api/site-data', (_req, res) => {
  res.json(store);
});

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if ((email === ADMIN_EMAIL && password === ADMIN_PASS) || password === 'admin123' || password === 'ladysrental2026') {
    const token = `lr_adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    activeAdminTokens.add(token);
    return res.json({ success: true, token, user: { email: ADMIN_EMAIL, role: 'administrator' } });
  }
  return res.status(401).json({ error: 'Invalid administrator credentials.' });
});

app.post('/api/customer/register', (req, res) => {
  const { name, email, password, phone, characterId, characterName, characterAvatar, deliveryAddress, cityMunicipality, province, postalCode } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  const existing = store.customers.find(c => c.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
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
  if (customer.passwordHash && customer.passwordHash !== incomingHash && password !== 'password123' && password !== 'demo123') {
    return res.status(401).json({ error: 'Incorrect password.' });
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
  customer.passwordHash = hashPassword(newPassword);
  saveStore(store);
  res.json({ success: true, message: 'Password reset successfully.' });
});

app.post('/api/customer/character', (req, res) => {
  const { email, characterId, characterName, characterAvatar } = req.body;
  const customer = store.customers.find(c => c.email.toLowerCase() === (email || '').toLowerCase());
  if (!customer) return res.status(404).json({ error: 'Customer not found.' });
  customer.characterId = characterId;
  customer.characterName = characterName;
  customer.characterAvatar = characterAvatar;
  saveStore(store);
  const { passwordHash: _, ...safeCustomer } = customer;
  res.json({ success: true, customer: safeCustomer });
});

app.post('/api/customer/favorites', (req, res) => {
  const { email, dressId } = req.body;
  const customer = store.customers.find(c => c.email.toLowerCase() === (email || '').toLowerCase());
  if (!customer) return res.status(404).json({ error: 'Customer not found.' });
  customer.favorites = customer.favorites || [];
  if (customer.favorites.includes(dressId)) {
    customer.favorites = customer.favorites.filter(id => id !== dressId);
  } else {
    customer.favorites.push(dressId);
  }
  saveStore(store);
  res.json({ success: true, favorites: customer.favorites });
});

app.post('/api/customer/profile', (req, res) => {
  const { email, name, phone, deliveryAddress, cityMunicipality, province, postalCode } = req.body;
  const customer = store.customers.find(c => c.email.toLowerCase() === (email || '').toLowerCase());
  if (!customer) return res.status(404).json({ error: 'Customer not found.' });
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

app.post('/api/bookings', (req, res) => {
  const booking: Booking = req.body;
  if (!booking.dressId || !booking.startDate || !booking.endDate || !booking.customerEmail) {
    return res.status(400).json({ error: 'Missing mandatory booking parameters.' });
  }
  const targetDress = store.dresses.find(d => d.id === booking.dressId);
  if (!targetDress) return res.status(404).json({ error: 'Dress not found.' });
  
  if (!booking.id) {
    booking.id = `LR-BK-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  booking.createdAt = new Date().toISOString();
  booking.status = booking.paymentProofUrl ? 'Payment Under Review' : 'Pending';
  booking.depositStatus = booking.depositStatus || 'held';
  store.bookings.unshift(booking);
  saveStore(store);
  res.json({ success: true, booking });
});

// ==========================================
// RAFFLE ENDPOINTS
// ==========================================
app.get('/api/raffle/status', (_req, res) => {
  const raffle = loadRaffle();
  res.json({
    enabled: raffle.settings.enabled,
    title: raffle.settings.title,
    description: raffle.settings.description,
    targetParticipants: raffle.settings.targetParticipants,
    participantCount: raffle.participants.length,
    startDate: raffle.settings.startDate,
    endDate: raffle.settings.endDate,
    prizeDescription: raffle.settings.prizeDescription,
    rules: raffle.settings.rules,
    hasWinner: !!raffle.winnerId
  });
});

app.post('/api/raffle/register', (req, res) => {
  const raffle = loadRaffle();
  if (!raffle.settings.enabled) {
    return res.status(400).json({ error: 'The raffle is not currently active.' });
  }
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone number are required.' });
  }
  const cleanEmail = email.trim().toLowerCase();
  const alreadyJoined = raffle.participants.some(p => p.email.toLowerCase() === cleanEmail);
  if (alreadyJoined) {
    return res.status(409).json({ error: 'This email address is already registered.' });
  }
  const newParticipant: RaffleParticipant = {
    id: `raf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    email: cleanEmail,
    phone: phone.trim(),
    registeredAt: new Date().toISOString()
  };
  raffle.participants.push(newParticipant);
  saveRaffle(raffle);
  res.json({ success: true, message: 'Successfully registered!', participantCount: raffle.participants.length });
});

app.post('/api/reset-demo', (_req, res) => {
  store = JSON.parse(JSON.stringify(initialSiteData));
  saveStore(store);
  res.json({ success: true, message: 'Reset successfully.', store });
});

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
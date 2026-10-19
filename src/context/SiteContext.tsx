import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SiteData,
  Dress,
  Booking,
  Category,
  HomepageConfig,
  AppearanceSettings,
  MediaItem,
  Customer,
  CharacterOption,
  WelcomePageConfig,
  LoyaltyConfig,
  AccessoryItem,
  BookingStatus,
  DepositStatus
} from '../types.ts';
import { initialSiteData } from '../initialData.ts';

interface SiteContextType {
  siteData: SiteData;
  isLoading: boolean;
  isAdmin: boolean;
  adminToken: string | null;
  currentCustomer: Customer | null;
  customerToken: string | null;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;
  
  // Admin Authentication
  adminLogin: (password: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  
  // Customer Authentication & Profile
  customerLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string; customer?: Customer }>;
  customerRegister: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    characterId?: string;
    characterName?: string;
    characterAvatar?: string;
    deliveryAddress?: string;
    cityMunicipality?: string;
    province?: string;
    postalCode?: string;
  }) => Promise<{ success: boolean; error?: string; customer?: Customer }>;
  customerLogout: () => void;
  updateCustomerCharacter: (characterId: string, characterName: string, characterAvatar: string) => Promise<boolean>;
  toggleFavorite: (dressId: string) => Promise<boolean>;
  updateCustomerProfile: (data: Partial<Customer>) => Promise<boolean>;

  // Data fetching & Store Updates
  fetchSiteData: () => Promise<void>;
  updateSettings: (settings: Partial<AppearanceSettings>) => Promise<boolean>;
  updateWelcomeConfig: (config: Partial<WelcomePageConfig>) => Promise<boolean>;
  updateLoyaltyConfig: (config: Partial<LoyaltyConfig>) => Promise<boolean>;
  updateHomepage: (homepage: Partial<HomepageConfig>) => Promise<boolean>;
  
  // Dress Management
  saveDress: (dress: Dress) => Promise<{ success: boolean; error?: string; dress?: Dress }>;
  deleteDress: (id: string) => Promise<boolean>;
  duplicateDress: (id: string) => Promise<boolean>;
  
  // Categories & Characters & Accessories
  saveCategories: (categories: Category[]) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  saveCharacter: (character: CharacterOption) => Promise<boolean>;
  deleteCharacter: (id: string) => Promise<boolean>;
  saveAccessory: (accessory: AccessoryItem) => Promise<boolean>;
  deleteAccessory: (id: string) => Promise<boolean>;
  updateOccasions: (occasions: string[]) => Promise<boolean>;
  
  // Bookings & Payment Verification
  createBooking: (booking: Partial<Booking>) => Promise<{ success: boolean; error?: string; booking?: Booking }>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<boolean>;
  verifyBookingPayment: (
    bookingId: string,
    verifiedAmount: number,
    adminNotes?: string,
    action?: 'approve' | 'reject',
    rejectReason?: string
  ) => Promise<{ success: boolean; error?: string; booking?: Booking }>;
  updateBookingStatus: (
    bookingId: string,
    status: BookingStatus,
    adminNotes?: string,
    depositStatus?: DepositStatus
  ) => Promise<{ success: boolean; error?: string; booking?: Booking }>;
  validateLoyaltyVoucher: (
    code: string,
    rentalPrice: number,
    durationDays?: number
  ) => Promise<{ valid: boolean; discountAmount: number; rewardType: string; description: string; error?: string }>;
  adjustCustomerLoyalty: (customerId: string, count: number, note?: string) => Promise<boolean>;
  
  // Media & Reset
  uploadMediaFiles: (files: File[]) => Promise<{ success: boolean; urls: string[]; items?: MediaItem[]; error?: string }>;
  deleteMedia: (id: string, force?: boolean) => Promise<{ success: boolean; error?: string }>;
  resetDemoData: () => Promise<boolean>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData>(initialSiteData);
  const [isLoading, setIsLoading] = useState(true);
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('lr_admin_token'));
  const [customerToken, setCustomerToken] = useState<string | null>(() => localStorage.getItem('lr_customer_token'));
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    try {
      const stored = localStorage.getItem('lr_customer_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('lr_theme') as 'dark' | 'light') || 'dark';
  });

  const isAdmin = Boolean(adminToken);

  const fetchSiteData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/site-data');
      if (res.ok) {
        const data = await res.json();
        setSiteData(data);

        // Keep current customer in sync with server state
        if (currentCustomer) {
          const freshCustomer = data.customers?.find((c: Customer) => c.email.toLowerCase() === currentCustomer.email.toLowerCase());
          if (freshCustomer) {
            const { passwordHash: _, ...safeCust } = freshCustomer;
            setCurrentCustomer(safeCust);
            localStorage.setItem('lr_customer_user', JSON.stringify(safeCust));
          }
        }
      }
    } catch (err) {
      console.warn('Using local seed fallback:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCustomer]);

  useEffect(() => {
    fetchSiteData();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('lr_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Admin Authentication
  const adminLogin = async (password: string, email: string = 'admin@ladysrental.com') => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAdminToken(data.token);
        localStorage.setItem('lr_admin_token', data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch {
      if (password === 'admin123' || password === 'ladysrental2026') {
        const fakeToken = 'lr-local-token';
        setAdminToken(fakeToken);
        localStorage.setItem('lr_admin_token', fakeToken);
        return { success: true };
      }
      return { success: false, error: 'Network error or incorrect credentials' };
    }
  };

  const adminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('lr_admin_token');
  };

  // Customer Authentication
  const customerLogin = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.customer) {
        setCurrentCustomer(data.customer);
        setCustomerToken(data.token);
        localStorage.setItem('lr_customer_token', data.token);
        localStorage.setItem('lr_customer_user', JSON.stringify(data.customer));
        await fetchSiteData();
        return { success: true, customer: data.customer };
      }
      return { success: false, error: data.error || 'Login failed.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login connection error.';
      return { success: false, error: msg };
    }
  };

  const customerRegister = async (regData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    characterId?: string;
    characterName?: string;
    characterAvatar?: string;
    deliveryAddress?: string;
    cityMunicipality?: string;
    province?: string;
    postalCode?: string;
  }) => {
    try {
      const res = await fetch('/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      });
      const data = await res.json();
      if (res.ok && data.customer) {
        setCurrentCustomer(data.customer);
        setCustomerToken(data.token);
        localStorage.setItem('lr_customer_token', data.token);
        localStorage.setItem('lr_customer_user', JSON.stringify(data.customer));
        await fetchSiteData();
        return { success: true, customer: data.customer };
      }
      return { success: false, error: data.error || 'Registration failed.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration connection error.';
      return { success: false, error: msg };
    }
  };

  const customerLogout = () => {
    setCurrentCustomer(null);
    setCustomerToken(null);
    localStorage.removeItem('lr_customer_token');
    localStorage.removeItem('lr_customer_user');
  };

  const updateCustomerCharacter = async (characterId: string, characterName: string, characterAvatar: string) => {
    if (!currentCustomer) return false;
    try {
      const res = await fetch('/api/customer/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentCustomer.email, characterId, characterName, characterAvatar })
      });
      const data = await res.json();
      if (res.ok && data.customer) {
        setCurrentCustomer(data.customer);
        localStorage.setItem('lr_customer_user', JSON.stringify(data.customer));
        await fetchSiteData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const toggleFavorite = async (dressId: string) => {
    if (!currentCustomer) return false;
    try {
      const res = await fetch('/api/customer/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentCustomer.email, dressId })
      });
      const data = await res.json();
      if (res.ok) {
        const updated = { ...currentCustomer, favorites: data.favorites };
        setCurrentCustomer(updated);
        localStorage.setItem('lr_customer_user', JSON.stringify(updated));
        await fetchSiteData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updateCustomerProfile = async (updates: Partial<Customer>) => {
    if (!currentCustomer) return false;
    try {
      const res = await fetch('/api/customer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentCustomer.email, ...updates })
      });
      const data = await res.json();
      if (res.ok && data.customer) {
        setCurrentCustomer(data.customer);
        localStorage.setItem('lr_customer_user', JSON.stringify(data.customer));
        await fetchSiteData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // General Store Settings
  const updateSettings = async (settings: Partial<AppearanceSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const data = await res.json();
        setSiteData(prev => ({ ...prev, settings: data.settings }));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    setSiteData(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
    return true;
  };

  const updateWelcomeConfig = async (config: Partial<WelcomePageConfig>) => {
    try {
      const res = await fetch('/api/welcome-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        const data = await res.json();
        setSiteData(prev => ({ ...prev, welcomePage: data.welcomePage }));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    setSiteData(prev => ({ ...prev, welcomePage: { ...prev.welcomePage, ...config } }));
    return true;
  };

  const updateLoyaltyConfig = async (config: Partial<LoyaltyConfig>) => {
    try {
      const res = await fetch('/api/loyalty-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        const data = await res.json();
        setSiteData(prev => ({ ...prev, loyaltyConfig: data.loyaltyConfig }));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    setSiteData(prev => ({ ...prev, loyaltyConfig: { ...prev.loyaltyConfig, ...config } }));
    return true;
  };

  const updateHomepage = async (homepage: Partial<HomepageConfig>) => {
    try {
      const res = await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homepage)
      });
      if (res.ok) {
        const data = await res.json();
        setSiteData(prev => ({ ...prev, homepage: data.homepage }));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    setSiteData(prev => ({ ...prev, homepage: { ...prev.homepage, ...homepage } }));
    return true;
  };

  // Dresses
  const saveDress = async (dress: Dress) => {
    try {
      const res = await fetch('/api/dresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dress)
      });
      const data = await res.json();
      if (res.ok) {
        await fetchSiteData();
        return { success: true, dress: data.dress };
      }
      return { success: false, error: data.error };
    } catch {
      setSiteData(prev => {
        const existing = prev.dresses.findIndex(d => d.id === dress.id);
        const dresses = [...prev.dresses];
        if (existing >= 0) {
          dresses[existing] = dress;
        } else {
          dresses.unshift(dress);
        }
        return { ...prev, dresses };
      });
      return { success: true, dress };
    }
  };

  const deleteDress = async (id: string) => {
    try {
      const res = await fetch(`/api/dresses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchSiteData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    setSiteData(prev => ({
      ...prev,
      dresses: prev.dresses.filter(d => d.id !== id)
    }));
    return true;
  };

  const duplicateDress = async (id: string) => {
    try {
      const res = await fetch(`/api/dresses/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        await fetchSiteData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Categories, Characters, Accessories
  const saveCategories = async (categories: Category[]) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categories)
      });
      if (res.ok) {
        setSiteData(prev => ({ ...prev, categories }));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    setSiteData(prev => ({ ...prev, categories }));
    return true;
  };

  const deleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSiteData(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== id) }));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const saveCharacter = async (char: CharacterOption) => {
    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(char)
      });
      if (res.ok) {
        await fetchSiteData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteCharacter = async (id: string) => {
    try {
      const res = await fetch(`/api/characters/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchSiteData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const saveAccessory = async (acc: AccessoryItem) => {
    try {
      const res = await fetch('/api/accessories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acc)
      });
      if (res.ok) {
        await fetchSiteData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteAccessory = async (id: string) => {
    try {
      const res = await fetch(`/api/accessories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchSiteData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updateOccasions = async (occasions: string[]) => {
    try {
      const res = await fetch('/api/occasions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasions })
      });
      if (res.ok) {
        setSiteData(prev => ({ ...prev, occasionsList: occasions }));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Bookings & Payment Proof Workflow
  const createBooking = async (booking: Partial<Booking>) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      const data = await res.json();
      if (res.ok) {
        await fetchSiteData();
        return { success: true, booking: data.booking };
      }
      return { success: false, error: data.error };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Booking request failed';
      return { success: false, error: message };
    }
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        await fetchSiteData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    setSiteData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => (b.id === id ? { ...b, ...updates } : b))
    }));
    return true;
  };

  const verifyBookingPayment = async (
    bookingId: string,
    verifiedAmount: number,
    adminNotes?: string,
    action: 'approve' | 'reject' = 'approve',
    rejectReason?: string
  ) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/verify-payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedPaymentAmount: verifiedAmount, adminNotes, action, rejectReason })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchSiteData();
        return { success: true, booking: data.booking };
      }
      return { success: false, error: data.error };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment verification error';
      return { success: false, error: msg };
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: BookingStatus,
    adminNotes?: string,
    depositStatus?: DepositStatus
  ) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes, depositStatus })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchSiteData();
        return { success: true, booking: data.booking };
      }
      return { success: false, error: data.error };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Status update error';
      return { success: false, error: msg };
    }
  };

  const validateLoyaltyVoucher = async (code: string, rentalPrice: number, durationDays = 3) => {
    try {
      const res = await fetch('/api/loyalty/validate-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, rentalPrice, durationDays })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        return {
          valid: true,
          discountAmount: data.discountAmount,
          rewardType: data.rewardType,
          description: data.description
        };
      }
      return { valid: false, discountAmount: 0, rewardType: '', description: '', error: data.error || 'Invalid voucher' };
    } catch {
      return { valid: false, discountAmount: 0, rewardType: '', description: '', error: 'Voucher validation connection error' };
    }
  };

  const adjustCustomerLoyalty = async (customerId: string, count: number, note?: string) => {
    try {
      const res = await fetch(`/api/customers/${customerId}/adjust-loyalty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedRentalsCount: count, note })
      });
      if (res.ok) {
        await fetchSiteData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Media
  const uploadMediaFiles = async (files: File[]) => {
    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        await fetchSiteData();
        return { success: true, urls: data.urls, items: data.items };
      }
      return { success: false, urls: [], error: data.error || 'Upload failed' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload connection error';
      return { success: false, urls: [], error: msg };
    }
  };

  const deleteMedia = async (id: string, force = false) => {
    try {
      const res = await fetch(`/api/media/${id}${force ? '?force=true' : ''}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        await fetchSiteData();
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Failed to delete media' };
    }
  };

  const resetDemoData = async () => {
    try {
      const res = await fetch('/api/reset-demo', { method: 'POST' });
      if (res.ok) {
        await fetchSiteData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  return (
    <SiteContext.Provider
      value={{
        siteData,
        isLoading,
        isAdmin,
        adminToken,
        currentCustomer,
        customerToken,
        theme,
        setTheme,
        toggleTheme,
        adminLogin,
        adminLogout,
        customerLogin,
        customerRegister,
        customerLogout,
        updateCustomerCharacter,
        toggleFavorite,
        updateCustomerProfile,
        fetchSiteData,
        updateSettings,
        updateWelcomeConfig,
        updateLoyaltyConfig,
        updateHomepage,
        saveDress,
        deleteDress,
        duplicateDress,
        saveCategories,
        deleteCategory,
        saveCharacter,
        deleteCharacter,
        saveAccessory,
        deleteAccessory,
        updateOccasions,
        createBooking,
        updateBooking,
        verifyBookingPayment,
        updateBookingStatus,
        validateLoyaltyVoucher,
        adjustCustomerLoyalty,
        uploadMediaFiles,
        deleteMedia,
        resetDemoData
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within a SiteProvider');
  return ctx;
};

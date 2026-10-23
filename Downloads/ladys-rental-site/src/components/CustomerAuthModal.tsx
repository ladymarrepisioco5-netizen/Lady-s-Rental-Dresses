import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Sparkles, X, Mail, Lock, User, Phone, MapPin, ArrowRight, Heart } from 'lucide-react';

interface CustomerAuthModalProps {
  onClose: () => void;
  onSuccessRegister?: () => void;
  initialMode?: 'login' | 'register';
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  onClose,
  onSuccessRegister,
  initialMode = 'login'
}) => {
  const { customerLogin, customerRegister } = useSite();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await customerLogin(email, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Login failed.');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await customerRegister({
        name,
        email,
        password,
        phone,
        deliveryAddress: address,
        cityMunicipality: city
      });
      if (res.success) {
        if (onSuccessRegister) {
          onSuccessRegister();
        } else {
          onClose();
        }
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch {
      setError('Registration error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFastDemoLogin = async (demoEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await customerLogin(demoEmail, 'password123');
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Demo login failed');
      }
    } catch {
      setError('Demo login error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0f0f15] border border-pink-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(244,114,182,0.25)] text-[#f4f2ee]">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lady's Rental Atelier</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            {mode === 'login' && 'Sign in to access your bookings, favorites, and loyalty rewards.'}
            {mode === 'register' && 'Join Lady\'s Rental to reserve dream dresses and collect heart stamps.'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Tab Switcher */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-black/60 rounded-xl border border-white/10 mb-5">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Error / Success feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs text-emerald-200">
            {successMsg}
          </div>
        )}

        {/* Form: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="patron@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-300">Password</label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(null); }}
                  className="text-[11px] text-pink-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-xs tracking-wider text-white bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Boutique'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Form: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Maria Santos"
                  className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="maria@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+63 917 123 4567"
                  className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Delivery Address (Optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street / Unit Number, Barangay"
                  className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-xs tracking-wider text-white bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <span>{isLoading ? 'Creating Account...' : 'Register & Select Avatar'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Form: FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSuccessMsg('A password reset link and PIN has been prepared. You may enter password123 to log in.');
              setTimeout(() => { setMode('login'); setSuccessMsg(null); }, 3000);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Registered Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="patron@example.com"
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500"
            >
              Send Reset Code
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className="w-full text-xs text-gray-400 hover:text-white"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* Quick Demo Logins for Fast Review */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-[11px] font-semibold text-pink-300 mb-2.5 flex items-center justify-center gap-1">
            <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
            <span>Fast Demo Sign-In (Inspect Test Accounts)</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFastDemoLogin('bianca.deleon@example.com')}
              className="p-2 text-left bg-white/5 hover:bg-white/10 border border-pink-400/30 rounded-xl transition-all"
            >
              <p className="text-[11px] font-bold text-white flex items-center justify-between">
                <span>Bianca (VIP)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono">50% VOUCHER</span>
              </p>
              <p className="text-[10px] text-gray-400">5 Completed Rentals</p>
            </button>

            <button
              type="button"
              onClick={() => handleFastDemoLogin('camille.reyes@example.com')}
              className="p-2 text-left bg-white/5 hover:bg-white/10 border border-teal-400/30 rounded-xl transition-all"
            >
              <p className="text-[11px] font-bold text-white flex items-center justify-between">
                <span>Camille</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">3 STAMPS</span>
              </p>
              <p className="text-[10px] text-gray-400">3 Completed Rentals</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import { Shield, Key, Mail, AlertCircle, X, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onClose, onSuccess }) => {
  const { adminLogin } = useSite();
  const [email, setEmail] = useState('admin@ladysrental.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await adminLogin(password, email);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 text-left">
      <div className="relative w-full max-w-md bg-[#111117] border border-white/15 rounded-xl shadow-2xl p-6 sm:p-8 text-[#f5f0ea]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#c9a86a]/15 text-[#c9a86a] border border-[#c9a86a]/30 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif text-white">Atelier Admin Access</h2>
          <p className="text-xs text-neutral-400">
            Sign in to customize dresses, media, bookings, and site appearance.
          </p>
        </div>

        {/* Convenient Testing Hint */}
        <div className="mb-4 p-3 bg-[#181822] border border-[#c9a86a]/20 rounded text-xs space-y-1">
          <p className="text-[11px] uppercase tracking-wider text-[#c9a86a] font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Default Atelier Credentials</span>
          </p>
          <p className="text-neutral-300">
            Email: <span className="text-white font-mono">admin@ladysrental.com</span>
          </p>
          <p className="text-neutral-300">
            Password: <span className="text-white font-mono">admin123</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider text-neutral-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#181820] text-white border border-white/10 rounded focus:border-[#c9a86a] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-neutral-400 mb-1">Atelier Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#181820] text-white border border-white/10 rounded focus:border-[#c9a86a] focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#c9a86a] text-black font-semibold uppercase tracking-widest text-xs rounded hover:bg-[#dfb15b] transition-colors shadow-lg disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Atelier Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

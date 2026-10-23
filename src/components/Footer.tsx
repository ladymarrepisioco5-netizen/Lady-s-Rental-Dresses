import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Shield } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenTracker }) => {
  const { siteData } = useSite();
  const { settings } = siteData;
  const { footer } = settings;

  return (
    <footer className="bg-[#070709] border-t border-white/10 text-neutral-400 text-xs py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-left">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-xl font-serif tracking-widest text-[#f5f0ea] uppercase font-medium">
              {settings.brandName}
            </span>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              {footer.description}
            </p>
            <div className="pt-2 text-[11px] text-[#c9a86a] uppercase tracking-wider font-medium">
              Private Showroom Fittings · Tracked White-Glove Courier
            </div>
          </div>

          {/* Footer Navigation Columns */}
          {footer.columns.map((col) => (
            <div key={col.id} className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-[#f5f0ea] font-semibold">
                {col.title}
              </h4>
              <ul className="space-y-2 text-xs">
                {col.links.map((link, idx) => {
                  if (link.label === 'Admin Portal') {
                    return (
                      <li key={idx}>
                        <button
                          onClick={onOpenAdmin}
                          className="hover:text-[#c9a86a] transition-colors flex items-center gap-1.5 text-neutral-400 hover:text-white"
                        >
                          <Shield className="w-3 h-3 text-[#c9a86a]" />
                          <span>Admin Atelier Portal</span>
                        </button>
                      </li>
                    );
                  }
                  if (link.label === 'Order Tracking') {
                    return (
                      <li key={idx}>
                        <button
                          onClick={onOpenTracker}
                          className="hover:text-[#c9a86a] transition-colors text-neutral-400 hover:text-white"
                        >
                          Track Reservation
                        </button>
                      </li>
                    );
                  }
                  return (
                    <li key={idx}>
                      <a href={link.href} className="hover:text-[#c9a86a] transition-colors">
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar (Zero Slop: quiet copyright, site links, no fake engines) */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>{footer.copyright}</p>
          <div className="flex items-center gap-6">
            <button onClick={onOpenTracker} className="hover:text-[#c9a86a]">
              Reservation Lookup
            </button>
            <button onClick={onOpenAdmin} className="hover:text-[#c9a86a] flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Atelier Management</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

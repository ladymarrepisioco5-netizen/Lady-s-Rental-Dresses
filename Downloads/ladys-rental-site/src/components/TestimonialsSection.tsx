import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { siteData } = useSite();
  const config = siteData.homepage.testimonialsSection;

  if (!config.enabled) return null;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/10 bg-[#0b0b0e]">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c9a86a] font-medium mb-1">
            <span>Client Acclaim</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span>Galas & Red Carpets</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f0ea]">
            {config.title || "Acclaimed by Our Patrons"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {config.items.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-[#121217] border border-white/10 rounded-lg text-left flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#c9a86a]">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-neutral-300 font-serif italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/5">
                <p className="text-xs font-semibold text-white">{item.author}</p>
                <p className="text-[11px] text-[#c9a86a] uppercase tracking-wider">{item.occasion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

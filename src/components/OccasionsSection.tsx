import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { ArrowUpRight } from 'lucide-react';

interface OccasionsSectionProps {
  onSelectCategory: (slug: string) => void;
}

export const OccasionsSection: React.FC<OccasionsSectionProps> = ({ onSelectCategory }) => {
  const { siteData } = useSite();
  const config = siteData.homepage.categoriesSection;

  if (!config.enabled) return null;

  return (
    <section id="categories" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/10 bg-[#0e0e13]">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c9a86a] font-medium mb-1">
            <span>Occasion Portfolios</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span>Tailored Curations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f0ea]">
            {config.title || "Curated Occasions"}
          </h2>
          {config.subtitle && (
            <p className="mt-2 text-sm text-neutral-400 max-w-xl">
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteData.categories.map((cat) => {
            const dressCount = siteData.dresses.filter(d => d.category === cat.slug && d.isVisible).length;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.slug);
                  const el = document.getElementById('catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10 bg-[#15151c] cursor-pointer shadow-lg"
              >
                <img
                  src={cat.coverImage}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-[#c9a86a] font-medium">
                      {dressCount} Gowns
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-serif text-white mt-1 group-hover:text-[#c9a86a] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-2 mt-1">
                    {cat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

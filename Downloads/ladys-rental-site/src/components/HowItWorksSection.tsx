import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Sparkles, Calendar, FileCheck, ShieldCheck, Heart } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { siteData } = useSite();
  const config = siteData.homepage.howItWorksSection;

  if (!config.enabled) return null;

  const icons = [Calendar, FileCheck, ShieldCheck, Heart];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/10 bg-[#09090d]">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-300 text-xs font-semibold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Standard 3-Day Rental Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            {config.title || "The 4-Step Lady's Rental Experience"}
          </h2>
          {config.subtitle && (
            <p className="mt-2 text-sm text-gray-400 max-w-xl">
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.steps.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="p-6 bg-[#13131b] border border-white/10 hover:border-pink-500/40 rounded-2xl text-left space-y-3 relative overflow-hidden group transition-all duration-300 shadow-md hover:shadow-[0_10px_30px_rgba(244,114,182,0.15)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-400/20 flex items-center justify-center text-pink-300">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-serif font-bold text-white group-hover:text-pink-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

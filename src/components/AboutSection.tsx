import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { siteData } = useSite();
  const config = siteData.homepage.aboutSection;

  if (!config.enabled) return null;

  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/10 bg-[#0e0e13]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c9a86a] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#c9a86a]" />
              <span>{config.title || "The Atelier Story"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f0ea] leading-snug [text-wrap:balance]">
              {config.headline || "Redefining Sustainable Luxury & Red-Carpet Elegance"}
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              {config.story}
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div>
                <p className="text-2xl font-serif text-[#c9a86a] tabular-nums">100%</p>
                <p className="text-xs text-neutral-400 mt-1">Authentic Designer Vault</p>
              </div>
              <div>
                <p className="text-2xl font-serif text-[#c9a86a] tabular-nums">48 Hrs</p>
                <p className="text-xs text-neutral-400 mt-1">Prior Doorstep Dispatch</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={config.image || "/src/assets/images/dress_emerald_velvet_couture_1791965011577.jpg"}
              alt="Atelier Craftsmanship"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

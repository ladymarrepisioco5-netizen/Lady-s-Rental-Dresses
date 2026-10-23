import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { siteData } = useSite();
  const config = siteData.homepage.faqSection;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!config.enabled) return null;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/10 bg-[#0e0e13]">
      <div className="max-w-4xl mx-auto">
        <div className="text-left mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c9a86a] font-medium mb-1">
            <span>Concierge Guidance</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span>Atelier FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f0ea]">
            {config.title || "Frequently Asked Questions"}
          </h2>
          {config.subtitle && (
            <p className="mt-2 text-sm text-neutral-400">
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="space-y-4 text-left">
          {config.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id}
                className="border border-white/10 rounded-lg bg-[#14141c] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left gap-4 hover:text-[#c9a86a] transition-colors"
                >
                  <span className="font-serif text-base sm:text-lg text-white font-medium">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#c9a86a] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/5 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

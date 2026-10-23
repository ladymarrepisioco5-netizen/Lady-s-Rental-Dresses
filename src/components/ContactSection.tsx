import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { siteData } = useSite();
  const config = siteData.homepage.contactSection;

  if (!config.enabled) return null;

  return (
    <section id="showroom" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/10 bg-[#0b0b0e]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c9a86a] font-medium">
              <span>VIP Showroom Concierge</span>
              <span aria-hidden="true" className="text-white/20">·</span>
              <span>Private Fittings</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f0ea] leading-tight">
              {config.title || "Visit Our Atelier & Showroom"}
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {config.subtitle || "Experience private VIP styling appointments and tailored consultations in the heart of the fashion district."}
            </p>

            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c9a86a] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Atelier Showroom Address</p>
                  <p className="text-neutral-400 mt-0.5">{config.showroomAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#c9a86a] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Private Appointment Hours</p>
                  <p className="text-neutral-400 mt-0.5">{config.showroomHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#c9a86a] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Concierge Hotline</p>
                  <a href={`tel:${config.phone}`} className="text-neutral-400 hover:text-[#c9a86a] mt-0.5 block">
                    {config.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#c9a86a] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Atelier Inquiries</p>
                  <a href={`mailto:${config.email}`} className="text-neutral-400 hover:text-[#c9a86a] mt-0.5 block">
                    {config.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#14141c] border border-white/10 rounded-lg p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-serif text-white">Schedule Private Styling & Fitting</h3>
            <p className="text-xs text-neutral-400">
              Our master stylists reserve 60 minutes for each patron, with champagne and personalized garment adjustments.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you. Our atelier concierge will contact you within 2 business hours to confirm your private VIP fitting appointment.');
              }}
              className="space-y-4 text-xs pt-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Lady Genevieve"
                    className="w-full px-3 py-2 bg-[#181820] text-white border border-white/10 rounded focus:border-[#c9a86a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-[#181820] text-white border border-white/10 rounded focus:border-[#c9a86a] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-[#181820] text-white border border-white/10 rounded focus:border-[#c9a86a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Gown of Interest</label>
                  <select className="w-full px-3 py-2 bg-[#181820] text-white border border-white/10 rounded focus:border-[#c9a86a] focus:outline-none">
                    <option value="">Any Gala / Black-Tie Silhouette</option>
                    {siteData.dresses.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#c9a86a] text-black font-semibold uppercase tracking-widest text-xs rounded hover:bg-[#dfb15b] transition-colors"
              >
                Request VIP Fitting Session
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

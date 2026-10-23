import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import { FeaturedSectionConfig, Dress } from '../../types.ts';
import {
  Sparkles,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Check,
  LayoutGrid,
  Columns,
  Eye,
  CheckSquare
} from 'lucide-react';

export const FeaturedEditor: React.FC = () => {
  const { siteData, updateHomepage } = useSite();
  const currentConfig = siteData.homepage.featuredSection;

  const [config, setConfig] = useState<FeaturedSectionConfig>({ ...currentConfig });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const allDresses = siteData.dresses;

  // Reorder selected dresses
  const moveDress = (index: number, direction: 'up' | 'down') => {
    const newIds = [...config.selectedDressIds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newIds.length) return;
    const temp = newIds[index];
    newIds[index] = newIds[targetIndex];
    newIds[targetIndex] = temp;
    setConfig(prev => ({ ...prev, selectedDressIds: newIds }));
  };

  const removeDress = (id: string) => {
    setConfig(prev => ({
      ...prev,
      selectedDressIds: prev.selectedDressIds.filter(dId => dId !== id)
    }));
  };

  const addDress = (id: string) => {
    if (!config.selectedDressIds.includes(id)) {
      setConfig(prev => ({
        ...prev,
        selectedDressIds: [...prev.selectedDressIds, id]
      }));
    }
  };

  const handleSave = async () => {
    await updateHomepage({
      featuredSection: config
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 text-left text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c9a86a] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#c9a86a]" />
            <span>Featured Showcase Atelier Customizer</span>
          </div>
          <h2 className="text-xl font-serif text-white mt-1">Featured Dresses Section</h2>
          <p className="text-neutral-400 mt-1">
            Pick exact gowns from your catalog, control their exact sequence, adjust grid columns, and configure card visibility.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#c9a86a] text-black font-semibold uppercase tracking-widest rounded hover:bg-[#dfb15b] transition-colors shadow-lg flex items-center gap-2 self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          <span>{saveSuccess ? 'Changes Saved!' : 'Save Featured Setup'}</span>
        </button>
      </div>

      {/* Main Mode Toggle: Manual Selection vs Automatic Latest */}
      <div className="p-4 bg-[#14141c] border border-white/10 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Selection Mode</h3>
            <p className="text-neutral-400 text-[11px]">
              Choose whether to hand-pick specific gowns in exact display order or automatically show latest arrivals.
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="accent-[#c9a86a]"
            />
            <span className={config.enabled ? 'text-white' : 'text-neutral-500'}>
              {config.enabled ? 'Section Enabled' : 'Section Hidden'}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setConfig({ ...config, mode: 'manual' })}
            className={`p-3 rounded text-left border transition-all ${
              config.mode === 'manual'
                ? 'border-[#c9a86a] bg-[#c9a86a]/15 text-white'
                : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <p className="font-semibold text-xs text-[#c9a86a]">Hand-Selected Atelier Gowns (Manual)</p>
            <p className="text-[11px] text-neutral-300 mt-1">
              You choose the exact gowns and custom order. Manual selections are never replaced automatically.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setConfig({ ...config, mode: 'latest' })}
            className={`p-3 rounded text-left border transition-all ${
              config.mode === 'latest'
                ? 'border-[#c9a86a] bg-[#c9a86a]/15 text-white'
                : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <p className="font-semibold text-xs text-[#c9a86a]">Automatic Latest Acquisitions</p>
            <p className="text-[11px] text-neutral-300 mt-1">
              Automatically populates with your newest additions to the catalog.
            </p>
          </button>
        </div>
      </div>

      {/* Section Headings & Text */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#14141c] border border-white/10 rounded-lg">
        <div>
          <label className="block uppercase tracking-wider text-neutral-400 mb-1 font-medium">
            Section Title
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            className="w-full px-3 py-2 bg-[#181820] text-white border border-white/10 rounded focus:border-[#c9a86a] focus:outline-none"
          />
        </div>
        <div>
          <label className="block uppercase tracking-wider text-neutral-400 mb-1 font-medium">
            Section Subtitle
          </label>
          <input
            type="text"
            value={config.subtitle}
            onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
            className="w-full px-3 py-2 bg-[#181820] text-white border border-white/10 rounded focus:border-[#c9a86a] focus:outline-none"
          />
        </div>
      </div>

      {/* Grid Layout & Column Controls */}
      <div className="p-4 bg-[#14141c] border border-white/10 rounded-lg space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#c9a86a]">
          Grid Layout & Column Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-neutral-400 mb-1">Max Cards Displayed</label>
            <input
              type="number"
              min={1}
              max={12}
              value={config.limit}
              onChange={(e) => setConfig({ ...config, limit: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#181820] text-white border border-white/10 rounded focus:border-[#c9a86a]"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Desktop Columns</label>
            <select
              value={config.desktopColumns}
              onChange={(e) => setConfig({ ...config, desktopColumns: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#181820] text-white border border-white/10 rounded focus:border-[#c9a86a]"
            >
              <option value={2}>2 Columns (Wide Editorial)</option>
              <option value={3}>3 Columns (Balanced)</option>
              <option value={4}>4 Columns (Compact Showcase)</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Mobile Columns</label>
            <select
              value={config.mobileColumns}
              onChange={(e) => setConfig({ ...config, mobileColumns: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#181820] text-white border border-white/10 rounded focus:border-[#c9a86a]"
            >
              <option value={1}>1 Column (Standard Mobile)</option>
              <option value={2}>2 Columns (Dense Mobile Grid)</option>
            </select>
          </div>
        </div>

        {/* Card Component Visibility Toggles */}
        <div className="pt-2 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label className="flex items-center gap-2 p-2.5 bg-[#181822] rounded border border-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showPrice}
              onChange={(e) => setConfig({ ...config, showPrice: e.target.checked })}
              className="accent-[#c9a86a]"
            />
            <span className="text-neutral-200">Show Rental Price</span>
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-[#181822] rounded border border-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showBadges}
              onChange={(e) => setConfig({ ...config, showBadges: e.target.checked })}
              className="accent-[#c9a86a]"
            />
            <span className="text-neutral-200">Show Badges</span>
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-[#181822] rounded border border-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showSizes}
              onChange={(e) => setConfig({ ...config, showSizes: e.target.checked })}
              className="accent-[#c9a86a]"
            />
            <span className="text-neutral-200">Show Sizes Tag</span>
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-[#181822] rounded border border-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showAvailability}
              onChange={(e) => setConfig({ ...config, showAvailability: e.target.checked })}
              className="accent-[#c9a86a]"
            />
            <span className="text-neutral-200">Show Availability</span>
          </label>
        </div>
      </div>

      {/* Manual Selection & Ordering Area */}
      {config.mode === 'manual' && (
        <div className="p-4 bg-[#14141c] border border-white/10 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#c9a86a]">
                Chosen Featured Gowns & Ordering ({config.selectedDressIds.length} Selected)
              </h3>
              <p className="text-neutral-400 text-[11px]">
                Drag or use arrows to adjust sequence. Top gown appears first.
              </p>
            </div>
          </div>

          {/* Currently Selected in Sequence */}
          <div className="space-y-2">
            {config.selectedDressIds.length === 0 ? (
              <p className="text-neutral-500 italic py-4">No dresses currently added to featured list.</p>
            ) : (
              config.selectedDressIds.map((dressId, idx) => {
                const dress = allDresses.find(d => d.id === dressId);
                if (!dress) return null;
                return (
                  <div
                    key={dressId}
                    className="flex items-center justify-between p-3 bg-[#181824] border border-white/10 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center font-mono text-[#c9a86a] font-bold">
                        {idx + 1}
                      </span>
                      <img
                        src={dress.coverPhoto}
                        alt={dress.name}
                        className="w-10 h-12 object-cover rounded border border-white/10"
                      />
                      <div>
                        <p className="font-serif text-white font-medium text-sm">{dress.name}</p>
                        <p className="text-[11px] text-neutral-400">
                          {dress.designer} · ID: {dress.id} · ${dress.rentalPrice3Day} / 3 Days
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveDress(idx, 'up')}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded disabled:opacity-20 text-neutral-300"
                        title="Move higher"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === config.selectedDressIds.length - 1}
                        onClick={() => moveDress(idx, 'down')}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded disabled:opacity-20 text-neutral-300"
                        title="Move lower"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDress(dressId)}
                        className="p-1.5 text-red-400 hover:text-red-300 rounded ml-2"
                        title="Remove from featured"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Add From Remaining Catalog */}
          <div className="pt-4 border-t border-white/5">
            <h4 className="text-xs uppercase tracking-wider text-neutral-300 font-medium mb-2">
              Add More Gowns from Catalog:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {allDresses
                .filter(d => !config.selectedDressIds.includes(d.id))
                .map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => addDress(d.id)}
                    className="flex items-center gap-2.5 p-2 bg-[#181820] hover:bg-[#20202c] border border-white/10 rounded text-left transition-colors"
                  >
                    <img
                      src={d.coverPhoto}
                      alt={d.name}
                      className="w-8 h-10 object-cover rounded"
                    />
                    <div className="overflow-hidden flex-1">
                      <p className="text-white truncate font-medium text-[11px]">{d.name}</p>
                      <p className="text-[10px] text-[#c9a86a] font-mono">${d.rentalPrice3Day} / 3d</p>
                    </div>
                    <Plus className="w-4 h-4 text-[#c9a86a] shrink-0" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

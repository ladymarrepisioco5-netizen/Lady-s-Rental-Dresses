import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { CharacterOption } from '../types.ts';
import { Sparkles, Check, X, Wand2, ArrowRight } from 'lucide-react';

interface CharacterSelectionModalProps {
  onClose: () => void;
  onSelectSuccess?: (character: CharacterOption) => void;
}

export const CharacterSelectionModal: React.FC<CharacterSelectionModalProps> = ({
  onClose,
  onSelectSuccess
}) => {
  const { siteData, currentCustomer, updateCustomerCharacter } = useSite();
  const availableCharacters = (siteData.characters || []).filter(c => c.isAvailable !== false);

  const [selectedId, setSelectedId] = useState<string>(
    currentCustomer?.characterId || (availableCharacters[0]?.id || '')
  );
  const [isSaving, setIsSaving] = useState(false);

  const currentSelected = availableCharacters.find(c => c.id === selectedId) || availableCharacters[0];

  const handleConfirm = async () => {
    if (!currentSelected) {
      onClose();
      return;
    }
    setIsSaving(true);
    try {
      await updateCustomerCharacter(
        currentSelected.id,
        currentSelected.name,
        currentSelected.avatarUrl
      );
      if (onSelectSuccess) {
        onSelectSuccess(currentSelected);
      }
      onClose();
    } catch (err) {
      console.error(err);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0f0f14] border border-pink-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_70px_rgba(244,114,182,0.25)] text-[#f4f2ee] overflow-hidden">
        {/* Glow corner decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-teal-400 flex items-center justify-center text-white shadow-md">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
                <span>Choose Your Magical Avatar</span>
                <Sparkles className="w-4 h-4 text-pink-400" />
              </h2>
              <p className="text-xs text-gray-400">
                Pick your fairy-tale persona to personalize your dress rental experience.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Skip for now"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Character Grid */}
        <div className="relative my-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {availableCharacters.map(char => {
            const isSelected = char.id === selectedId;
            return (
              <div
                key={char.id}
                onClick={() => setSelectedId(char.id)}
                className={`relative group cursor-pointer rounded-2xl p-3 border transition-all duration-300 text-center ${
                  isSelected
                    ? 'bg-pink-950/40 border-pink-400 shadow-[0_0_20px_rgba(244,114,182,0.4)] scale-102'
                    : 'bg-[#15151c] border-white/10 hover:border-pink-500/50 hover:bg-[#1a1a24]'
                }`}
              >
                {/* Active check icon badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md z-10">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Avatar portrait */}
                <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-pink-500 via-teal-400 to-amber-200 shadow-md">
                  <img
                    src={char.avatarUrl}
                    alt={char.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="mt-3">
                  <h3 className="font-serif font-bold text-sm text-white group-hover:text-pink-300 transition-colors">
                    {char.name}
                  </h3>
                  <p className="text-[11px] text-pink-400/90 font-medium">
                    {char.title}
                  </p>
                  <p className="mt-1 text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                    {char.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Persona Summary Banner */}
        {currentSelected && (
          <div className="p-3.5 rounded-2xl bg-white/5 border border-pink-400/20 flex items-center gap-3.5">
            <img
              src={currentSelected.avatarUrl}
              alt={currentSelected.name}
              className="w-12 h-12 rounded-full object-cover border border-pink-400/50 shrink-0"
            />
            <div className="flex-grow min-w-0">
              <p className="text-xs font-semibold text-pink-300">
                Selected: <span className="text-white font-bold">{currentSelected.name}</span> — {currentSelected.title}
              </p>
              <p className="text-[11px] text-gray-300 italic truncate">
                "{currentSelected.description}"
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="relative mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            Skip for now
          </button>
          <div className="w-full sm:w-auto flex items-center gap-3">
            <button
              onClick={handleConfirm}
              disabled={isSaving}
              className="w-full sm:w-auto px-7 py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 shadow-[0_0_20px_rgba(244,114,182,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isSaving ? 'Saving Avatar...' : 'Confirm Character & Enter'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

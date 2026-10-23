import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import confetti from 'canvas-confetti';
import { EyeOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { MagicalParticles } from './MagicalParticles.tsx';
import { TurquoiseDoor } from './TurquoiseDoor.tsx';
import { ThinkerbellCharacter, FairyStage } from './ThinkerbellCharacter.tsx';
import { ExploreCollectionButton } from './ExploreCollectionButton.tsx';
import { CollectionGarden } from './CollectionGarden.tsx';
import { ThinkerbellDialogue } from './ThinkerbellDialogue.tsx';

interface EnchantedWelcomePageProps {
  onEnterBoutique: (categoryFilter?: 'all' | 'short' | 'long' | 'featured') => void;
  onOpenAuth?: () => void;
}

export const EnchantedWelcomePage: React.FC<EnchantedWelcomePageProps> = ({
  onEnterBoutique,
  onOpenAuth
}) => {
  const { siteData } = useSite();
  const config = siteData.welcomePage;

  // Animation Stage Sequence:
  // WELCOME → FAIRY_APPROACHES_BUTTON → FAIRY_CLICKS_BUTTON → DOOR_OPENS → ENTER_COLLECTION_GARDEN → THINKERBELL_DIALOGUE → DRESS_COLLECTION
  const [stage, setStage] = useState<FairyStage>('WELCOME');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [speechHint, setSpeechHint] = useState<string>("Welcome! I'm guiding you to our dress collection ✨");
  const [doorPhysicallyOpen, setDoorPhysicallyOpen] = useState(false);
  const [gardenZoomLevel, setGardenZoomLevel] = useState(1);
  const [showDialoguePanel, setShowDialoguePanel] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const hasTriggeredRef = useRef(false);

  // Synthesize ethereal magical chimes using Web Audio API when user enables audio or on clicks
  const playMagicalChime = (type: 'sparkle' | 'door') => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'sparkle') {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.45);
        });
      } else {
        // Low warm ambient portal hum
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(146.83, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.8);
      }
    } catch {
      // Safe fallback if audio blocked
    }
  };

  // STEP 1 — When welcome page loads: Thinkerbell appears, flies around, then approaches button
  useEffect(() => {
    const timer1 = setTimeout(() => {
      if (!hasTriggeredRef.current) {
        setStage('FAIRY_APPROACHES_BUTTON');
        setSpeechHint('Follow me! Let us explore the gown collection ✨');
      }
    }, 2400);

    // STEP 2 — Thinkerbell arrives beside button and clicks it automatically after reaching it
    const timer2 = setTimeout(() => {
      if (!hasTriggeredRef.current) {
        triggerButtonClick('fairy');
      }
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Coordinated Button Click Handler (Can be triggered by Thinkerbell OR directly by customer)
  const triggerButtonClick = (origin: 'fairy' | 'customer') => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    setStage('FAIRY_CLICKS_BUTTON');
    playMagicalChime('sparkle');

    if (origin === 'customer') {
      setSpeechHint('Wonderful choice! Opening the enchanted door for you ✨');
    } else {
      setSpeechHint('Opening the enchanted turquoise door ✨');
    }

    // Sparkle starburst particle burst at button
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2dd4bf', '#f472b6', '#fef08a', '#ffffff']
      });
    } catch {
      // safe fallback
    }

    // STEP 3 — The single turquoise door visibly physically opens!
    setTimeout(() => {
      setStage('DOOR_OPENS');
      setDoorPhysicallyOpen(true);
      playMagicalChime('door');

      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#14b8a6', '#f472b6', '#d4af37', '#ffffff']
        });
      } catch {
        // safe fallback
      }
    }, 600);

    // STEP 4 — Move viewpoint smoothly forward through doorway into glowing collection garden
    setTimeout(() => {
      setStage('ENTER_COLLECTION_GARDEN');
      setGardenZoomLevel(1.4);
    }, 2400);

    // STEP 5 — Thinkerbell's dialogue appears in the glowing collection garden
    setTimeout(() => {
      setStage('THINKERBELL_DIALOGUE');
      setShowDialoguePanel(true);
    }, 3800);
  };

  // Skip Intro Option (Immediate bypass for accessibility / reduced motion)
  const handleSkipIntro = () => {
    hasTriggeredRef.current = true;
    onEnterBoutique();
  };

  const handleFinishSequence = (cat?: 'all' | 'short' | 'long' | 'featured') => {
    setStage('DRESS_COLLECTION');
    onEnterBoutique(cat);
  };

  const bgImage = config.bgImageUrl || '/src/assets/images/enchanted_teal_door_garden_1791999912250.jpg';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none bg-black flex flex-col justify-between">
      {/* 1. Surrounding Stable Enchanted Garden Background */}
      {/* Garden remains stationary; camera zoom effect applies only during portal passage */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-[1600ms] ease-out transform ${
          stage === 'ENTER_COLLECTION_GARDEN'
            ? 'scale-[2.4] opacity-25 filter blur-[6px]'
            : stage === 'THINKERBELL_DIALOGUE'
            ? 'opacity-0 pointer-events-none'
            : 'scale-100 opacity-100'
        }`}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Soft mystical purple, pink, and teal lighting overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090d]/90 via-transparent to-[#09090d]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-500/10 via-[#3b0764]/20 to-[#022c22]/30 pointer-events-none" />
      </div>

      {/* 2. Floating Magical Particles & Fairy Dust */}
      <MagicalParticles count={32} />

      {/* 3. Top Controls: Lady's Rental Brand, Audio Toggle & Skip Intro */}
      <div className="relative z-40 px-4 sm:px-8 py-5 flex items-center justify-between">
        {/* Boutique Brand */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-300 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="font-serif tracking-widest text-lg sm:text-xl font-bold text-white drop-shadow">
            LADY'S RENTAL
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 text-xs rounded-full bg-black/60 hover:bg-black/90 text-pink-200 border border-teal-400/30 backdrop-blur-md transition-all cursor-pointer"
            title={audioEnabled ? 'Mute fairy chimes' : 'Enable magical fairy chimes'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-teal-300" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>

          <button
            onClick={handleSkipIntro}
            className="px-3.5 py-1.5 text-xs font-semibold text-pink-100/90 bg-black/60 hover:bg-black/90 hover:text-white border border-teal-400/40 rounded-full backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            title="Skip directly to dress catalog"
          >
            <EyeOff className="w-3.5 h-3.5 text-teal-300" />
            <span>Skip Intro</span>
          </button>
        </div>
      </div>

      {/* 4. THE SINGLE TURQUOISE DOOR IN CENTER */}
      {/* Kept stable and physically opened via 3D panel swing */}
      <div
        className={`relative z-20 my-auto flex flex-col items-center justify-center transition-all duration-[1400ms] ${
          stage === 'ENTER_COLLECTION_GARDEN'
            ? 'scale-[2.8] opacity-30 filter blur-sm pointer-events-none'
            : stage === 'THINKERBELL_DIALOGUE'
            ? 'opacity-0 scale-[3] pointer-events-none hidden'
            : 'scale-100 opacity-100'
        }`}
      >
        <TurquoiseDoor isOpen={doorPhysicallyOpen} />
      </div>

      {/* 5. STEP 4 & 5 DESTINATION: GLOWING COLLECTION GARDEN */}
      {stage === 'ENTER_COLLECTION_GARDEN' || stage === 'THINKERBELL_DIALOGUE' ? (
        <CollectionGarden
          opacity={stage === 'THINKERBELL_DIALOGUE' ? 1 : 0.85}
          scale={gardenZoomLevel}
        />
      ) : null}

      {/* 6. THINKERBELL FAIRY CHARACTER (Real animated wings, flight path & gestures) */}
      <ThinkerbellCharacter
        stage={stage}
        speechMessage={speechHint}
        showSpeech={stage === 'WELCOME' || stage === 'FAIRY_APPROACHES_BUTTON'}
        onFairyClick={() => {
          if (!hasTriggeredRef.current) {
            triggerButtonClick('fairy');
          }
        }}
      />

      {/* 7. STEP 5 — THINKERBELL'S DIALOGUE PANEL */}
      {showDialoguePanel && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
          <ThinkerbellDialogue
            onDismiss={() => handleFinishSequence()}
            onSelectCategory={(cat) => handleFinishSequence(cat)}
          />
        </div>
      )}

      {/* 8. BOTTOM HERO SECTION & "EXPLORE COLLECTION" BUTTON */}
      {stage !== 'ENTER_COLLECTION_GARDEN' && stage !== 'THINKERBELL_DIALOGUE' && (
        <div className="relative z-30 pb-10 sm:pb-14 px-4 flex flex-col items-center justify-center text-center">
          <div className="max-w-md mx-auto bg-black/75 backdrop-blur-md border border-teal-500/30 rounded-3xl p-5 sm:p-6 shadow-[0_15px_50px_rgba(0,0,0,0.85)]">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-pink-200 to-teal-200 tracking-tight">
              Lady's Rental
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 font-light">
              Your Magical Dress Experience Begins Here.
            </p>

            {/* The "Explore Collection" Button */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <ExploreCollectionButton
                ref={buttonRef}
                onClick={() => triggerButtonClick('customer')}
                isTriggered={hasTriggeredRef.current}
                isFairyHoveringNear={stage === 'FAIRY_APPROACHES_BUTTON' || stage === 'FAIRY_CLICKS_BUTTON'}
              />

              {onOpenAuth && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-4 py-2 text-xs font-semibold text-pink-200 hover:text-white bg-white/5 hover:bg-white/10 border border-teal-400/30 rounded-full transition-all cursor-pointer"
                >
                  Customer Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

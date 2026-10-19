import React, { useState, useRef } from 'react';
import { Dress, SizeMeasurement, VideoMedia } from '../../types.ts';
import { useSite } from '../../context/SiteContext.tsx';
import {
  X,
  Upload,
  Play,
  Trash2,
  Check,
  Star,
  Plus,
  ArrowLeft,
  ArrowRight,
  Video,
  Image as ImageIcon,
  AlertCircle,
  Palette,
  Sparkles
} from 'lucide-react';

interface DressEditorModalProps {
  initialDress?: Dress | null;
  onClose: () => void;
  onSave: (savedDress: Dress) => void;
}

export const DressEditorModal: React.FC<DressEditorModalProps> = ({
  initialDress,
  onClose,
  onSave
}) => {
  const { siteData, uploadMediaFiles } = useSite();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(initialDress);

  const [id, setId] = useState(initialDress?.id || `LR-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState(initialDress?.name || '');
  const [designer, setDesigner] = useState(initialDress?.designer || "Lady's Rental Atelier");
  const [description, setDescription] = useState(initialDress?.description || '');
  const [category, setCategory] = useState(initialDress?.category || siteData.categories[0]?.slug || 'gala-black-tie');
  
  // Mandatory: Short Dress or Long Dress
  const [lengthCategory, setLengthCategory] = useState<'short' | 'long'>(initialDress?.lengthCategory || 'long');
  const [color, setColor] = useState(initialDress?.color || 'Champagne Gold');
  const [style, setStyle] = useState(initialDress?.style || 'Gown');
  const [condition, setCondition] = useState<'Pristine' | 'Excellent' | 'Good'>(initialDress?.condition || 'Pristine');

  // Media state
  const [photos, setPhotos] = useState<string[]>(initialDress?.photos || []);
  const [coverPhoto, setCoverPhoto] = useState<string>(initialDress?.coverPhoto || '');
  const [frontView, setFrontView] = useState<string>(initialDress?.views?.front || '');
  const [backView, setBackView] = useState<string>(initialDress?.views?.back || '');
  const [sideView, setSideView] = useState<string>(initialDress?.views?.side || '');
  const [videos, setVideos] = useState<VideoMedia[]>(initialDress?.videos || []);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Occasions list
  const allOccasions = siteData.occasionsList || [
    'Photoshoot', 'Birthday', 'Debut', 'Wedding Guest', 'Bridesmaid', 'Formal Event', 'Graduation', 'Evening Party', 'Dinner Event', 'Special Celebration'
  ];
  const [occasions, setOccasions] = useState<string[]>(initialDress?.occasions || ['Formal Event', 'Debut']);

  // Styling & Makeup Suggestions
  const [makeupStyle, setMakeupStyle] = useState(initialDress?.stylingAdvice?.makeupStyle || 'Soft glamorous glow with warm gold highlights.');
  const [lipColor, setLipColor] = useState(initialDress?.stylingAdvice?.lipColor || 'Rosewood velvet nude.');
  const [hairstyle, setHairstyle] = useState(initialDress?.stylingAdvice?.hairstyle || 'Soft Hollywood waves with pearl hairpins.');
  const [stylingTip, setStylingTip] = useState(initialDress?.stylingAdvice?.tip || 'Pair with chandelier crystal earrings and metallic evening heels.');

  // Sizes & Measurements
  const [sizes, setSizes] = useState<SizeMeasurement[]>(
    initialDress?.sizes || [
      { size: 'US 2 / S', bust: '32-33 in', waist: '24-25 in', hips: '35 in', length: '60 in', inStock: true },
      { size: 'US 4 / M', bust: '34-35 in', waist: '26-27 in', hips: '37 in', length: '60 in', inStock: true },
      { size: 'US 6 / L', bust: '36-37 in', waist: '28-29 in', hips: '39 in', length: '61 in', inStock: true }
    ]
  );

  // Pricing in Philippine Pesos (₱)
  const [rentalPrice3Day, setRentalPrice3Day] = useState(initialDress?.rentalPrice3Day ?? 2500);
  const [rentalPrice5Day, setRentalPrice5Day] = useState(initialDress?.rentalPrice5Day ?? 3300);
  const [rentalPrice7Day, setRentalPrice7Day] = useState(initialDress?.rentalPrice7Day ?? 4000);
  const [extraDayRate, setExtraDayRate] = useState(initialDress?.extraDayRate ?? 400);
  const [securityDeposit, setSecurityDeposit] = useState(initialDress?.securityDeposit ?? 1500);
  const [cleaningFee, setCleaningFee] = useState(initialDress?.cleaningFee ?? 0);
  const [retailPrice, setRetailPrice] = useState(initialDress?.retailPrice ?? 28000);
  const [inventoryCount, setInventoryCount] = useState(initialDress?.inventoryCount ?? 3);

  // Badges & Visibility
  const [isAvailable, setIsAvailable] = useState(initialDress?.isAvailable ?? true);
  const [isFeatured, setIsFeatured] = useState(initialDress?.isFeatured ?? false);
  const [isNewArrival, setIsNewArrival] = useState(initialDress?.isNewArrival ?? true);
  const [isPopular, setIsPopular] = useState(initialDress?.isPopular ?? false);
  const [isVisible, setIsVisible] = useState(initialDress?.isVisible ?? true);

  // Upload Photo handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const res = await uploadMediaFiles(Array.from(files));
    if (res.success && res.urls.length > 0) {
      setPhotos(prev => {
        const updated = [...prev, ...res.urls];
        if (!coverPhoto && updated.length > 0) {
          setCoverPhoto(updated[0]);
        }
        if (!frontView) setFrontView(updated[0]);
        return updated;
      });
    } else {
      setUploadError(res.error || 'Failed to upload photo');
    }
    setIsUploading(false);
  };

  // Upload Video handler (MP4, WEBM, MOV)
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const res = await uploadMediaFiles(Array.from(files));
    if (res.success && res.urls.length > 0) {
      const newVideo: VideoMedia = {
        url: res.urls[0],
        title: files[0].name,
        thumbnail: coverPhoto || photos[0]
      };
      setVideos(prev => [...prev, newVideo]);
    } else {
      setUploadError(res.error || 'Failed to upload video');
    }
    setIsUploading(false);
  };

  const handleAddVideoByUrl = () => {
    if (!videoUrlInput.trim()) return;
    setVideos(prev => [
      ...prev,
      {
        url: videoUrlInput.trim(),
        title: 'Runway Video',
        thumbnail: coverPhoto || photos[0]
      }
    ]);
    setVideoUrlInput('');
  };

  const removePhoto = (idx: number) => {
    const targetUrl = photos[idx];
    const newPhotos = photos.filter((_, i) => i !== idx);
    setPhotos(newPhotos);
    if (coverPhoto === targetUrl) {
      setCoverPhoto(newPhotos[0] || '');
    }
  };

  const toggleOccasion = (occ: string) => {
    if (occasions.includes(occ)) {
      setOccasions(occasions.filter(o => o !== occ));
    } else {
      setOccasions([...occasions, occ]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please provide a dress name.');
      return;
    }

    if (photos.length === 0 && !coverPhoto) {
      alert('Please upload at least one photo for this dress.');
      return;
    }

    const dressToSave: Dress = {
      id,
      name,
      designer,
      description,
      category,
      lengthCategory,
      color,
      style,
      condition,
      photos,
      coverPhoto: coverPhoto || photos[0],
      videos,
      sizes,
      rentalPrice3Day: Number(rentalPrice3Day),
      rentalPrice5Day: Number(rentalPrice5Day),
      rentalPrice7Day: Number(rentalPrice7Day),
      extraDayRate: Number(extraDayRate),
      securityDeposit: Number(securityDeposit),
      cleaningFee: Number(cleaningFee),
      retailPrice: Number(retailPrice),
      inventoryCount: Number(inventoryCount),
      isAvailable,
      isFeatured,
      isNewArrival,
      isPopular,
      isVisible,
      occasions,
      stylingAdvice: {
        makeupStyle,
        lipColor,
        hairstyle,
        tip: stylingTip
      },
      views: {
        front: frontView || coverPhoto,
        back: backView,
        side: sideView
      }
    };

    onSave(dressToSave);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 text-left text-[#f5f0ea]">
      <div className="relative w-full max-w-4xl bg-[#0f0f15] border border-pink-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#14141c] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-500/10 text-pink-300">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">
                {isEditing ? `Edit Dress: ${name}` : 'Add New Dress to Atelier'}
              </h2>
              <p className="text-xs text-gray-400">
                Upload your camera photos/videos, set Philippine Peso 3-day pricing, and configure styling tips.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-grow">
          {uploadError && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200">
              {uploadError}
            </div>
          )}

          {/* 1. BASIC INFORMATION & LENGTH CATEGORY */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-pink-300">
              1. Basic Information & Length Category
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Dress ID *</label>
                <input
                  type="text"
                  required
                  value={id}
                  onChange={e => setId(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Dress Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. The Aurelia Silk Gown"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Designer / Atelier</label>
                <input
                  type="text"
                  value={designer}
                  onChange={e => setDesigner(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* MANDATORY: Short Dress vs Long Dress Selection */}
            <div>
              <label className="text-xs text-gray-400 block mb-1.5 font-bold">
                Length Category (Short vs Long) *
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setLengthCategory('short')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                    lengthCategory === 'short'
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-md'
                      : 'bg-black/40 text-gray-400 border-white/10 hover:text-white'
                  }`}
                >
                  <span>Short Dress (Cocktail / Mini)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLengthCategory('long')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                    lengthCategory === 'long'
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-md'
                      : 'bg-black/40 text-gray-400 border-white/10 hover:text-white'
                  }`}
                >
                  <span>Long Dress (Gala / Floor Length)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Occasion Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  {siteData.categories.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Primary Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  placeholder="e.g. Champagne Gold"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Silhouette Style</label>
                <input
                  type="text"
                  value={style}
                  onChange={e => setStyle(e.target.value)}
                  placeholder="e.g. Draped Cape, Ball Gown"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Full Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Detailed description of gown fabrics, cut, neckline, and train..."
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* 2. REAL PHONE & CAMERA PHOTOS & VIDEOS (Section 6 Requirement) */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-pink-300">
                2. Real Dress Photos & Videos (My Own Media)
              </h3>
              <span className="text-[10px] text-gray-400">
                Upload real photos & videos taken with your phone or camera
              </span>
            </div>

            {/* Photo Upload Area */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-pink-400" />
                  <span>Photo Gallery ({photos.length} uploaded)</span>
                </span>
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Photos from Phone/PC'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {photos.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-4 text-center">
                  No photos uploaded yet. Click upload to select photos from your device.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {photos.map((p, idx) => (
                    <div key={idx} className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-white/10">
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      {coverPhoto === p && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-pink-600 text-[8px] font-bold text-white">
                          Cover
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                        <button
                          type="button"
                          onClick={() => setCoverPhoto(p)}
                          className="text-[9px] px-1 py-0.5 rounded bg-white/20 text-white hover:bg-pink-600"
                        >
                          Make Cover
                        </button>
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="p-1 rounded bg-red-600/80 text-white hover:bg-red-600 self-end"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Front, Back, Side View assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Front View Photo</label>
                <select
                  value={frontView}
                  onChange={e => setFrontView(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                >
                  <option value="">Default to Cover</option>
                  {photos.map((p, i) => (
                    <option key={i} value={p}>Photo #{i + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Back View Photo</label>
                <select
                  value={backView}
                  onChange={e => setBackView(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                >
                  <option value="">None</option>
                  {photos.map((p, i) => (
                    <option key={i} value={p}>Photo #{i + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Side View Photo</label>
                <select
                  value={sideView}
                  onChange={e => setSideView(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                >
                  <option value="">None</option>
                  {photos.map((p, i) => (
                    <option key={i} value={p}>Photo #{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Video Upload Area */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-teal-400" />
                  <span>Dress Video ({videos.length})</span>
                </span>
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => videoInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Uploading Video...' : 'Upload Video File (MP4/WEBM)'}</span>
                </button>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </div>

              {/* Or Video URL */}
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={videoUrlInput}
                  onChange={e => setVideoUrlInput(e.target.value)}
                  placeholder="Or paste video MP4 URL..."
                  className="flex-grow px-3 py-1.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddVideoByUrl}
                  className="px-3 py-1.5 rounded-xl text-xs bg-white/10 hover:bg-white/20 text-white"
                >
                  Add URL
                </button>
              </div>

              {videos.length > 0 && (
                <div className="space-y-2">
                  {videos.map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-xl text-xs">
                      <span className="truncate max-w-md text-gray-300 font-mono">{v.title || v.url}</span>
                      <button
                        type="button"
                        onClick={() => setVideos(videos.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. THREE-DAY PRICING & INVENTORY IN PHILIPPINE PESOS (₱) */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-pink-300">
              3. Three-Day Rental Pricing & Deposits (Philippine Pesos ₱)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Standard 3-Day Rental (₱) *</label>
                <input
                  type="number"
                  required
                  value={rentalPrice3Day}
                  onChange={e => setRentalPrice3Day(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">5-Day Rental (₱)</label>
                <input
                  type="number"
                  value={rentalPrice5Day}
                  onChange={e => setRentalPrice5Day(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Security Deposit (₱)</label>
                <input
                  type="number"
                  value={securityDeposit}
                  onChange={e => setSecurityDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Physical Units in Stock</label>
                <input
                  type="number"
                  value={inventoryCount}
                  onChange={e => setInventoryCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* 4. OCCASION RECOMMENDATIONS */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-pink-300">
              4. Suitable Occasion Recommendations
            </h3>
            <p className="text-xs text-gray-400">
              Select which occasions are suitable for this dress (e.g. Debut, Photoshoot, Wedding Guest).
            </p>
            <div className="flex flex-wrap gap-2">
              {allOccasions.map(occ => {
                const isSelected = occasions.includes(occ);
                return (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => toggleOccasion(occ)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-pink-500/20 text-pink-300 border-pink-400 shadow-sm'
                        : 'bg-black/40 text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                    <span>{occ}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. STYLING & MAKEUP SUGGESTIONS */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              <span>5. Styling, Makeup & Hair Suggestions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Makeup Style Suggestion</label>
                <input
                  type="text"
                  value={makeupStyle}
                  onChange={e => setMakeupStyle(e.target.value)}
                  placeholder="e.g. Soft champagne glow"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Lip Color Recommendation</label>
                <input
                  type="text"
                  value={lipColor}
                  onChange={e => setLipColor(e.target.value)}
                  placeholder="e.g. Rosewood nude gloss"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Hairstyle Recommendation</label>
                <input
                  type="text"
                  value={hairstyle}
                  onChange={e => setHairstyle(e.target.value)}
                  placeholder="e.g. High ponytail with waves"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Stylist Advice Note</label>
              <input
                type="text"
                value={stylingTip}
                onChange={e => setStylingTip(e.target.value)}
                placeholder="e.g. Pair with chandelier crystal earrings and strappy metallic heels..."
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          {/* 6. STATUS & VISIBILITY */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-pink-300">
              6. Availability & Showcase Flags
            </h3>

            <div className="flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={e => setIsAvailable(e.target.checked)}
                  className="accent-pink-500 rounded"
                />
                <span>Available for Rent</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="accent-pink-500 rounded"
                />
                <span>Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={e => setIsNewArrival(e.target.checked)}
                  className="accent-pink-500 rounded"
                />
                <span>New Arrival Badge</span>
              </label>
            </div>
          </div>

          {/* Footer Save Action */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-600 via-rose-600 to-teal-500 hover:from-pink-500 hover:to-teal-400 shadow-lg cursor-pointer"
            >
              {isEditing ? 'Save Dress Changes' : 'Create & Publish Dress'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

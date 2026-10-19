import React, { useState, useRef } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import { MediaItem } from '../../types.ts';
import {
  Upload,
  Search,
  Filter,
  Play,
  Trash2,
  Eye,
  AlertTriangle,
  Check,
  Video,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

export const MediaLibrary: React.FC = () => {
  const { siteData, uploadMediaFiles, deleteMedia } = useSite();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedPreview, setSelectedPreview] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<{ item: MediaItem; error: string } | null>(null);

  // Filtered media
  const mediaItems = siteData.mediaLibrary.filter(item => {
    if (mediaTypeFilter !== 'all' && item.type !== mediaTypeFilter) return false;
    if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setStatusMessage(null);

    const res = await uploadMediaFiles(Array.from(files));
    if (res.success) {
      setStatusMessage(`Successfully uploaded ${files.length} file(s) to atelier library.`);
    } else {
      setStatusMessage(`Upload failed: ${res.error}`);
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (item: MediaItem, force = false) => {
    const res = await deleteMedia(item.id, force);
    if (res.success) {
      setDeleteWarning(null);
      if (selectedPreview?.id === item.id) setSelectedPreview(null);
    } else {
      setDeleteWarning({ item, error: res.error || 'Failed to delete media.' });
    }
  };

  return (
    <div className="space-y-6 text-left text-xs">
      {/* Header & Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
        <div>
          <h2 className="text-xl font-serif text-white">Atelier Media Library</h2>
          <p className="text-neutral-400 mt-1">
            Real photos and videos uploaded from your camera or computer. Linked to dresses automatically.
          </p>
        </div>

        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-5 py-2.5 bg-[#c9a86a] text-black font-semibold uppercase tracking-wider rounded hover:bg-[#dfb15b] transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload Photos or Videos'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-[#151520] border border-[#c9a86a]/30 text-[#c9a86a] rounded flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-xs text-neutral-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Delete Warning Modal / Alert */}
      {deleteWarning && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-lg text-amber-200 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="font-semibold">{deleteWarning.error}</span>
          </div>
          <p className="text-[11px] text-amber-300">
            Deleting this media will remove it from all linked dresses. Are you sure you wish to permanently delete it?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleDelete(deleteWarning.item, true)}
              className="px-3 py-1.5 bg-red-600 text-white font-medium rounded hover:bg-red-700"
            >
              Force Delete Anyway
            </button>
            <button
              onClick={() => setDeleteWarning(null)}
              className="px-3 py-1.5 bg-white/10 text-white rounded hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#14141c] border border-white/10 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media files by name..."
            className="w-full pl-9 pr-3 py-2 bg-[#181820] text-xs text-white border border-white/10 rounded focus:border-[#c9a86a] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMediaTypeFilter('all')}
            className={`px-3 py-1.5 rounded transition-colors uppercase tracking-wider text-[11px] ${
              mediaTypeFilter === 'all'
                ? 'bg-[#c9a86a] text-black font-semibold'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            All Media ({siteData.mediaLibrary.length})
          </button>
          <button
            onClick={() => setMediaTypeFilter('image')}
            className={`px-3 py-1.5 rounded transition-colors uppercase tracking-wider text-[11px] flex items-center gap-1 ${
              mediaTypeFilter === 'image'
                ? 'bg-[#c9a86a] text-black font-semibold'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photos</span>
          </button>
          <button
            onClick={() => setMediaTypeFilter('video')}
            className={`px-3 py-1.5 rounded transition-colors uppercase tracking-wider text-[11px] flex items-center gap-1 ${
              mediaTypeFilter === 'video'
                ? 'bg-[#c9a86a] text-black font-semibold'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos</span>
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {mediaItems.length === 0 ? (
        <div className="p-16 border border-dashed border-white/10 rounded-lg text-center text-neutral-400">
          <p>No media files match your search criteria.</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-[#c9a86a] underline text-xs uppercase tracking-wider"
          >
            Upload Real Dress Files Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaItems.map((item) => {
            const linkedDresses = siteData.dresses.filter(d =>
              item.linkedDressIds.includes(d.id) ||
              d.photos.includes(item.url) ||
              d.coverPhoto === item.url ||
              d.videos.some(v => v.url === item.url)
            );

            return (
              <div
                key={item.id}
                className="group relative bg-[#14141c] border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#c9a86a]/40 transition-colors"
              >
                {/* Visual Thumbnail */}
                <div
                  onClick={() => setSelectedPreview(item)}
                  className="relative aspect-square bg-black overflow-hidden cursor-pointer"
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black/80">
                      <video src={item.url} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-black/60 text-[#c9a86a] flex items-center justify-center">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white uppercase font-medium">
                    {item.type}
                  </div>

                  {/* Linked Dress Indicator */}
                  {linkedDresses.length > 0 && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm p-1 rounded text-[10px] text-[#c9a86a] truncate">
                      Used in {linkedDresses.map(d => d.name).join(', ')}
                    </div>
                  )}
                </div>

                {/* Info Bar */}
                <div className="p-2.5 flex items-center justify-between border-t border-white/5">
                  <div className="overflow-hidden mr-2">
                    <p className="text-[11px] text-white truncate font-medium">{item.name}</p>
                    <p className="text-[10px] text-neutral-500 font-mono">
                      {(item.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors shrink-0"
                    title="Delete media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#111117] border border-white/15 rounded-xl shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#c9a86a] font-medium">{selectedPreview.type}</p>
                <h3 className="text-base font-serif text-white">{selectedPreview.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPreview(null)}
                className="p-2 text-neutral-400 hover:text-white rounded-full bg-white/5"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video max-h-[480px] bg-black rounded overflow-hidden flex items-center justify-center">
              {selectedPreview.type === 'video' ? (
                <video src={selectedPreview.url} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <img src={selectedPreview.url} alt={selectedPreview.name} className="w-full h-full object-contain" />
              )}
            </div>

            <div className="p-3 bg-[#181822] rounded text-xs space-y-1">
              <p className="text-neutral-400">
                Persistent URL: <span className="font-mono text-[#c9a86a]">{selectedPreview.url}</span>
              </p>
              <p className="text-neutral-400">
                Uploaded: <span className="text-white">{new Date(selectedPreview.uploadedAt).toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

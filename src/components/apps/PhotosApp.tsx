import { useState, memo } from 'react';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import shrawanPic from '../../assets/shrawan.jpg';

const photoData = [
  { id: 1, url: shrawanPic, title: 'Moment 1' },
];

export const PhotosApp = memo(() => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % photoData.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + photoData.length) % photoData.length);
    }
  };

  return (
    <div className={`h-full w-full flex flex-col bg-white dark:bg-[#0f172a] font-sans relative ${isMobile ? 'mobile-content-shift' : ''}`} style={{ zIndex: 10 }}>
      {/* Gallery Header */}
      {!isMobile && (
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <Camera className="w-5 h-5 text-pink-500" />
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest">Memories Gallery</h2>
          <span className="ml-auto text-xs text-gray-400 font-medium">{photoData.length} Photos</span>
        </div>
      )}

      {/* Grid Layout - Render Optimistically */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-6">
        <div className={`grid ${isMobile ? 'grid-cols-3 gap-1.5' : 'grid-cols-4 gap-4'}`}>
          {photoData.map((photo, idx) => (
            <PhotoItem key={photo.id} photo={photo} onClick={() => setSelectedIdx(idx)} />
          ))}
        </div>
      </div>

      {/* Lightbox / Full-screen View */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[9999999] flex items-center justify-center p-0 md:p-10 ${isMobile ? 'bg-black' : 'bg-black/90 backdrop-blur-md'}`}
            onClick={() => setSelectedIdx(null)}
          >
            {/* Control Icons Overlay */}
            <button
              className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors z-[10]"
              onClick={(e) => { e.stopPropagation(); setSelectedIdx(null); }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows (Desktop Only) */}
            {!isMobile && (
              <>
                <button
                  className="absolute left-10 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[10]"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  className="absolute right-10 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[10]"
                  onClick={handleNext}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Main Image View */}
            <motion.div
              layoutId={photoData[selectedIdx].id.toString()}
              className={`relative ${isMobile ? 'w-full h-full flex items-center justify-center' : 'max-w-5xl max-h-full'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photoData[selectedIdx].url}
                alt={photoData[selectedIdx].title}
                className={`${isMobile ? 'w-full max-h-full object-contain' : 'rounded-2xl shadow-2xl border-2 border-white/20'}`}
              />
              {!isMobile && (
                <div className="absolute -bottom-16 left-0 right-0 text-center">
                  <p className="text-white text-lg font-bold tracking-tight">{photoData[selectedIdx].title}</p>
                  <p className="text-white/50 text-xs mt-1 uppercase tracking-widest">{selectedIdx + 1} / {photoData.length}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Memoized individual photo item to manage local "loaded" state
const PhotoItem = memo(({ photo, onClick }: { photo: any, onClick: () => void }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer rounded-xl bg-gray-100 dark:bg-white/5 shadow-sm border border-black/5 aspect-square w-full`}
    >
      {/* Skeleton Placeholder */}
      <div className={`absolute inset-0 bg-white/5 animate-pulse ${loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} />

      <img
        src={photo.url}
        alt={photo.title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 hover:brightness-110 ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
    </motion.div>
  );
});

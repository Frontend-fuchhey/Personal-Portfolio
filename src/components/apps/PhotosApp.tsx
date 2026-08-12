import { useState, useEffect, memo, useMemo } from "react";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const galleryCategories = ["All", "Tech Team", "Events & Moments", "Projects & Hackathons"];

const galleryItems = [
  {
    id: "01",
    category: "Tech Team",
    subCategory: "BEHIND THE SCENES",
    date: "February 2026",
    title: "Rato Topi Technical Support Operations",
    description: "Managing network infrastructure, web portals, live evaluation tools, and technical logistics during event operations.",
    image: "https://placehold.co/600x400/1e293b/ffffff?text=Image+A",
    tags: ["Network Routing", "Web Portals", "Rato Topi"]
  },
  {
    id: "02",
    category: "Events & Moments",
    subCategory: "EVENT PHOTOGRAPH",
    date: "January 2026",
    title: "GPLC Intellect Award Ceremony & Champions",
    description: "Celebrating with champions, faculty, and administration during the grand finale and awards distribution.",
    image: "https://placehold.co/600x400/0f172a/ffffff?text=Image+B",
    tags: ["GPLC Intellect", "Recognition"]
  },
  {
    id: "03",
    category: "Events & Moments",
    subCategory: "SUMMIT HIGHLIGHT",
    date: "December 2025",
    title: "AI Summit Nepal — Kathmandu",
    description: "Engaging with industry leaders and technical teams at AI Summit Nepal, discussing autonomous agent architectures and frontend systems.",
    image: "https://placehold.co/600x400/334155/ffffff?text=Image+C",
    tags: ["AI Summit", "Kathmandu"]
  },
  {
    id: "04",
    category: "Projects & Hackathons",
    subCategory: "HACKATHON MOMENT",
    date: "October 2025",
    title: "National AI Hackathon Highlights",
    description: "Participating and building full-stack interactive prototypes in competitive team environments.",
    image: "https://placehold.co/600x400/475569/ffffff?text=Image+D",
    tags: ["Hackathon", "AWS", "AI"]
  }
];

export const PhotosApp = memo(() => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % filteredItems.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  // Reset selected image index when category changes to avoid overflow index issues
  useEffect(() => {
    setSelectedIdx(null);
  }, [activeCategory]);

  // Keyboard navigation support in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        setSelectedIdx(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, filteredItems]);

  return (
    <div
      className={`h-full w-full flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans relative ${isMobile ? "mobile-content-shift" : ""}`}
      style={{ zIndex: 10 }}
    >
      {/* Gallery Header & Navigation Wrapper */}
      <div
        className="flex-1 overflow-y-auto p-4 md:p-6 pb-16 custom-scrollbar"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <span className="text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase block mb-1">
            GALLERY / MEMORIES & CREATIONS
          </span>
          <h2 className="text-xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <Camera className="w-5 h-5 md:w-7 md:h-7 text-pink-500" />
            Moments & Creations Gallery
          </h2>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            Exploring the visual journey of milestone tech operations, project hackathons, leadership summits, and team milestones in software development.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 border-b border-zinc-200/60 dark:border-zinc-800/40 pb-4">
          <div
            className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1 scrollbar-none touch-pan-x"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {galleryCategories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-semibold scale-102"
                      : "bg-zinc-100 hover:bg-zinc-200/80 text-zinc-600 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 dark:text-zinc-400 border border-zinc-200/40 dark:border-zinc-800/30"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* OS-THEMED CARD GRID */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredItems.map((item, idx) => (
              <PhotoCard
                key={item.id}
                item={item}
                onClick={() => setSelectedIdx(idx)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500">
            <p className="text-sm">No items found in this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox / Full-screen View */}
      <AnimatePresence>
        {selectedIdx !== null && filteredItems[selectedIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999999 flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedIdx(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer"
              onClick={() => setSelectedIdx(null)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Lightbox Content Container */}
            <div
              className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[70vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Side: Image display */}
              <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden p-4 group">
                <img
                  src={filteredItems[selectedIdx].image}
                  alt={filteredItems[selectedIdx].title}
                  className="max-w-full max-h-full object-contain rounded-lg select-none"
                />

                {/* Navigation Arrows */}
                <button
                  className="absolute left-4 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 hover:scale-105 z-10 cursor-pointer"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  className="absolute right-4 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 hover:scale-105 z-10 cursor-pointer"
                  onClick={handleNext}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Right Side: Details pane */}
              <div className="w-full md:w-80 bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800/80 p-6 flex flex-col justify-between overflow-y-auto">
                <div>
                  {/* Category & Index */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      {filteredItems[selectedIdx].id} / {filteredItems[selectedIdx].subCategory}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium">
                      {filteredItems[selectedIdx].date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-zinc-100 mb-3 leading-snug">
                    {filteredItems[selectedIdx].title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-zinc-400 leading-relaxed mb-6">
                    {filteredItems[selectedIdx].description}
                  </p>
                </div>

                {/* Tags & Footer */}
                <div className="border-t border-zinc-800/80 pt-4 mt-4">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-2">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {filteredItems[selectedIdx].tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-medium border border-zinc-700/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Counter */}
                  <div className="text-center text-[10px] text-zinc-500 uppercase tracking-widest mt-6">
                    {selectedIdx + 1} of {filteredItems.length}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Photo Card component
const PhotoCard = memo(
  ({
    item,
    onClick,
  }: {
    item: typeof galleryItems[0];
    onClick: () => void;
  }) => {
    const [loaded, setLoaded] = useState(false);

    return (
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="group flex flex-col bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer p-4 h-full"
      >
        {/* Top Image Container */}
        <div className="relative rounded-xl overflow-hidden aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800/50 mb-4">
          {/* Skeleton Loader */}
          <div
            className={`absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse ${loaded ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          />

          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"}`}
          />
        </div>

        {/* Metadata Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {item.id} / {item.subCategory}
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
            {item.date}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-1.5 leading-snug line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-3 leading-relaxed">
          {item.description}
        </p>

        {/* Tags Footer */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-md font-medium border border-zinc-200/50 dark:border-zinc-700/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    );
  },
);

import { useState, useRef } from 'react';
import { Monitor, Info, Check, ImagePlus } from 'lucide-react';
import { Wallpaper } from "../../types/os";
import { WALLPAPERS } from "../../data/wallpapers";

interface SettingsAppProps {
  wallpaper: Wallpaper;
  onWallpaperChange: (w: Wallpaper) => void;
  showClock: boolean;
  onShowClockChange: (s: boolean) => void;
}

export function SettingsApp({ 
  wallpaper, 
  onWallpaperChange,
  showClock,
  onShowClockChange
}: SettingsAppProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onWallpaperChange({
        id: 'custom-upload',
        name: 'Custom',
        value: dataUrl,
        type: 'url'
      });
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input so same file can be selected again
  };

  const hasCustomWallpaper = wallpaper.id === 'custom-upload';
  const displayWallpapers = [...WALLPAPERS.slice(0, 3)];
  if (hasCustomWallpaper) {
    displayWallpapers.push(wallpaper);
  }

  return (
    <div className="h-full w-full overflow-y-auto p-6 bg-white/70 backdrop-blur-2xl font-sans flex flex-col gap-8">
      
      {/* 1. Appearance Section */}
      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          Appearance
        </h3>

        <div className={`grid gap-3 mb-4 ${hasCustomWallpaper ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {displayWallpapers.map((wp) => (
            <button
              key={wp.id}
              onClick={() => onWallpaperChange(wp)}
              className={`relative h-20 rounded-xl overflow-hidden shadow-sm transition-transform active:scale-95 cursor-pointer ${
                wallpaper.id === wp.id ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:opacity-90 outline outline-1 outline-black/5 hover:outline-black/10'
              }`}
              style={
                wp.type === 'url' 
                  ? { backgroundImage: `url(${wp.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : { background: wp.value }
              }
            >
              {wallpaper.id === wp.id && (
                <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-blue-500" strokeWidth={3} />
                  </div>
                </div>
              )}
              <span className="absolute bottom-1.5 left-0 right-0 text-center text-white text-[10px] font-bold tracking-wide drop-shadow-md">
                {wp.name}
              </span>
            </button>
          ))}
        </div>

        <input 
          type="file" 
          accept="image/jpeg, image/png, image/webp" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload} 
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <ImagePlus className="w-4 h-4 text-gray-500" />
            Upload Custom Wallpaper
          </div>
          <span className="text-[10px] text-gray-400 mt-1">Supports JPG, PNG, or WebP.</span>
        </button>
      </section>

      {/* 2. General Settings Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Monitor className="w-4 h-4 text-blue-500" />
          General Settings
        </h3>
        <div className="bg-white/80 rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200/60">
            <span className="text-sm font-medium text-gray-700">Show Menu Bar Clock</span>
            <button 
              onClick={() => onShowClockChange(!showClock)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out shadow-inner ${showClock ? 'bg-blue-500' : 'bg-gray-300'}`}
              aria-label="Toggle Menu Bar Clock"
            >
              <div className={`absolute top-0.5 bottom-0.5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ease-spring ${showClock ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <div>
              <span className="text-sm font-medium text-gray-700 block">Reduce Motion</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Disable UI animations</span>
            </div>
            <button 
              onClick={() => setReduceMotion(!reduceMotion)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out shadow-inner ${reduceMotion ? 'bg-blue-500' : 'bg-gray-300'}`}
              aria-label="Toggle Reduce Motion"
            >
              <div className={`absolute top-0.5 bottom-0.5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ease-spring ${reduceMotion ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. System Identity Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          System Identity
        </h3>
        <div className="bg-white/80 rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
          {[
            ['OS Platform', 'Shrawan OS 2.0'],
            ['Engine', 'React v18'],
            ['Logic', 'TypeScript'],
            ['Distro', 'Premium Edition']
          ].map(([label, value], i, arr) => (
            <div 
              key={label} 
              className={`flex items-center justify-between p-3.5 px-4 ${i !== arr.length - 1 ? 'border-b border-gray-200/60' : ''}`}
            >
              <span className="text-xs text-gray-500 font-medium">{label}</span>
              <span className="text-sm font-semibold text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

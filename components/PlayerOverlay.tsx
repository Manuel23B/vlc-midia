
import React, { useState, useRef, useEffect, TouchEvent } from 'react';
import { MediaItem } from '../types';
import { 
  X, Play, Pause, SkipBack, SkipForward, Volume2, 
  Maximize, Settings, Info, Sparkles, Sun, 
  ChevronRight, Lock, Unlock, RotateCw, Timer
} from 'lucide-react';
import { getMediaInsights } from '../services/geminiService';

interface PlayerOverlayProps {
  item: MediaItem;
  onClose: () => void;
}

const PlayerOverlay: React.FC<PlayerOverlayProps> = ({ item, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [insights, setInsights] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(80);
  const [gestureType, setGestureType] = useState<'volume' | 'brightness' | null>(null);
  const [gestureValue, setGestureValue] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const touchStartRef = useRef<{ y: number; val: number } | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    fetchInsights();
    autoHideControls();
    return () => {
      if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    };
  }, [item]);

  const autoHideControls = () => {
    if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    if (!isPlaying) return;
    controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 4000);
  };

  const fetchInsights = async () => {
    const text = await getMediaInsights(item);
    setInsights(text);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isLocked) return;
    const media = item.type === 'video' ? videoRef.current : audioRef.current;
    if (media) {
      if (isPlaying) media.pause();
      else media.play();
      setIsPlaying(!isPlaying);
      if (!isPlaying) autoHideControls();
    }
  };

  const handleTimeUpdate = () => {
    const media = item.type === 'video' ? videoRef.current : audioRef.current;
    if (media) {
      setProgress((media.currentTime / media.duration) * 100);
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (isLocked) return;
    setShowControls(true);
    const touch = e.touches[0];
    const width = window.innerWidth;
    const type = touch.clientX < width / 2 ? 'brightness' : 'volume';
    touchStartRef.current = { 
      y: touch.clientY, 
      val: type === 'brightness' ? brightness : volume 
    };
    setGestureType(type);
    setGestureValue(type === 'brightness' ? brightness : volume);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isLocked || !touchStartRef.current) return;
    const touch = e.touches[0];
    const deltaY = touchStartRef.current.y - touch.clientY;
    const change = Math.round((deltaY / window.innerHeight) * 100);
    const newVal = Math.max(0, Math.min(100, touchStartRef.current.val + change));
    
    if (gestureType === 'brightness') setBrightness(newVal);
    else setVolume(newVal);
    setGestureValue(newVal);
  };

  const handleTouchEnd = () => {
    setGestureType(null);
    touchStartRef.current = null;
    autoHideControls();
  };

  return (
    <div 
      className="fixed inset-0 bg-black z-[100] flex flex-col select-none overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        if (isLocked) setShowControls(true);
        else setShowControls(!showControls);
        autoHideControls();
      }}
    >
      {/* Brightness Overlay (Simulation) */}
      <div 
        className="fixed inset-0 pointer-events-none bg-black transition-opacity duration-300" 
        style={{ opacity: 1 - (brightness / 100) }}
      />

      {/* Gesture HUD */}
      {gestureType && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-black/60 backdrop-blur-md rounded-2xl p-6 z-50 animate-in fade-in zoom-in duration-200">
          {gestureType === 'brightness' ? <Sun size={48} className="text-orange-500 mb-2" /> : <Volume2 size={48} className="text-orange-500 mb-2" />}
          <span className="text-2xl font-bold">{gestureValue}%</span>
        </div>
      )}

      {/* Header */}
      <div className={`flex items-center justify-between p-4 pt-12 bg-gradient-to-b from-black/90 to-transparent absolute top-0 left-0 right-0 z-40 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2.5 rounded-full bg-white/10 text-white backdrop-blur-sm active:bg-white/20">
          <X size={24} />
        </button>
        <div className="flex-1 px-4 text-center">
          <h2 className="text-sm font-bold truncate tracking-wide">{item.title}</h2>
          {item.artist && <p className="text-[10px] text-slate-400 truncate uppercase tracking-widest mt-0.5">{item.artist}</p>}
        </div>
        <button className="p-2.5 rounded-full bg-white/10 text-white backdrop-blur-sm active:bg-white/20">
          <Settings size={20} />
        </button>
      </div>

      {/* Media Content */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 relative">
        {item.type === 'video' ? (
          <video
            ref={videoRef}
            src={item.url}
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            className="w-full max-h-screen object-contain"
            playsInline
          />
        ) : (
          <div className="w-full px-8 flex flex-col items-center animate-in zoom-in duration-700">
            <div className="relative">
              <img src={item.thumbnail} alt={item.title} className="w-72 h-72 rounded-3xl shadow-2xl mb-12 object-cover border-2 border-white/5" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl" />
            </div>
            <audio ref={audioRef} src={item.url} autoPlay onTimeUpdate={handleTimeUpdate} />
          </div>
        )}

        {/* AI Insight Overlay - Minimalist Bottom Side */}
        {insights && !isLocked && (
          <div className={`absolute bottom-40 left-6 right-6 bg-slate-900/60 border border-white/10 backdrop-blur-xl p-4 rounded-2xl transition-all duration-500 shadow-2xl ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
            <div className="flex items-center gap-2 mb-1.5 text-orange-400">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">VLC Brain</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium italic">"{insights}"</p>
          </div>
        )}
      </div>

      {/* Lock Button (Android Style) */}
      <button 
        onClick={(e) => { e.stopPropagation(); setIsLocked(!isLocked); setShowControls(true); }}
        className={`absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {isLocked ? <Lock size={20} className="text-orange-500" /> : <Unlock size={20} />}
      </button>

      {/* Bottom Controls */}
      {!isLocked && (
        <div className={`p-6 bg-gradient-to-t from-black to-transparent pb-16 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Action Row */}
          <div className="flex justify-around mb-8 px-4 text-slate-400">
             <button className="flex flex-col items-center gap-1 active:text-orange-500"><Timer size={18} /><span className="text-[9px] font-bold">SPEED</span></button>
             <button className="flex flex-col items-center gap-1 active:text-orange-500"><RotateCw size={18} /><span className="text-[9px] font-bold">SLEEP</span></button>
             <button className="flex flex-col items-center gap-1 active:text-orange-500"><ChevronRight size={18} /><span className="text-[9px] font-bold">SUBTITLE</span></button>
          </div>

          {/* Seek Bar */}
          <div className="relative w-full h-1.5 bg-white/10 rounded-full mb-8 cursor-pointer overflow-hidden group">
            <div 
              className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-100" 
              style={{ width: `${progress}%` }} 
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-lg" 
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>

          <div className="flex items-center justify-between px-2">
            <button className="p-2 text-slate-300 hover:text-white active:scale-90 transition-transform">
              <SkipBack size={28} />
            </button>
            
            <div className="flex items-center gap-10">
              <button className="p-2 text-slate-300 active:scale-90 transition-transform">
                <SkipBack size={36} fill="currentColor" className="opacity-40" />
              </button>
              <button 
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-2xl shadow-orange-500/40 active:scale-90 transition-transform border-4 border-white/10"
              >
                {isPlaying ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" className="ml-1" />}
              </button>
              <button className="p-2 text-slate-300 active:scale-90 transition-transform">
                <SkipForward size={36} fill="currentColor" className="opacity-40" />
              </button>
            </div>

            <button className="p-2 text-slate-300 hover:text-white active:scale-90 transition-transform">
              <SkipForward size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerOverlay;

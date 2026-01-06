
import React, { useState, useRef, useEffect } from 'react';
import { MediaItem } from '../types';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Settings, Info, Sparkles } from 'lucide-react';
import { getMediaInsights } from '../services/geminiService';

interface PlayerOverlayProps {
  item: MediaItem;
  onClose: () => void;
}

const PlayerOverlay: React.FC<PlayerOverlayProps> = ({ item, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetchInsights();
  }, [item]);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const text = await getMediaInsights(item);
    setInsights(text);
    setLoadingInsights(false);
  };

  const togglePlay = () => {
    const media = item.type === 'video' ? videoRef.current : audioRef.current;
    if (media) {
      if (isPlaying) media.pause();
      else media.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    const media = item.type === 'video' ? videoRef.current : audioRef.current;
    if (media) {
      setProgress((media.currentTime / media.duration) * 100);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
        <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white backdrop-blur-sm">
          <X size={24} />
        </button>
        <div className="flex-1 px-4 text-center">
          <h2 className="text-sm font-semibold truncate">{item.title}</h2>
          {item.artist && <p className="text-xs text-slate-400 truncate">{item.artist}</p>}
        </div>
        <button className="p-2 rounded-full bg-white/10 text-white backdrop-blur-sm">
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
            className="w-full max-h-full object-contain"
            onClick={togglePlay}
          />
        ) : (
          <div className="w-full px-8 flex flex-col items-center">
            <img src={item.thumbnail} alt={item.title} className="w-64 h-64 rounded-xl shadow-2xl mb-8 object-cover" />
            <audio
              ref={audioRef}
              src={item.url}
              autoPlay
              onTimeUpdate={handleTimeUpdate}
            />
          </div>
        )}

        {/* AI Insight Overlay */}
        {insights && (
          <div className="absolute bottom-32 left-4 right-4 bg-orange-500/10 border border-orange-500/20 backdrop-blur-md p-4 rounded-xl transition-opacity">
            <div className="flex items-center gap-2 mb-2 text-orange-400">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">AI Insights</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed italic">{insights}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-gradient-to-t from-black to-slate-900/50 pb-12">
        {/* Seek Bar */}
        <div className="relative w-full h-1 bg-slate-800 rounded-full mb-6 cursor-pointer overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center justify-between px-4">
          <button className="text-slate-400 hover:text-white transition-colors">
            <Info size={24} />
          </button>
          
          <div className="flex items-center gap-8">
            <button className="text-white hover:text-orange-500 transition-colors">
              <SkipBack size={32} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
            </button>
            <button className="text-white hover:text-orange-500 transition-colors">
              <SkipForward size={32} />
            </button>
          </div>

          <button className="text-slate-400 hover:text-white transition-colors">
            {item.type === 'video' ? <Maximize size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerOverlay;

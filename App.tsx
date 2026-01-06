
import React, { useState, useMemo } from 'react';
import { TabType, MediaItem } from './types';
import { MOCK_VIDEOS, MOCK_AUDIO, VLC_ORANGE } from './constants';
import BottomNav from './components/BottomNav';
import PlayerOverlay from './components/PlayerOverlay';
import { Search, ListFilter, Plus, Folder, Globe, History, Radio, Grid, LayoutList } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.VIDEO);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredVideos = useMemo(() => 
    MOCK_VIDEOS.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())), 
  [searchQuery]);

  const filteredAudio = useMemo(() => 
    MOCK_AUDIO.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())), 
  [searchQuery]);

  const renderVideoTab = () => (
    <div className={`p-3 pb-24 transition-all duration-300 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}`}>
      {filteredVideos.map((video) => (
        <div 
          key={video.id} 
          className={`ripple group relative cursor-pointer bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden active:scale-[0.98] transition-all ${viewMode === 'list' ? 'flex items-center p-2 gap-3' : ''}`}
          onClick={() => setSelectedMedia(video)}
        >
          <div className={`${viewMode === 'grid' ? 'aspect-video w-full' : 'w-24 aspect-video'} relative overflow-hidden rounded-xl bg-slate-800`}>
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute bottom-1.5 right-1.5 px-1 py-0.5 bg-black/80 text-[9px] font-black text-white rounded uppercase">
              {video.duration}
            </div>
          </div>
          <div className={`p-2 ${viewMode === 'grid' ? '' : 'flex-1'}`}>
            <h3 className="text-[13px] font-bold line-clamp-1 text-slate-100">{video.title}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-tighter font-bold">{video.category || 'VLC Local'}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAudioTab = () => (
    <div className="p-4 pb-24 space-y-1 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-4">
         <h2 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em]">Recently Added</h2>
         <button className="text-[10px] font-bold text-orange-500 uppercase">Sort By</button>
      </div>
      {filteredAudio.map((audio) => (
        <div 
          key={audio.id} 
          className="ripple flex items-center gap-4 py-3 px-3 hover:bg-slate-900/60 active:bg-orange-500/10 rounded-2xl transition-all cursor-pointer border border-transparent active:border-orange-500/20"
          onClick={() => setSelectedMedia(audio)}
        >
          <div className="relative flex-shrink-0">
            <img src={audio.thumbnail} alt={audio.title} className="w-14 h-14 rounded-xl object-cover shadow-lg border border-white/5" />
            <div className="absolute inset-0 bg-black/10 rounded-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-100 truncate">{audio.title}</h3>
            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{audio.artist}</p>
          </div>
          <div className="text-[10px] text-slate-600 font-mono font-bold tracking-tighter bg-slate-900 px-2 py-1 rounded-md border border-white/5">
            {audio.duration}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-safe">
      {/* App Bar (Android Style) */}
      <header className="px-5 py-4 flex items-center justify-between sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 rotate-3 active:rotate-0 transition-transform">
             <img src="https://upload.wikimedia.org/wikipedia/commons/e/e6/VLC_Icon.svg" alt="VLC" className="w-7 h-7" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tighter block leading-tight">VLC</span>
            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.2em] opacity-80">Android Edition</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2.5 text-slate-400 active:text-orange-500"
          >
            {viewMode === 'grid' ? <LayoutList size={22} /> : <Grid size={22} />}
          </button>
          <button className="p-2.5 text-slate-400 active:text-orange-500">
            <Plus size={22} />
          </button>
        </div>
      </header>

      {/* Search Section */}
      <div className="p-5">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder={`Search your library...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:bg-slate-900 transition-all placeholder:text-slate-600 shadow-inner"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {activeTab === TabType.VIDEO && renderVideoTab()}
        {activeTab === TabType.AUDIO && renderAudioTab()}
        {activeTab === TabType.BROWSE && (
          <div className="p-5 space-y-4 pb-24 animate-in slide-in-from-bottom-5 duration-400">
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 shadow-2xl">
              <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6">Storage & Network</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Folder, label: 'Internal', color: 'text-orange-500' },
                  { icon: Globe, label: 'Network', color: 'text-blue-500' },
                  { icon: Radio, label: 'Streams', color: 'text-green-500' },
                  { icon: History, label: 'Recent', color: 'text-purple-500' },
                ].map((item, idx) => (
                  <div key={idx} className="ripple bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 group active:border-orange-500/40 transition-all">
                    <item.icon className={item.color} size={24} />
                    <span className="text-xs font-bold text-slate-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === TabType.PLAYLISTS && (
           <div className="flex flex-col items-center justify-center p-12 text-slate-500 space-y-6 min-h-[50vh]">
             <div className="w-32 h-32 bg-slate-900/50 rounded-full flex items-center justify-center border-2 border-dashed border-white/10 animate-pulse">
               <ListFilter size={64} className="opacity-10 text-orange-500" />
             </div>
             <div className="text-center">
               <p className="text-sm font-bold text-slate-300">No Playlists Found</p>
               <p className="text-xs text-slate-600 mt-2">Start curating your dream media library</p>
             </div>
             <button className="ripple bg-orange-500 text-white px-10 py-3.5 rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 active:scale-95 transition-transform">
               New Playlist
             </button>
           </div>
        )}
        {activeTab === TabType.MORE && (
          <div className="p-5 pb-24 space-y-2">
            {[
              { icon: History, label: 'Playback History', sub: 'Resume what you left' },
              { icon: ListFilter, label: 'Media Scanner', sub: 'Refresh your local files' },
              { icon: Settings, label: 'Performance', sub: 'Hardware acceleration & HW decoding' },
              { icon: Info, label: 'Legal & Credits', sub: 'Open source licenses' },
            ].map((item, idx) => (
              <div key={idx} className="ripple flex items-center gap-4 p-4 hover:bg-slate-900/60 rounded-2xl transition-all cursor-pointer border border-transparent active:border-white/5">
                <div className="p-2.5 bg-slate-900 rounded-xl text-slate-400"><item.icon size={20} /></div>
                <div>
                  <span className="text-sm font-bold block">{item.label}</span>
                  <span className="text-[10px] text-slate-600 font-medium uppercase tracking-tighter">{item.sub}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Media Player Overlay */}
      {selectedMedia && (
        <PlayerOverlay 
          item={selectedMedia} 
          onClose={() => setSelectedMedia(null)} 
        />
      )}

      {/* Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

// SVG Settings & Info defined inline for robustness
const Settings = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const Info = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;

export default App;


import React, { useState, useMemo } from 'react';
import { TabType, MediaItem } from './types';
import { MOCK_VIDEOS, MOCK_AUDIO, VLC_ORANGE } from './constants';
import BottomNav from './components/BottomNav';
import PlayerOverlay from './components/PlayerOverlay';
import { Search, ListFilter, Plus, Folder, Globe, History, Radio } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.VIDEO);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const filteredVideos = useMemo(() => 
    MOCK_VIDEOS.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())), 
  [searchQuery]);

  const filteredAudio = useMemo(() => 
    MOCK_AUDIO.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())), 
  [searchQuery]);

  const renderVideoTab = () => (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {filteredVideos.map((video) => (
          <div 
            key={video.id} 
            className="group relative cursor-pointer"
            onClick={() => setSelectedMedia(video)}
          >
            <div className="aspect-video relative overflow-hidden rounded-xl bg-slate-800">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-[10px] font-bold text-white rounded">
                {video.duration}
              </div>
            </div>
            <div className="mt-2 flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium line-clamp-1">{video.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{video.category || 'Local'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAudioTab = () => (
    <div className="flex flex-col p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {filteredAudio.map((audio) => (
        <div 
          key={audio.id} 
          className="flex items-center gap-4 py-3 border-b border-slate-800 last:border-0 cursor-pointer hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
          onClick={() => setSelectedMedia(audio)}
        >
          <img src={audio.thumbnail} alt={audio.title} className="w-14 h-14 rounded-md object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate">{audio.title}</h3>
            <p className="text-xs text-slate-400 truncate">{audio.artist}</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">{audio.duration}</span>
        </div>
      ))}
    </div>
  );

  const renderBrowseTab = () => (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-slate-800/50 rounded-2xl p-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Location</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 cursor-pointer hover:bg-slate-700/30 p-2 rounded-lg">
            <div className="p-2 bg-slate-700 rounded-lg text-orange-500"><Folder size={20} /></div>
            <span className="text-sm font-medium">Internal Memory</span>
          </div>
          <div className="flex items-center gap-4 cursor-pointer hover:bg-slate-700/30 p-2 rounded-lg">
            <div className="p-2 bg-slate-700 rounded-lg text-orange-500"><Globe size={20} /></div>
            <span className="text-sm font-medium">Local Network</span>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-2xl p-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Streams</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 cursor-pointer hover:bg-slate-700/30 p-2 rounded-lg">
            <div className="p-2 bg-slate-700 rounded-lg text-orange-500"><Radio size={20} /></div>
            <span className="text-sm font-medium">Open Network Stream</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMoreTab = () => (
    <div className="p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {[
        { icon: History, label: 'History' },
        { icon: ListFilter, label: 'Media Library' },
        { icon: Settings, label: 'Settings' },
        { icon: Info, label: 'About' },
      ].map((item, idx) => (
        <div key={idx} className="flex items-center gap-4 p-4 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
          <item.icon size={20} className="text-slate-400" />
          <span className="text-sm font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 overflow-x-hidden">
      {/* App Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center overflow-hidden">
             <img src="https://upload.wikimedia.org/wikipedia/commons/e/e6/VLC_Icon.svg" alt="VLC" className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg tracking-tight">VLC</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder={`Search in ${activeTab.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === TabType.VIDEO && renderVideoTab()}
        {activeTab === TabType.AUDIO && renderAudioTab()}
        {activeTab === TabType.BROWSE && renderBrowseTab()}
        {activeTab === TabType.MORE && renderMoreTab()}
        {activeTab === TabType.PLAYLISTS && (
           <div className="flex flex-col items-center justify-center p-12 text-slate-500 space-y-4 animate-in fade-in duration-500">
             <div className="p-6 bg-slate-900 rounded-full">
               <ListFilter size={48} className="opacity-20" />
             </div>
             <p className="text-sm font-medium">Your playlists will appear here</p>
             <button className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors">
               Create Playlist
             </button>
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

// Simplified utility for Lucide icons used in more tab
const Settings = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const Info = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;

export default App;

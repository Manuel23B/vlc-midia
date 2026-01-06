
import React from 'react';
import { TabType } from '../types';
import { Play, Music, ListMusic, FolderOpen, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: TabType.VIDEO, label: 'Video', icon: Play },
    { id: TabType.AUDIO, label: 'Audio', icon: Music },
    { id: TabType.PLAYLISTS, label: 'Playlists', icon: ListMusic },
    { id: TabType.BROWSE, label: 'Browse', icon: FolderOpen },
    { id: TabType.MORE, label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex justify-around items-center py-2 px-1 z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center flex-1 py-1 transition-colors ${
              isActive ? 'text-orange-500' : 'text-slate-400'
            }`}
          >
            <Icon size={22} className={isActive ? 'fill-orange-500/10' : ''} />
            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;

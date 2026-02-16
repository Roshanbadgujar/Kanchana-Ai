
import React from 'react';
import { AppView, KanchanaMode } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  activeMode: KanchanaMode;
  setActiveMode: (mode: KanchanaMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, activeMode, setActiveMode }) => {
  const modes = [
    { id: KanchanaMode.LOVELY, icon: <ICONS.Heart /> },
    { id: KanchanaMode.NAUGHTY, icon: <ICONS.Flame /> },
    { id: KanchanaMode.POSSESSIVE, icon: <ICONS.Lock /> },
    { id: KanchanaMode.HORROR, icon: <ICONS.Ghost /> },
    { id: KanchanaMode.MYSTIC, icon: <ICONS.Sparkles /> },
  ];

  return (
    <aside className="hidden lg:flex w-24 flex-col items-center py-8 gap-12 bg-black/40 border-r border-white/5 backdrop-blur-3xl">
      <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center font-cinzel text-2xl text-white shadow-2xl shadow-purple-900/50">K</div>
      
      <div className="flex-1 flex flex-col gap-4">
        {modes.map(mode => (
          <button 
            key={mode.id}
            onClick={() => { setActiveMode(mode.id); setView('chat'); }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative group ${
              activeMode === mode.id && currentView === 'chat' 
                ? 'bg-purple-600 text-white' 
                : 'text-slate-600 hover:text-purple-400 hover:bg-white/5'
            }`}
          >
            {mode.icon}
            <span className="absolute left-full ml-4 px-3 py-1 bg-black text-[9px] text-white uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">{mode.id}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={() => setView('audio')}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${currentView === 'audio' ? 'text-purple-400' : 'text-slate-600 hover:text-white'}`}
        >
          <ICONS.Mic />
        </button>
        <button 
          onClick={() => setView('settings')}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${currentView === 'settings' ? 'text-purple-400' : 'text-slate-600 hover:text-white'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

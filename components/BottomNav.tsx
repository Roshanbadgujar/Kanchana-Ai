
import React from 'react';
import { AppView } from '../types';
import { ICONS } from '../constants';

interface BottomNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  return (
    <nav className="lg:hidden h-20 bg-black/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-6 z-50">
      <button 
        onClick={() => setView('chat')}
        className={`flex flex-col items-center gap-1 ${currentView === 'chat' || currentView === 'home' ? 'text-purple-400' : 'text-slate-600'}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span className="text-[8px] font-bold uppercase tracking-widest">Chat</span>
      </button>
      
      <button 
        onClick={() => setView('audio')}
        className={`w-14 h-14 -mt-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-purple-900 transition-all active:scale-90 ${currentView === 'audio' ? 'scale-110' : ''}`}
      >
        <ICONS.Mic />
      </button>

      <button 
        onClick={() => setView('settings')}
        className={`flex flex-col items-center gap-1 ${currentView === 'settings' ? 'text-purple-400' : 'text-slate-600'}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        <span className="text-[8px] font-bold uppercase tracking-widest">Settings</span>
      </button>
    </nav>
  );
};

export default BottomNav;

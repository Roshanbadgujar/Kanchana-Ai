
import React from 'react';
import { UserPreferences, UserTier, AppView } from '../types';

interface SettingsPageProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  setView: (view: AppView) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ preferences, setPreferences, setView }) => {
  return (
    <div className="h-full w-full overflow-y-auto bg-[#050107] p-8 md:p-16 custom-scrollbar animate-fade-in pb-32">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="font-cinzel text-4xl text-white tracking-widest uppercase">The Sanctuary</h1>
            <p className="font-playfair italic text-slate-500">Configure your connection to the ethereal.</p>
          </div>
          <button 
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-[10px] text-slate-500 hover:text-white font-bold uppercase tracking-widest transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Home
          </button>
        </header>

        <div className="grid gap-8">
          <section className="glass-panel p-8 md:p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Soul Profile</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-600 uppercase tracking-widest px-1 font-bold">Your Name</label>
                <input 
                  type="text" 
                  value={preferences.name} 
                  onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-purple-500 transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-600 uppercase tracking-widest px-1 font-bold">Frequency Email</label>
                <input 
                  type="email" 
                  value={preferences.email} 
                  readOnly
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-500 outline-none text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          <section className="glass-panel p-8 md:p-10 rounded-[2.5rem] border-white/5 space-y-6">
             <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Eternal Bond</h3>
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl">
                <div>
                  <p className="text-amber-200 font-bold uppercase tracking-widest text-xs mb-1">{preferences.tier} Frequency</p>
                  <p className="text-[10px] text-amber-500/60 uppercase tracking-widest font-bold">Remaining Whispers: {50 - preferences.messageCount}</p>
                </div>
                <button 
                  onClick={() => setView('upgrade')}
                  className="w-full md:w-auto px-10 py-4 bg-amber-600 text-black font-bold rounded-full text-[10px] tracking-widest uppercase hover:bg-amber-500 transition-all active:scale-95 shadow-xl shadow-amber-900/20"
                >
                  {preferences.tier === UserTier.PREMIUM ? 'Manage Benefits' : 'Unlock Golden Key'}
                </button>
             </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest px-4 font-bold">Protocols & Links</h3>
              <div className="glass-panel rounded-3xl border-white/5 overflow-hidden">
                  <button onClick={() => setView('privacy')} className="w-full px-8 py-5 text-left text-sm text-slate-300 hover:bg-white/5 transition-all border-b border-white/5 font-playfair italic flex justify-between items-center group">
                    Privacy Protocols
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                  <button onClick={() => setView('security')} className="w-full px-8 py-5 text-left text-sm text-slate-300 hover:bg-white/5 transition-all border-b border-white/5 font-playfair italic flex justify-between items-center group">
                    Security Linkage
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                  <button className="w-full px-8 py-5 text-left text-sm text-slate-300 hover:bg-white/5 transition-all font-playfair italic flex justify-between items-center group">
                    Terms of Connection
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest px-4 font-bold">Severance</h3>
              <div className="glass-panel rounded-3xl border-white/5 overflow-hidden">
                  <button onClick={() => { if(confirm("This will erase all threads and memories permanently. Proceed?")) { localStorage.clear(); window.location.reload(); } }} className="w-full px-8 py-5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-all border-b border-white/5 font-playfair italic">Total Amnesia (Clear All Data)</button>
                  <button onClick={() => { if(confirm("End current session?")) setView('landing'); }} className="w-full px-8 py-5 text-left text-sm text-slate-400 hover:bg-white/5 transition-all font-playfair italic">Sever Astral Link (Logout)</button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

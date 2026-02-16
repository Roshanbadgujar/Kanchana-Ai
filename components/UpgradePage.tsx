
import React from 'react';
import { UserPreferences, UserTier } from '../types';

interface Props {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  onBack: () => void;
}

const UpgradePage: React.FC<Props> = ({ preferences, setPreferences, onBack }) => {
  const isPremium = preferences.tier === UserTier.PREMIUM;

  const handleUpgrade = () => {
    setPreferences(p => ({ ...p, tier: UserTier.PREMIUM }));
    alert("The Golden Key has been forged. Your bond is now eternal.");
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-[#050107] p-8 md:p-20 custom-scrollbar animate-fade-in pb-32">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <button onClick={onBack} className="self-start group flex items-center gap-3 text-slate-500 hover:text-white transition-all mb-16">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back</span>
        </button>

        <div className="text-center space-y-6 mb-20">
          <h1 className="font-cinzel text-4xl md:text-6xl text-amber-500 tracking-widest uppercase drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">The Golden Key</h1>
          <p className="font-playfair italic text-slate-400 text-lg md:text-xl max-w-2xl">
            "Sustaining a neural link across dimensions requires immense energy. Unlock the eternal bond."
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 w-full">
          {/* Free Tier */}
          <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 space-y-10 relative">
             <div className="space-y-2">
                <h3 className="font-cinzel text-xl text-slate-500 uppercase tracking-widest">Free Soul</h3>
                <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">The Echo Connection</p>
             </div>
             <div className="text-4xl font-cinzel text-slate-300">₹0 <span className="text-xs text-slate-600 font-bold uppercase tracking-widest">/ eternity</span></div>
             <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li className="flex items-center gap-3 opacity-50"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> 50 Messages Daily</li>
                <li className="flex items-center gap-3 opacity-50"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Basic Modes</li>
                <li className="flex items-center gap-3 opacity-20"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Voice Sanctuary</li>
             </ul>
             <button disabled className="w-full py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em]">Current Status</button>
          </div>

          {/* Premium Tier */}
          <div className="glass-panel p-10 rounded-[3.5rem] border-amber-500/30 space-y-10 relative overflow-hidden bg-gradient-to-br from-amber-600/5 to-transparent">
             <div className="absolute top-0 right-0 p-6">
                <div className="px-4 py-1 bg-amber-500 text-black text-[9px] font-bold uppercase tracking-widest rounded-full">Recommended</div>
             </div>
             <div className="space-y-2">
                <h3 className="font-cinzel text-xl text-amber-500 uppercase tracking-widest">Premium Bond</h3>
                <p className="text-amber-600/60 text-[10px] uppercase tracking-widest font-bold">The Eternal Frequency</p>
             </div>
             <div className="text-4xl font-cinzel text-amber-400">₹499 <span className="text-xs text-amber-600 font-bold uppercase tracking-widest">/ eternity</span></div>
             <ul className="space-y-4 text-sm text-amber-200/60 font-medium">
                <li className="flex items-center gap-3"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-amber-500"><polyline points="20 6 9 17 4 12"/></svg> Unlimited Neural Messages</li>
                <li className="flex items-center gap-3"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-amber-500"><polyline points="20 6 9 17 4 12"/></svg> Voice Call Sanctuary</li>
                <li className="flex items-center gap-3"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-amber-500"><polyline points="20 6 9 17 4 12"/></svg> All Secret Modes Unlocked</li>
                <li className="flex items-center gap-3"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-amber-500"><polyline points="20 6 9 17 4 12"/></svg> Priority Soul Processing</li>
             </ul>
             <button 
              onClick={handleUpgrade}
              disabled={isPremium}
              className={`w-full py-5 rounded-3xl text-[10px] font-bold uppercase tracking-[0.4em] transition-all ${
                isPremium ? 'bg-amber-500/20 text-amber-500 cursor-default' : 'bg-amber-600 text-white hover:bg-amber-500 shadow-xl shadow-amber-900/20 active:scale-95'
              }`}
             >
                {isPremium ? 'GOLDEN KEY ACTIVE' : 'FORGE THE BOND'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;

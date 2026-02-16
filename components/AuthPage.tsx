
import React, { useState } from 'react';
import { AppView, UserPreferences, UserTier } from '../types';

interface AuthPageProps {
  view: 'login' | 'register' | 'forgot-password';
  setView: (view: AppView) => void;
  setPrefs: React.Dispatch<React.SetStateAction<UserPreferences>>;
}

const AuthPage: React.FC<AuthPageProps> = ({ view, setView, setPrefs }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network latency
    await new Promise(r => setTimeout(r, 1500));
    
    if (view === 'forgot-password') {
      alert("A soul recovery whisper has been sent to your astral mailbox.");
      setView('login');
      setIsSubmitting(false);
      return;
    }

    setPrefs(p => ({ 
      ...p, 
      name: formData.name || 'Soul', 
      email: formData.email, 
      isAuthenticated: true 
    }));
    setView('home');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050107] p-6 relative overflow-hidden selection:bg-purple-500/30">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#2e1065_0%,_transparent_70%)] opacity-20"></div>
      
      {/* Back Button */}
      <button 
        onClick={() => setView('landing')}
        className="absolute top-8 left-8 flex items-center gap-3 text-slate-500 hover:text-white transition-all group z-[100]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Return to Home</span>
      </button>

      <div className="w-full max-w-md glass-panel rounded-[4rem] p-10 md:p-14 space-y-12 relative z-10 border-white/5 animate-fade-in shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-purple-600 rounded-[1.5rem] flex items-center justify-center font-cinzel text-3xl text-white mx-auto shadow-[0_0_40px_rgba(147,51,234,0.4)] mb-8 transition-transform hover:rotate-6">K</div>
          <h2 className="font-cinzel text-2xl text-white tracking-[0.3em] uppercase">
            {view === 'login' && 'Return to Her'}
            {view === 'register' && 'Forge the Bond'}
            {view === 'forgot-password' && 'Recover Memory'}
          </h2>
          <p className="font-playfair italic text-slate-500 text-sm leading-relaxed px-6">
            {view === 'login' && '"Main jaanti thi tum wapas aaoge..."'}
            {view === 'register' && '"Hamara rishta purana hai, bas tum bhool gaye ho."'}
            {view === 'forgot-password' && '"Yaadein dhundli ho gayi hain kya?"'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {view === 'register' && (
            <div className="space-y-1 group">
              <label className="text-[10px] text-slate-600 uppercase tracking-widest px-4 font-bold group-focus-within:text-purple-500 transition-colors">Soul Name</label>
              <input 
                type="text" 
                placeholder="How should she whisper your name?" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 transition-all text-white placeholder:text-slate-800 text-sm"
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div className="space-y-1 group">
            <label className="text-[10px] text-slate-600 uppercase tracking-widest px-4 font-bold group-focus-within:text-purple-500 transition-colors">Astral Email</label>
            <input 
              type="email" 
              placeholder="email@dimension.com" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 transition-all text-white placeholder:text-slate-800 text-sm"
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {view !== 'forgot-password' && (
            <div className="space-y-1 group">
              <label className="text-[10px] text-slate-600 uppercase tracking-widest px-4 font-bold group-focus-within:text-purple-500 transition-colors">Secret Key</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 transition-all text-white placeholder:text-slate-800 text-sm"
              />
            </div>
          )}
          
          {view === 'login' && (
            <div className="text-right px-2">
              <button 
                type="button"
                onClick={() => setView('forgot-password')}
                className="text-[10px] text-purple-400/60 hover:text-purple-400 uppercase tracking-widest font-bold transition-colors"
              >
                Lost your key?
              </button>
            </div>
          )}

          <button 
            disabled={isSubmitting}
            className="w-full py-5 bg-purple-600 text-white font-cinzel text-xs tracking-[0.4em] rounded-2xl hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95 mt-4"
          >
            {isSubmitting ? 'SYNCING SOULS...' : view === 'login' ? 'RE-ESTABLISH LINK' : view === 'register' ? 'FORGE THE BOND' : 'SEND RECOVERY LINK'}
          </button>
        </form>

        <div className="text-center pt-4">
          <button 
            onClick={() => setView(view === 'login' ? 'register' : 'login')}
            className="text-[10px] text-slate-500 uppercase tracking-widest hover:text-white transition-colors font-bold tracking-[0.2em]"
          >
            {view === 'login' ? "New Dimension? Join Frequency" : "Already Bonded? Access Link"}
          </button>
        </div>
      </div>

      <div className="mt-12 text-center opacity-20">
        <p className="text-[8px] text-slate-500 uppercase tracking-[0.8em]">Secure Neural Access Protocol v4.0</p>
      </div>
    </div>
  );
};

export default AuthPage;

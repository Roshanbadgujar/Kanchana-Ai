
import React, { useState } from 'react';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onStart(name);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0111] p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-1/4 w-[100vw] h-[100vw] bg-purple-900/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-[100vw] h-[100vw] bg-red-900/5 blur-[150px] rounded-full"></div>
      
      <div className="max-w-md w-full z-10 text-center space-y-12 animate-fade-in px-4">
        <div className="space-y-4">
          <div className="inline-block p-4 rounded-3xl bg-purple-600/10 border border-purple-500/20 mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-950">
              <span className="font-cinzel text-3xl sm:text-4xl text-white">K</span>
            </div>
          </div>
          <h1 className="font-cinzel text-4xl sm:text-5xl text-purple-100 tracking-[0.2em] uppercase">Kanchana</h1>
          <p className="font-playfair italic text-purple-400/60 text-base sm:text-lg">
            "Raat gehri hai... kya tum akele ho?"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative group max-w-xs mx-auto">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name, soul..."
              className="w-full bg-transparent border-b border-purple-500/30 focus:border-purple-500 outline-none px-4 py-4 text-xl sm:text-2xl font-playfair transition-all text-center text-purple-100 placeholder:text-purple-900/50"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full sm:w-auto px-12 py-4 bg-purple-600 hover:bg-purple-500 text-white font-cinzel text-xs tracking-[0.3em] rounded-full transition-all duration-500 hover:scale-105 shadow-[0_0_30px_rgba(147,51,234,0.3)] active:scale-95"
          >
            INITIATE BOND
          </button>
        </form>

        <p className="text-[10px] text-slate-700 uppercase tracking-[0.5em] pt-12">Mystic Engine v3.0</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;

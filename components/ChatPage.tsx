
import React, { useRef, useEffect, useState } from 'react';
import { Message, KanchanaMode } from '../types';

interface ChatPageProps {
  threads: Record<string, Message[]>;
  activeMode: KanchanaMode;
  onSend: (text: string) => void;
  isTyping: boolean;
}

const ChatPage: React.FC<ChatPageProps> = ({ threads, activeMode, onSend, isTyping }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = threads[activeMode] || [];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#050107]">
      {/* Dynamic Header */}
      <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/20">
             <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-cinzel text-sm text-white tracking-widest uppercase">Kanchana</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">{activeMode} Frequency</span>
            </div>
          </div>
        </div>
      </header>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-10 space-y-8 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
             <div className="w-32 h-32 bg-purple-900/20 rounded-full flex items-center justify-center animate-pulse">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-purple-400"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg>
             </div>
             <p className="font-playfair italic text-lg text-slate-300">"Suno... hamari ye nayi dunya hogi."</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] md:max-w-[60%] p-5 rounded-[2rem] border relative ${
              msg.role === 'user' 
                ? 'bg-purple-600/10 border-purple-500/20 text-purple-100 rounded-tr-none shadow-[0_10px_30px_rgba(147,51,234,0.05)]' 
                : 'bg-white/5 border-white/5 text-slate-200 rounded-tl-none backdrop-blur-md'
            }`}>
              <p className={`text-sm md:text-base leading-relaxed ${msg.role === 'kanchana' ? 'font-playfair italic' : 'font-sans'}`}>
                {msg.text}
              </p>
              <span className="block mt-2 text-[8px] opacity-30 font-bold tracking-widest uppercase text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/5 flex gap-2">
              <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Zone */}
      <div className="p-8 bg-gradient-to-t from-black/80 to-transparent">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto glass-panel p-2 rounded-full border border-white/10 flex items-center shadow-2xl">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Whisper into the void..."
            className="flex-1 bg-transparent border-none outline-none px-6 py-3 text-white placeholder:text-slate-700 font-medium"
          />
          <button className="w-12 h-12 bg-purple-600 hover:bg-purple-500 text-white rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-purple-900/40">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;

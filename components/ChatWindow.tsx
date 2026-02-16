
import React, { useRef, useEffect, useState } from 'react';
import { Message, KanchanaMode } from '../types';

interface ChatWindowProps {
  messages: Message[];
  onSend: (text: string) => void;
  isTyping: boolean;
  mode: KanchanaMode;
  onVoiceToggle: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSend, isTyping, mode, onVoiceToggle }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

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
    <div className="flex flex-col h-full relative">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-8 space-y-6 z-10 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
            <div className="w-20 h-20 bg-purple-900/20 rounded-full mb-4 animate-pulse"></div>
            <p className="font-playfair italic text-slate-300">"Kaho... main sun rahi hoon."</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-white/10 flex-shrink-0 ${msg.role === 'kanchana' ? 'shadow-[0_0_15px_rgba(168,85,247,0.2)]' : ''}`}>
              <img 
                src={msg.role === 'user' ? `https://api.dicebear.com/7.x/avataaars/svg?seed=user` : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'} 
                alt="avatar" 
                className="w-full h-full object-cover grayscale"
              />
            </div>
            
            <div className={`
              max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 sm:p-4 shadow-2xl relative
              ${msg.role === 'user' 
                ? 'bg-purple-900/30 text-purple-50 border border-purple-500/20 rounded-tr-none' 
                : 'bg-white/5 backdrop-blur-xl text-slate-200 border border-white/10 rounded-tl-none'}
            `}>
              <div className={`whitespace-pre-wrap text-sm sm:text-base ${msg.role === 'kanchana' ? 'font-playfair italic tracking-wide' : 'font-sans'}`}>
                {msg.text}
              </div>
              <div className={`text-[8px] mt-1.5 opacity-30 font-bold uppercase tracking-widest ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
             <div className="bg-white/5 px-4 py-2 rounded-full border border-white/5 flex gap-1.5 items-center">
                <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce"></span>
                <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-6 z-20 bg-gradient-to-t from-[#0d0111] to-transparent">
        <form 
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto glass-panel rounded-2xl sm:rounded-full p-1 sm:p-1.5 flex items-center shadow-3xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Whisper your soul..."
            className="flex-1 bg-transparent border-none outline-none text-slate-100 text-sm sm:text-base px-4 py-3 sm:py-2.5 placeholder:text-slate-700 font-medium"
          />

          <div className="flex items-center gap-1">
            <button 
              type="button" 
              onClick={onVoiceToggle}
              className="p-3 text-slate-500 hover:text-purple-400 transition-colors active:scale-90"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
            </button>
            <button 
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 sm:w-11 sm:h-11 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white rounded-xl sm:rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;

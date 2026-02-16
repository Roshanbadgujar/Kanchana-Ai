
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { KanchanaMode, UserTier, Message, UserPreferences, AppView } from './types';
import { SYSTEM_INSTRUCTION, MAX_FREE_MESSAGES, ICONS } from './constants';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import ChatPage from './components/ChatPage';
import AudioPage from './components/AudioPage';
import SettingsPage from './components/SettingsPage';
import PrivacySecurityPage from './components/PrivacySecurityPage';
import UpgradePage from './components/UpgradePage';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(() => {
    const saved = localStorage.getItem('kanchana_view');
    return (saved as AppView) || 'landing';
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('kanchana_prefs');
    return saved ? JSON.parse(saved) : {
      name: '',
      email: '',
      tier: UserTier.FREE,
      messageCount: 0,
      isAuthenticated: false
    };
  });

  const [activeMode, setActiveMode] = useState<KanchanaMode>(KanchanaMode.LOVELY);
  const [threads, setThreads] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('kanchana_threads');
    return saved ? JSON.parse(saved) : {};
  });

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('kanchana_prefs', JSON.stringify(preferences));
    localStorage.setItem('kanchana_view', view);
    localStorage.setItem('kanchana_threads', JSON.stringify(threads));
  }, [preferences, view, threads]);

  const handleSendMessage = async (text: string) => {
    const currentThread = threads[activeMode] || [];
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    const updatedHistory = [...currentThread, userMsg];
    
    setThreads(prev => ({ ...prev, [activeMode]: updatedHistory }));
    setIsTyping(true);
    setPreferences(prev => ({ ...prev, messageCount: prev.messageCount + 1 }));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...updatedHistory.slice(-10).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }))],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION(activeMode, preferences.name, preferences.tier === UserTier.PREMIUM),
          temperature: 1,
        }
      });

      const kanchanaMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'kanchana',
        text: response.text || "...",
        timestamp: Date.now()
      };
      
      setThreads(prev => ({ ...prev, [activeMode]: [...updatedHistory, kanchanaMsg] }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const renderContent = () => {
    if (view === 'landing') return <LandingPage onEnter={() => setView(preferences.isAuthenticated ? 'home' : 'login')} />;
    
    if (['login', 'register', 'forgot-password'].includes(view)) {
      return <AuthPage view={view as any} setView={setView} setPrefs={setPreferences} />;
    }

    return (
      <div className="flex h-screen w-full bg-[#050107] overflow-hidden">
        {/* Desktop Navigation */}
        <Sidebar currentView={view} setView={setView} activeMode={activeMode} setActiveMode={setActiveMode} />
        
        <main className="flex-1 flex flex-col relative overflow-hidden pb-20 lg:pb-0">
          {view === 'home' && <LandingPage onEnter={() => setView('chat')} isInside={true} />}
          {view === 'chat' && <ChatPage threads={threads} activeMode={activeMode} onSend={handleSendMessage} isTyping={isTyping} />}
          {/* Pass activeMode to AudioPage */}
          {view === 'audio' && <AudioPage preferences={preferences} activeMode={activeMode} onClose={() => setView('chat')} />}
          {view === 'settings' && <SettingsPage preferences={preferences} setPreferences={setPreferences} setView={setView} />}
          {view === 'privacy' && <PrivacySecurityPage type="privacy" onBack={() => setView('settings')} />}
          {view === 'security' && <PrivacySecurityPage type="security" onBack={() => setView('settings')} />}
          {view === 'upgrade' && <UpgradePage preferences={preferences} setPreferences={setPreferences} onBack={() => setView('settings')} />}
          
          {/* Mobile Navigation */}
          <BottomNav currentView={view} setView={setView} />
        </main>
      </div>
    );
  };

  return <div className="h-full w-full font-inter selection:bg-purple-500/30">{renderContent()}</div>;
};

export default App;

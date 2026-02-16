
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { UserPreferences, UserTier, KanchanaMode } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

/**
 * Manual base64 decoding helper following Gemini SDK guidelines.
 */
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Manual base64 encoding helper following Gemini SDK guidelines.
 */
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Manual PCM audio decoding helper following Gemini SDK guidelines.
 */
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// FIX: Added activeMode to interface to resolve property error
interface VoiceInterfaceProps {
  preferences: UserPreferences;
  activeMode: KanchanaMode;
  onClose: () => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ preferences, activeMode, onClose }) => {
  const [hasUnlocked, setHasUnlocked] = useState(preferences.tier === UserTier.PREMIUM);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
  const [transcript, setTranscript] = useState('');
  
  const audioInRef = useRef<AudioContext | null>(null);
  const audioOutRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const activeSources = useRef<Set<AudioBufferSourceNode>>(new Set());

  const handleStartCall = async () => {
    if (status !== 'idle') return;
    setStatus('connecting');
    setTranscript('Connecting to her frequency...');
    
    try {
      // FIX: Cross-browser AudioContext support
      const ctxIn = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const ctxOut = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      await ctxIn.resume();
      await ctxOut.resume();
      audioInRef.current = ctxIn;
      audioOutRef.current = ctxOut;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // FIX: Correct GoogleGenAI initialization
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');
            setTranscript('She is listening...');
            
            const micSource = ctxIn.createMediaStreamSource(stream);
            const processor = ctxIn.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32768;
              }
              // FIX: Ensure sendRealtimeInput is called only after session is resolved
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ 
                  media: {
                    data: encode(new Uint8Array(int16.buffer)),
                    mimeType: 'audio/pcm;rate=16000'
                  }
                });
              });
            };
            micSource.connect(processor);
            processor.connect(ctxIn.destination);

            // GREETING: Trigger her to speak first
            // FIX: Using activeMode prop instead of non-existent preferences.mode
            sessionPromise.then(s => s.sendRealtimeInput({
              media: { data: '', mimeType: 'audio/pcm;rate=16000' }
            }));
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscript(message.serverContent.outputTranscription.text);
            }
            
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              setStatus('speaking');
              // FIX: Manual audio decoding logic as per guidelines
              const buffer = await decodeAudioData(decode(base64EncodedAudioString), ctxOut, 24000, 1);
              const source = ctxOut.createBufferSource();
              source.buffer = buffer;
              source.connect(ctxOut.destination);
              source.onended = () => {
                activeSources.current.delete(source);
                if (activeSources.current.size === 0) setStatus('listening');
              };
              
              // FIX: Queue audio playback correctly
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctxOut.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              activeSources.current.add(source);
            }

            // FIX: Handle interruption of the model turn
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              activeSources.current.forEach(s => { try { s.stop(); } catch(e){} });
              activeSources.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('listening');
            }
          },
          onerror: (e) => {
            console.error(e);
            setStatus('error');
            setTranscript("The connection was severed...");
          },
          onclose: () => setStatus('idle')
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          // FIX: Used activeMode instead of non-existent preferences.mode property
          systemInstruction: SYSTEM_INSTRUCTION(activeMode, preferences.name, true) + "\nCRITICAL: Answer in less than 15 words always."
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTranscript("Connection failed.");
    }
  };

  const handleEndCall = () => {
    sessionRef.current?.close();
    audioInRef.current?.close();
    audioOutRef.current?.close();
    activeSources.current.forEach(s => { try { s.stop(); } catch(e){} });
    activeSources.current.clear();
    setStatus('idle');
  };

  useEffect(() => {
    return () => handleEndCall();
  }, []);

  if (!hasUnlocked) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-black/60 backdrop-blur-md">
        <div className="w-full max-w-xs glass-panel rounded-[2.5rem] p-10 border border-amber-500/20 shadow-[0_0_50px_rgba(251,191,36,0.1)]">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div className="w-20 h-20 mx-auto mb-8 relative">
            <div className="absolute inset-0 border-2 border-amber-500/40 rounded-full animate-pulse"></div>
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" alt="Kanchana" className="w-full h-full object-cover rounded-full border-2 border-black grayscale brightness-75" />
          </div>
          <h2 className="font-cinzel text-lg text-amber-400 mb-2 tracking-[0.2em] uppercase">Golden Key</h2>
          <p className="text-[9px] text-slate-400 mb-8 leading-relaxed tracking-[0.1em] uppercase">Requires an eternal bond to hear her whispers.</p>
          <button 
            onClick={() => setHasUnlocked(true)}
            className="w-full py-4 premium-gold-btn rounded-full text-amber-200 text-[9px] font-bold tracking-[0.3em] hover:scale-105 transition-all shadow-xl"
          >
            UNLOCK SOUL FREQUENCY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col p-8 bg-black/40 relative">
      <div className="flex justify-between items-center mb-10 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'listening' ? 'bg-green-500 animate-pulse' : status === 'speaking' ? 'bg-purple-500 animate-pulse' : 'bg-slate-600'}`}></div>
          <h3 className="font-cinzel text-[9px] text-purple-400 tracking-[0.4em] uppercase">{status}</h3>
        </div>
        <button onClick={onClose} className="p-1 text-slate-500 hover:text-white transition-colors active:scale-90">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12 relative z-10">
        <div className="relative">
          {status === 'speaking' && (
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-64 h-64 border border-purple-500/30 rounded-full animate-[ping_2s_infinite]"></div>
              <div className="w-56 h-56 border border-purple-500/20 rounded-full animate-[ping_3s_infinite_1s]"></div>
            </div>
          )}
          
          <div className={`w-44 h-44 rounded-full overflow-hidden border-2 border-purple-500/40 transition-all duration-1000 ${status === 'speaking' ? 'scale-110 shadow-[0_0_60px_rgba(168,85,247,0.3)]' : 'grayscale brightness-50'}`}>
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500" alt="Kanchana" className="w-full h-full object-cover" />
          </div>

          {status === 'listening' && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1 items-center bg-purple-600 px-4 py-1.5 rounded-full text-[8px] text-white font-bold tracking-widest shadow-lg">
              <div className="flex gap-0.5 items-center">
                <span className="w-0.5 h-2 bg-white/40 animate-pulse"></span>
                <span className="w-0.5 h-3 bg-white animate-pulse"></span>
                <span className="w-0.5 h-2 bg-white/40 animate-pulse"></span>
              </div>
              WHISPER NOW
            </div>
          )}
        </div>

        <div className="text-center space-y-6 max-w-[240px]">
          {status === 'idle' ? (
            <div className="space-y-4">
               <p className="font-playfair italic text-slate-400 text-xs italic">"Mere khayalon se judna chahoge?"</p>
               <button 
                onClick={handleStartCall}
                className="px-10 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-cinzel text-[10px] tracking-[0.3em] shadow-2xl transition-all active:scale-95"
              >
                INITIATE SOUL BOND
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <p className="font-playfair italic text-slate-100 text-base leading-relaxed min-h-[4rem]">
                {transcript || "..."}
              </p>
              <button 
                onClick={handleEndCall}
                className="w-12 h-12 rounded-full bg-red-900/40 border border-red-500/40 text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all mx-auto active:scale-90 shadow-xl"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 2.59 3.4z"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-8 text-center opacity-20">
        <p className="text-[7px] text-slate-500 uppercase tracking-[0.6em]">Neural Frequency v2.8</p>
      </div>
    </div>
  );
};

export default VoiceInterface;

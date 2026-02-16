
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { UserPreferences, UserTier, KanchanaMode } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

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

// FIX: Accept activeMode as a prop to resolve 'mode' property error
const AudioPage: React.FC<{ preferences: UserPreferences; activeMode: KanchanaMode; onClose: () => void }> = ({ preferences, activeMode, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'live' | 'error'>('idle');
  const [transcript, setTranscript] = useState('');
  const sessionRef = useRef<any>(null);
  const audioInRef = useRef<AudioContext | null>(null);
  const audioOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    setStatus('live');
    try {
      // FIX: Use named parameter for GoogleGenAI initialization
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // FIX: Cross-browser AudioContext initialization
      const ctxIn = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const ctxOut = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioInRef.current = ctxIn;
      audioOutRef.current = ctxOut;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
             const source = ctxIn.createMediaStreamSource(stream);
             const processor = ctxIn.createScriptProcessor(4096, 1, 1);
             processor.onaudioprocess = (audioProcessingEvent) => {
               const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
               const int16 = new Int16Array(inputData.length);
               for (let i = 0; i < inputData.length; i++) {
                 int16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32768;
               }
               // FIX: Initiate sendRealtimeInput after live.connect call resolves as per guidelines
               sessionPromise.then((session) => {
                 session.sendRealtimeInput({ 
                   media: { 
                     data: encode(new Uint8Array(int16.buffer)), 
                     mimeType: 'audio/pcm;rate=16000' 
                   } 
                 });
               });
             };
             source.connect(processor);
             processor.connect(ctxIn.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             if (message.serverContent?.outputTranscription) {
               setTranscript(message.serverContent.outputTranscription.text);
             }
             
             const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
             if (base64EncodedAudioString) {
                // FIX: Use manual decoding logic as per Gemini SDK rules
                const audioBuffer = await decodeAudioData(
                  decode(base64EncodedAudioString),
                  ctxOut,
                  24000,
                  1
                );
                const source = ctxOut.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctxOut.destination);
                
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });

                // FIX: Track end of audio queue for gapless playback
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctxOut.currentTime);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
             }

             // FIX: Handle interruption of the model's turn
             const interrupted = message.serverContent?.interrupted;
             if (interrupted) {
               for (const source of sourcesRef.current) {
                 source.stop();
                 sourcesRef.current.delete(source);
               }
               nextStartTimeRef.current = 0;
             }
          },
          onerror: (e) => {
            console.error(e);
            setStatus('error');
          },
          onclose: () => setStatus('idle')
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { 
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } 
          },
          // FIX: Use activeMode instead of non-existent preferences.mode property
          systemInstruction: SYSTEM_INSTRUCTION(activeMode, preferences.name, true) + " Keep it short and poetic."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) { 
      console.error(e);
      setStatus('error'); 
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    audioInRef.current?.close();
    audioOutRef.current?.close();
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setStatus('idle');
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2e1065_0%,_transparent_70%)] opacity-30"></div>
      
      <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all z-20">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>

      <div className="relative z-10 flex flex-col items-center space-y-16 max-w-lg text-center">
        <div className="relative">
          <div className={`w-56 h-56 rounded-full border-2 border-purple-500/20 flex items-center justify-center transition-all duration-1000 ${status === 'live' ? 'scale-110 shadow-[0_0_50px_rgba(168,85,247,0.3)]' : 'grayscale'}`}>
             <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-full" />
          </div>
          {status === 'live' && <div className="absolute inset-0 border border-purple-500 rounded-full animate-ping opacity-20"></div>}
        </div>

        <div className="space-y-8 h-32">
          <p className="font-playfair italic text-2xl text-white leading-relaxed animate-fade-in">
            {transcript || (status === 'live' ? "She is listening..." : "Connect to her frequency.")}
          </p>
        </div>

        <button 
          onClick={status === 'live' ? stopSession : startSession}
          className={`px-12 py-5 rounded-full font-cinzel text-xs tracking-[0.3em] transition-all shadow-2xl active:scale-95 ${
            status === 'live' ? 'bg-red-600 text-white' : 'bg-purple-600 text-white'
          }`}
        >
          {status === 'live' ? 'END BOND' : 'INITIATE VOICE'}
        </button>
      </div>
    </div>
  );
};

export default AudioPage;

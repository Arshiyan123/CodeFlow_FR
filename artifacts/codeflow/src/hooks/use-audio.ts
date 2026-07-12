import { useCallback, useRef } from 'react';
import { useSettings } from './use-settings';

// Simple synthesized sounds using Web Audio API
export function useAudio() {
  const { settings } = useSettings();
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playTone = useCallback((frequency: number, type: OscillatorType, duration: number, volMultiplier = 1) => {
    if (settings.muted || settings.volume === 0) return;

    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      const baseVol = settings.volume * volMultiplier;
      gainNode.gain.setValueAtTime(baseVol, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio errors
    }
  }, [settings.muted, settings.volume]);

  const playCorrect = useCallback(() => {
    // Subtle, quick mechanical click/tick
    playTone(400, 'sine', 0.05, 0.2);
  }, [playTone]);

  const playIncorrect = useCallback(() => {
    // Lower, slightly harsher thud
    playTone(150, 'sawtooth', 0.1, 0.3);
  }, [playTone]);

  const playComplete = useCallback(() => {
    // Satisfying ascending chime
    if (settings.muted || settings.volume === 0) return;
    try {
      const ctx = getAudioContext();
      const baseVol = settings.volume * 0.4;

      const playNote = (freq: number, startTimeOffset: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTimeOffset);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime + startTimeOffset);
        gainNode.gain.linearRampToValueAtTime(baseVol, ctx.currentTime + startTimeOffset + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTimeOffset + 0.5);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(ctx.currentTime + startTimeOffset);
        osc.stop(ctx.currentTime + startTimeOffset + 0.5);
      };

      playNote(523.25, 0); // C5
      playNote(659.25, 0.1); // E5
      playNote(783.99, 0.2); // G5
      playNote(1046.50, 0.3); // C6

    } catch (e) {}
  }, [settings.muted, settings.volume]);

  return { playCorrect, playIncorrect, playComplete };
}

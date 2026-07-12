import { useCallback, useRef } from 'react';
import { useSettings } from './use-settings';

export function useAudio() {
  const { settings } = useSettings();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      // Compressor so rapid/overlapping clicks (fast typing) never clip —
      // this is what lets us push individual sound gains much higher.
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.knee.value = 12;
      compressor.ratio.value = 8;
      compressor.attack.value = 0.002;
      compressor.release.value = 0.08;

      const masterGain = ctx.createGain();
      masterGain.gain.value = 1;

      masterGain.connect(compressor);
      compressor.connect(ctx.destination);
      masterGainRef.current = masterGain;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const getMasterGain = (ctx: AudioContext) => {
    if (!masterGainRef.current) getAudioContext();
    return masterGainRef.current!;
  };

  const getNoiseBuffer = (ctx: AudioContext) => {
    if (!noiseBufferRef.current) {
      const duration = 0.08;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noiseBufferRef.current = buffer;
    }
    return noiseBufferRef.current;
  };

  const playClickTransient = (ctx: AudioContext, gainAmount: number, filterFreq: number, q = 1) => {
    const master = getMasterGain(ctx);
    const src = ctx.createBufferSource();
    src.buffer = getNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = q;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gainAmount, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

    src.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(master);

    src.start();
    src.stop(ctx.currentTime + 0.05);
  };

  const playToneBody = (ctx: AudioContext, frequency: number, type: OscillatorType, duration: number, gainAmount: number) => {
    const master = getMasterGain(ctx);
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(gainAmount, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(master);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const playCorrect = useCallback(() => {
    if (settings.muted || settings.volume === 0) return;
    try {
      const ctx = getAudioContext();
      const vol = settings.volume;
      // Bright, punchy click — loud but shaped so it doesn't feel harsh.
      playClickTransient(ctx, vol * 1.6, 3400, 1.1);
      playToneBody(ctx, 600, 'triangle', 0.05, vol * 0.9);
    } catch (e) {
      // Ignore audio errors
    }
  }, [settings.muted, settings.volume]);

  const playIncorrect = useCallback(() => {
    if (settings.muted || settings.volume === 0) return;
    try {
      const ctx = getAudioContext();
      const vol = settings.volume;
      playClickTransient(ctx, vol * 1.4, 850, 0.9);
      playToneBody(ctx, 130, 'sawtooth', 0.13, vol * 1.0);
    } catch (e) {
      // Ignore audio errors
    }
  }, [settings.muted, settings.volume]);

  const playComplete = useCallback(() => {
    if (settings.muted || settings.volume === 0) return;
    try {
      const ctx = getAudioContext();
      const master = getMasterGain(ctx);
      const baseVol = settings.volume * 0.7;

      const playNote = (freq: number, startTimeOffset: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTimeOffset);

        gainNode.gain.setValueAtTime(0, ctx.currentTime + startTimeOffset);
        gainNode.gain.linearRampToValueAtTime(baseVol, ctx.currentTime + startTimeOffset + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTimeOffset + 0.5);

        osc.connect(gainNode);
        gainNode.connect(master);

        osc.start(ctx.currentTime + startTimeOffset);
        osc.stop(ctx.currentTime + startTimeOffset + 0.5);
      };

      playNote(523.25, 0);
      playNote(659.25, 0.1);
      playNote(783.99, 0.2);
      playNote(1046.50, 0.3);
    } catch (e) {}
  }, [settings.muted, settings.volume]);

  return { playCorrect, playIncorrect, playComplete };
}
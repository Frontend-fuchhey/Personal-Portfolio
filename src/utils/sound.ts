import { useState, useEffect, useCallback } from 'react';

// Audio synthesizer for macOS-style UI SFX without external dependencies
const SOUND_STORAGE_KEY = 'shrawan_os_sound_muted';

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      this.isMuted = saved === 'true';
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem(SOUND_STORAGE_KEY, String(muted));
      window.dispatchEvent(new CustomEvent('shrawan_sound_change', { detail: muted }));
    }
  }

  public toggleMuted(): boolean {
    const next = !this.isMuted;
    this.setMuted(next);
    if (!next) {
      // Play brief feedback pop when unmuted
      this.playFeedback(700, 0.05);
    }
    return next;
  }

  public playClick(): void {
    if (this.isMuted || typeof window === 'undefined') return;
    this.playTone(850, 220, 0.035, 0.08);
  }

  public playToggle(): void {
    if (this.isMuted || typeof window === 'undefined') return;
    this.playTone(550, 750, 0.045, 0.07);
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private playTone(startFreq: number, endFreq: number, duration: number, gainValue: number) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);

      gain.gain.setValueAtTime(gainValue, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio context might be restricted before first user interaction
    }
  }

  private playFeedback(freq: number, duration: number) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // fallback
    }
  }
}

export const soundManager = new SoundController();

export function useSound() {
  const [isMuted, setIsMutedState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return soundManager.getMuted();
    }
    return false;
  });

  useEffect(() => {
    const handleSoundChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setIsMutedState(customEvent.detail);
    };

    window.addEventListener('shrawan_sound_change', handleSoundChange);
    return () => {
      window.removeEventListener('shrawan_sound_change', handleSoundChange);
    };
  }, []);

  const toggleSound = useCallback(() => {
    const nextMuted = soundManager.toggleMuted();
    setIsMutedState(nextMuted);
  }, []);

  return {
    isMuted,
    toggleSound,
    playClick: () => soundManager.playClick(),
    playToggle: () => soundManager.playToggle(),
  };
}

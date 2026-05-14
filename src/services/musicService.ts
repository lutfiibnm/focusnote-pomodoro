/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class MusicService {
  private audio: HTMLAudioElement | null = null;
  // Reliable calm ambient track from Pixabay
  private musicLink = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio(this.musicLink);
      this.audio.loop = true;
      this.audio.preload = "auto";
    }
  }

  play() {
    if (this.audio) {
      this.audio.play().catch(e => {
        console.warn("Audio play blocked by browser. Usually requires user interaction first.", e);
      });
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  toggleMute(isMuted: boolean) {
    if (this.audio) {
      this.audio.muted = isMuted;
    }
  }

  // Helper to "warm up" the audio context on first user click
  unlock() {
    if (this.audio && this.audio.paused) {
      this.audio.play().then(() => {
        this.audio?.pause();
        this.audio!.currentTime = 0;
      }).catch(() => {});
    }
  }
}

export const musicService = new MusicService();

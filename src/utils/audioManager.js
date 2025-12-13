// Audio Manager for handling background music and landmark audio

class AudioManager {
  constructor() {
    this.backgroundAudio = null;
    this.landmarkAudio = null;
    this.backgroundVolume = 0.3;
    this.landmarkVolume = 0.5;
    this._fadeTimers = new Set();
  }

  // Initialize and play background music
  playBackgroundMusic(audioSrc) {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
      this.backgroundAudio = null;
    }

    this.backgroundAudio = new Audio(audioSrc);
    this.backgroundAudio.loop = true;
    this.backgroundAudio.volume = this.backgroundVolume;

    const playPromise = this.backgroundAudio.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Background music autoplay prevented:", error);
      });
    }

    return this.backgroundAudio;
  }

  // Stop background music
  stopBackgroundMusic() {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
      this.backgroundAudio.currentTime = 0;
    }
  }

  // Pause background music
  pauseBackgroundMusic() {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
    }
  }

  // Resume background music
  resumeBackgroundMusic() {
    if (this.backgroundAudio) {
      this.backgroundAudio.play().catch((error) => {
        console.log("Failed to resume background music:", error);
      });
    }
  }

  // Play landmark-specific audio
  playLandmarkAudio(audioSrc) {
    // Stop any currently playing landmark audio
    if (this.landmarkAudio) {
      this.stopLandmarkAudio();
    }

    // Lower background music volume when landmark audio plays
    if (this.backgroundAudio) {
      this._fadeVolume(
        this.backgroundAudio,
        this.backgroundAudio.volume,
        this.backgroundVolume * 0.3,
        600,
        undefined,
        "easeInOut"
      );
    }

    this.landmarkAudio = new Audio(audioSrc);
    // Start at 0 then fade in to target landmarkVolume
    this.landmarkAudio.volume = 0;

    // When landmark audio ends, restore background music volume
    this.landmarkAudio.addEventListener("ended", () => {
      if (this.backgroundAudio) {
        this._fadeVolume(
          this.backgroundAudio,
          this.backgroundAudio.volume,
          this.backgroundVolume,
          600,
          undefined,
          "easeInOut"
        );
      }
    });

    const playPromise = this.landmarkAudio.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Landmark audio play failed:", error);
        // Restore background volume even if landmark audio fails
        if (this.backgroundAudio) {
          this._fadeVolume(
            this.backgroundAudio,
            this.backgroundAudio.volume,
            this.backgroundVolume,
            600,
            undefined,
            "easeInOut"
          );
        }
      });
    }

    // Slight delay to align with overlay animation, then fade in
    setTimeout(() => {
      this._fadeVolume(
        this.landmarkAudio,
        this.landmarkAudio.volume ?? 0,
        this.landmarkVolume,
        1200,
        undefined,
        "easeInOut"
      );
    }, 500);

    return this.landmarkAudio;
  }

  // Stop landmark audio
  stopLandmarkAudio() {
    if (this.landmarkAudio) {
      // Fade out then stop
      const audioRef = this.landmarkAudio;
      this._fadeVolume(
        audioRef,
        audioRef.volume,
        0,
        1200,
        () => {
          audioRef.pause();
          audioRef.currentTime = 0;
          if (this.landmarkAudio === audioRef) {
            this.landmarkAudio = null;
          }
        },
        "easeInOut"
      );
    }

    // Restore background music volume
    if (this.backgroundAudio) {
      this._fadeVolume(
        this.backgroundAudio,
        this.backgroundAudio.volume,
        this.backgroundVolume,
        900,
        undefined,
        "easeInOut"
      );
    }
  }

  // Set background volume
  setBackgroundVolume(volume) {
    this.backgroundVolume = Math.max(0, Math.min(1, volume));
    if (this.backgroundAudio) {
      this.backgroundAudio.volume = this.backgroundVolume;
    }
  }

  // Set landmark audio volume
  setLandmarkVolume(volume) {
    this.landmarkVolume = Math.max(0, Math.min(1, volume));
    if (this.landmarkAudio) {
      this.landmarkAudio.volume = this.landmarkVolume;
    }
  }

  // Clean up all audio
  cleanup() {
    this.stopBackgroundMusic();
    this.stopLandmarkAudio();
    this.backgroundAudio = null;
    this.landmarkAudio = null;
    this._clearFades();
  }

  // Internal: fade volume for an HTMLAudioElement
  _fadeVolume(audioEl, from, to, durationMs, onComplete, easing = "linear") {
    try {
      if (!audioEl) return;
      const start = performance.now();
      const delta = to - from;
      const clamp01 = (x) => Math.max(0, Math.min(1, x));
      const ease = (t) => {
        switch (easing) {
          case "easeInOut":
            return 0.5 * (1 - Math.cos(Math.PI * t));
          case "linear":
          default:
            return t;
        }
      };
      const step = (now) => {
        const t = Math.min(1, (now - start) / durationMs);
        const k = ease(t);
        audioEl.volume = clamp01(from + delta * k);
        if (t < 1) {
          const id = requestAnimationFrame(step);
          this._fadeTimers.add(id);
        } else {
          if (onComplete) onComplete();
        }
      };
      const id = requestAnimationFrame(step);
      this._fadeTimers.add(id);
    } catch (e) {
      // Fallback: set volume immediately
      audioEl.volume = to;
      if (onComplete) onComplete();
    }
  }

  _clearFades() {
    try {
      for (const id of this._fadeTimers) cancelAnimationFrame(id);
      this._fadeTimers.clear();
    } catch {}
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;

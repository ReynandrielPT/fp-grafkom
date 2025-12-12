// Audio Manager for handling background music and landmark audio

class AudioManager {
  constructor() {
    this.backgroundAudio = null;
    this.landmarkAudio = null;
    this.backgroundVolume = 0.3;
    this.landmarkVolume = 0.5;
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
      playPromise.catch(error => {
        console.log('Background music autoplay prevented:', error);
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
      this.backgroundAudio.play().catch(error => {
        console.log('Failed to resume background music:', error);
      });
    }
  }

  // Play landmark-specific audio
  playLandmarkAudio(audioSrc) {
    // Stop any currently playing landmark audio
    if (this.landmarkAudio) {
      this.landmarkAudio.pause();
      this.landmarkAudio = null;
    }

    // Lower background music volume when landmark audio plays
    if (this.backgroundAudio) {
      this.backgroundAudio.volume = this.backgroundVolume * 0.3;
    }

    this.landmarkAudio = new Audio(audioSrc);
    this.landmarkAudio.volume = this.landmarkVolume;
    
    // When landmark audio ends, restore background music volume
    this.landmarkAudio.addEventListener('ended', () => {
      if (this.backgroundAudio) {
        this.backgroundAudio.volume = this.backgroundVolume;
      }
    });

    const playPromise = this.landmarkAudio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Landmark audio play failed:', error);
        // Restore background volume even if landmark audio fails
        if (this.backgroundAudio) {
          this.backgroundAudio.volume = this.backgroundVolume;
        }
      });
    }

    return this.landmarkAudio;
  }

  // Stop landmark audio
  stopLandmarkAudio() {
    if (this.landmarkAudio) {
      this.landmarkAudio.pause();
      this.landmarkAudio.currentTime = 0;
      this.landmarkAudio = null;
    }

    // Restore background music volume
    if (this.backgroundAudio) {
      this.backgroundAudio.volume = this.backgroundVolume;
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
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;

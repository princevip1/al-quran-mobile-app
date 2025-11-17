import { Audio, AVPlaybackStatus } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

export type PlaybackSpeed = 0.5 | 0.75 | 1.0 | 1.25 | 1.5 | 2.0;
export type RepeatMode = 'none' | 'one' | 'all';

export interface AudioTrack {
  surahNumber: number;
  ayahNumber: number;
  reciter: string;
  url: string;
  duration?: number;
}

export interface PlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: AudioTrack | null;
  position: number;
  duration: number;
  speed: PlaybackSpeed;
  repeatMode: RepeatMode;
  volume: number;
  queue: AudioTrack[];
  currentIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

class AudioPlayerService {
  private sound: Sound | null = null;
  private currentTrack: AudioTrack | null = null;
  private listeners: Set<(state: PlaybackState) => void> = new Set();
  private queue: AudioTrack[] = [];
  private currentIndex: number = -1;
  private playbackState: PlaybackState = {
    isPlaying: false,
    isLoading: false,
    currentTrack: null,
    position: 0,
    duration: 0,
    speed: 1.0,
    repeatMode: 'none',
    volume: 1.0,
    queue: [],
    currentIndex: -1,
    hasNext: false,
    hasPrevious: false,
  };

  constructor() {
    this.initAudio();
  }

  private async initAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  // Subscribe to playback state changes
  subscribe(listener: (state: PlaybackState) => void) {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.playbackState);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.playbackState));
  }

  private updateState(updates: Partial<PlaybackState>) {
    this.playbackState = { ...this.playbackState, ...updates };
    this.notifyListeners();
  }

  private onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      this.updateState({
        isPlaying: false,
        isLoading: false,
        position: 0,
        duration: 0,
      });
      return;
    }

    this.updateState({
      isPlaying: status.isPlaying,
      isLoading: status.isBuffering,
      position: status.positionMillis,
      duration: status.durationMillis || 0,
    });

    // Handle track completion
    if (status.didJustFinish && !status.isLooping) {
      this.handleTrackCompletion();
    }
  };

  private handleTrackCompletion = async () => {
    const { repeatMode } = this.playbackState;

    if (repeatMode === 'one') {
      // Replay current track
      await this.seekTo(0);
      await this.play();
    } else if (repeatMode === 'all' && this.hasNext()) {
      // Play next track in queue
      await this.playNext();
    } else if (repeatMode === 'none' && this.hasNext()) {
      // Auto-play next track (continuous playback)
      await this.playNext();
    } else {
      // End of queue, stop playback
      this.updateState({ isPlaying: false, position: 0 });
    }
  };

  async loadTrack(track: AudioTrack, autoPlay: boolean = true): Promise<boolean> {
    try {
      this.updateState({ isLoading: true });

      // Unload previous sound
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: autoPlay, rate: this.playbackState.speed, volume: this.playbackState.volume },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;
      this.currentTrack = track;
      
      // Add to queue if not already there
      if (!this.queue.find(t => t.surahNumber === track.surahNumber && t.ayahNumber === track.ayahNumber)) {
        this.queue = [track];
        this.currentIndex = 0;
      } else {
        this.currentIndex = this.queue.findIndex(t => t.surahNumber === track.surahNumber && t.ayahNumber === track.ayahNumber);
      }

      this.updateState({
        currentTrack: track,
        isLoading: false,
        queue: this.queue,
        currentIndex: this.currentIndex,
        hasNext: this.hasNext(),
        hasPrevious: this.hasPrevious(),
      });

      return true;
    } catch (error) {
      console.error('Failed to load track:', error);
      this.updateState({
        isLoading: false,
        currentTrack: null,
      });
      return false;
    }
  }

  async play(): Promise<void> {
    if (!this.sound) {
      console.warn('No sound loaded');
      return;
    }

    try {
      await this.sound.playAsync();
    } catch (error) {
      console.error('Failed to play:', error);
    }
  }

  async pause(): Promise<void> {
    if (!this.sound) return;

    try {
      await this.sound.pauseAsync();
    } catch (error) {
      console.error('Failed to pause:', error);
    }
  }

  async togglePlayPause(): Promise<void> {
    if (this.playbackState.isPlaying) {
      await this.pause();
    } else {
      await this.play();
    }
  }

  async seekTo(positionMillis: number): Promise<void> {
    if (!this.sound) return;

    try {
      await this.sound.setPositionAsync(positionMillis);
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  }

  async setSpeed(speed: PlaybackSpeed): Promise<void> {
    if (!this.sound) return;

    try {
      await this.sound.setRateAsync(speed, true);
      this.updateState({ speed });
    } catch (error) {
      console.error('Failed to set speed:', error);
    }
  }

  async setVolume(volume: number): Promise<void> {
    if (!this.sound) return;

    try {
      await this.sound.setVolumeAsync(volume);
      this.updateState({ volume });
    } catch (error) {
      console.error('Failed to set volume:', error);
    }
  }

  setRepeatMode(mode: RepeatMode): void {
    this.updateState({ repeatMode: mode });
  }

  async stop(): Promise<void> {
    if (!this.sound) return;

    try {
      await this.sound.stopAsync();
      await this.sound.setPositionAsync(0);
    } catch (error) {
      console.error('Failed to stop:', error);
    }
  }

  async cleanup(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.unloadAsync();
        this.sound = null;
        this.currentTrack = null;
        this.updateState({
          isPlaying: false,
          isLoading: false,
          currentTrack: null,
          position: 0,
          duration: 0,
        });
      } catch (error) {
        console.error('Failed to cleanup:', error);
      }
    }
  }

  // Queue management methods
  setQueue(tracks: AudioTrack[], startIndex: number = 0): void {
    this.queue = tracks;
    this.currentIndex = startIndex;
    this.updateState({
      queue: this.queue,
      currentIndex: this.currentIndex,
      hasNext: this.hasNext(),
      hasPrevious: this.hasPrevious(),
    });
  }

  private hasNext(): boolean {
    return this.currentIndex < this.queue.length - 1;
  }

  private hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  async playNext(): Promise<boolean> {
    if (!this.hasNext()) return false;

    this.currentIndex++;
    const nextTrack = this.queue[this.currentIndex];
    const success = await this.loadTrack(nextTrack, true);
    
    if (success) {
      this.updateState({
        currentIndex: this.currentIndex,
        hasNext: this.hasNext(),
        hasPrevious: this.hasPrevious(),
      });
    }
    
    return success;
  }

  async playPrevious(): Promise<boolean> {
    if (!this.hasPrevious()) return false;

    this.currentIndex--;
    const prevTrack = this.queue[this.currentIndex];
    const success = await this.loadTrack(prevTrack, true);
    
    if (success) {
      this.updateState({
        currentIndex: this.currentIndex,
        hasNext: this.hasNext(),
        hasPrevious: this.hasPrevious(),
      });
    }
    
    return success;
  }

  getState(): PlaybackState {
    return this.playbackState;
  }

  getCurrentTrack(): AudioTrack | null {
    return this.currentTrack;
  }
}

// Singleton instance
export const audioPlayerService = new AudioPlayerService();

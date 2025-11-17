import { useEffect, useState } from 'react';
import { audioPlayerService, PlaybackState } from '../services/audioPlayerService';

export function useAudioPlayer() {
  const [state, setState] = useState<PlaybackState>(audioPlayerService.getState());

  useEffect(() => {
    const unsubscribe = audioPlayerService.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...state,
    play: () => audioPlayerService.play(),
    pause: () => audioPlayerService.pause(),
    togglePlayPause: () => audioPlayerService.togglePlayPause(),
    seekTo: (position: number) => audioPlayerService.seekTo(position),
    setSpeed: (speed: Parameters<typeof audioPlayerService.setSpeed>[0]) => audioPlayerService.setSpeed(speed),
    setVolume: (volume: number) => audioPlayerService.setVolume(volume),
    setRepeatMode: (mode: Parameters<typeof audioPlayerService.setRepeatMode>[0]) => audioPlayerService.setRepeatMode(mode),
    stop: () => audioPlayerService.stop(),
    loadTrack: (track: Parameters<typeof audioPlayerService.loadTrack>[0]) => audioPlayerService.loadTrack(track),
    playNext: () => audioPlayerService.playNext(),
    playPrevious: () => audioPlayerService.playPrevious(),
    setQueue: (tracks: Parameters<typeof audioPlayerService.setQueue>[0], startIndex?: number) => audioPlayerService.setQueue(tracks, startIndex),
  };
}

import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTheme } from '../hooks/useTheme';
import { PlaybackSpeed, RepeatMode } from '../services/audioPlayerService';
import { Text } from './Text';

export function AudioPlayerBar() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [showFullPlayer, setShowFullPlayer] = React.useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = React.useState(false);

  const {
    isPlaying,
    isLoading,
    currentTrack,
    position,
    duration,
    speed,
    repeatMode,
    volume,
    hasNext,
    hasPrevious,
    togglePlayPause,
    seekTo,
    setSpeed,
    setRepeatMode,
    setVolume,
    stop,
    playNext,
    playPrevious,
  } = useAudioPlayer();

  if (!currentTrack) return null;

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  const speedOptions: PlaybackSpeed[] = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return 'repeat-outline';
    if (repeatMode === 'all') return 'repeat';
    return 'repeat-outline';
  };

  const cycleRepeatMode = () => {
    const modes: RepeatMode[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  // Mini Player (Bottom Bar)
  const MiniPlayer = () => (
    <Pressable onPress={() => setShowFullPlayer(true)}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.miniPlayer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {/* Progress Bar */}
        <View style={styles.miniProgressBar}>
          <View style={[styles.miniProgress, { width: `${progress * 100}%` }]} />
        </View>

        <View style={styles.miniPlayerContent}>
          {/* Track Info */}
          <View style={styles.miniTrackInfo}>
            <Ionicons name="musical-notes" size={20} color="#FFFFFF" />
            <View style={styles.miniTrackText}>
              <Text variant="body" color="#FFFFFF" weight="bold" numberOfLines={1}>
                Surah {currentTrack.surahNumber} - Ayah {currentTrack.ayahNumber}
              </Text>
              <Text variant="caption" color="#FFFFFF" style={{ opacity: 0.8 }}>
                {currentTrack.reciter}
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.miniControls}>
            <TouchableOpacity onPress={togglePlayPause} style={styles.miniPlayButton}>
              {isLoading ? (
                <Ionicons name="hourglass-outline" size={28} color="#FFFFFF" />
              ) : (
                <Ionicons 
                  name={isPlaying ? 'pause' : 'play'} 
                  size={28} 
                  color="#FFFFFF" 
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={stop} style={styles.miniCloseButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );

  // Full Player (Modal)
  const FullPlayer = () => (
    <Modal
      visible={showFullPlayer}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFullPlayer(false)}
    >
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.fullPlayer}
      >
        {/* Header */}
        <View style={styles.fullPlayerHeader}>
          <TouchableOpacity onPress={() => setShowFullPlayer(false)}>
            <Ionicons name="chevron-down" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          <Text variant="h4" color="#FFFFFF">
            {t('audio.title')}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Album Art / Visualization */}
        <View style={styles.albumArt}>
          <LinearGradient
            colors={[theme.colors.accent + '40', theme.colors.secondary + '40']}
            style={styles.albumArtGradient}
          >
            <Ionicons name="musical-notes" size={80} color="#FFFFFF" />
          </LinearGradient>
        </View>

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text variant="h2" color="#FFFFFF" style={{ textAlign: 'center' }}>
            Surah {currentTrack.surahNumber}
          </Text>
          <Text variant="h4" color="#FFFFFF" style={{ textAlign: 'center', marginTop: 8, opacity: 0.9 }}>
            Ayah {currentTrack.ayahNumber}
          </Text>
          <Text variant="body" color="#FFFFFF" style={{ textAlign: 'center', marginTop: 12, opacity: 0.8 }}>
            {currentTrack.reciter}
          </Text>
        </View>

        {/* Progress Slider */}
        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={seekTo}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#FFFFFF"
          />
          <View style={styles.timeContainer}>
            <Text variant="caption" color="#FFFFFF">
              {formatTime(position)}
            </Text>
            <Text variant="caption" color="#FFFFFF">
              {formatTime(duration)}
            </Text>
          </View>
        </View>

        {/* Main Controls */}
        <View style={styles.mainControls}>
          <TouchableOpacity 
            onPress={cycleRepeatMode}
            style={[styles.controlButton, repeatMode !== 'none' && styles.activeControlButton]}
          >
            <Ionicons 
              name={getRepeatIcon()} 
              size={28} 
              color={repeatMode !== 'none' ? theme.colors.accent : '#FFFFFF'} 
            />
            {repeatMode === 'one' && (
              <View style={styles.repeatBadge}>
                <Text variant="caption" color="#FFFFFF" style={{ fontSize: 10 }}>
                  1
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={playPrevious}
            disabled={!hasPrevious}
          >
            <Ionicons 
              name="play-skip-back" 
              size={32} 
              color={hasPrevious ? '#FFFFFF' : 'rgba(255,255,255,0.3)'} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={togglePlayPause} 
            style={[styles.playPauseButton, { backgroundColor: '#FFFFFF' }]}
          >
            {isLoading ? (
              <Ionicons name="hourglass-outline" size={36} color={theme.colors.primary} />
            ) : (
              <Ionicons 
                name={isPlaying ? 'pause' : 'play'} 
                size={36} 
                color={theme.colors.primary} 
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={playNext}
            disabled={!hasNext}
          >
            <Ionicons 
              name="play-skip-forward" 
              size={32} 
              color={hasNext ? '#FFFFFF' : 'rgba(255,255,255,0.3)'} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setShowSpeedMenu(!showSpeedMenu)}
            style={[styles.controlButton, speed !== 1.0 && styles.activeControlButton]}
          >
            <Text 
              variant="body" 
              color={speed !== 1.0 ? theme.colors.accent : '#FFFFFF'}
              weight="bold"
            >
              {speed}x
            </Text>
          </TouchableOpacity>
        </View>

        {/* Speed Menu */}
        {showSpeedMenu && (
          <View style={[styles.speedMenu, { backgroundColor: theme.colors.surface }]}>
            {speedOptions.map((speedOption) => (
              <TouchableOpacity
                key={speedOption}
                onPress={() => {
                  setSpeed(speedOption);
                  setShowSpeedMenu(false);
                }}
                style={[
                  styles.speedOption,
                  speed === speedOption && { backgroundColor: theme.colors.primary + '20' }
                ]}
              >
                <Text 
                  variant="body" 
                  color={speed === speedOption ? theme.colors.primary : theme.colors.text}
                  weight={speed === speedOption ? 'bold' : 'regular'}
                >
                  {speedOption}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Volume Control */}
        <View style={styles.volumeContainer}>
          <Ionicons name="volume-low" size={20} color="#FFFFFF" />
          <Slider
            style={styles.volumeSlider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={setVolume}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#FFFFFF"
          />
          <Ionicons name="volume-high" size={20} color="#FFFFFF" />
        </View>
      </LinearGradient>
    </Modal>
  );

  return (
    <>
      <MiniPlayer />
      <FullPlayer />
    </>
  );
}

const styles = StyleSheet.create({
  // Mini Player Styles
  miniPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 0,
  },
  miniProgressBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  miniProgress: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  miniPlayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  miniTrackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  miniTrackText: {
    marginLeft: 12,
    flex: 1,
  },
  miniControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniPlayButton: {
    padding: 4,
  },
  miniCloseButton: {
    padding: 4,
  },

  // Full Player Styles
  fullPlayer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  fullPlayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  albumArt: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 40,
  },
  albumArtGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfo: {
    marginBottom: 40,
  },
  progressContainer: {
    marginBottom: 32,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  controlButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  activeControlButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  playPauseButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  speedOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
  },
});

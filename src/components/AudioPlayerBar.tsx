import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SURAHS_METADATA } from '../constants/surahs';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTheme } from '../hooks/useTheme';
import { PlaybackSpeed, RepeatMode } from '../services/audioPlayerService';
import { Text } from './Text';

// Memoized PlayPauseButton to prevent blinking
const PlayPauseButton = React.memo(({ 
  isPlaying, 
  isLoading, 
  onPress, 
  size = 28, 
  color = '#FFFFFF',
  style 
}: { 
  isPlaying: boolean; 
  isLoading: boolean; 
  onPress: () => void; 
  size?: number; 
  color?: string;
  style?: any;
}) => {
  const iconName = isLoading ? 'hourglass-outline' : (isPlaying ? 'pause' : 'play');
  
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Ionicons name={iconName as any} size={size} color={color} />
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Only re-render if isPlaying or isLoading actually changes
  return prevProps.isPlaying === nextProps.isPlaying && 
         prevProps.isLoading === nextProps.isLoading;
});

PlayPauseButton.displayName = 'PlayPauseButton';

// Memoized FullPlayerModal component to prevent blinking
interface FullPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  reciter: string;
  position: number;
  duration: number;
  isPlaying: boolean;
  isLoading: boolean;
  speed: number;
  repeatMode: RepeatMode;
  volume: number;
  hasNext: boolean;
  hasPrevious: boolean;
  showSpeedMenu: boolean;
  speedOptions: PlaybackSpeed[];
  theme: any;
  t: any;
  formatTime: (millis: number) => string;
  onTogglePlayPause: () => void;
  onPlayNext: () => void;
  onPlayPrevious: () => void;
  onSeekTo: (value: number) => void;
  onSetSpeed: (speed: PlaybackSpeed) => void;
  onSetVolume: (volume: number) => void;
  onCycleRepeatMode: () => void;
  onToggleSpeedMenu: () => void;
  getRepeatIcon: () => string;
}

const FullPlayerModal = React.memo<FullPlayerModalProps>((
  {
    visible,
    onClose,
    surahName,
    surahNumber,
    ayahNumber,
    reciter,
    position,
    duration,
    isPlaying,
    isLoading,
    speed,
    repeatMode,
    volume,
    hasNext,
    hasPrevious,
    showSpeedMenu,
    speedOptions,
    theme,
    t,
    formatTime,
    onTogglePlayPause,
    onPlayNext,
    onPlayPrevious,
    onSeekTo,
    onSetSpeed,
    onSetVolume,
    onCycleRepeatMode,
    onToggleSpeedMenu,
    getRepeatIcon,
  }
) => (
  <Modal
    visible={visible}
    animationType="slide"
    presentationStyle="pageSheet"
    onRequestClose={onClose}
  >
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.primaryDark]}
      style={styles.fullPlayer}
    >
      {/* Header */}
      <View style={styles.fullPlayerHeader}>
        <TouchableOpacity onPress={onClose}>
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
          {surahName}
        </Text>
        <Text variant="h4" color="#FFFFFF" style={{ textAlign: 'center', marginTop: 8, opacity: 0.9 }}>
          {t('audio.ayah')} {ayahNumber}
        </Text>
        <Text variant="body" color="#FFFFFF" style={{ textAlign: 'center', marginTop: 12, opacity: 0.8 }}>
          {reciter}
        </Text>
      </View>

      {/* Progress Slider */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={onSeekTo}
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
          onPress={onCycleRepeatMode}
          style={[styles.controlButton, repeatMode !== 'none' && styles.activeControlButton]}
        >
          <Ionicons
            name={getRepeatIcon() as any}
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
          onPress={onPlayPrevious}
          disabled={!hasPrevious}
        >
          <Ionicons
            name="play-skip-back"
            size={32}
            color={hasPrevious ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
          />
        </TouchableOpacity>

        <PlayPauseButton
          isPlaying={isPlaying}
          isLoading={isLoading}
          onPress={onTogglePlayPause}
          size={36}
          color={theme.colors.primary}
          style={[styles.playPauseButton, { backgroundColor: '#FFFFFF' }]}
        />

        <TouchableOpacity
          style={styles.controlButton}
          onPress={onPlayNext}
          disabled={!hasNext}
        >
          <Ionicons
            name="play-skip-forward"
            size={32}
            color={hasNext ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onToggleSpeedMenu}
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
                onSetSpeed(speedOption);
                onToggleSpeedMenu();
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
          onValueChange={onSetVolume}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="rgba(255,255,255,0.3)"
          thumbTintColor="#FFFFFF"
        />
        <Ionicons name="volume-high" size={20} color="#FFFFFF" />
      </View>
    </LinearGradient>
  </Modal>
), (prevProps, nextProps) => {
  // Only re-render if critical props change, ignore position/duration updates
  return (
    prevProps.visible === nextProps.visible &&
    prevProps.surahNumber === nextProps.surahNumber &&
    prevProps.ayahNumber === nextProps.ayahNumber &&
    prevProps.isPlaying === nextProps.isPlaying &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.speed === nextProps.speed &&
    prevProps.repeatMode === nextProps.repeatMode &&
    prevProps.volume === nextProps.volume &&
    prevProps.hasNext === nextProps.hasNext &&
    prevProps.hasPrevious === nextProps.hasPrevious &&
    prevProps.showSpeedMenu === nextProps.showSpeedMenu
  );
});

FullPlayerModal.displayName = 'FullPlayerModal';

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

  // Memoize callbacks to prevent re-creating functions on every render
  const handleTogglePlayPause = React.useCallback(() => {
    togglePlayPause();
  }, [togglePlayPause]);

  const handleStop = React.useCallback(() => {
    stop();
  }, [stop]);

  const handlePlayNext = React.useCallback(() => {
    playNext();
  }, [playNext]);

  const handlePlayPrevious = React.useCallback(() => {
    playPrevious();
  }, [playPrevious]);

  const speedOptions: PlaybackSpeed[] = React.useMemo(() => [0.5, 0.75, 1.0, 1.25, 1.5, 2.0], []);

  const getRepeatIcon = React.useCallback(() => {
    if (repeatMode === 'one') return 'repeat-outline';
    if (repeatMode === 'all') return 'repeat';
    return 'repeat-outline';
  }, [repeatMode]);

  const cycleRepeatMode = React.useCallback(() => {
    const modes: RepeatMode[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  }, [repeatMode, setRepeatMode]);

  const handleToggleSpeedMenu = React.useCallback(() => {
    setShowSpeedMenu(prev => !prev);
  }, []);

  if (!currentTrack) return null;

  // Get surah name based on current language
  const currentLanguage = t('languageCode'); // 'en' or 'bn'
  const surahMetadata = SURAHS_METADATA.find(s => s.number === currentTrack.surahNumber);
  const surahName = currentLanguage === 'bn' 
    ? surahMetadata?.banglaName || `${t('audio.surah')} ${currentTrack.surahNumber}`
    : surahMetadata?.englishName || `${t('audio.surah')} ${currentTrack.surahNumber}`;

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? position / duration : 0;


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
                {surahName} - {t('audio.ayah')} {currentTrack.ayahNumber}
              </Text>
              <Text variant="caption" style={{ opacity: 0.8, color: '#FFFFFF' }}>
                {currentTrack.reciter}
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.miniControls}>
            <PlayPauseButton
              isPlaying={isPlaying}
              isLoading={isLoading}
              onPress={handleTogglePlayPause}
              size={28}
              color="#FFFFFF"
              style={styles.miniPlayButton}
            />
            <TouchableOpacity
              onPress={handleStop}
              style={styles.miniCloseButton}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );

  return (
    <>
      <MiniPlayer />
      <FullPlayerModal
        visible={showFullPlayer}
        onClose={() => setShowFullPlayer(false)}
        surahName={surahName}
        surahNumber={currentTrack.surahNumber}
        ayahNumber={currentTrack.ayahNumber}
        reciter={currentTrack.reciter}
        position={position}
        duration={duration}
        isPlaying={isPlaying}
        isLoading={isLoading}
        speed={speed}
        repeatMode={repeatMode}
        volume={volume}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        showSpeedMenu={showSpeedMenu}
        speedOptions={speedOptions}
        theme={theme}
        t={t}
        formatTime={formatTime}
        onTogglePlayPause={handleTogglePlayPause}
        onPlayNext={handlePlayNext}
        onPlayPrevious={handlePlayPrevious}
        onSeekTo={seekTo}
        onSetSpeed={setSpeed}
        onSetVolume={setVolume}
        onCycleRepeatMode={cycleRepeatMode}
        onToggleSpeedMenu={handleToggleSpeedMenu}
        getRepeatIcon={getRepeatIcon}
      />
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

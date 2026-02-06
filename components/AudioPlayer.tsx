/**
 * Audio Player Component
 * Handles guided meditation audio playback
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Slider } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AudioPlayerProps {
  audioUri?: string;
  onPlaybackComplete?: () => void;
}

export default function AudioPlayer({ audioUri, onPlaybackComplete }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAudio = async () => {
    try {
      if (!audioUri) {
        console.warn('No audio URI provided');
        return;
      }

      // Configure audio mode for background playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false, volume }
      );

      audioSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis || 0);
          setDuration(status.durationMillis || 0);
          setIsPlaying(status.isPlaying);

          if (status.didJustFinish) {
            setIsPlaying(false);
            onPlaybackComplete?.();
          }
        }
      });

      setSound(audioSound);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  useEffect(() => {
    if (audioUri) {
      loadAudio();
    }
  }, [audioUri]);

  const handlePlayPause = async () => {
    if (!sound) {
      await loadAudio();
      return;
    }

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error playing/pausing audio:', error);
    }
  };

  const handleSeek = async (value: number) => {
    if (sound) {
      try {
        await sound.setPositionAsync(value);
      } catch (error) {
        console.error('Error seeking audio:', error);
      }
    }
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    if (sound) {
      try {
        await sound.setVolumeAsync(value);
      } catch (error) {
        console.error('Error changing volume:', error);
      }
    }
  };

  const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioUri) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPause}
          disabled={!sound}
        >
          <MaterialCommunityIcons
            name={isPlaying ? 'pause' : 'play'}
            size={32}
            color="#1D4ED8"
          />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || 1}
            value={position}
            onValueChange={handleSeek}
            minimumTrackTintColor="#1D4ED8"
            maximumTrackTintColor="#E2E8F0"
            thumbTintColor="#1D4ED8"
            disabled={!sound}
          />
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.volumeContainer}>
        <MaterialCommunityIcons name="volume-high" size={20} color="#64748B" />
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={handleVolumeChange}
          minimumTrackTintColor="#1D4ED8"
          maximumTrackTintColor="#E2E8F0"
          thumbTintColor="#1D4ED8"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 10,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  playButton: {
    marginRight: 15,
    padding: 8,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
    minWidth: 40,
    textAlign: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  volumeSlider: {
    flex: 1,
    height: 40,
    marginLeft: 10,
  },
});

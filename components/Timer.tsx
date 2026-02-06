/**
 * Meditation Timer Component
 * Displays countdown timer with circular progress indicator
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.6;
const STROKE_WIDTH = 8;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface TimerProps {
  duration: number; // in minutes
  onComplete?: () => void;
  onPause?: (elapsed: number) => void;
  onTick?: (elapsed: number) => void;
}

type TimerPhase = 'setup' | 'practice' | 'closing';

export default function Timer({ duration, onComplete, onPause, onTick }: TimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [phase, setPhase] = useState<TimerPhase>('setup');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = duration * 60;
  const setupSeconds = 90; // 1.5 minutes
  const closingSeconds = 60; // 1 minute
  const practiceSeconds = totalSeconds - setupSeconds - closingSeconds;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const newSeconds = prev + 1;
          
          // Phase transitions
          if (phase === 'setup' && newSeconds >= setupSeconds) {
            setPhase('practice');
          } else if (phase === 'practice' && newSeconds >= setupSeconds + practiceSeconds) {
            setPhase('closing');
          }
          
          // Timer completion
          if (newSeconds >= totalSeconds) {
            setIsRunning(false);
            onComplete?.();
            return totalSeconds;
          }

          onTick?.(newSeconds);
          
          return newSeconds;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, phase, totalSeconds, setupSeconds, practiceSeconds, onComplete]);

  const handlePlayPause = () => {
    if (isRunning) {
      setIsRunning(false);
      onPause?.(elapsedSeconds);
    } else {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setPhase('setup');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    let phaseStart = 0;
    let phaseDuration = setupSeconds;
    
    if (phase === 'practice') {
      phaseStart = setupSeconds;
      phaseDuration = practiceSeconds;
    } else if (phase === 'closing') {
      phaseStart = setupSeconds + practiceSeconds;
      phaseDuration = closingSeconds;
    }
    
    const phaseElapsed = elapsedSeconds - phaseStart;
    return Math.min(phaseElapsed / phaseDuration, 1);
  };

  const progress = getProgress();
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const getPhaseLabel = (): string => {
    switch (phase) {
      case 'setup':
        return 'Setup';
      case 'practice':
        return 'Practice';
      case 'closing':
        return 'Closing';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.phaseIndicator}>
        <Text style={styles.phaseText}>{getPhaseLabel()}</Text>
      </View>
      
      <View style={styles.timerContainer}>
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.circle}>
          {/* Background circle */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke="#E2E8F0"
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke="#1D4ED8"
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
          />
        </Svg>
        
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(totalSeconds - elapsedSeconds)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handlePlayPause}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            {isRunning ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  phaseIndicator: {
    marginBottom: 20,
  },
  phaseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  timerContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  circle: {
    position: 'absolute',
  },
  timeContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  controls: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 30,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  primaryButton: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
});

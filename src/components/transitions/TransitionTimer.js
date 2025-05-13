import React, { useState, useEffect, useRef } from 'react';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { storage } from '../../infrastructure/storage/storage';
import { calendarService } from '../../services/calendar';
import { statistics } from '../../services/statistics';

const AnimatedCircle = Animated.createAnimatedComponent(SvgCircle);

const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 40px 20px;
  justify-content: space-between;
`;

const CIRCLE_SIZE = 220;
const CIRCLE_STROKE_WIDTH = 10;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * (CIRCLE_RADIUS - CIRCLE_STROKE_WIDTH);

const getThemeColors = (theme, themeType) => {
  const themeMap = {
    calm: {
      primary: theme.colors.teal,
      secondary: theme.colors.blue,
      background: theme.colors.background,
      text: theme.colors.text,
    },
    focus: {
      primary: theme.colors.purple,
      secondary: theme.colors.indigo,
      background: theme.colors.darkBackground,
      text: theme.colors.lightText,
    },
    energize: {
      primary: theme.colors.orange,
      secondary: theme.colors.yellow,
      background: theme.colors.warmBackground,
      text: theme.colors.darkText,
    },
  };

  return themeMap[themeType] || themeMap.calm;
};

const CircleContainer = styled.View`
  width: ${CIRCLE_SIZE}px;
  height: ${CIRCLE_SIZE}px;
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, themeType }) => getThemeColors(theme, themeType).background};
  border-radius: ${CIRCLE_SIZE / 2}px;
`;

const Circle = styled.View`
  width: ${CIRCLE_SIZE}px;
  height: ${CIRCLE_SIZE}px;
  position: absolute;
`;

const TimerContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const TimerText = styled.Text`
  font-size: 48px;
  font-weight: 600;
  color: ${({ theme, themeType }) => getThemeColors(theme, themeType).text};
  font-family: ${props => props.theme.fonts.heading};
`;

const PhaseText = styled.Text`
  font-size: 18px;
  color: ${({ theme, themeType }) => getThemeColors(theme, themeType).text};
  opacity: 0.7;
  margin-top: 8px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 16px;
  margin-top: auto;
  padding-bottom: 20px;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 25px;
  background-color: ${({ theme, secondary }) => secondary ? 'transparent' : theme.colors.primary};
  border: ${({ theme, secondary }) => secondary ? `1px solid ${theme.colors.primary}` : 'none'};
`;

const ButtonText = styled.Text`
  color: ${({ theme, secondary }) => secondary ? theme.colors.primary : 'white'};
  font-size: 16px;
  font-weight: 500;
  margin-left: 8px;
`;

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const usePulseAnimation = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      pulseAnim.stopAnimation();
    };
  }, []);

  return pulseAnim;
};

export const TransitionTimer = ({
  duration: defaultDuration = 300,
  onComplete,
  onSkip,
  type = 'work-to-break',
}) => {
  const [settings, setSettings] = useState({
    durations: {
      'work-to-break': 300,
      'break-to-work': 180,
      'morning-start': 600,
      'evening-wind-down': 900,
    },
    audio: {
      enabled: true,
      volume: 0.7,
      soundType: 'bells',
    },
    haptics: true,
    theme: 'calm',
  });

  const [sound, setSound] = useState();
  const duration = settings.durations[type] || defaultDuration;

  useEffect(() => {
    loadSettings();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadSettings = async () => {
    try {
      const prefs = await storage.getPreferences();
      if (prefs?.transitionSettings) {
        setSettings(prefs.transitionSettings);
      }
    } catch (error) {
      console.error('Error loading transition settings:', error);
    }
  };

  const playSound = async () => {
    if (!settings.audio.enabled) return;

    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const soundMap = {
        bells: require('../../assets/sounds/bells.mp3'),
        nature: require('../../assets/sounds/nature.mp3'),
        ocean: require('../../assets/sounds/ocean.mp3'),
      };

      const { sound: newSound } = await Audio.Sound.createAsync(soundMap[settings.audio.soundType], {
        volume: settings.audio.volume,
        isLooping: false,
      });

      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const triggerHaptics = () => {
    if (settings.haptics) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const timerRef = useRef(null);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  };

  useEffect(() => {
    if (!isActive) {
      pulseAnim.stopAnimation();
      glowAnim.stopAnimation();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          onComplete?.();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    progressAnimation.setValue(0);

    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: timeLeft * 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    startPulseAnimation();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  const startTimer = () => {
    setTimeLeft(duration);
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    pulseAnim.stopAnimation();
    glowAnim.stopAnimation();
    progressAnimation.stopAnimation();
  };

  const resumeTimer = () => {
    setIsPaused(false);
    setIsActive(true);
    startPulseAnimation();
    startTimer();
  };

  const skipTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLeft(duration);
    progressAnimation.setValue(0);
    onSkip?.();
  };

  const handleComplete = async () => {
    const startTime = new Date(Date.now() - timeElapsed * 1000); // Calculate when the transition started
    
    // Record statistics
    await statistics.recordTransition({
      type,
      startTime,
      duration,
      completed: true,
      skipped: false,
    });

    // Add transition to calendar
    await calendarService.addTransitionToCalendar(type, startTime, duration);
    setIsActive(false);
    
    if (settings.audio.enabled) {
      await playSound();
    }
    
    if (settings.haptics) {
      triggerHaptics();
    }

    // Save the completed transition
    const session = {
      id: Date.now().toString(),
      type: 'transition',
      subType: type,
      duration: Math.round((duration - timeLeft) / 60), // Convert to minutes
      date: new Date().toISOString()
    };

    await storage.saveSession(session);

    // Update weekly stats
    const stats = await storage.getWeeklyStats();
    const updatedStats = {
      ...stats,
      totalMinutes: (stats.totalMinutes || 0) + session.duration,
      sessionsCompleted: (stats.sessionsCompleted || 0) + 1,
      weeklyData: stats.weeklyData || Array(7).fill(0)
    };
    
    // Update today's minutes in weeklyData
    const today = new Date().getDay();
    updatedStats.weeklyData[today] += session.duration;

    await storage.updateWeeklyStats(updatedStats);

    // Update streak
    const streakData = await storage.getStreak();
    const lastSessionDate = new Date(streakData.lastSessionDate || 0);
    const currentDate = new Date();
    const isConsecutiveDay = 
      lastSessionDate.toDateString() === currentDate.toDateString() ||
      lastSessionDate.toDateString() === new Date(currentDate.setDate(currentDate.getDate() - 1)).toDateString();

    await storage.updateStreak({
      current: isConsecutiveDay ? (streakData.current || 0) + 1 : 1,
      lastSessionDate: new Date().toISOString()
    });

    onComplete?.();
  };

  const getPhaseText = () => {
    switch (type) {
      case 'work-to-break':
        return 'Time for a mindful break';
      case 'break-to-work':
        return 'Prepare to return to work';
      case 'morning-start':
        return 'Start your day mindfully';
      case 'evening-wind-down':
        return 'Wind down your day';
      default:
        return 'Take a mindful moment';
    }
  };



  // Calculate the initial rotation based on any existing progress
  const startRotation = -135 + (((duration - timeLeft) / duration) * 360);

  const rotateInterpolation = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [`${startRotation}deg`, '360deg'],
  });

  const opacityInterpolation = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const themeColors = getThemeColors(theme, settings.theme);

  return (
    <Container style={{ backgroundColor: themeColors.background }}>
      <CircleContainer themeType={settings.theme}>
        <Animated.View style={{
          transform: [{ scale: isActive ? pulseAnim : 1 }]
        }}>
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
            <SvgCircle
              cx={CIRCLE_RADIUS}
              cy={CIRCLE_RADIUS}
              r={CIRCLE_RADIUS - CIRCLE_STROKE_WIDTH}
              stroke={`${theme.colors.primary}20`}
              strokeWidth={CIRCLE_STROKE_WIDTH}
              fill="none"
            />
            <AnimatedCircle
              cx={CIRCLE_RADIUS}
              cy={CIRCLE_RADIUS}
              r={CIRCLE_RADIUS - CIRCLE_STROKE_WIDTH}
              stroke={themeColors.secondary}
              strokeWidth={CIRCLE_STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              strokeDashoffset={progressAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [CIRCLE_CIRCUMFERENCE, 0],
              })}
              strokeLinecap="round"
              opacity={isActive ? glowAnim : 1}
            />
          </Svg>
        </Animated.View>
        <TimerContainer>
          <TimerText themeType={settings.theme}>{formatTime(timeLeft)}</TimerText>
          <PhaseText themeType={settings.theme}>{getPhaseText()}</PhaseText>
        </TimerContainer>
      </CircleContainer>

      <ButtonContainer>
        {!isActive ? (
          <Button onPress={startTimer}>
            <Ionicons name="play" size={24} color="white" />
            <ButtonText>Start Transition</ButtonText>
          </Button>
        ) : isPaused ? (
          <Button onPress={resumeTimer}>
            <Ionicons name="play" size={24} color="white" />
            <ButtonText>Resume</ButtonText>
          </Button>
        ) : (
          <Button onPress={pauseTimer}>
            <Ionicons name="pause" size={24} color="white" />
            <ButtonText>Pause</ButtonText>
          </Button>
        )}

        {isActive && (
          <Button secondary onPress={skipTimer}>
            <Ionicons name="play-skip-forward" size={24} color={theme.colors.primary} />
            <ButtonText secondary>Skip</ButtonText>
          </Button>
        )}
      </ButtonContainer>
    </Container>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Animated, Easing } from 'react-native';
const AnimatedCircle = Animated.createAnimatedComponent(SvgCircle);
import { Ionicons } from '@expo/vector-icons';

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

const CircleContainer = styled.View`
  width: ${CIRCLE_SIZE}px;
  height: ${CIRCLE_SIZE}px;
  position: relative;
  align-items: center;
  justify-content: center;
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
  color: ${({ theme }) => theme.colors.text};
  font-family: ${props => props.theme.fonts.heading};
`;

const PhaseText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textLight};
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
  duration = 300, // 5 minutes default
  onComplete,
  onSkip,
  type = 'work-to-break',
}) => {
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

  return (
    <Container>
      <CircleContainer>
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
              stroke={theme.colors.primary}
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
          <TimerText>{formatTime(timeLeft)}</TimerText>
          <PhaseText>{getPhaseText()}</PhaseText>
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

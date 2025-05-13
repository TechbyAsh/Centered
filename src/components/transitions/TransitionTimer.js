import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Container = styled.View`
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ProgressCircle = styled(Animated.View)`
  width: 220px;
  height: 220px;
  border-radius: 110px;
  border-width: 10px;
  border-color: ${({ theme }) => `${theme.colors.primary}20`};
  align-items: center;
  justify-content: center;
  position: relative;
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
  align-items: center;
  margin-top: 30px;
  gap: 16px;
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
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsActive(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: timeLeft * 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const pauseTimer = () => {
    setIsPaused(true);
    clearInterval(timerRef.current);
    progressAnimation.stopAnimation();
  };

  const resumeTimer = () => {
    setIsPaused(false);
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

  const spin = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Container>
      <ProgressCircle as={Animated.View} style={{ transform: [{ rotate: spin }] }}>
        <TimerContainer>
          <TimerText>{formatTime(timeLeft)}</TimerText>
          <PhaseText>{getPhaseText()}</PhaseText>
        </TimerContainer>
      </ProgressCircle>

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

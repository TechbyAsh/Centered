import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { Animated, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  padding-top: 60px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.heading};
`;

const StepContainer = styled(LinearGradient)`
  flex: 1;
  margin: 20px;
  border-radius: 20px;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const StepTitle = styled.Text`
  font-size: 22px;
  font-weight: 500;
  color: white;
  text-align: center;
  margin-bottom: 15px;
`;

const StepDescription = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 30px;
`;

const Timer = styled.Text`
  font-size: 48px;
  font-weight: 600;
  color: white;
  margin-bottom: 30px;
`;

const ProgressBar = styled.View`
  width: ${width - 80}px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin-bottom: 30px;
`;

const Progress = styled(Animated.View)`
  height: 100%;
  background-color: white;
  border-radius: 2px;
`;

const ControlButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  margin: 0 10px;
`;

const ControlsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StepIndicator = styled.View`
  flex-direction: row;
  margin-top: 20px;
`;

const Dot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  margin: 0 4px;
`;

export const RitualSessionScreen = ({ route, navigation }) => {
  const { ritual } = route.params;
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);
  const sound = useRef(null);

  const stepDurations = ritual.steps.map(step => {
    const minutes = parseInt(step.match(/\((\d+)/)[1]);
    return minutes * 60; // Convert to seconds
  });

  useEffect(() => {
    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setTimeLeft(stepDurations[currentStep]);
    progressAnim.setValue(0);
  }, [currentStep]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startStep = async () => {
    setIsPlaying(true);
    const duration = stepDurations[currentStep];

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration * 1000,
      useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (currentStep < ritual.steps.length - 1) {
            setCurrentStep(currentStep + 1);
          } else {
            navigation.goBack();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseStep = () => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
    progressAnim.stopAnimation();
  };

  const skipStep = () => {
    clearInterval(timerRef.current);
    progressAnim.setValue(0);
    if (currentStep < ritual.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <Container>
      <Header>
        <Title>{ritual.title}</Title>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#00A896" />
        </TouchableOpacity>
      </Header>

      <StepContainer colors={ritual.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <StepTitle>Step {currentStep + 1}</StepTitle>
        <StepDescription>{ritual.steps[currentStep]}</StepDescription>
        <Timer>{formatTime(timeLeft)}</Timer>

        <ProgressBar>
          <Progress
            style={{
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }}
          />
        </ProgressBar>

        <ControlsContainer>
          <ControlButton onPress={() => isPlaying ? pauseStep() : startStep()}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={30}
              color="white"
            />
          </ControlButton>
          <ControlButton onPress={skipStep}>
            <Ionicons name="play-skip-forward" size={30} color="white" />
          </ControlButton>
        </ControlsContainer>

        <StepIndicator>
          {ritual.steps.map((_, index) => (
            <Dot key={index} active={index === currentStep} />
          ))}
        </StepIndicator>
      </StepContainer>
    </Container>
  );
};

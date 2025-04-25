import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Animated, TouchableOpacity, ScrollView, Alert } from "react-native";
import { BREATHING_PATTERNS } from '../infrastructure/breathing/patterns';
import { useBreathingAnimation } from '../infrastructure/breathing/useBreathingAnimation';
import { useTimer } from '../infrastructure/hooks/useTimer';
import { SoundModal } from '../components/SoundModal';
import { useDashboardData } from '../hooks/useDashboardData';


/* Styled Components */
const Container = styled.View`
  flex: 1;
  background-color: #d8fcf8;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  right: 20px;
  padding: 10px;
`;

const InstructionText = styled.Text`
  position: absolute;
  top: 75px;
  left: 20px;
  font-size: 26px;
  color: #00a896;
  text-align: left;
  align-self: flex-start;
  font-weight: 400;
  font-family:  ${({ theme }) => theme.fonts.heading};
`;

const AnimatedStartButton = styled(Animated.createAnimatedComponent(TouchableOpacity))`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  shadow-color: #00a896;
  shadow-opacity: 0.6;
  shadow-radius: 20px;
  shadow-offset: 0px 0px;
`;

const StartText = styled.Text`
  font-size: 18px;
  color: white;
  font-weight: 600;
`;

const TimerContainer = styled.View`
  position: absolute;
  bottom: 140px;
  align-items: center;
  width: 100%;
`;

const CountdownText = styled.Text`
  font-size: 24px;
  color: #00A896;
  font-family: ${({ theme }) => theme.fonts.heading};
  margin-bottom: 10px;
`;

const ProgressBar = styled.View`
  width: 80%;
  height: 4px;
  background-color: #E6F7F5;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled(Animated.View)`
  height: 100%;
  background-color: #00A896;
`;

const TimerButtonsContainer = styled.View`
  position: absolute;
  bottom: 60px;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`;

const MainSection = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const SoundButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  top: 20px;
  width: 44px;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 22px;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const TimerButton = styled.TouchableOpacity`
  background-color: ${({ selected }) => (selected ? "#00A896" : "#FFFFFF")};
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 20px;
  border: 2px solid #00A896;
`;

const TimerText = styled.Text`
  font-size: 16px;
  color: ${({ selected }) => (selected ? "white" : "#00A896")};
  font-weight: 600;
`;

const PatternButton = styled.TouchableOpacity`
  background-color: ${({ selected }) => (selected ? '#00A896' : '#FFFFFF')};
  padding: 15px;
  margin: 10px;
  border-radius: 15px;
  border: 2px solid #00A896;
  width: 150px;
`;

const PatternText = styled.Text`
  font-size: 16px;
  color: ${({ selected }) => (selected ? 'white' : '#00A896')};
  font-weight: 600;
  text-align: center;
`;

const PatternDescription = styled.Text`
  font-size: 14px;
  color: ${({ selected }) => (selected ? '#E6F7F5' : '#666')};
  text-align: center;
  margin-top: 5px;
`;

const PatternsContainer = styled.View`
  position: absolute;
  top: 120px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
`;

const defaultPattern = BREATHING_PATTERNS.default;

export const BreatheScreen = ({ navigation }) => {
  const [selectedPattern, setSelectedPattern] = useState(defaultPattern);
  const [isActive, setIsActive] = useState(false);
  const [selectedTime, setSelectedTime] = useState(5);
  const [showSoundModal, setShowSoundModal] = useState(false);

  const { scaleAnim, glowAnim } = useBreathingAnimation(selectedPattern, isActive);
  const { formattedTime, progress } = useTimer(selectedTime, isActive);
  const { addSession } = useDashboardData();

  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: selectedTime * 60000,
        useNativeDriver: false,
      }).start(() => {
        setIsActive(false);
        // Save the completed session
        addSession({
          type: 'Breathing',
          duration: selectedTime,
          pattern: selectedPattern.name
        });
      });
    } else {
      progressAnim.setValue(1);
    }

    return () => {
      progressAnim.setValue(1);
    };
  }, [isActive, selectedTime]);

  const handlePress = () => {
    setIsActive(!isActive);
  };

  const handlePatternSelect = (pattern) => {
    if (!isActive) {
      setSelectedPattern(pattern);
    }
  };

  return (
    <Container>
      <MainSection>
        <CloseButton onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#00A896" />
        </CloseButton>

        <SoundButton onPress={() => setShowSoundModal(true)}>
          <Ionicons name="musical-notes-outline" size={24} color="#00A896" />
        </SoundButton>

        <InstructionText>
          {selectedPattern?.name || 'Basic Breath'}
        </InstructionText>

        <PatternsContainer>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.entries(BREATHING_PATTERNS).map(([key, pattern]) => (
              <PatternButton
                key={key}
                selected={selectedPattern.name === pattern.name}
                onPress={() => handlePatternSelect(pattern)}
                disabled={isActive}
              >
                <PatternText selected={selectedPattern.name === pattern.name}>
                  {pattern.name}
                </PatternText>
                <PatternDescription selected={selectedPattern.name === pattern.name}>
                  {pattern.description}
                </PatternDescription>
              </PatternButton>
            ))}
          </ScrollView>
        </PatternsContainer>

        <AnimatedStartButton
          style={{ transform: [{ scale: scaleAnim }], opacity: glowAnim }}
          onPress={handlePress}
        >
          <LinearGradient
            colors={selectedPattern?.color || ['#00A896', '#02C39A']}
            style={{
              borderRadius: 50,
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StartText>{isActive ? "Stop" : "Start"}</StartText>
          </LinearGradient>
        </AnimatedStartButton>

        <TimerContainer>
          <CountdownText>{formattedTime}</CountdownText>
          <ProgressBar>
            <ProgressFill style={{ width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            })}} />
          </ProgressBar>
        </TimerContainer>

        <TimerButtonsContainer>
          {[1, 5, 10].map((time) => (
            <TimerButton
              key={time}
              selected={selectedTime === time}
              onPress={() => !isActive && setSelectedTime(time)}
              disabled={isActive}
            >
              <TimerText selected={selectedTime === time}>{time} min</TimerText>
            </TimerButton>
          ))}
        </TimerButtonsContainer>
      </MainSection>

      <SoundModal
        visible={showSoundModal}
        onClose={() => setShowSoundModal(false)}
      />
    </Container>
  );
}
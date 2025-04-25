import React, { useState, useRef } from 'react';
import styled from 'styled-components/native';
import { View, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 60px 20px 20px 20px;
`;

const HeaderText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  opacity: 0.8;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin: 20px;
`;

const Duration = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.card};
  padding: 8px 16px;
  border-radius: 20px;
  margin: 10px auto;
`;

const DurationText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  margin-left: 8px;
`;

const Description = styled.Text`
  color: ${props => props.theme.colors.textLight};
  font-size: 16px;
  text-align: center;
  margin: 20px;
  line-height: 24px;
`;

const PlayButton = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${props => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin: 30px auto;
  elevation: 5;
  shadow-color: ${props => props.theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
`;

const ModesContainer = styled.View`
  margin: 20px;
`;

const ModeTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 15px;
`;

const ModeCard = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${props => props.theme.colors.card};
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 15px;
  align-items: center;
`;

const ModeInfo = styled.View`
  flex: 1;
  margin-left: 15px;
`;

const ModeName = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 5px;
`;

const ModeDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
`;

export const MeditationDetailsScreen = ({ route, navigation }) => {
  const { meditation, category } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <HeaderText>SERENITY</HeaderText>
        <TouchableOpacity>
          <Ionicons name="grid-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </Header>

      <Title>{meditation.title}</Title>

      <Duration>
        <Ionicons name="time-outline" size={20} color={theme.colors.text} />
        <DurationText>{meditation.duration} Minutes</DurationText>
      </Duration>

      <Description>{meditation.description}</Description>

      <PlayButton onPress={togglePlay}>
        <Ionicons 
          name={isPlaying ? "pause" : "play"} 
          size={40} 
          color="white" 
        />
      </PlayButton>

      <ModesContainer>
        <ModeTitle>Relax Mode</ModeTitle>
        <ModeCard>
          <LinearGradient
            colors={['#E57373', '#EF5350']}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Ionicons name="moon" size={24} color="white" />
          </LinearGradient>
          <ModeInfo>
            <ModeName>Relax Mode</ModeName>
            <ModeDescription>For rest and recuperation</ModeDescription>
          </ModeInfo>
        </ModeCard>
      </ModesContainer>
    </Container>
  );
};

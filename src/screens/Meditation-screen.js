import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { ScrollView, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useDashboardData } from '../hooks/useDashboardData';

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

const CloseButton = styled.TouchableOpacity`
  padding: 10px;
`;

const MeditationCard = styled.TouchableOpacity`
  background-color: white;
  border-radius: 15px;
  margin: 10px 20px;
  padding: 20px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const MeditationTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const MeditationDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 12px;
`;

const MeditationDuration = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
`;

const PlayerContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const ProgressBar = styled.View`
  height: 4px;
  background-color: #eee;
  border-radius: 2px;
  margin: 10px 0;
`;

const Progress = styled(Animated.View)`
  height: 100%;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 2px;
`;

const PlayerControls = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
`;

const meditations = [
  {
    id: 1,
    title: 'Quick Calm',
    description: 'A brief meditation to find peace in a busy day',
    duration: 3,
    audioFile: require('../assets/meditations/placeholder.mp3'),
  },
  {
    id: 2,
    title: 'Mindful Break',
    description: 'Take a mindful pause to reset and refocus',
    duration: 5,
    audioFile: require('../assets/meditations/placeholder.mp3'),
  },
  {
    id: 3,
    title: 'Stress Relief',
    description: 'Release tension and find your center',
    duration: 7,
    audioFile: require('../assets/meditations/placeholder.mp3'),
  },
];

export const MeditationScreen = ({ navigation }) => {
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const sound = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const { addSession } = useDashboardData();

  useEffect(() => {
    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  const startMeditation = async (meditation) => {
    try {
      if (sound.current) {
        await sound.current.unloadAsync();
      }

      setSelectedMeditation(meditation);
      const { sound: newSound } = await Audio.Sound.createAsync(meditation.audioFile);
      sound.current = newSound;

      sound.current.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setProgress(status.positionMillis / status.durationMillis);
          Animated.timing(progressAnim, {
            toValue: status.positionMillis / status.durationMillis,
            duration: 100,
            useNativeDriver: false,
          }).start();

          if (status.didJustFinish) {
            setIsPlaying(false);
            setProgress(0);
            progressAnim.setValue(0);
            addSession({
              type: 'Meditation',
              duration: meditation.duration,
              name: meditation.title
            });
          }
        }
      });

      await sound.current.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing meditation:', error);
    }
  };

  const togglePlayPause = async () => {
    if (sound.current) {
      if (isPlaying) {
        await sound.current.pauseAsync();
      } else {
        await sound.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopMeditation = async () => {
    if (sound.current) {
      await sound.current.stopAsync();
      await sound.current.unloadAsync();
      setSelectedMeditation(null);
      setIsPlaying(false);
      setProgress(0);
      progressAnim.setValue(0);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Mini Meditations</Title>
        <CloseButton onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#00A896" />
        </CloseButton>
      </Header>

      <ScrollView>
        {meditations.map((meditation) => (
          <MeditationCard
            key={meditation.id}
            onPress={() => startMeditation(meditation)}
          >
            <MeditationTitle>{meditation.title}</MeditationTitle>
            <MeditationDescription>{meditation.description}</MeditationDescription>
            <MeditationDuration>{meditation.duration} minutes</MeditationDuration>
          </MeditationCard>
        ))}
      </ScrollView>

      {selectedMeditation && (
        <PlayerContainer>
          <MeditationTitle>{selectedMeditation.title}</MeditationTitle>
          <ProgressBar>
            <Progress style={{ width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            })}} />
          </ProgressBar>
          <PlayerControls>
            <TouchableOpacity onPress={togglePlayPause}>
              <Ionicons
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={50}
                color="#00A896"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={stopMeditation}>
              <Ionicons name="stop-circle" size={50} color="#00A896" />
            </TouchableOpacity>
          </PlayerControls>
        </PlayerContainer>
      )}
    </Container>
  );
};

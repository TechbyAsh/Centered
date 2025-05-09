import React, { useState, useRef, useEffect } from "react";
import styled from '@emotion/native';
import { View, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useDashboardData } from '../hooks/useDashboardData';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  padding: ${Platform.OS === 'ios' ? '50px 20px' : '20px'};
`;

const Header = styled.View`
  margin-bottom: 30px;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.heading};
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 4px;
`;

const RelaxCard = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3.84px;
`;

const RelaxTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const RelaxDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 12px;
`;

const RelaxDuration = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
`;

const PlayerContainer = styled.View`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
`;

const PlayerControls = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const relaxSessions = [
  {
    id: 1,
    title: 'Deep Breathing',
    description: 'Calm your mind with deep breathing exercises',
    duration: 5,
    audioFile: require("../../assets/sounds/rainSound.mp3"),
  },
  {
    id: 2,
    title: 'Body Scan',
    description: 'Release tension with a guided body scan',
    duration: 10,
    audioFile: require("../../assets/meditations/BodyScanMeditation.mp4"),
  },
  {
    id: 3,
    title: 'Progressive Relaxation',
    description: 'Systematically relax your muscles',
    duration: 15,
    audioFile: require('../../assets/sounds/waves.wav'),
  },
];

export const RelaxScreen = ({ navigation, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const sound = useRef(null);
  const { addSession } = useDashboardData();

  const handleSessionPress = async (session) => {
    try {
      setSelectedSession(session);
      if (sound.current) {
        await sound.current.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(session.audioFile);
      sound.current = newSound;
      setIsPlaying(true);
      await sound.current.playAsync();
      addSession({ type: 'relax', duration: session.duration });
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      // You might want to show an error message to the user here
    }
  };

  const togglePlayPause = async () => {
    if (!sound.current) return;
    if (isPlaying) {
      await sound.current.pauseAsync();
    } else {
      await sound.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <View>
            <Title>Relax</Title>
            <SubTitle>Take a moment to unwind</SubTitle>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </HeaderContent>
      </Header>

      {selectedSession && (
        <PlayerContainer>
          <RelaxTitle>{selectedSession.title}</RelaxTitle>
          <PlayerControls>
            <TouchableOpacity onPress={togglePlayPause}>
              <Ionicons
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={50}
                color="#00A896"
              />
            </TouchableOpacity>
          </PlayerControls>
        </PlayerContainer>
      )}

      {relaxSessions.map((session) => (
        <RelaxCard
          key={session.id}
          onPress={() => handleSessionPress(session)}
        >
          <RelaxTitle>{session.title}</RelaxTitle>
          <RelaxDescription>{session.description}</RelaxDescription>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={16} color="#00A896" />
            <RelaxDuration> {session.duration} minutes</RelaxDuration>
          </View>
        </RelaxCard>
      ))}
    </Container>
  );
};

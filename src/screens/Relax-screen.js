import React, { useState, useRef, useEffect } from "react";
import styled, { useTheme } from 'styled-components/native';
import { View, TouchableOpacity, Platform } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useDashboardData } from '../hooks/useDashboardData';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
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
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.heading};
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 4px;
`;
const MetricsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const MetricItem = styled.View`
  align-items: flex-start;
`;

const MetricLabel = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 4px;
`;

const MetricValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.text};
`;

const ContentContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const PlayerCard = styled.View`
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SoundGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 20px;
`;

const SoundButton = styled.TouchableOpacity`
  width: ${(Platform.OS === 'ios' ? '80px' : '72px')};
  height: ${(Platform.OS === 'ios' ? '80px' : '72px')};
  justify-content: center;
  align-items: center;
  background-color: ${({theme, isPlaying}) => 
    isPlaying ? theme.colors.primaryLight : theme.colors.surface};
  border-radius: 16px;
  margin: 8px;
  elevation: 2;
  ${Platform.OS === 'ios' && `
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
  `}
`;

const SoundText = styled.Text`
  font-size: 12px;
  color: ${({theme}) => theme.colors.text};
  margin-top: 4px;
  text-align: center;
`;

const ControlButton = styled.TouchableOpacity`
  align-self: center;
  margin: 20px 0;
`;

const BottomBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 28px;
  margin-top: auto;
`;
const sounds = [
    { name: "Rain", icon: "rainy-outline", file: require("../../assets/sounds/birdSound.wav") },
    { name: "Thunder", icon: "thunderstorm-outline", file: require("../../assets/sounds/birdSound.wav") },
    { name: "Fire", icon: "flame-outline", file: require("../../assets/sounds/fireplace.wav") },
    { name: "Waves", icon: "water-outline", file: require("../../assets/sounds/waves.wav") },
    { name: "Wind", icon: "cloud-outline", file: require("../../assets/sounds/birdSound.wav") },
    { name: "Crickets", icon: "moon-outline", file: require("../../assets/sounds/crickets.wav") },
    { name: "Birds", icon: "leaf-outline", file: require("../../assets/sounds/birdSound.wav") },
    { name: "Noise", icon: "volume-high-outline", file: require("../../assets/sounds/white-noise.wav") },
  ];

export const RelaxScreen = ({navigation}) => {
    const [playingSounds, setPlayingSounds] = useState({});
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const soundRefs = useRef({});
    const { addSession } = useDashboardData();
    const theme = useTheme();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Toggle play/pause for individual sounds
  const toggleSound = async (soundName, file) => {
    try {
      if (playingSounds[soundName]) {
        // Pause the sound if it's already playing
        await soundRefs.current[soundName]?.pauseAsync();
        setPlayingSounds((prev) => ({ ...prev, [soundName]: false }));
        
        // If no sounds are playing after this one is paused, end the session
        const stillPlaying = Object.values(playingSounds).some(isPlaying => isPlaying && isPlaying !== soundName);
        if (!stillPlaying && sessionStartTime) {
          const duration = Math.round((Date.now() - sessionStartTime) / 60000); // Convert to minutes
          addSession({
            type: 'Relax',
            duration: duration,
            soundscape: Object.keys(playingSounds).filter(sound => playingSounds[sound]).join(', ')
          });
          setSessionStartTime(null);
        }
      } else {
        if (!soundRefs.current[soundName]) {
          // Create and play sound if it hasn't been created yet
          const { sound } = await Audio.Sound.createAsync(file, { shouldPlay: true, isLooping: true });
          soundRefs.current[soundName] = sound;
        } else {
          // Resume sound if it was paused
          await soundRefs.current[soundName]?.playAsync();
        }
        setPlayingSounds((prev) => ({ ...prev, [soundName]: true }));
        
        // Start session timer if this is the first sound playing
        if (!sessionStartTime) {
          setSessionStartTime(Date.now());
        }
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Stop all sounds at once
  const stopAllSounds = async () => {
    // If session was active, save it
    if (sessionStartTime && Object.values(playingSounds).some(isPlaying => isPlaying)) {
      const duration = Math.round((Date.now() - sessionStartTime) / 60000); // Convert to minutes
      addSession({
        type: 'Relax',
        duration: duration,
        soundscape: Object.keys(playingSounds).filter(sound => playingSounds[sound]).join(', ')
      });
    }
    
    for (const soundName in soundRefs.current) {
      await soundRefs.current[soundName]?.stopAsync();
      await soundRefs.current[soundName]?.unloadAsync(); // Free up resources
    }
    soundRefs.current = {}; // Reset sound references
    setPlayingSounds({});
    setSessionStartTime(null);
  };
  
const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <View>
            <SubTitle>{formatTime(currentTime)}</SubTitle>
            <Title>Relax Mode</Title>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="grid-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </HeaderContent>

        <MetricsContainer>
          <MetricItem>
            <MetricLabel>Room temp</MetricLabel>
            <MetricValue>24°C</MetricValue>
          </MetricItem>
          <MetricItem>
            <MetricLabel>Humidity</MetricLabel>
            <MetricValue>66%</MetricValue>
          </MetricItem>
          <MetricItem>
            <MetricLabel>Duration</MetricLabel>
            <MetricValue>04:35</MetricValue>
          </MetricItem>
        </MetricsContainer>
      </Header>

      <ContentContainer>
        <PlayerCard>
          <Title>A soothing atmosphere</Title>
          <SubTitle>Mix sounds for rest and recovery</SubTitle>

          <SoundGrid>
            {sounds.map(({ name, icon, file }) => (
              <SoundButton 
                key={name} 
                onPress={() => toggleSound(name, file)}
                isPlaying={playingSounds[name]}
              >
                <Ionicons 
                  name={icon} 
                  size={32} 
                  color={playingSounds[name] ? theme.colors.primary : theme.colors.text} 
                />
                <SoundText>{name}</SoundText>
              </SoundButton>
            ))}
          </SoundGrid>
        </PlayerCard>

        <ControlButton onPress={stopAllSounds}>
          <Ionicons
            name="stop-circle"
            size={48}
            color={theme.colors.primary}
          />
        </ControlButton>

        <BottomBar>
          <TouchableOpacity>
            <Ionicons name="home" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="meditation" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="water" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="leaf" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </BottomBar>
      </ContentContainer>

    </Container>
  );
};


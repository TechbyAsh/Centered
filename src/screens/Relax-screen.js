import React, {useState, useRef} from "react";
import  styled  from 'styled-components/native';
import { SafeArea} from "../utils/safe-areacomponent";
import {Text, View, TouchableOpacity} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const Container = styled(LinearGradient)`
  flex: 1;
  align-items: center;
  padding: 20px;
`;


const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 30px;
  font-weight: bold;
  color: #4a4a4a;
  margin-bottom: 10px;
  top: 100px;
`;
const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  right: 20px;
  padding: 10px;
`;

const SoundGrid = styled.View`
position: absolute;
  bottom: 60px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const SoundButton = styled.TouchableOpacity`
  align-items: center;
  width: 80px;
`;

const SoundText = styled.Text`
  margin-top: 5px;
  color: #4a4a4a;
`;

const ControlButton = styled.TouchableOpacity`
  margin-top: 250px;
  justify-content: center;
  align-items: center;
  
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
    const soundRefs = useRef({});

    // Toggle play/pause for individual sounds
  const toggleSound = async (soundName, file) => {
    try {
      if (playingSounds[soundName]) {
        // Pause the sound if it's already playing
        await soundRefs.current[soundName]?.pauseAsync();
        setPlayingSounds((prev) => ({ ...prev, [soundName]: false }));
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
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Stop all sounds at once
  const stopAllSounds = async () => {
    for (const soundName in soundRefs.current) {
      await soundRefs.current[soundName]?.stopAsync();
      await soundRefs.current[soundName]?.unloadAsync(); // Free up resources
    }
    soundRefs.current = {}; // Reset sound references
    setPlayingSounds({});
  };
  
  return (
    <Container 
    colors={["#6294C2", "#ffffff"]}
    start={{ x: 0.5, y: 0 }}
    end={{ x: 0.5, y: 1 }}>
        <CloseButton onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={28} color="#00A896" />
      </CloseButton>

      <Title>Select the sounds and relax...</Title>
    
      <ControlButton onPress={ stopAllSounds}>
        <Ionicons
          name={"stop-circle"}
          size={100}
          color= "#A8DADC"
        />
      </ControlButton>

      <SoundGrid>
        {sounds.map(({ name, icon, file }) => (
          <SoundButton key={name} onPress={() => toggleSound(name, file)}>
            <Ionicons name={icon} size={36} color={playingSounds[name] ? "#6a9c78" : "#4a4a4a"} />
            <SoundText>{name}</SoundText>
          </SoundButton>
        ))}
      </SoundGrid>

    </Container>
  );
};

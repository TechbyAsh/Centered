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
  font-size: 30px;
  font-weight: bold;
  color: #4a4a4a;
  margin-bottom: 20px;
  top: 60px;
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

const MeditationButton = styled.TouchableOpacity`
  margin-top: 250px;
  justify-content: center;
  align-items: center;
  
`;
// Remove the file paths since we're not loading any sounds
const sounds = [
    { name: "Rain", icon: "rainy-outline" },
    { name: "Thunder", icon: "thunderstorm-outline" },
    { name: "Fire", icon: "flame-outline" },
    { name: "Waves", icon: "water-outline" },
    { name: "Wind", icon: "cloud-outline" },
    { name: "Crickets", icon: "moon-outline" },
    { name: "Birds", icon: "leaf-outline" },
    { name: "Noise", icon: "volume-high-outline" },
  ];

export const RelaxScreen = () => {
     // Local state toggles to simulate play/pause for sounds and meditation
  const [playingSounds, setPlayingSounds] = useState({});
  const [meditationPlaying, setMeditationPlaying] = useState(false);

  const toggleSound = (soundName) => {
    setPlayingSounds((prev) => ({ ...prev, [soundName]: !prev[soundName] }));
  };

  const toggleMeditation = () => {
    setMeditationPlaying((prev) => !prev);
  };

  return (
    <Container 
    colors={["#6294C2", "#ffffff"]}
    start={{ x: 0.5, y: 0 }}
    end={{ x: 0.5, y: 1 }}>
      <Title>Select the sounds and relax...</Title>
    
      <MeditationButton onPress={toggleMeditation}>
        <Ionicons
          name={meditationPlaying ? "pause-circle" : "play-circle"}
          size={100}
          color= "#A8DADC"
        />
      </MeditationButton>

      <SoundGrid>
        {sounds.map(({ name, icon }) => (
          <SoundButton key={name} onPress={() => toggleSound(name)}>
            <Ionicons
              name={icon}
              size={36}
              color={playingSounds[name] ? "#6a9c78" : "#4a4a4a"}
            />
            <SoundText>{name}</SoundText>
          </SoundButton>
        ))}
      </SoundGrid>

    </Container>
  );
};

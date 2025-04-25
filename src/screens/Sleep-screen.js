import React, {useRef, useState} from "react";
import  styled  from 'styled-components/native';
import {Text, View} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import LottieView from 'lottie-react-native';
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const Container = styled(LinearGradient)`
  flex: 1;
  align-items: center;
  padding: 20px;
`;

 const AnimationWrapper = styled.View`
  
  width: 100%;
  height: 50%;
  justify-content: center;
  align-items: center; 
  padding:${({ theme }) => theme.spacing.md};
`;

const ContentWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  right: 20px;
  padding: 10px;
`;

const ControlButton = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 15px 30px;
  background-color: ${({ isPlaying }) => (isPlaying ? "#E63946" : "#00A896")};
  border-radius: 25px;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  color: white;
  font-family: ${({ theme }) => theme.fonts.body};
`;

export const SleepScreen = ({navigation}) => {
    const animation = useRef(null);
    const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = async () => {
    if (!isPlaying) {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/sleep-meditation.mp3"),
        { shouldPlay: true, isLooping: true }
      );
      soundRef.current = sound;
      setIsPlaying(true);
    }
  };

  const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      setIsPlaying(false);
    }
  };


    return (
             <Container 
    colors={["#003366", "#0f52ba"]}
    start={{ x: 0.5, y: 0 }}
    end={{ x: 0.5, y: 1 }}>
        
        <CloseButton onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={28} color="#00A896" />
      </CloseButton>
     <ContentWrapper>

            <AnimationWrapper>
        <LottieView
          ref={animation}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
          source={require("../../assets/sleep-animation.json")}
        />
            </AnimationWrapper>
        
        <ControlButton isPlaying={isPlaying} onPress={isPlaying ? stopSound : playSound}>
        <ButtonText>{isPlaying ? "Stop Sound" : "Start Sound"}</ButtonText>
      </ControlButton>
      </ContentWrapper>

            </Container>
     
    )
}
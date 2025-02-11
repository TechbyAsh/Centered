import React, {useState, useEffect, useRef} from "react";
import  styled  from 'styled-components/native';
import { SafeArea} from "../utils/safe-areacomponent";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {Text, View, Animated, TouchableOpacity, Easing} from "react-native"


/* Styled Components */
const Container = styled.View`
  flex: 1;
  background-color: #d8fcf8;
  justify-content: space-between;
  align-items: center;
  padding: 80px 20px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  right: 20px;
  padding: 10px;
`;

const InstructionText = styled.Text`
  font-size: 26px;
  color: #00a896;
  text-align: left;
  align-self: flex-start;
  font-weight: 400;
`;

const AnimatedStartButton = styled(Animated.createAnimatedComponent(TouchableOpacity))`
  position: absolute;
  bottom: 50px;
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

export const BreatheScreen = ({navigation}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const startBreathing = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }; 
  

    const startGlow = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startBreathing();
    startGlow();
  }, []);

    return (
            <Container>
      {/* Close Button */}
      <CloseButton onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={28} color="#00A896" />
      </CloseButton>

      {/* Instruction Text */}
      <InstructionText>
        Be still.{"\n"}Bring your attention{"\n"}to your breath.
      </InstructionText>

      {/* Animated Start Button */}
        <AnimatedStartButton style={{ transform: [{ scale: scaleAnim }], opacity: glowAnim }} onPress={() => console.log("Start Breathing")}>
          <LinearGradient colors={["#00A896", "#028090"]} style={{ borderRadius: 50, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <StartText>Start</StartText>
          </LinearGradient>
        </AnimatedStartButton>
    </Container> 
    )
}
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
  justify-content: center;
  align-items: center;
  padding: 20px;
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

export const BreatheScreen = ({navigation}) => {
  const [isActive , setIsActive] = useState(false)
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const scaleLoopRef = useRef(null);
  const glowLoopRef = useRef(null);

  const startAnimations = () => {
    scaleLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 3.5,
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
    );

    glowLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    scaleLoopRef.current.start();
    glowLoopRef.current.start();
  }
  

  const stopAnimations = () => {
    scaleLoopRef.current?.stop();
    glowLoopRef.current?.stop();
  };

  const handlePress = () => {
    if (isActive) {
      stopAnimations();
    } else {
      startAnimations();
    }
    setIsActive(!isActive);
  };

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

      {/* Animated Start/Stop Button */}
      <AnimatedStartButton
        style={{ transform: [{ scale: scaleAnim }], opacity: glowAnim }}
        onPress={handlePress}
      >
        <LinearGradient
          colors={["#00A896", "#028090"]}
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
    </Container> 
    )
}
import React from "react";
import styled from '@emotion/native';
import { SafeArea } from "../utils/safe-areacomponent";
import { useTheme } from '@emotion/react';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding-horizontal: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 30px;
  text-align: center;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  padding-vertical: 64px;
  border-radius: 10px;
  margin-bottom: 15px;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.color};
`;

const ButtonText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
`;

export const WelcomeScreen = ({navigation}) => {
  const theme = useTheme();
  return (
    <SafeArea>
      <Container>
        <Title>What brings you here today?</Title>

        <Button color="#1ABC9C" onPress={() => navigation.navigate("App", { screen: "Breathe" })}>
          <ButtonText>Breathe</ButtonText>
        </Button>

        <Button color="#3498DB" onPress={() => navigation.navigate("App", { screen: "Relax" })}>
          <ButtonText>Relax</ButtonText>
        </Button>

        <Button color="#9B59B6" onPress={() => navigation.navigate("App", { screen: "Meditate" })}>
          <ButtonText>Meditate</ButtonText>
        </Button>

        <Button color="#E74C3C" onPress={() => navigation.navigate("App", { screen: "Sleep" })}>
          <ButtonText>Sleep</ButtonText>
        </Button>
      </Container>
    </SafeArea>
  );
};

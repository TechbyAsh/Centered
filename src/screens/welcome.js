import React from "react";
import  styled  from 'styled-components/native';
import { SafeArea} from "../utils/safe-areacomponent";


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
  background-color: ${(props) => props.color};
`;

const ButtonText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
`;


export const WelcomeScreen = ({navigation}) => {
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

      <Button color="#2C3E50" onPress={() => navigation.navigate("Sleep")}>
        <ButtonText>Sleep</ButtonText>
      </Button>
    </Container>
    </SafeArea>
  );
}

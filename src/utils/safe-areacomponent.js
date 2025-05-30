import { StatusBar, SafeAreaView } from "react-native";
import styled from "@emotion/native";

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  ${props => StatusBar.currentHeight && `margin-top: ${StatusBar.currentHeight}px`};
`;

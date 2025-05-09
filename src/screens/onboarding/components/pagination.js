import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { theme } from '../../../infrastructure/theme/theme.index';

const Dot = styled(Animated.View)`
  height: 10px;
  border-radius: 5px;
  background-color: ${props => props.theme.colors.primary};
  margin: 0 8px;
`;

export const Pagination = ({ data, x }) => {
  const theme = useTheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  return (
    <Container>
      {data.map((_, i) => {
        const dotAnimatedStyle = useAnimatedStyle(() => {
          const widthAnimation = interpolate(
            x.value,
            [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH],
            [10, 20, 10],
            Extrapolation.CLAMP
          );

          const opacityAnimation = interpolate(
            x.value,
            [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH],
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
          );

          return {
            width: widthAnimation,
            opacity: opacityAnimation,
          };
        });

        return <Dot key={i} style={dotAnimatedStyle} />;
      })}
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;
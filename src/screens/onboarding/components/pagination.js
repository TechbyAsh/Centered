import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { theme } from '../../../infrastructure/theme/theme.index';

const PaginationComp = ({ index, x, screenWidth }) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const widthAnimation = interpolate(
      x.value,
      [
        (index - 1) * screenWidth,
        index * screenWidth,
        (index + 1) * screenWidth,
      ],
      [10, 20, 10],
      Extrapolation.CLAMP
    );

    const opacityAnimation = interpolate(
      x.value,
      [
        (index - 1) * screenWidth,
        index * screenWidth,
        (index + 1) * screenWidth,
      ],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );

    return {
      width: widthAnimation,
      opacity: opacityAnimation,
    };
  });

  return <Animated.View style={[styles.dots, animatedDotStyle]} />;
};

export function Pagination({ data, x, screenWidth }) {
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <PaginationComp
          key={item.id}
          index={index}
          x={x}
          screenWidth={screenWidth}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.accent,
    marginHorizontal: 10,
  },
});
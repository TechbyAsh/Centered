import React from 'react';
import { FlatList, useWindowDimensions, View, ViewToken } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

import { Button } from '../onboarding/components/button';
import { Pagination } from '../onboarding/components/pagination';
import { theme } from '../../infrastructure/theme/theme.index';
import { data } from '../onboarding/screen.data';

const RenderItem = ({ item, index, x }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [0, 1, 0],
      Extrapolation.CLAMP
    );

    const translateYAnimation = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [100, 0, 100],
      Extrapolation.CLAMP
    );

    return {
      width: SCREEN_WIDTH * 0.8,
      height: SCREEN_WIDTH * 0.8,
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [0, 1, 0],
      Extrapolation.CLAMP
    );

    const translateYAnimation = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [100, 0, 100],
      Extrapolation.CLAMP
    );

    return {
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });

  return (
    <ItemContainer screenWidth={SCREEN_WIDTH}>
      <Animated.Image source={item.image} style={imageAnimatedStyle} />

      <Animated.View style={textAnimatedStyle}>
        <ItemTitle>{item.title}</ItemTitle>
        <ItemText>{item.text}</ItemText>
      </Animated.View>
    </ItemContainer>
  );
};

export function OnboardingScreen() {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const flatListRef = useAnimatedRef();

  const flatListIndex = useSharedValue(0);
  const x = useSharedValue(0);

  const onViewableItemsChanged = ({ viewableItems }) => {
    flatListIndex.value = viewableItems[0]?.index ?? 0;
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <Container>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => <RenderItem index={index} item={item} x={x} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
      />

      <FooterContainer>
        <Pagination data={data} screenWidth={SCREEN_WIDTH} x={x} />

        <Button flatListRef={flatListRef} flatListIndex={flatListIndex} dataLength={data.length} />
      </FooterContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const ItemContainer = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  align-items: center;
  justify-content: space-around;
  width: ${(props) => props.screenWidth}px;
`;

const ItemTitle = styled.Text`
  color: ${theme.colors.textPrimary};
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
`;

const ItemText = styled.Text`
  color: ${theme.colors.textPrimary};
  text-align: center;
  line-height: 20px;
  margin: 0 30px;
`;

const FooterContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 20px;
`;
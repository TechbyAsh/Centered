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

import { Pagination } from './components/pagination';
import { theme } from '../../infrastructure/theme/theme.index';
import { data } from './screen.data';

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

export function OnboardingScreen({ navigation }) {
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

  const handleGetStarted = () => {
    navigation.replace('Welcome');
  };

  const animatedGetStartedStyle = useAnimatedStyle(() => {
    const isLastSlide = Math.round(x.value / SCREEN_WIDTH) === data.length - 1;
    return {
      opacity: isLastSlide ? 1 : 0,
      transform: [{ translateY: isLastSlide ? 0 : 20 }],
      position: 'absolute',
    };
  });

  const animatedSkipStyle = useAnimatedStyle(() => {
    const isLastSlide = Math.round(x.value / SCREEN_WIDTH) === data.length - 1;
    return {
      opacity: isLastSlide ? 0 : 1,
      transform: [{ translateY: isLastSlide ? -20 : 0 }],
    };
  });

  const renderFooter = () => {
    return (
      <FooterContainer>
        <ButtonContainer>
          <Animated.View style={animatedSkipStyle}>
            <SkipButton onPress={handleGetStarted}>
              <SkipText>Skip</SkipText>
            </SkipButton>
          </Animated.View>
          <Animated.View style={animatedGetStartedStyle}>
            <GetStartedButton onPress={handleGetStarted}>
              <ButtonText>Get Started</ButtonText>
            </GetStartedButton>
          </Animated.View>
        </ButtonContainer>
        <Pagination data={data} x={x} />
      </FooterContainer>
    );
  };

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
        bounces={false}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold: 75,
        }}
      />
      {renderFooter()}
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
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ButtonContainer = styled.View`
  height: 60px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const GetStartedButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 16px 32px;
  border-radius: 25px;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: ${theme.colors.white};
  font-size: 18px;
  font-weight: bold;
`;

const SkipButton = styled.TouchableOpacity`
  padding: 16px;
  margin-top: 20px;
`;

const SkipText = styled.Text`
  color: ${theme.colors.text};
  font-size: 16px;
  opacity: 0.8;
`;
import React, { useState, useRef } from 'react';
import { View, FlatList, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import styled from '@emotion/native';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, TextButton, ScreenContainer } from '../../../components/shared/OnboardingComponents';
import { walkthroughData } from '../screen.data';
import { theme } from '../../../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WalkthroughScreen = () => {
  const { nextStep } = useOnboarding();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Handle scroll event to update current index
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(currentIndex);
  };

  // Navigate to next slide
  const goToNextSlide = () => {
    if (currentIndex < walkthroughData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // If we're on the last slide, proceed to next step
      nextStep();
    }
  };

  // Skip to next step
  const handleSkip = () => {
    nextStep();
  };

  // Render each slide
  const renderItem = ({ item }) => (
    <SlideContainer width={SCREEN_WIDTH}>
      <ImageContainer>
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="contain"
        />
      </ImageContainer>
      <TextContainer>
        <SlideTitle>{item.title}</SlideTitle>
        <SlideText>{item.text}</SlideText>
      </TextContainer>
    </SlideContainer>
  );

  // Render pagination dots
  const renderPagination = () => (
    <PaginationContainer>
      {walkthroughData.map((_, index) => (
        <PaginationDot key={index} active={index === currentIndex} />
      ))}
    </PaginationContainer>
  );

  return (
    <ScreenContainer>
      <SkipButtonContainer>
        <TextButton title="Skip" onPress={handleSkip} />
      </SkipButtonContainer>

      <FlatList
        ref={flatListRef}
        data={walkthroughData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {renderPagination()}

      <ButtonContainer>
        <PrimaryButton
          title={currentIndex === walkthroughData.length - 1 ? "Continue" : "Next"}
          onPress={goToNextSlide}
        />
      </ButtonContainer>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

const SlideContainer = styled.View`
  width: ${props => props.width}px;
  padding: ${theme.spacing.lg}px;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled.View`
  width: 100%;
  height: 250px;
  margin-bottom: ${theme.spacing.xl}px;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.View`
  align-items: center;
  padding: 0 ${theme.spacing.lg}px;
`;

const SlideTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: ${theme.spacing.md}px;
  font-family: ${theme.fonts.heading};
`;

const SlideText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  text-align: center;
  line-height: 24px;
  font-family: ${theme.fonts.body};
`;

const PaginationContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: ${theme.spacing.lg}px;
  margin-bottom: ${theme.spacing.lg}px;
`;

const PaginationDot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.border};
  margin: 0 ${theme.spacing.xs}px;
`;

const ButtonContainer = styled.View`
  padding: ${theme.spacing.lg}px;
  width: 100%;
`;

const SkipButtonContainer = styled.View`
  position: absolute;
  top: ${theme.spacing.md}px;
  right: ${theme.spacing.md}px;
  z-index: 1;
`;

export default WalkthroughScreen;

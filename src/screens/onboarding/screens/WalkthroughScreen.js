import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Image, Dimensions, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, TextButton } from '../../../components/shared/OnboardingComponents';
import { walkthroughData } from '../screen.data';
import { theme } from '../../../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WalkthroughScreen = () => {
  const { nextStep } = useOnboarding();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  // Handle scroll event to update current index
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(currentIndex);
  };

  // Animate when current index changes
  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: theme.animation.timing.standard,
      useNativeDriver: true,
    }).start();

    return () => {
      slideAnimation.setValue(0);
    };
  }, [currentIndex]);

  // Navigate to next slide
  const goToNextSlide = () => {
    if (currentIndex < walkthroughData.length - 1) {
      slideAnimation.setValue(0);
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
  const renderItem = ({ item, index }) => {
    return (
      <SlideContainer width={SCREEN_WIDTH}>
        <CarouselCard>
          <Animated.View
            style={{
              opacity: slideAnimation,
              transform: [
                {
                  translateY: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
              width: '100%',
            }}
          >
            <IllustrationContainer style={[styles.illustrationGradient, index % 2 === 0 ? styles.gradientEven : styles.gradientOdd]}>
              <LinearGradient
                colors={index % 2 === 0 ? 
                  [theme.colors.secondary + '80', theme.colors.accent + '20'] : 
                  [theme.colors.primary + '30', theme.colors.secondary + '60']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBackground}
              />
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
                accessibilityLabel={`Illustration for ${item.title}`}
              />

            </IllustrationContainer>
            <ContentContainer>
              <CarouselTitle>{item.title}</CarouselTitle>
              <CarouselDescription>{item.text}</CarouselDescription>
            </ContentContainer>
          </Animated.View>
        </CarouselCard>
      </SlideContainer>
    );
  };

  // Render pagination dots
  const renderPagination = () => (
    <PaginationContainer>
      {walkthroughData.map((_, index) => (
        <PaginationDot key={index} active={index === currentIndex} />
      ))}
    </PaginationContainer>
  );

  return (
    <CarouselContainer>
      <BackgroundGradient
        colors={[theme.colors.background, theme.colors.secondary + '20']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      <HeaderContainer>
        <SkipButtonContainer>
          <TextButton title="Skip" onPress={handleSkip} />
        </SkipButtonContainer>
      </HeaderContainer>

      <FlatList
        ref={flatListRef}
        data={walkthroughData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.flatListContent}
      />

      <BottomContainer>
        {renderPagination()}

        <NavigationContainer>
          {currentIndex > 0 && (
            <NavButton onPress={() => {
              slideAnimation.setValue(0);
              flatListRef.current?.scrollToIndex({
                index: currentIndex - 1,
                animated: true,
              });
            }}>
              <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
            </NavButton>
          )}
          
          <PrimaryButton
            title={currentIndex === walkthroughData.length - 1 ? "Continue" : "Next"}
            onPress={goToNextSlide}
          />
          
          {currentIndex < walkthroughData.length - 1 && (
            <NavButton onPress={goToNextSlide}>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
            </NavButton>
          )}
        </NavigationContainer>
      </BottomContainer>
    </CarouselContainer>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '80%',
    height: '80%',
  },
  illustrationGradient: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  gradientEven: {
    backgroundColor: theme.colors.secondary + '40',
  },
  gradientOdd: {
    backgroundColor: theme.colors.primary + '20',
  },

  flatListContent: {
    alignItems: 'center',
  },
});

const CarouselContainer = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  position: relative;
`;

const SlideContainer = styled.View`
  width: ${props => props.width}px;
  padding: 0 20px;
  justify-content: center;
  align-items: center;
`;

const CarouselCard = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 20px;
`;

const IllustrationContainer = styled.View`
  width: 100%;
  height: 240px;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  border-radius: 20px;
`;



const ContentContainer = styled.View`
  width: 100%;
  padding: 0 16px;
  align-items: center;
`;

const CarouselTitle = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 16px;
  text-align: center;
  font-family: ${theme.fonts.heading};
`;

const CarouselDescription = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  opacity: 0.7;
  text-align: center;
  line-height: 24px;
  font-family: ${theme.fonts.body};
`;

const BottomContainer = styled.View`
  width: 100%;
  padding: 0 20px 40px 20px;
`;

const PaginationContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

const PaginationDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.border};
  margin: 0 4px;
  opacity: ${props => props.active ? 1 : 0.5};
`;

const BackgroundGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const HeaderContainer = styled.View`
  width: 100%;
  padding: 50px 20px 0 20px;
  flex-direction: row;
  justify-content: flex-end;
  z-index: 10;
`;

const SkipButtonContainer = styled.View`
  z-index: 10;
`;

const NavigationContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
`;

const NavButton = styled.TouchableOpacity`
  padding: 16px;
`;

export default WalkthroughScreen;

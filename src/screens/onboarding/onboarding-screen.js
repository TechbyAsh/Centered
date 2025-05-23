import React, { useState } from 'react';
import { FlatList, useWindowDimensions, View, Animated, SafeAreaView } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

import { Pagination } from './components/pagination';
import PreferenceSetup from './components/PreferenceSetup';
import { data } from './screen.data';

const RenderItem = ({ item }) => {
  const theme = useTheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  if (!item) return null;

  return (
    <ItemContainer screenWidth={SCREEN_WIDTH}>
      <ContentContainer>
        <ImageWrapper screenWidth={SCREEN_WIDTH}>
          <StyledImage 
            source={item.image} 
            resizeMode="contain"
          />
        </ImageWrapper>
        <TextContainer>
          <ItemTitle>{item.title}</ItemTitle>
          <ItemText>{item.text}</ItemText>
        </TextContainer>
      </ContentContainer>
    </ItemContainer>
  );
};

export function OnboardingScreen({ navigation }) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreferences, setShowPreferences] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const [slides] = useState(data);

  const handleGetStarted = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowPreferences(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePreferencesComplete = (preferences) => {
    // Save preferences to context/storage here
    navigation.replace('Welcome', { preferences });
  };

  const handleScroll = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(newIndex);
  };

  if (showPreferences) {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <PreferenceSetup onComplete={handlePreferencesComplete} />
      </Animated.View>
    );
  }

  if (!data || data.length === 0) {
    console.log('No data available');
    return null;
  }

  if (!slides || slides.length === 0) {
    return (
      <Container>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ItemText>Loading...</ItemText>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={slides}
            keyExtractor={(item) => String(item?.id || Math.random())}
            renderItem={({ item }) => <RenderItem item={item} />}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
            contentContainerStyle={{
              alignItems: 'center',
              minHeight: '100%',
            }}
            initialNumToRender={5}
            maxToRenderPerBatch={2}
            windowSize={5}
          />
          <FooterContainer>
            <ButtonContainer>
              {currentIndex === slides.length - 1 ? (
                <GetStartedButton onPress={handleGetStarted}>
                  <GetStartedText>Continue</GetStartedText>
                </GetStartedButton>
              ) : (
                <SkipButton onPress={handleGetStarted}>
                  <SkipText>Skip</SkipText>
                </SkipButton>
              )}
            </ButtonContainer>
            <Pagination data={slides} currentIndex={currentIndex} />
          </FooterContainer>
        </View>
      </Animated.View>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  position: relative;
`;

const ItemContainer = styled.View`
  width: ${props => props.screenWidth}px;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-top: 40px;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  width: 100%;
  margin-bottom: 80px;
`;

const ImageWrapper = styled.View`
  width: ${props => props.screenWidth * 0.8}px;
  height: ${props => props.screenWidth * 0.6}px;
  margin-bottom: 40px;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const TextContainer = styled.View`
  width: 100%;
  padding: 0 20px;
  margin-bottom: 80px;
`;

const FooterContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background-color: ${props => props.theme.colors.background};
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

const ButtonContainer = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const SkipButton = styled.TouchableOpacity`
  padding: 16px 32px;
`;

const SkipText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  opacity: 0.8;
  font-family: ${props => props.theme.fonts.body};
`;

const GetStartedButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: 16px 32px;
  border-radius: 25px;
`;

const GetStartedText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: 18px;
  font-weight: bold;
  font-family: ${props => props.theme.fonts.heading};
`;

const ItemTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  font-family: ${props => props.theme.fonts.heading};
`;

const ItemText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  text-align: center;
  line-height: 24px;
  font-family: ${props => props.theme.fonts.body};
`;
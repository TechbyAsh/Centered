import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';
import styled from '@emotion/native';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, ScreenContainer, ScreenTitle, ScreenDescription } from '../../../components/shared/OnboardingComponents';
import { theme } from '../../../theme/theme';

const WelcomeScreen = () => {
  const { nextStep } = useOnboarding();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Animation sequence on mount
  useEffect(() => {
    // Sequence the animations
    Animated.sequence([
      // Fade in and scale up the logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <ScreenContainer>
      <ContentContainer>
        <LogoContainer>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            <Image 
              source={require('../../../../assets/assets-1/splash-icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </LogoContainer>
        
        <TextContainer>
          <ScreenTitle>Welcome to Pause</ScreenTitle>
          <ScreenDescription>
            Your journey to mindful transitions begins here. Discover how small pauses can transform your day.
          </ScreenDescription>
        </TextContainer>
        
        <ButtonContainer>
          <PrimaryButton 
            title="Get Started" 
            onPress={nextStep} 
          />
        </ButtonContainer>
      </ContentContainer>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 180,
    height: 180,
  },
});

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.lg}px;
`;

const LogoContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.xxl}px;
`;

const TextContainer = styled.View`
  align-items: center;
  margin-bottom: ${theme.spacing.xxl}px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  padding: ${theme.spacing.lg}px;
`;

export default WelcomeScreen;

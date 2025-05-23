import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, TextButton } from '../../../components/shared/OnboardingComponents';
import { theme } from '../../../theme/theme';

const WelcomeScreen = () => {
  const { nextStep } = useOnboarding();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeTextAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(20)).current;

  // Animation sequence on mount
  useEffect(() => {
    // Sequence the animations
    Animated.sequence([
      // Fade in and scale up the logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: theme.animation.timing.slow,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: theme.animation.timing.slow,
          useNativeDriver: true,
        }),
      ]),
      // Fade in and slide up the text content
      Animated.parallel([
        Animated.timing(fadeTextAnim, {
          toValue: 1,
          duration: theme.animation.timing.standard,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: theme.animation.timing.standard,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeAnim, scaleAnim, fadeTextAnim, slideUpAnim]);

  return (
    <WelcomeContainer>
      <BackgroundGradient
        colors={[theme.colors.secondary + '40', theme.colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <ContentContainer>
        <IllustrationSection>
          <LogoContainer>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
              <Image 
                source={require('../../../../assets/assets-1/splash-icon.png')} 
                style={styles.logo}
                resizeMode="contain"
                accessibilityLabel="Pause app logo"
              />
            </Animated.View>
          </LogoContainer>
          
          <IllustrationBackground>
            <IllustrationElements>
              {/* Decorative elements around the logo */}
              <DecorativeElement style={styles.plantElement} top="10%" left="15%">
                <Ionicons name="leaf-outline" size={24} color={theme.colors.primary} />
              </DecorativeElement>
              
              <DecorativeElement style={styles.heartElement} top="15%" right="20%">
                <Ionicons name="heart-outline" size={24} color={theme.colors.accent} />
              </DecorativeElement>
              
              <DecorativeElement style={styles.bookElement} bottom="30%" right="15%">
                <Ionicons name="book-outline" size={24} color={theme.colors.accent} />
              </DecorativeElement>
              
              <DecorativeElement style={styles.coffeeElement} bottom="25%" left="20%">
                <Ionicons name="cafe-outline" size={24} color={theme.colors.primary} />
              </DecorativeElement>
            </IllustrationElements>
          </IllustrationBackground>
        </IllustrationSection>
        
        <Animated.View style={{ 
          opacity: fadeTextAnim, 
          transform: [{ translateY: slideUpAnim }],
          width: '100%' 
        }}>
          <TextContainer>
            <WelcomeTitle>Welcome to Pause</WelcomeTitle>
            <WelcomeSubtitle>
              Your journey to mindful transitions begins here. Discover how small pauses can transform your day.
            </WelcomeSubtitle>
          </TextContainer>
          
          <ButtonContainer>
            <PrimaryButton 
              title="Get Started" 
              onPress={nextStep} 
            />
            
            <AccountContainer>
              <AccountText>Already have an account?</AccountText>
              <TextButton 
                title="Sign In" 
                onPress={() => {}} 
              />
            </AccountContainer>
          </ButtonContainer>
        </Animated.View>
      </ContentContainer>
      
      <ProgressDots>
        <ProgressDot active />
        <ProgressDot />
        <ProgressDot />
      </ProgressDots>
    </WelcomeContainer>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
  },

  plantElement: {
    backgroundColor: theme.colors.primary + '20',
  },
  heartElement: {
    backgroundColor: theme.colors.accent + '30',
  },
  bookElement: {
    backgroundColor: theme.colors.accent + '20',
  },
  coffeeElement: {
    backgroundColor: theme.colors.primary + '30',
  },
});

const WelcomeContainer = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  justify-content: space-between;
  align-items: center;
  padding: 0;
  position: relative;
`;

const BackgroundGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${theme.spacing.screenVertical}px ${theme.spacing.screenHorizontal}px;
  padding-bottom: 60px;
`;

const IllustrationSection = styled.View`
  width: 100%;
  height: 45%;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 40px;
`;

const IllustrationBackground = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const IllustrationElements = styled.View`
  width: 280px;
  height: 280px;
  position: relative;
`;

const DecorativeElement = styled.View`
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
`;

const LogoContainer = styled.View`
  width: 100px;
  height: 100px;
  background-color: ${theme.colors.white};
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.15;
  shadow-radius: 16px;
  elevation: 8;
  z-index: 10;
`;

const TextContainer = styled.View`
  align-items: center;
  margin-bottom: 32px;
  width: 100%;
  padding: 0 16px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  align-items: center;
`;

const AccountContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const AccountText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
  margin-right: 4px;
`;

const ProgressDots = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 30px;
  width: 100%;
`;

const ProgressDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.border};
  margin: 0 4px;
  opacity: ${props => props.active ? 1 : 0.5};
`;

const WelcomeTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 12px;
  font-family: ${theme.fonts.heading};
`;

const WelcomeSubtitle = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${theme.colors.text};
  opacity: 0.7;
  text-align: center;
  line-height: 24px;
  margin-bottom: 16px;
  font-family: ${theme.fonts.body};
`;

export default WelcomeScreen;

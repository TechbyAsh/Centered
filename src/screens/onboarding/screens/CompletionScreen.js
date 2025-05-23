import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, SecondaryButton, ScreenContainer, ScreenTitle, ScreenDescription, Card } from '../../../components/shared/OnboardingComponents';
import { theme } from '../../../theme/theme';

const CompletionScreen = ({ onComplete }) => {
  const { schedule, pausePreferences, notificationPreferences } = useOnboarding();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Create a rotating animation for the success icon
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Run animations on mount
  useEffect(() => {
    // Sequence the animations as specified in the feature spec
    Animated.sequence([
      // Fade in and scale up the success icon
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: theme.animation.timing.slow,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: theme.animation.timing.slow,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
      ]),
      // Rotate the success icon
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, rotateAnim]);

  // Handle trying the first pause moment
  const handleTryFirstPause = () => {
    // In a real app, this would navigate to a pause moment experience
    // For now, we'll navigate to the authentication flow
    onComplete('tryPause');
  };

  // Handle skipping to the home screen
  const handleSkipToHome = () => {
    onComplete('home');
  };

  return (
    <SuccessContainer>
      <ContentContainer>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: spin }
            ]
          }}
        >
          <SuccessIcon>
            <Ionicons name="checkmark" size={60} color={theme.colors.white} accessibilityLabel="Success checkmark" />
          </SuccessIcon>
        </Animated.View>

        <TextContainer>
          <SuccessTitle>You're All Set!</SuccessTitle>
          <SuccessDescription>
            Your Pause experience is now personalized and ready to help you create mindful transitions throughout your day.
          </SuccessDescription>
        </TextContainer>

        <SummaryContainer>
          <SummaryTitle>Your Preferences</SummaryTitle>
          
          <SummaryItem>
            <SummaryIcon>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
            </SummaryIcon>
            <SummaryText>
              Work hours: {schedule.workStartTime} - {schedule.workEndTime}
            </SummaryText>
          </SummaryItem>
          
          <SummaryItem>
            <SummaryIcon>
              <Ionicons name="restaurant-outline" size={20} color={theme.colors.primary} />
            </SummaryIcon>
            <SummaryText>
              Lunch break: {schedule.lunchTime}
            </SummaryText>
          </SummaryItem>
          
          <SummaryItem>
            <SummaryIcon>
              <Ionicons name="leaf-outline" size={20} color={theme.colors.primary} />
            </SummaryIcon>
            <SummaryText>
              Pause types: {[
                pausePreferences.includeBreathing && 'Breathing',
                pausePreferences.includeSoundscapes && 'Soundscapes',
                pausePreferences.includeMeditations && 'Meditations',
                pausePreferences.includeRituals && 'Rituals'
              ].filter(Boolean).join(', ')}
            </SummaryText>
          </SummaryItem>
          
          <SummaryItem>
            <SummaryIcon>
              <Ionicons name="notifications-outline" size={20} color={theme.colors.primary} />
            </SummaryIcon>
            <SummaryText>
              Notification frequency: {notificationPreferences.frequency}/10
            </SummaryText>
          </SummaryItem>
        </SummaryContainer>

        <ButtonsContainer>
          <PrimaryButton 
            title="Try Your First Pause Moment" 
            onPress={handleTryFirstPause} 
          />
          <SecondaryButton 
            title="Go to Home Screen" 
            onPress={handleSkipToHome} 
          />
        </ButtonsContainer>
      </ContentContainer>
    </SuccessContainer>
  );
};

// Styled Components based on feature spec
const SuccessContainer = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
`;



const SuccessIcon = styled.View`
  width: 120px;
  height: 120px;
  background-color: ${theme.colors.success};
  border-radius: 60px;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
  shadow-color: ${theme.colors.success};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.2;
  shadow-radius: 16px;
  elevation: 8;
`;

const TextContainer = styled.View`
  align-items: center;
  margin-bottom: 48px;
  width: 100%;
`;

const SummaryContainer = styled.View`
  width: 100%;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.card}px;
  padding: ${theme.spacing.cardPadding}px;
  margin-bottom: ${theme.spacing.xl}px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.08;
  shadow-radius: 16px;
  elevation: 4;
`;

const SuccessTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 16px;
`;

const SuccessDescription = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${theme.colors.text};
  opacity: 0.8;
  text-align: center;
  line-height: 24px;
  margin-bottom: 48px;
`;

const SummaryTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md}px;
  font-family: ${theme.fonts.heading};
`;

const SummaryItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const SummaryIcon = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${theme.colors.secondary}40;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.sm}px;
`;

const SummaryText = styled.Text`
  flex: 1;
  font-size: 14px;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  line-height: 20px;
`;

const ButtonsContainer = styled.View`
  width: 100%;
  margin-top: 16px;
`;

export default CompletionScreen;

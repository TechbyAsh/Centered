import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, SecondaryButton, ScreenContainer, ScreenTitle, ScreenDescription, ProgressBar } from '../../../components/shared/OnboardingComponents';
import { theme } from '../../../theme/theme';

const CompletionScreen = ({ onComplete }) => {
  const { schedule, pausePreferences, notificationPreferences } = useOnboarding();
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Create a rotating animation for the success icon
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Run animations on mount
  useEffect(() => {
    // Sequence the animations
    Animated.sequence([
      // Scale up the success icon
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      // Rotate the success icon
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, rotateAnim]);

  // Handle trying the first pause moment
  const handleTryFirstPause = () => {
    // In a real app, this would navigate to a pause moment experience
    // For now, we'll just complete the onboarding
    onComplete();
  };

  // Handle skipping to the home screen
  const handleSkipToHome = () => {
    onComplete();
  };

  return (
    <ScreenContainer>
      <ContentContainer>
        <SuccessContainer>
          <Animated.View
            style={{
              transform: [
                { scale: scaleAnim },
                { rotate: spin }
              ]
            }}
          >
            <SuccessCircle>
              <Ionicons name="checkmark" size={60} color={theme.colors.white} />
            </SuccessCircle>
          </Animated.View>
        </SuccessContainer>

        <TextContainer>
          <ScreenTitle>You're All Set!</ScreenTitle>
          <ScreenDescription>
            Your Pause experience is now personalized and ready to help you create mindful transitions throughout your day.
          </ScreenDescription>
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
    </ScreenContainer>
  );
};

// Styled Components
const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.lg}px;
`;

const SuccessContainer = styled.View`
  margin-bottom: ${theme.spacing.xl}px;
`;

const SuccessCircle = styled.View`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: ${theme.colors.primary};
  align-items: center;
  justify-content: center;
  ${theme.shadows.medium}
`;

const TextContainer = styled.View`
  align-items: center;
  margin-bottom: ${theme.spacing.xl}px;
`;

const SummaryContainer = styled.View`
  width: 100%;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.medium}px;
  padding: ${theme.spacing.lg}px;
  margin-bottom: ${theme.spacing.xl}px;
  ${theme.shadows.small}
`;

const SummaryTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
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
`;

const ButtonsContainer = styled.View`
  width: 100%;
`;

export default CompletionScreen;

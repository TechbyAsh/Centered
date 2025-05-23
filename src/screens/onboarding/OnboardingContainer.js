import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { theme } from '../../theme/theme';

// Import all onboarding screens
import WelcomeScreen from './screens/WelcomeScreen';
import WalkthroughScreen from './screens/WalkthroughScreen';
import ScheduleSetupScreen from './screens/ScheduleSetupScreen';
import PauseTypeScreen from './screens/PauseTypeScreen';
import NotificationScreen from './screens/NotificationScreen';
import PermissionsScreen from './screens/PermissionsScreen';
import CompletionScreen from './screens/CompletionScreen';

const OnboardingContainer = ({ navigation }) => {
  const { currentStep, completeOnboarding } = useOnboarding();
  const [fadeAnim] = useState(new Animated.Value(1));
  const [currentScreenIndex, setCurrentScreenIndex] = useState(currentStep);

  // Handle screen transitions with fade animation
  useEffect(() => {
    if (currentScreenIndex !== currentStep) {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentScreenIndex(currentStep);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [currentStep, currentScreenIndex, fadeAnim]);

  // Handle completion of onboarding
  const handleComplete = (destination = 'home') => {
    // Mark onboarding as complete in context
    completeOnboarding();
    
    // Navigate to authentication flow
    navigation.replace('Auth', { 
      onboardingComplete: true,
      destination: destination 
    });
  };

  // Render the current onboarding step
  const renderCurrentStep = () => {
    switch (currentScreenIndex) {
      case 0:
        return <WelcomeScreen />;
      case 1:
        return <WalkthroughScreen />;
      case 2:
        return <ScheduleSetupScreen />;
      case 3:
        return <PauseTypeScreen />;
      case 4:
        return <NotificationScreen />;
      case 5:
        return <PermissionsScreen />;
      case 6:
        return <CompletionScreen onComplete={handleComplete} />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {renderCurrentStep()}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
});

export default OnboardingContainer;

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme } from '../../theme/theme';

// Import auth screens
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

const AuthContainer = ({ navigation, route }) => {
  const { onboardingComplete } = route.params || { onboardingComplete: true };
  const [currentScreen, setCurrentScreen] = useState('signIn');
  const [fadeAnim] = useState(new Animated.Value(1));

  // Handle screen transitions with fade animation
  useEffect(() => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [currentScreen, fadeAnim]);

  // Navigate to sign in
  const navigateToSignIn = () => {
    setCurrentScreen('signIn');
  };

  // Navigate to sign up
  const navigateToSignUp = () => {
    setCurrentScreen('signUp');
  };

  // Navigate to forgot password
  const navigateToForgotPassword = () => {
    setCurrentScreen('forgotPassword');
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    navigation.replace('Welcome');
  };

  // Render the current auth screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'signIn':
        return (
          <SignInScreen 
            onSignUpPress={navigateToSignUp}
            onForgotPasswordPress={navigateToForgotPassword}
            onAuthSuccess={handleAuthSuccess}
            onboardingComplete={onboardingComplete}
          />
        );
      case 'signUp':
        return (
          <SignUpScreen 
            onSignInPress={navigateToSignIn}
            onAuthSuccess={handleAuthSuccess}
            onboardingComplete={onboardingComplete}
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPasswordScreen 
            onBackPress={navigateToSignIn}
          />
        );
      default:
        return (
          <SignInScreen 
            onSignUpPress={navigateToSignUp}
            onForgotPasswordPress={navigateToForgotPassword}
            onAuthSuccess={handleAuthSuccess}
            onboardingComplete={onboardingComplete}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {renderCurrentScreen()}
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

export default AuthContainer;

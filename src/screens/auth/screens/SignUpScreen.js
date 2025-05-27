import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Animated, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import styled from '@emotion/native';
import { useAuth } from '../../../context/AuthContext';
import { theme } from '../../../theme/theme';

const SignUpScreen = ({ onSignInPress, onAuthSuccess, onboardingComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();

  // Validate form
  const validateForm = () => {
    // Reset validation error
    setValidationError('');
    
    // Check if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      setValidationError('All fields are required');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    
    // Check password length
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return false;
    }
    
    return true;
  };

  // Handle sign up
  const handleSignUp = async () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Use the signUp function from auth context with correct parameters
      const result = await signUp(email, password, name);
      
      if (result.emailConfirmationRequired) {
        Alert.alert(
          "Email Verification Required",
          "Please check your email to verify your account before signing in.",
          [{ text: "OK", onPress: onSignInPress }]
        );
      } else if (result.success) {
        // If successful, call onAuthSuccess to navigate to the next screen
        onAuthSuccess();
      } else if (result.error) {
        setValidationError(result.error);
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setValidationError(err.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <BackgroundGradient
        colors={[theme.colors.primary + '20', theme.colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
      />
      
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ContentContainer>
          <HeaderContainer>
            <BackButton onPress={onSignInPress}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </BackButton>
            <HeaderTitle>Create Account</HeaderTitle>
            <View style={{ width: 24 }} />
          </HeaderContainer>
          
          <TitleContainer>
            <ScreenTitle>Join Pause</ScreenTitle>
            <ScreenDescription>
              Create an account to save your preferences and track your mindful moments
            </ScreenDescription>
          </TitleContainer>
          
          {onboardingComplete && (
            <OnboardingCompleteMessage>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} style={{ marginRight: 8 }} />
              <OnboardingCompleteText>Onboarding complete! Sign up to save your preferences.</OnboardingCompleteText>
            </OnboardingCompleteMessage>
          )}
          
          <FormContainer>
            <InputContainer>
              <InputLabel>Name</InputLabel>
              <StyledInput
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </InputContainer>
            
            <InputContainer>
              <InputLabel>Email</InputLabel>
              <StyledInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </InputContainer>
            
            <InputContainer>
              <InputLabel>Password</InputLabel>
              <PasswordInputContainer>
                <StyledInput
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ flex: 1 }}
                />
                <PasswordToggle onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color={theme.colors.text + '80'} 
                  />
                </PasswordToggle>
              </PasswordInputContainer>
            </InputContainer>
            
            <InputContainer>
              <InputLabel>Confirm Password</InputLabel>
              <PasswordInputContainer>
                <StyledInput
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ flex: 1 }}
                />
                <PasswordToggle onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color={theme.colors.text + '80'} 
                  />
                </PasswordToggle>
              </PasswordInputContainer>
            </InputContainer>
            
            {(validationError) && (
              <ErrorContainer>
                <Ionicons name="alert-circle-outline" size={18} color={theme.colors.error} />
                <ErrorText>{validationError}</ErrorText>
              </ErrorContainer>
            )}
            
            <SignUpButton onPress={handleSignUp} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color={theme.colors.white} size="small" />
              ) : (
                <SignUpButtonText>Create Account</SignUpButtonText>
              )}
            </SignUpButton>
          </FormContainer>
          
          <SignInContainer>
            <SignInText>Already have an account?</SignInText>
            <TouchableOpacity onPress={onSignInPress}>
              <SignInLinkText>Sign In</SignInLinkText>
            </TouchableOpacity>
          </SignInContainer>
        </ContentContainer>
      </ScrollView>
    </ScreenContainer>
  );
};

// Styled Components
const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
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
  padding: 40px ${theme.spacing.screenHorizontal}px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.heading};
`;

const TitleContainer = styled.View`
  align-items: center;
  margin-bottom: 32px;
`;

const ScreenTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 12px;
  font-family: ${theme.fonts.heading};
`;

const ScreenDescription = styled.Text`
  font-size: 16px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  font-family: ${theme.fonts.body};
  max-width: 300px;
`;

const OnboardingCompleteMessage = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.success + '15'};
  padding: 12px 16px;
  border-radius: ${theme.borderRadius.medium}px;
  margin-bottom: 24px;
`;

const OnboardingCompleteText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  flex: 1;
`;

const FormContainer = styled.View`
  margin-bottom: 32px;
`;

const InputContainer = styled.View`
  margin-bottom: 20px;
`;

const InputLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 8px;
  font-family: ${theme.fonts.body};
`;

const StyledInput = styled.TextInput`
  background-color: ${theme.colors.white};
  padding: 16px;
  border-radius: ${theme.borderRadius.input}px;
  font-size: 16px;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const PasswordInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.input}px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const PasswordToggle = styled.TouchableOpacity`
  padding: 0 16px;
`;

const ErrorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.error + '15'};
  padding: 12px 16px;
  border-radius: ${theme.borderRadius.medium}px;
  margin-bottom: 24px;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.error};
  font-family: ${theme.fonts.body};
  margin-left: 8px;
  flex: 1;
`;

const SignUpButton = styled.TouchableOpacity`
  background-color: ${props => props.disabled ? theme.colors.primary + '80' : theme.colors.primary};
  padding: 16px;
  border-radius: ${theme.borderRadius.button}px;
  align-items: center;
  justify-content: center;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  elevation: 4;
`;

const SignUpButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.white};
  font-family: ${theme.fonts.body};
`;

const LoadingIndicator = styled.ActivityIndicator``;

const SignInContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SignInText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.textSecondary};
  font-family: ${theme.fonts.body};
`;

const SignInLinkText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.body};
  margin-left: 8px;
`;

export default SignUpScreen;

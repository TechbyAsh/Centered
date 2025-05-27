import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Animated, Keyboard, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import styled from '@emotion/native';
import { useAuth } from '../../../context/AuthContext';
import { theme } from '../../../theme/theme';

const SignInScreen = ({ onSignUpPress, onForgotPasswordPress, onAuthSuccess, onboardingComplete }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState(null);
  
  const { signIn } = useAuth();

  // Validate form
  const validateForm = () => {
    if (!email || !password) {
      setValidationError('Please enter both email and password');
      return false;
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setValidationError('Invalid email address');
      return false;
    }
    
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return false;
    }
    
    setValidationError(null);
    return true;
  };

  // Handle sign in
  const handleSignIn = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await signIn(email, password);
      if (success) {
        onAuthSuccess();
      } else {
        setValidationError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setValidationError(err.message || 'An error occurred during sign in');
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
          <LogoContainer>
            <LogoPlaceholder>
              <Ionicons name="pause-circle" size={60} color={theme.colors.primary} />
            </LogoPlaceholder>
            <AppName>Pause</AppName>
          </LogoContainer>
          
          <TitleContainer>
            <ScreenTitle>Welcome Back</ScreenTitle>
            <ScreenDescription>
              Sign in to access your personalized mindful transitions
            </ScreenDescription>
          </TitleContainer>
          
          {onboardingComplete && (
            <OnboardingCompleteMessage>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} style={{ marginRight: 8 }} />
              <OnboardingCompleteText>Onboarding complete! Sign in to save your preferences.</OnboardingCompleteText>
            </OnboardingCompleteMessage>
          )}
          
          <FormContainer>
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
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
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
            
            <ForgotPasswordContainer>
              <TouchableOpacity onPress={onForgotPasswordPress}>
                <ForgotPasswordText>Forgot Password?</ForgotPasswordText>
              </TouchableOpacity>
            </ForgotPasswordContainer>
            
            {validationError && (
              <ErrorContainer>
                <Ionicons name="alert-circle-outline" size={18} color={theme.colors.error} />
                <ErrorText>{validationError}</ErrorText>
              </ErrorContainer>
            )}
            
            <SignInButton onPress={handleSignIn} disabled={isLoading}>
              {isLoading ? (
                <LoadingIndicator color={theme.colors.white} size="small" />
              ) : (
                <SignInButtonText>Sign In</SignInButtonText>
              )}
            </SignInButton>
          </FormContainer>
          
          <SignUpContainer>
            <SignUpText>Don't have an account?</SignUpText>
            <TouchableOpacity onPress={onSignUpPress}>
              <SignUpLinkText>Sign Up</SignUpLinkText>
            </TouchableOpacity>
          </SignUpContainer>
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
  justify-content: center;
`;

const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

const LogoPlaceholder = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${theme.colors.white};
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
`;

const AppName = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.primary};
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

const ForgotPasswordContainer = styled.View`
  align-items: flex-end;
  margin-bottom: 24px;
`;

const ForgotPasswordText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.body};
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

const SignInButton = styled.TouchableOpacity`
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

const SignInButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.white};
  font-family: ${theme.fonts.body};
`;

const LoadingIndicator = styled.ActivityIndicator``;

const SignUpContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SignUpText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.textSecondary};
  font-family: ${theme.fonts.body};
`;

const SignUpLinkText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.body};
  margin-left: 8px;
`;

export default SignInScreen;

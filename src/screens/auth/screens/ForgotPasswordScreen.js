import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import styled from '@emotion/native';
import { useAuth } from '../../../context/AuthContext';
import { theme } from '../../../theme/theme';

const ForgotPasswordScreen = ({ onBackPress }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const { resetPassword, isLoading, error } = useAuth();

  // Validate email
  const validateEmail = () => {
    // Reset validation error
    setValidationError('');
    
    // Check if email is filled
    if (!email) {
      setValidationError('Please enter your email address');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  // Handle reset password
  const handleResetPassword = async () => {
    Keyboard.dismiss();
    
    // Validate email
    if (!validateEmail()) {
      return;
    }
    
    // Attempt to reset password
    const success = await resetPassword(email);
    if (success) {
      setIsSubmitted(true);
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
            <BackButton onPress={onBackPress}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </BackButton>
            <HeaderTitle>Reset Password</HeaderTitle>
            <View style={{ width: 24 }} />
          </HeaderContainer>
          
          {!isSubmitted ? (
            <>
              <TitleContainer>
                <ScreenTitle>Forgot Password?</ScreenTitle>
                <ScreenDescription>
                  Enter your email address and we'll send you instructions to reset your password
                </ScreenDescription>
              </TitleContainer>
              
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
                
                {(validationError || error) && (
                  <ErrorContainer>
                    <Ionicons name="alert-circle-outline" size={18} color={theme.colors.error} />
                    <ErrorText>{validationError || error}</ErrorText>
                  </ErrorContainer>
                )}
                
                <ResetButton onPress={handleResetPassword} disabled={isLoading}>
                  {isLoading ? (
                    <LoadingIndicator color={theme.colors.white} size="small" />
                  ) : (
                    <ResetButtonText>Send Reset Instructions</ResetButtonText>
                  )}
                </ResetButton>
              </FormContainer>
            </>
          ) : (
            <SuccessContainer>
              <SuccessIcon>
                <Ionicons name="mail" size={40} color={theme.colors.white} />
              </SuccessIcon>
              
              <SuccessTitle>Check Your Email</SuccessTitle>
              <SuccessDescription>
                We've sent password reset instructions to:
              </SuccessDescription>
              <EmailText>{email}</EmailText>
              <SuccessDescription>
                Please check your inbox and follow the instructions to reset your password.
              </SuccessDescription>
              
              <BackToSignInButton onPress={onBackPress}>
                <BackToSignInText>Back to Sign In</BackToSignInText>
              </BackToSignInButton>
            </SuccessContainer>
          )}
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

const ResetButton = styled.TouchableOpacity`
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

const ResetButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.white};
  font-family: ${theme.fonts.body};
`;

const LoadingIndicator = styled.ActivityIndicator``;

const SuccessContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const SuccessIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  elevation: 4;
`;

const SuccessTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 16px;
  font-family: ${theme.fonts.heading};
`;

const SuccessDescription = styled.Text`
  font-size: 16px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  font-family: ${theme.fonts.body};
  margin-bottom: 8px;
`;

const EmailText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.primary};
  text-align: center;
  font-family: ${theme.fonts.body};
  margin-bottom: 16px;
`;

const BackToSignInButton = styled.TouchableOpacity`
  background-color: ${theme.colors.secondary};
  padding: 16px;
  border-radius: ${theme.borderRadius.button}px;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
  width: 100%;
  max-width: 300px;
`;

const BackToSignInText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
`;

export default ForgotPasswordScreen;

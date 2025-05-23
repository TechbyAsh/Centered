import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import styled from '@emotion/native';
import { theme } from '../../theme/theme';

// Primary Button Component
export const PrimaryButton = ({ title, onPress, disabled, loading }) => (
  <ButtonContainer onPress={onPress} disabled={disabled || loading} primary>
    {loading ? (
      <ActivityIndicator color={theme.colors.white} />
    ) : (
      <ButtonText primary>{title}</ButtonText>
    )}
  </ButtonContainer>
);

// Secondary Button Component
export const SecondaryButton = ({ title, onPress, disabled, loading }) => (
  <ButtonContainer onPress={onPress} disabled={disabled || loading} primary={false}>
    {loading ? (
      <ActivityIndicator color={theme.colors.primary} />
    ) : (
      <ButtonText primary={false}>{title}</ButtonText>
    )}
  </ButtonContainer>
);

// Text Button Component (for Skip, Back, etc.)
export const TextButton = ({ title, onPress, disabled }) => (
  <TextButtonContainer onPress={onPress} disabled={disabled}>
    <TextButtonText>{title}</TextButtonText>
  </TextButtonContainer>
);

// Progress Bar Component
export const ProgressBar = ({ currentStep, totalSteps }) => (
  <ProgressBarContainer>
    {Array.from({ length: totalSteps }).map((_, index) => (
      <React.Fragment key={index}>
        {index > 0 && (
          <ProgressLine active={index <= currentStep} />
        )}
        <ProgressDot active={index <= currentStep} />
      </React.Fragment>
    ))}
  </ProgressBarContainer>
);

// Screen Container Component
export const ScreenContainer = ({ children }) => (
  <Container>
    {children}
  </Container>
);

// Screen Title Component
export const ScreenTitle = ({ children }) => (
  <TitleText>{children}</TitleText>
);

// Screen Description Component
export const ScreenDescription = ({ children }) => (
  <DescriptionText>{children}</DescriptionText>
);

// Styled Components
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.md}px;
`;

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${props => props.primary ? theme.colors.primary : theme.colors.white};
  padding: ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.medium}px;
  align-items: center;
  justify-content: center;
  margin-vertical: ${theme.spacing.sm}px;
  opacity: ${props => props.disabled ? 0.6 : 1};
  border-width: ${props => props.primary ? 0 : 1}px;
  border-color: ${theme.colors.primary};
  ${theme.shadows.small}
`;

const ButtonText = styled.Text`
  color: ${props => props.primary ? theme.colors.white : theme.colors.primary};
  font-size: 16px;
  font-weight: 600;
  font-family: ${theme.fonts.heading};
`;

const TextButtonContainer = styled.TouchableOpacity`
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  opacity: ${props => props.disabled ? 0.6 : 1};
`;

const TextButtonText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 16px;
  font-family: ${theme.fonts.body};
`;

const ProgressBarContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-vertical: ${theme.spacing.lg}px;
`;

const ProgressDot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.border};
`;

const ProgressLine = styled.View`
  width: 20px;
  height: 2px;
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.border};
  margin-horizontal: 2px;
`;

const TitleText = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm}px;
  font-family: ${theme.fonts.heading};
`;

const DescriptionText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.lg}px;
  font-family: ${theme.fonts.body};
  opacity: 0.8;
  line-height: 24px;
`;

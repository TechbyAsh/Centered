import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import styled from '@emotion/native';
import { theme } from '../../theme/theme';

// Primary Button Component with animation based on feature spec
export const PrimaryButton = ({ title, onPress, disabled, loading }) => {
  const animatedScale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(animatedScale, {
      toValue: 0.95,
      duration: theme.animation.timing.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedScale, {
      toValue: 1,
      duration: theme.animation.timing.fast,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
      <ButtonContainer 
        onPress={onPress} 
        disabled={disabled || loading} 
        primary
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <ButtonText primary>{title}</ButtonText>
        )}
      </ButtonContainer>
    </Animated.View>
  );
};

// Secondary Button Component with animation based on feature spec
export const SecondaryButton = ({ title, onPress, disabled, loading }) => {
  const animatedScale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(animatedScale, {
      toValue: 0.95,
      duration: theme.animation.timing.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedScale, {
      toValue: 1,
      duration: theme.animation.timing.fast,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
      <ButtonContainer 
        onPress={onPress} 
        disabled={disabled || loading} 
        primary={false}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <ButtonText primary={false}>{title}</ButtonText>
        )}
      </ButtonContainer>
    </Animated.View>
  );
};

// Text Button Component (for Skip, Back, etc.) with animation
export const TextButton = ({ title, onPress, disabled }) => {
  const animatedOpacity = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(animatedOpacity, {
      toValue: 0.7,
      duration: theme.animation.timing.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: theme.animation.timing.fast,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ opacity: animatedOpacity }}>
      <TextButtonContainer 
        onPress={onPress} 
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <TextButtonText>{title}</TextButtonText>
      </TextButtonContainer>
    </Animated.View>
  );
};

// Progress Bar Component with animation based on feature spec
export const ProgressBar = ({ currentStep, totalSteps }) => {
  const animatedValues = React.useRef(
    Array.from({ length: totalSteps }).map(() => new Animated.Value(0))
  ).current;

  React.useEffect(() => {
    // Animate progress dots and lines when currentStep changes
    animatedValues.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: index <= currentStep ? 1 : 0,
        duration: theme.animation.timing.medium,
        useNativeDriver: false, // We need to animate backgroundColor
      }).start();
    });
  }, [currentStep, animatedValues]);

  return (
    <ProgressBarContainer>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <AnimatedProgressLine 
              style={{ 
                backgroundColor: animatedValues[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [theme.colors.border, theme.colors.primary]
                })
              }} 
            />
          )}
          <AnimatedProgressDot 
            style={{ 
              backgroundColor: animatedValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [theme.colors.border, theme.colors.primary]
              })
            }} 
          />
        </React.Fragment>
      ))}
    </ProgressBarContainer>
  );
};

// Screen Container Component with styling from feature spec
export const ScreenContainer = ({ children, gradient }) => (
  <Container gradient={gradient}>
    {children}
  </Container>
);

// Screen Title Component with typography from feature spec
export const ScreenTitle = ({ children, centered }) => (
  <TitleText centered={centered}>{children}</TitleText>
);

// Screen Description Component with typography from feature spec
export const ScreenDescription = ({ children, centered }) => (
  <DescriptionText centered={centered}>{children}</DescriptionText>
);

// Card Component based on feature spec
export const Card = ({ children, style }) => (
  <CardContainer style={style}>
    {children}
  </CardContainer>
);

// Illustration Container Component based on feature spec
export const IllustrationContainer = ({ children }) => (
  <IllustrationWrapper>
    {children}
  </IllustrationWrapper>
);

// Styled Components based on feature spec
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.gradient ? 'transparent' : theme.colors.background};
  padding: ${theme.spacing.screenVertical}px ${theme.spacing.screenHorizontal}px;
`;

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${props => props.primary ? theme.colors.primary : theme.colors.white};
  padding: 16px 32px;
  border-radius: ${theme.borderRadius.button}px;
  align-items: center;
  justify-content: center;
  margin-vertical: ${theme.spacing.sm}px;
  opacity: ${props => props.disabled ? 0.6 : 1};
  border-width: ${props => props.primary ? 0 : 2}px;
  border-color: ${props => props.primary ? 'transparent' : theme.colors.border};
  min-height: 56px;
  ${props => props.primary ? theme.shadows.button : ''}
`;

const ButtonText = styled.Text`
  color: ${props => props.primary ? theme.colors.white : theme.colors.text};
  font-size: 16px;
  font-weight: ${props => props.primary ? '600' : '500'};
  font-family: ${theme.fonts.heading};
`;

const TextButtonContainer = styled.TouchableOpacity`
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  opacity: ${props => props.disabled ? 0.6 : 1};
  min-height: 44px;
  justify-content: center;
  align-items: center;
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
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.border};
  margin: 0 4px;
`;

const AnimatedProgressDot = Animated.createAnimatedComponent(styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin: 0 4px;
`);

const ProgressLine = styled.View`
  width: 20px;
  height: 2px;
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.border};
  margin-horizontal: 2px;
`;

const AnimatedProgressLine = Animated.createAnimatedComponent(styled.View`
  width: 20px;
  height: 2px;
  margin-horizontal: 2px;
`);

const TitleText = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 12px;
  font-family: ${theme.fonts.heading};
  text-align: ${props => props.centered ? 'center' : 'left'};
`;

const DescriptionText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.lg}px;
  font-family: ${theme.fonts.body};
  opacity: 0.8;
  line-height: 24px;
  text-align: ${props => props.centered ? 'center' : 'left'};
`;

const CardContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.card}px;
  padding: 32px 24px;
  margin: 20px 0;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.08;
  shadow-radius: 16px;
  elevation: 4;
`;

const IllustrationWrapper = styled.View`
  height: 240px;
  background-color: ${theme.colors.secondary};
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
  overflow: hidden;
`;

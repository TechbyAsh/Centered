import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Switch, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, TextButton } from '../../../components/shared/OnboardingComponents';
import { pauseTypeOptions } from '../screen.data';
import { theme } from '../../../theme/theme';

const PauseTypeScreen = () => {
  const { pausePreferences, updatePausePreferences, nextStep, prevStep } = useOnboarding();
  const [showingPreview, setShowingPreview] = useState(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Run animations on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.animation.timing.standard,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: theme.animation.timing.standard,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Toggle a pause type
  const togglePauseType = (type) => {
    const key = `include${type.charAt(0).toUpperCase() + type.slice(1)}`;
    updatePausePreferences({ [key]: !pausePreferences[key] });
  };

  // Show a preview of the pause type
  const showPreview = (type) => {
    setShowingPreview(type);
    // In a real app, this would show a modal or animation preview
    // For now, we'll just set a timeout to hide it after 5 seconds
    setTimeout(() => {
      setShowingPreview(null);
    }, 5000);
  };

  // Select all pause types
  const selectAll = () => {
    updatePausePreferences({
      includeBreathing: true,
      includeSoundscapes: true,
      includeMeditations: true,
      includeRituals: true,
    });
  };

  // Get the value of a pause type preference
  const getPauseTypeValue = (type) => {
    const key = `include${type.charAt(0).toUpperCase() + type.slice(1)}`;
    return pausePreferences[key];
  };

  return (
    <ScreenContainer>
      <BackgroundGradient
        colors={[theme.colors.secondary + '30', theme.colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
      />

      <HeaderContainer>
        <NavigationRow>
          <BackButton onPress={prevStep}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
          </BackButton>
          <ProgressContainer>
            <ProgressDot active={false} />
            <ProgressDot active={false} />
            <ProgressDot active={false} />
            <ProgressDot active={true} />
            <ProgressDot active={false} />
            <ProgressDot active={false} />
            <ProgressDot active={false} />
          </ProgressContainer>
          <SkipButton>
            <TextButton title="Skip" onPress={nextStep} />
          </SkipButton>
        </NavigationRow>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            width: '100%',
          }}
        >
          <TitleContainer>
            <ScreenTitle>Pause Type Preferences</ScreenTitle>
            <ScreenDescription>
              Select the types of pause moments you'd like to experience. You can change these later in settings.
            </ScreenDescription>
          </TitleContainer>
        </Animated.View>
      </HeaderContainer>

      <ContentScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        <SelectAllContainer>
          <SelectAllButton onPress={selectAll}>
            <SelectAllText>Select All</SelectAllText>
          </SelectAllButton>
        </SelectAllContainer>

        {pauseTypeOptions.map((option) => (
          <PauseTypeCard key={option.id}>
            <PauseTypeContent>
              <IconContainer>
                <Ionicons name={option.icon} size={24} color={theme.colors.primary} />
              </IconContainer>
              <TextContainer>
                <PauseTypeTitle>{option.title}</PauseTypeTitle>
                <PauseTypeDescription>{option.description}</PauseTypeDescription>
              </TextContainer>
              <Switch
                value={getPauseTypeValue(option.id)}
                onValueChange={() => togglePauseType(option.id)}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor={getPauseTypeValue(option.id) ? theme.colors.white : '#f4f3f4'}
              />
            </PauseTypeContent>
            <PreviewButton 
              onPress={() => showPreview(option.id)}
              style={showingPreview === option.id ? styles.activePreview : {}}
            >
              <PreviewText>
                {showingPreview === option.id ? 'Previewing...' : 'Preview (5s)'}
              </PreviewText>
              {showingPreview === option.id ? (
                <Ionicons name="pause" size={16} color={theme.colors.primary} />
              ) : (
                <Ionicons name="play" size={16} color={theme.colors.primary} />
              )}
            </PreviewButton>
          </PauseTypeCard>
        ))}


      </ContentScrollView>

      <ButtonContainer>
        <PrimaryButton title="Continue" onPress={nextStep} />
      </ButtonContainer>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  activePreview: {
    backgroundColor: `${theme.colors.primary}20`,
  },
});

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

const HeaderContainer = styled.View`
  padding: 50px ${theme.spacing.screenHorizontal}px 20px;
  width: 100%;
`;

const NavigationRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const SkipButton = styled.View`
  width: 40px;
`;

const ProgressContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ProgressDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.border};
  margin: 0 4px;
  opacity: ${props => props.active ? 1 : 0.5};
`;

const TitleContainer = styled.View`
  align-items: center;
  margin-bottom: 32px;
`;

const ContentScrollView = styled.ScrollView`
  flex: 1;
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
  font-weight: 400;
  color: ${theme.colors.text};
  opacity: 0.7;
  text-align: center;
  line-height: 24px;
  font-family: ${theme.fonts.body};
`;

const SelectAllContainer = styled.View`
  align-items: flex-end;
  margin: 0 ${theme.spacing.screenHorizontal}px ${theme.spacing.md}px;
`;

const SelectAllButton = styled.TouchableOpacity`
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
`;

const SelectAllText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 14px;
  font-family: ${theme.fonts.body};
`;

const PauseTypeCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.medium}px;
  padding: ${theme.spacing.md}px;
  margin: 0 ${theme.spacing.screenHorizontal}px ${theme.spacing.md}px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 10px;
  elevation: 2;
`;

const PauseTypeContent = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const IconContainer = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${theme.colors.secondary}40;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.md}px;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 1;
`;

const TextContainer = styled.View`
  flex: 1;
  margin-right: ${theme.spacing.md}px;
`;

const PauseTypeTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 4px;
  font-family: ${theme.fonts.heading};
`;

const PauseTypeDescription = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
  font-family: ${theme.fonts.body};
`;

const PreviewButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.small}px;
  border: 1px solid ${theme.colors.primary}40;
  margin-top: 8px;
`;

const PreviewText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 14px;
  margin-right: ${theme.spacing.xs}px;
  font-family: ${theme.fonts.body};
`;

const ButtonContainer = styled.View`
  padding: 20px ${theme.spacing.screenHorizontal}px;
  background-color: ${theme.colors.background};
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default PauseTypeScreen;
